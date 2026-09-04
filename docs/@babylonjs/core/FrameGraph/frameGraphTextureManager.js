import { getDimensionsFromTextureSize, textureSizeIsObject } from "../Materials/Textures/textureCreationOptions.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { backbufferColorTextureHandle, backbufferDepthStencilTextureHandle } from "./frameGraphTypes.js";

import { FrameGraphRenderTarget } from "./frameGraphRenderTarget.js";
import { FrameGraphRenderPass } from "./Passes/renderPass.js";
import { Logger } from "../Misc/logger.js";
import { GetTypeForDepthTexture, IsDepthTexture, HasStencilAspect } from "../Materials/Textures/textureHelper.functions.js";
var FrameGraphTextureNamespace;
(function (FrameGraphTextureNamespace) {
    FrameGraphTextureNamespace[FrameGraphTextureNamespace["Task"] = 0] = "Task";
    FrameGraphTextureNamespace[FrameGraphTextureNamespace["Graph"] = 1] = "Graph";
    FrameGraphTextureNamespace[FrameGraphTextureNamespace["External"] = 2] = "External";
})(FrameGraphTextureNamespace || (FrameGraphTextureNamespace = {}));
/**
 * Manages the textures used by a frame graph
 */
export class FrameGraphTextureManager {
    /**
     * Constructs a new instance of the texture manager
     * @param engine The engine to use
     * @param _debugTextures If true, debug textures will be created so that they are visible in the inspector
     * @param _scene The scene the manager belongs to
     */
    constructor(engine, _debugTextures = false, _scene) {
        this.engine = engine;
        this._debugTextures = _debugTextures;
        this._scene = _scene;
        /** @internal */
        this._textures = new Map();
        /** @internal */
        this._historyTextures = new Map();
        /** @internal */
        this._isRecordingTask = false;
        /**
         * Gets or sets a boolean indicating if debug logs should be shown when applying texture allocation optimization (default: false)
         */
        this.showDebugLogsForTextureAllcationOptimization = false;
        this._backBufferTextureEntry = null;
        this._backBufferDepthStencilTextureEntry = null;
        this._backBufferTextureOverriden = false;
        this._addSystemTextures();
    }
    /**
     * Checks if a handle is a backbuffer handle (color or depth/stencil)
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer handle
     */
    isBackbuffer(handle) {
        if (this._backBufferTextureOverriden) {
            return false;
        }
        return this._isBackbuffer(handle);
    }
    /** @internal */
    _isBackbuffer(handle) {
        if (handle === backbufferColorTextureHandle || handle === backbufferDepthStencilTextureHandle) {
            return true;
        }
        const textureEntry = this._textures.get(handle);
        if (!textureEntry) {
            return false;
        }
        return textureEntry.refHandle === backbufferColorTextureHandle || textureEntry.refHandle === backbufferDepthStencilTextureHandle;
    }
    /**
     * Checks if a handle is a backbuffer color handle
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer color handle
     */
    isBackbufferColor(handle) {
        if (this._backBufferTextureOverriden) {
            return false;
        }
        if (handle === backbufferColorTextureHandle) {
            return true;
        }
        const textureEntry = this._textures.get(handle);
        if (!textureEntry) {
            return false;
        }
        return textureEntry.refHandle === backbufferColorTextureHandle;
    }
    /**
     * Checks if a handle is a backbuffer depth/stencil handle
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer depth/stencil handle
     */
    isBackbufferDepthStencil(handle) {
        if (this._backBufferTextureOverriden) {
            return false;
        }
        if (handle === backbufferDepthStencilTextureHandle) {
            return true;
        }
        const textureEntry = this._textures.get(handle);
        if (!textureEntry) {
            return false;
        }
        return textureEntry.refHandle === backbufferDepthStencilTextureHandle;
    }
    /**
     * Checks if a handle is a history texture (or points to a history texture, for a dangling handle)
     * @param handle The handle to check
     * @param checkAllTextures If false (default), the function will check if the handle is the main handle of a history texture (the first handle of the history texture).
     *   If true, the function will also check if the handle is one of the other handles of a history texture.
     * @returns True if the handle is a history texture, otherwise false
     */
    isHistoryTexture(handle, checkAllTextures = false) {
        const entry = this._textures.get(handle);
        if (!entry) {
            return false;
        }
        handle = entry.refHandle ?? handle;
        if (!checkAllTextures) {
            return this._historyTextures.has(handle);
        }
        return this._textures.get(handle)?.historyTexture === true;
    }
    /**
     * Gets the creation options of a texture
     * @param handle Handle of the texture
     * @param preserveHistoryTextureFlag If true, the isHistoryTexture flag in the returned creation options will be the same as when the texture was created (default: false)
     * @returns The creation options of the texture
     */
    getTextureCreationOptions(handle, preserveHistoryTextureFlag = false) {
        handle = this._textures.get(handle)?.refHandle ?? handle;
        const entry = this._textures.get(handle);
        const creationOptions = entry.creationOptions;
        return {
            size: textureSizeIsObject(creationOptions.size) ? { ...creationOptions.size } : creationOptions.size,
            sizeIsPercentage: creationOptions.sizeIsPercentage,
            options: FrameGraphTextureManager.CloneTextureOptions(creationOptions.options, entry.textureIndex),
            isHistoryTexture: preserveHistoryTextureFlag ? creationOptions.isHistoryTexture : false,
        };
    }
    /**
     * Gets the description of a texture
     * @param handle Handle of the texture
     * @returns The description of the texture
     */
    getTextureDescription(handle) {
        const creationOptions = this.getTextureCreationOptions(handle);
        const size = !creationOptions.sizeIsPercentage
            ? textureSizeIsObject(creationOptions.size)
                ? creationOptions.size
                : { width: creationOptions.size, height: creationOptions.size }
            : this.getAbsoluteDimensions(creationOptions.size);
        return {
            size,
            options: creationOptions.options,
        };
    }
    /**
     * Gets a texture handle or creates a new texture if the handle is not provided.
     * If handle is not provided, newTextureName and creationOptions must be provided.
     * @param handle If provided, will simply return the handle
     * @param newTextureName Name of the new texture to create
     * @param creationOptions Options to use when creating the new texture
     * @returns The handle to the texture.
     */
    getTextureHandleOrCreateTexture(handle, newTextureName, creationOptions) {
        if (handle === undefined) {
            if (newTextureName === undefined || creationOptions === undefined) {
                throw new Error("getTextureHandleOrCreateTexture: Either handle or newTextureName and creationOptions must be provided.");
            }
            return this.createRenderTargetTexture(newTextureName, creationOptions);
        }
        return handle;
    }
    /**
     * Gets a texture from a handle.
     * Note that if the texture is a history texture, the read texture for the current frame will be returned, except if historyGetWriteTexture is true.
     * @param handle The handle of the texture
     * @param historyGetWriteTexture If true and the texture is a history texture, the write texture for the current frame will be returned (default: false)
     * @returns The texture or null if not found
     */
    getTextureFromHandle(handle, historyGetWriteTexture) {
        const entry = this._textures.get(handle);
        const refHandle = entry?.refHandle;
        const finalEntry = refHandle !== undefined ? this._textures.get(refHandle) : entry;
        const finalHandle = refHandle !== undefined ? refHandle : handle;
        const historyEntry = this._historyTextures.get(finalHandle);
        if (historyEntry) {
            return historyEntry.textures[historyGetWriteTexture ? historyEntry.index : historyEntry.index ^ 1];
        }
        return finalEntry.texture;
    }
    /**
     * Imports a texture into the texture manager
     * @param name Name of the texture
     * @param texture Texture to import
     * @param handle Existing handle to use for the texture. If not provided (default), a new handle will be created.
     * @returns The handle to the texture
     */
    importTexture(name, texture, handle) {
        if (handle !== undefined) {
            this._freeEntry(handle);
        }
        const creationOptions = {
            size: { width: texture.width, height: texture.height },
            sizeIsPercentage: false,
            isHistoryTexture: false,
            options: {
                createMipMaps: texture.generateMipMaps,
                samples: texture.samples,
                types: [texture.type],
                formats: [texture.format],
                useSRGBBuffers: [texture._useSRGBBuffer],
                creationFlags: [texture._creationFlags],
                labels: texture.label ? [texture.label] : ["imported"],
            },
        };
        return this._createHandleForTexture(name, texture, creationOptions, FrameGraphTextureNamespace.External, handle);
    }
    /**
     * Creates a new render target texture
     * If multiple textures are described in FrameGraphTextureCreationOptions, the handle of the first texture is returned, handle+1 is the handle of the second texture, etc.
     * @param name Name of the texture
     * @param creationOptions Options to use when creating the texture
     * @param handle Existing handle to use for the texture. If not provided (default), a new handle will be created.
     * @returns The handle to the texture
     */
    createRenderTargetTexture(name, creationOptions, handle) {
        return this._createHandleForTexture(name, null, {
            size: textureSizeIsObject(creationOptions.size) ? { ...creationOptions.size } : creationOptions.size,
            sizeIsPercentage: creationOptions.sizeIsPercentage,
            isHistoryTexture: creationOptions.isHistoryTexture,
            options: FrameGraphTextureManager.CloneTextureOptions(creationOptions.options, undefined, true),
        }, this._isRecordingTask ? FrameGraphTextureNamespace.Task : FrameGraphTextureNamespace.Graph, handle);
    }
    /**
     * Creates a (frame graph) render target wrapper
     * Note that renderTargets or renderTargetDepth can be undefined, but not both at the same time!
     * @param name Name of the render target wrapper
     * @param renderTargets Render target handles (textures) to use
     * @param renderTargetDepth Render target depth handle (texture) to use
     * @param depthReadOnly If true, the depth buffer will be read-only
     * @param stencilReadOnly If true, the stencil buffer will be read-only
     * @returns The created render target wrapper
     */
    createRenderTarget(name, renderTargets, renderTargetDepth, depthReadOnly, stencilReadOnly) {
        const renderTarget = new FrameGraphRenderTarget(name, this, renderTargets, renderTargetDepth);
        const rtw = renderTarget.renderTargetWrapper;
        if (rtw !== undefined) {
            rtw.depthReadOnly = !!depthReadOnly;
            rtw.stencilReadOnly = !!stencilReadOnly;
            if (renderTargets) {
                const handles = Array.isArray(renderTargets) ? renderTargets : [renderTargets];
                for (let i = 0; i < handles.length; i++) {
                    let handle = handles[i];
                    handle = this._textures.get(handle)?.refHandle ?? handle;
                    const historyEntry = this._historyTextures.get(handle);
                    if (historyEntry) {
                        historyEntry.references.push({ renderTargetWrapper: rtw, textureIndex: i });
                        rtw.setTexture(historyEntry.textures[historyEntry.index], i, false);
                    }
                }
            }
        }
        return renderTarget;
    }
    /**
     * Creates a handle which is not associated with any texture.
     * Call resolveDanglingHandle to associate the handle with a valid texture handle.
     * @returns The dangling handle
     */
    createDanglingHandle() {
        return FrameGraphTextureManager._Counter++;
    }
    /**
     * Associates a texture with a dangling handle
     * @param danglingHandle The dangling handle
     * @param handle The handle to associate with the dangling handle (if not provided, a new texture handle will be created, using the newTextureName and creationOptions parameters)
     * @param newTextureName The name of the new texture to create (if handle is not provided)
     * @param creationOptions The options to use when creating the new texture (if handle is not provided)
     */
    resolveDanglingHandle(danglingHandle, handle, newTextureName, creationOptions) {
        if (handle === undefined) {
            if (newTextureName === undefined || creationOptions === undefined) {
                throw new Error("resolveDanglingHandle: Either handle or newTextureName and creationOptions must be provided.");
            }
            this.createRenderTargetTexture(newTextureName, creationOptions, danglingHandle);
            return;
        }
        const textureEntry = this._textures.get(handle);
        if (textureEntry === undefined) {
            throw new Error(`resolveDanglingHandle: Handle ${handle} does not exist!`);
        }
        handle = textureEntry.refHandle ?? handle; // gets the refHandle if handle is a (resolved) dangling handle itself
        this._textures.set(danglingHandle, {
            texture: textureEntry.texture,
            refHandle: handle,
            name: textureEntry.name,
            creationOptions: {
                size: { ...textureEntry.creationOptions.size },
                options: FrameGraphTextureManager.CloneTextureOptions(textureEntry.creationOptions.options),
                sizeIsPercentage: textureEntry.creationOptions.sizeIsPercentage,
                isHistoryTexture: false,
            },
            namespace: textureEntry.namespace,
            textureIndex: textureEntry.textureIndex,
        });
    }
    /**
     * Gets the absolute dimensions of a texture.
     * @param size The size of the texture. Width and height must be expressed as a percentage of the screen size (100=100%)!
     * @param screenWidth The width of the screen (default: the width of the rendering canvas)
     * @param screenHeight The height of the screen (default: the height of the rendering canvas)
     * @returns The absolute dimensions of the texture
     */
    getAbsoluteDimensions(size, screenWidth, screenHeight) {
        if (this._backBufferTextureOverriden) {
            const backbufferColorTextureSize = this._textures.get(backbufferColorTextureHandle).creationOptions.size;
            screenWidth ?? (screenWidth = backbufferColorTextureSize.width);
            screenHeight ?? (screenHeight = backbufferColorTextureSize.height);
        }
        else {
            screenWidth ?? (screenWidth = this.engine.getRenderWidth(true));
            screenHeight ?? (screenHeight = this.engine.getRenderHeight(true));
        }
        const { width, height } = getDimensionsFromTextureSize(size);
        return {
            width: Math.floor((width * screenWidth) / 100),
            height: Math.floor((height * screenHeight) / 100),
        };
    }
    /**
     * Gets the absolute dimensions of a texture from its handle or creation options.
     * @param handleOrCreationOptions The handle or creation options of the texture
     * @returns The absolute dimensions of the texture
     */
    getTextureAbsoluteDimensions(handleOrCreationOptions) {
        if (typeof handleOrCreationOptions === "number") {
            handleOrCreationOptions = this.getTextureCreationOptions(handleOrCreationOptions);
        }
        return !handleOrCreationOptions.sizeIsPercentage
            ? textureSizeIsObject(handleOrCreationOptions.size)
                ? handleOrCreationOptions.size
                : { width: handleOrCreationOptions.size, height: handleOrCreationOptions.size }
            : this.getAbsoluteDimensions(handleOrCreationOptions.size);
    }
    /**
     * Calculates the total byte size of all textures used by the frame graph texture manager (including external textures)
     * @param optimizedSize True if the calculation should not factor in aliased textures
     * @param outputWidth The output width of the frame graph. Will be used to calculate the size of percentage-based textures
     * @param outputHeight The output height of the frame graph. Will be used to calculate the size of percentage-based textures
     * @returns The total size of all textures
     */
    computeTotalTextureSize(optimizedSize, outputWidth, outputHeight) {
        let totalSize = 0;
        this._textures.forEach((entry, handle) => {
            if ((!this._backBufferTextureOverriden && (handle === backbufferColorTextureHandle || handle === backbufferDepthStencilTextureHandle)) ||
                entry.refHandle !== undefined) {
                return;
            }
            if (optimizedSize && entry.aliasHandle !== undefined) {
                return;
            }
            const options = entry.creationOptions;
            const textureIndex = entry.textureIndex || 0;
            const dimensions = options.sizeIsPercentage ? this.getAbsoluteDimensions(options.size, outputWidth, outputHeight) : getDimensionsFromTextureSize(options.size);
            const blockInfo = FrameGraphTextureManager._GetTextureBlockInformation(options.options.types?.[textureIndex] ?? 0, options.options.formats[textureIndex]);
            const textureByteSize = Math.ceil(dimensions.width / blockInfo.width) * Math.ceil(dimensions.height / blockInfo.height) * blockInfo.length;
            let byteSize = textureByteSize;
            if (options.options.createMipMaps) {
                byteSize = Math.floor((byteSize * 4) / 3);
            }
            if ((options.options.samples || 1) > 1) {
                // We need an additional texture in the case of MSAA
                byteSize += textureByteSize;
            }
            totalSize += byteSize;
        });
        return totalSize;
    }
    /**
     * True if the back buffer texture has been overriden by a call to setBackBufferTexture
     */
    get backBufferTextureOverriden() {
        return this._backBufferTextureOverriden;
    }
    /**
     * Overrides the default back buffer color/depth-stencil textures used by the frame graph.
     * Note that if both textureCreationOptions and depthStencilTextureCreationOptions are provided,
     * the engine will use them to create the back buffer color and depth/stencil textures respectively.
     * In that case, width and height are ignored.
     * @param width The width of the back buffer color/depth-stencil texture (if 0, the engine's current back buffer color/depth-stencil texture width will be used)
     * @param height The height of the back buffer color/depth-stencil texture (if 0, the engine's current back buffer color/depth-stencil texture height will be used)
     * @param textureCreationOptions The color texture creation options (optional)
     * @param depthStencilTextureCreationOptions The depth/stencil texture creation options (optional)
     */
    setBackBufferTextures(width, height, textureCreationOptions, depthStencilTextureCreationOptions) {
        if ((width === 0 || height === 0) && (!textureCreationOptions || !depthStencilTextureCreationOptions)) {
            if (this._backBufferTextureOverriden) {
                let entry = this._textures.get(backbufferColorTextureHandle);
                entry.texture?.dispose();
                entry.texture = null;
                entry.debug?.dispose();
                entry.debug = undefined;
                entry = this._textures.get(backbufferDepthStencilTextureHandle);
                entry.texture?.dispose();
                entry.texture = null;
                entry.debug?.dispose();
                entry.debug = undefined;
            }
            this._backBufferTextureEntry = null;
            this._backBufferDepthStencilTextureEntry = null;
            this._backBufferTextureOverriden = false;
            this._addSystemTextures();
            return;
        }
        this._backBufferTextureOverriden = true;
        const size = { width, height };
        this._backBufferTextureEntry = {
            name: "backbuffer color",
            texture: null,
            creationOptions: textureCreationOptions ?? {
                size,
                options: {
                    createMipMaps: false,
                    samples: this.engine.getCreationOptions().antialias ? 4 : 1,
                    types: [0],
                    formats: [5],
                    useSRGBBuffers: [false],
                    creationFlags: [0],
                    labels: ["backbuffer color"],
                },
                sizeIsPercentage: false,
            },
            namespace: FrameGraphTextureNamespace.Graph,
            lifespan: {
                firstTask: Number.MAX_VALUE,
                lastTask: 0,
            },
        };
        this._backBufferTextureEntry.textureDescriptionHash = this._createTextureDescriptionHash(this._backBufferTextureEntry.creationOptions);
        this._backBufferDepthStencilTextureEntry = {
            name: "backbuffer depth/stencil",
            texture: null,
            creationOptions: depthStencilTextureCreationOptions ?? {
                size,
                options: {
                    createMipMaps: false,
                    samples: this.engine.getCreationOptions().antialias ? 4 : 1,
                    types: [0],
                    formats: [this.engine.isStencilEnable ? 13 : 14],
                    useSRGBBuffers: [false],
                    creationFlags: [0],
                    labels: ["backbuffer depth/stencil"],
                },
                sizeIsPercentage: false,
            },
            namespace: FrameGraphTextureNamespace.Graph,
            lifespan: {
                firstTask: Number.MAX_VALUE,
                lastTask: 0,
            },
        };
        this._backBufferDepthStencilTextureEntry.textureDescriptionHash = this._createTextureDescriptionHash(this._backBufferDepthStencilTextureEntry.creationOptions);
        this._addSystemTextures();
    }
    /**
     * Resets the back buffer color/depth-stencil textures to the default (the engine's current back buffer textures)
     * It has no effect if setBackBufferTextures has not been called before.
     */
    resetBackBufferTextures() {
        this.setBackBufferTextures(0, 0);
    }
    /**
     * Returns true if the texture manager has at least one history texture
     */
    get hasHistoryTextures() {
        return this._historyTextures.size > 0;
    }
    /** @internal */
    _dispose() {
        this._releaseTextures();
    }
    /** @internal */
    _allocateTextures(tasks) {
        if (tasks) {
            this._optimizeTextureAllocation(tasks);
        }
        this._textures.forEach((entry) => {
            if (!entry.texture) {
                if (entry.refHandle !== undefined) {
                    // entry is a dangling handle which has been resolved to point to refHandle
                    // We simply update the texture to point to the refHandle texture
                    const refEntry = this._textures.get(entry.refHandle);
                    entry.texture = refEntry.texture;
                    entry.texture?.incrementReferences();
                    if (refEntry.refHandle === backbufferColorTextureHandle) {
                        entry.refHandle = backbufferColorTextureHandle;
                    }
                    if (refEntry.refHandle === backbufferDepthStencilTextureHandle) {
                        entry.refHandle = backbufferDepthStencilTextureHandle;
                    }
                }
                else if (entry.namespace !== FrameGraphTextureNamespace.External) {
                    if (entry.aliasHandle !== undefined) {
                        const aliasEntry = this._textures.get(entry.aliasHandle);
                        entry.texture = aliasEntry.texture;
                        entry.texture.incrementReferences();
                    }
                    else {
                        const creationOptions = entry.creationOptions;
                        const size = getDimensionsFromTextureSize(creationOptions.sizeIsPercentage ? this.getAbsoluteDimensions(creationOptions.size) : creationOptions.size);
                        const textureIndex = entry.textureIndex || 0;
                        const targetType = creationOptions.options.targetTypes?.[textureIndex] ?? 3553;
                        const is3D = targetType === 32879;
                        const isArray = targetType === 35866 || targetType === 3735928559;
                        const layerCount = creationOptions.options.layerCounts?.[textureIndex] ?? 0;
                        const internalTextureCreationOptions = {
                            createMipMaps: creationOptions.options.createMipMaps,
                            samples: creationOptions.options.samples,
                            type: creationOptions.options.types?.[textureIndex],
                            format: creationOptions.options.formats?.[textureIndex],
                            useSRGBBuffer: creationOptions.options.useSRGBBuffers?.[textureIndex],
                            creationFlags: creationOptions.options.creationFlags?.[textureIndex],
                            label: creationOptions.options.labels?.[textureIndex] ?? `${entry.name}${textureIndex > 0 ? "#" + textureIndex : ""}`,
                            samplingMode: 1,
                            createMSAATexture: creationOptions.options.samples > 1,
                            isCube: targetType === 34067 || targetType === 3735928559,
                        };
                        const isDepthTexture = IsDepthTexture(internalTextureCreationOptions.format);
                        const hasStencil = HasStencilAspect(internalTextureCreationOptions.format);
                        const source = isDepthTexture && hasStencil
                            ? 12 /* InternalTextureSource.DepthStencil */
                            : isDepthTexture || hasStencil
                                ? 14 /* InternalTextureSource.Depth */
                                : 5 /* InternalTextureSource.RenderTarget */;
                        const internalTexture = this.engine._createInternalTexture({ width: size.width, height: size.height, depth: is3D ? layerCount : undefined, layers: isArray ? layerCount : undefined }, internalTextureCreationOptions, false, source);
                        if (isDepthTexture) {
                            internalTexture.type = GetTypeForDepthTexture(internalTexture.format);
                        }
                        entry.texture = internalTexture;
                    }
                }
            }
            if (entry.texture && entry.refHandle === undefined) {
                entry.debug?.dispose();
                entry.debug = this._createDebugTexture(entry.name, entry.texture);
            }
        });
        this._historyTextures.forEach((entry) => {
            for (let i = 0; i < entry.handles.length; i++) {
                entry.textures[i] = this._textures.get(entry.handles[i]).texture;
            }
        });
    }
    /** @internal */
    _releaseTextures(releaseAll = true) {
        this._textures.forEach((entry, handle) => {
            if (entry.lifespan) {
                entry.lifespan.firstTask = Number.MAX_VALUE;
                entry.lifespan.lastTask = 0;
            }
            entry.aliasHandle = undefined;
            if (releaseAll || entry.namespace !== FrameGraphTextureNamespace.External) {
                entry.debug?.dispose();
                entry.debug = undefined;
            }
            if (entry.namespace === FrameGraphTextureNamespace.External) {
                return;
            }
            // We dispose of "Graph" and "Task" textures:
            // - "Graph" textures will be recreated by _allocateTextures because the entry still exists in this._textures, but entry.texture is null
            // - "Task" textures will be re-added to this._textures when the task is recorded (by a call to FrameGraph.build): that's why we delete the entry from this._textures below
            entry.texture?.dispose();
            entry.texture = null;
            if (releaseAll || entry.namespace === FrameGraphTextureNamespace.Task) {
                this._textures.delete(handle);
                this._historyTextures.delete(handle);
            }
        });
        this._historyTextures.forEach((entry) => {
            for (let i = 0; i < entry.handles.length; i++) {
                entry.textures[i] = null;
            }
        });
        if (releaseAll) {
            this._textures.clear();
            this._historyTextures.clear();
            this._addSystemTextures();
        }
    }
    /** @internal */
    _updateHistoryTextures() {
        this._historyTextures.forEach((entry) => {
            entry.index = entry.index ^ 1;
            const currentTexture = entry.textures[entry.index];
            if (currentTexture) {
                for (const { renderTargetWrapper, textureIndex } of entry.references) {
                    renderTargetWrapper.setTexture(currentTexture, textureIndex, false);
                }
            }
        });
    }
    _addSystemTextures() {
        const size = { width: this.engine.getRenderWidth(true), height: this.engine.getRenderHeight(true) };
        this._textures.set(backbufferColorTextureHandle, this._backBufferTextureEntry ?? {
            name: "backbuffer color",
            texture: null,
            creationOptions: {
                size,
                options: {
                    createMipMaps: false,
                    samples: this.engine.getCreationOptions().antialias ? 4 : 1,
                    types: [0], // todo? get from engine
                    formats: [5], // todo? get from engine
                    useSRGBBuffers: [false],
                    creationFlags: [0],
                    labels: ["backbuffer color"],
                },
                sizeIsPercentage: false,
            },
            namespace: FrameGraphTextureNamespace.External,
        });
        this._textures.set(backbufferDepthStencilTextureHandle, this._backBufferDepthStencilTextureEntry ?? {
            name: "backbuffer depth/stencil",
            texture: null,
            creationOptions: {
                size,
                options: {
                    createMipMaps: false,
                    samples: this.engine.getCreationOptions().antialias ? 4 : 1,
                    types: [0], // todo? get from engine
                    formats: [16], // todo? get from engine
                    useSRGBBuffers: [false],
                    creationFlags: [0],
                    labels: ["backbuffer depth/stencil"],
                },
                sizeIsPercentage: false,
            },
            namespace: FrameGraphTextureNamespace.External,
        });
    }
    _createDebugTexture(name, texture) {
        if (!this._debugTextures) {
            return;
        }
        const textureDebug = new Texture(null, this._scene);
        textureDebug.name = name;
        textureDebug._texture = texture;
        textureDebug._texture.incrementReferences();
        return textureDebug;
    }
    _freeEntry(handle) {
        const entry = this._textures.get(handle);
        if (entry) {
            entry.debug?.dispose();
            this._textures.delete(handle);
        }
    }
    _createHandleForTexture(name, texture, creationOptions, namespace, handle, textureIndex) {
        handle = handle ?? FrameGraphTextureManager._Counter++;
        textureIndex = textureIndex || 0;
        const textureName = creationOptions.isHistoryTexture ? `${name} ping` : name;
        let label = creationOptions.options.labels?.[textureIndex] ?? "";
        if (label === textureName) {
            label = "";
        }
        const textureEntry = {
            texture,
            name: `${textureName}${label ? " " + label : ""}`,
            creationOptions: {
                size: textureSizeIsObject(creationOptions.size) ? creationOptions.size : { width: creationOptions.size, height: creationOptions.size },
                options: creationOptions.options,
                sizeIsPercentage: creationOptions.sizeIsPercentage,
                isHistoryTexture: creationOptions.isHistoryTexture,
            },
            namespace,
            textureIndex,
            textureDescriptionHash: this._createTextureDescriptionHash(creationOptions),
            lifespan: {
                firstTask: Number.MAX_VALUE,
                lastTask: 0,
            },
            historyTexture: creationOptions.isHistoryTexture,
        };
        this._textures.set(handle, textureEntry);
        if (namespace === FrameGraphTextureNamespace.External) {
            return handle;
        }
        if (creationOptions.isHistoryTexture) {
            const pongCreationOptions = {
                size: { ...textureEntry.creationOptions.size },
                options: { ...textureEntry.creationOptions.options },
                sizeIsPercentage: textureEntry.creationOptions.sizeIsPercentage,
                isHistoryTexture: false,
            };
            const pongTexture = this._createHandleForTexture(`${name} pong`, null, pongCreationOptions, namespace);
            this._textures.get(pongTexture).historyTexture = true;
            this._historyTextures.set(handle, { textures: [null, null], handles: [handle, pongTexture], index: 0, references: [] });
            return handle;
        }
        if (creationOptions.options.types && creationOptions.options.types.length > 1 && textureIndex === 0) {
            const textureCount = creationOptions.options.types.length;
            const creationOptionsForTexture = {
                size: textureSizeIsObject(creationOptions.size) ? creationOptions.size : { width: creationOptions.size, height: creationOptions.size },
                options: creationOptions.options,
                sizeIsPercentage: creationOptions.sizeIsPercentage,
            };
            for (let i = 1; i < textureCount; i++) {
                this._createHandleForTexture(textureName, null, creationOptionsForTexture, namespace, handle + i, i);
            }
            FrameGraphTextureManager._Counter += textureCount - 1;
        }
        return handle;
    }
    _createTextureDescriptionHash(options) {
        const hash = [];
        hash.push(textureSizeIsObject(options.size) ? `${options.size.width}_${options.size.height}` : `${options.size}`);
        hash.push(options.sizeIsPercentage ? "%" : "A");
        hash.push(options.options.createMipMaps ? "M" : "N");
        hash.push(options.options.samples ? `${options.options.samples}` : "S1");
        hash.push(options.options.targetTypes ? options.options.targetTypes.join("_") : `${3553}`);
        hash.push(options.options.types ? options.options.types.join("_") : `${0}`);
        hash.push(options.options.formats ? options.options.formats.join("_") : `${5}`);
        hash.push(options.options.layerCounts ? options.options.layerCounts.join("_") : `0`);
        hash.push(options.options.useSRGBBuffers ? options.options.useSRGBBuffers.join("_") : "false");
        hash.push(options.options.creationFlags ? options.options.creationFlags.join("_") : "0");
        return hash.join("_");
    }
    _optimizeTextureAllocation(tasks) {
        this._computeTextureLifespan(tasks);
        if (this.showDebugLogsForTextureAllcationOptimization) {
            Logger.Log(`================== Optimization of texture allocation ==================`);
        }
        const cache = new Map();
        const iterator = this._textures.keys();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
            const textureHandle = key.value;
            const textureEntry = this._textures.get(textureHandle);
            if (textureEntry.refHandle !== undefined || textureEntry.namespace === FrameGraphTextureNamespace.External || this.isHistoryTexture(textureHandle, true)) {
                continue;
            }
            const textureHash = textureEntry.textureDescriptionHash;
            const textureLifespan = textureEntry.lifespan;
            const cacheEntries = cache.get(textureHash);
            if (cacheEntries) {
                let cacheEntryFound = false;
                for (const cacheEntry of cacheEntries) {
                    const [sourceHandle, lifespanArray] = cacheEntry;
                    let overlapped = false;
                    for (const lifespan of lifespanArray) {
                        if (lifespan.firstTask <= textureLifespan.lastTask && lifespan.lastTask >= textureLifespan.firstTask) {
                            overlapped = true;
                            break;
                        }
                    }
                    if (!overlapped) {
                        // No overlap between texture lifespan and all lifespans in the array, this texture can reuse the same entry cache
                        if (this.showDebugLogsForTextureAllcationOptimization) {
                            Logger.Log(`Texture ${textureHandle} (${textureEntry.name}) reuses cache entry ${sourceHandle}`);
                        }
                        lifespanArray.push(textureLifespan);
                        textureEntry.aliasHandle = sourceHandle;
                        cacheEntryFound = true;
                        break;
                    }
                }
                if (!cacheEntryFound) {
                    cacheEntries.push([textureHandle, [textureLifespan]]);
                }
            }
            else {
                cache.set(textureHash, [[textureHandle, [textureLifespan]]]);
            }
        }
    }
    // Loop through all task/pass dependencies and compute the lifespan of each texture (that is, the first task/pass that uses it and the last task/pass that uses it)
    _computeTextureLifespan(tasks) {
        if (this.showDebugLogsForTextureAllcationOptimization) {
            Logger.Log(`================== Dump of texture dependencies for all tasks/passes ==================`);
        }
        for (let t = 0; t < tasks.length; ++t) {
            const task = tasks[t];
            if (task.passes.length > 0) {
                this._computeTextureLifespanForPasses(task, t, task.passes);
            }
            if (task.passesDisabled.length > 0) {
                this._computeTextureLifespanForPasses(task, t, task.passesDisabled);
            }
            if (task.dependencies) {
                if (this.showDebugLogsForTextureAllcationOptimization) {
                    Logger.Log(`task#${t} (${task.name}), global dependencies`);
                }
                this._updateLifespan(t * 100 + 99, task.dependencies);
            }
        }
        if (this.showDebugLogsForTextureAllcationOptimization) {
            Logger.Log(`================== Texture lifespans ==================`);
            const iterator = this._textures.keys();
            for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
                const textureHandle = key.value;
                const textureEntry = this._textures.get(textureHandle);
                if (textureEntry.refHandle !== undefined || textureEntry.namespace === FrameGraphTextureNamespace.External || this._historyTextures.has(textureHandle)) {
                    continue;
                }
                Logger.Log(`${textureHandle} (${textureEntry.name}): ${textureEntry.lifespan.firstTask} - ${textureEntry.lifespan.lastTask}`);
            }
        }
    }
    _computeTextureLifespanForPasses(task, taskIndex, passes) {
        for (let p = 0; p < passes.length; ++p) {
            const dependencies = new Set();
            const pass = passes[p];
            if (!FrameGraphRenderPass.IsRenderPass(pass)) {
                continue;
            }
            pass.collectDependencies(dependencies);
            if (this.showDebugLogsForTextureAllcationOptimization) {
                Logger.Log(`task#${taskIndex} (${task.name}), pass#${p} (${pass.name})`);
            }
            this._updateLifespan(taskIndex * 100 + p, dependencies);
        }
    }
    _updateLifespan(passOrderNum, dependencies) {
        const iterator = dependencies.keys();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
            const textureHandle = key.value;
            if (this.isBackbuffer(textureHandle)) {
                continue;
            }
            let textureEntry = this._textures.get(textureHandle);
            if (!textureEntry) {
                throw new Error(`FrameGraph._computeTextureLifespan: Texture handle "${textureHandle}" not found in the texture manager. Make sure you didn't forget to add a task in the frame graph.`);
            }
            let handle = textureHandle;
            while (textureEntry.refHandle !== undefined) {
                handle = textureEntry.refHandle;
                textureEntry = this._textures.get(handle);
                if (!textureEntry) {
                    throw new Error(`FrameGraph._computeTextureLifespan: Texture handle "${handle}" not found in the texture manager (source handle="${textureHandle}"). Make sure you didn't forget to add a task in the frame graph.`);
                }
            }
            if (textureEntry.namespace === FrameGraphTextureNamespace.External || this._historyTextures.has(handle)) {
                continue;
            }
            if (this.showDebugLogsForTextureAllcationOptimization) {
                Logger.Log(`    ${handle} (${textureEntry.name})`);
            }
            textureEntry.lifespan.firstTask = Math.min(textureEntry.lifespan.firstTask, passOrderNum);
            textureEntry.lifespan.lastTask = Math.max(textureEntry.lifespan.lastTask, passOrderNum);
        }
    }
    /**
     * Clones a texture options
     * @param options The options to clone
     * @param textureIndex The index of the texture in the types, formats, etc array of FrameGraphTextureOptions. If not provided, all options are cloned.
     * @param preserveLabels True if the labels should be preserved (default: false)
     * @returns The cloned options
     */
    static CloneTextureOptions(options, textureIndex, preserveLabels) {
        return textureIndex !== undefined
            ? {
                createMipMaps: options.createMipMaps,
                samples: options.samples,
                targetTypes: options.targetTypes ? [options.targetTypes[textureIndex]] : undefined,
                types: options.types ? [options.types[textureIndex]] : undefined,
                formats: options.formats ? [options.formats[textureIndex]] : undefined,
                layerCounts: options.layerCounts ? [options.layerCounts[textureIndex]] : undefined,
                useSRGBBuffers: options.useSRGBBuffers ? [options.useSRGBBuffers[textureIndex]] : undefined,
                creationFlags: options.creationFlags ? [options.creationFlags[textureIndex]] : undefined,
                labels: options.labels ? [options.labels[textureIndex]] : undefined,
            }
            : {
                createMipMaps: options.createMipMaps,
                samples: options.samples,
                targetTypes: options.targetTypes ? [...options.targetTypes] : undefined,
                types: options.types ? [...options.types] : undefined,
                formats: options.formats ? [...options.formats] : undefined,
                layerCounts: options.layerCounts ? [...options.layerCounts] : undefined,
                useSRGBBuffers: options.useSRGBBuffers ? [...options.useSRGBBuffers] : undefined,
                creationFlags: options.creationFlags ? [...options.creationFlags] : undefined,
                labels: options.labels && preserveLabels ? [...options.labels] : undefined,
            };
    }
    /**
     * Gets the texture block information.
     * @param type Type of the texture.
     * @param format Format of the texture.
     * @returns The texture block information. You can calculate the byte size of the texture by doing: Math.ceil(width / blockInfo.width) * Math.ceil(height / blockInfo.height) * blockInfo.length
     */
    static _GetTextureBlockInformation(type, format) {
        switch (format) {
            case 15:
                return { width: 1, height: 1, length: 2 };
            case 16:
                return { width: 1, height: 1, length: 3 };
            case 13:
                return { width: 1, height: 1, length: 4 };
            case 14:
                return { width: 1, height: 1, length: 4 };
            case 18:
                return { width: 1, height: 1, length: 5 };
            case 19:
                return { width: 1, height: 1, length: 1 };
            case 36492:
                return { width: 4, height: 4, length: 16 };
            case 36495:
                return { width: 4, height: 4, length: 16 };
            case 36494:
                return { width: 4, height: 4, length: 16 };
            case 33779:
                return { width: 4, height: 4, length: 16 };
            case 33778:
                return { width: 4, height: 4, length: 16 };
            case 33777:
            case 33776:
                return { width: 4, height: 4, length: 8 };
            case 37808:
                return { width: 4, height: 4, length: 16 };
            case 37809:
                return { width: 5, height: 4, length: 16 };
            case 37810:
                return { width: 5, height: 5, length: 16 };
            case 37811:
                return { width: 6, height: 5, length: 16 };
            case 37812:
                return { width: 6, height: 6, length: 16 };
            case 37813:
                return { width: 8, height: 5, length: 16 };
            case 37814:
                return { width: 8, height: 6, length: 16 };
            case 37815:
                return { width: 8, height: 8, length: 16 };
            case 37816:
                return { width: 10, height: 5, length: 16 };
            case 37817:
                return { width: 10, height: 6, length: 16 };
            case 37818:
                return { width: 10, height: 8, length: 16 };
            case 37819:
                return { width: 10, height: 10, length: 16 };
            case 37820:
                return { width: 12, height: 10, length: 16 };
            case 37821:
                return { width: 12, height: 12, length: 16 };
            case 36196:
            case 37492:
                return { width: 4, height: 4, length: 8 };
            case 37496:
                return { width: 4, height: 4, length: 16 };
        }
        switch (type) {
            case 3:
            case 0:
                switch (format) {
                    case 6:
                    case 8:
                    case 0:
                    case 1:
                        return { width: 1, height: 1, length: 1 };
                    case 7:
                    case 9:
                    case 2:
                        return { width: 1, height: 1, length: 2 };
                    case 4:
                    case 10:
                        return { width: 1, height: 1, length: 3 };
                    case 11:
                        return { width: 1, height: 1, length: 4 };
                    default:
                        return { width: 1, height: 1, length: 4 };
                }
            case 4:
            case 5:
                switch (format) {
                    case 8:
                        return { width: 1, height: 1, length: 2 };
                    case 9:
                        return { width: 1, height: 1, length: 4 };
                    case 10:
                        return { width: 1, height: 1, length: 6 };
                    case 11:
                        return { width: 1, height: 1, length: 8 };
                    default:
                        return { width: 1, height: 1, length: 8 };
                }
            case 6:
            case 7: // Refers to UNSIGNED_INT
                switch (format) {
                    case 8:
                        return { width: 1, height: 1, length: 4 };
                    case 9:
                        return { width: 1, height: 1, length: 8 };
                    case 10:
                        return { width: 1, height: 1, length: 12 };
                    case 11:
                        return { width: 1, height: 1, length: 16 };
                    default:
                        return { width: 1, height: 1, length: 16 };
                }
            case 1:
                switch (format) {
                    case 6:
                        return { width: 1, height: 1, length: 4 };
                    case 7:
                        return { width: 1, height: 1, length: 8 };
                    case 4:
                        return { width: 1, height: 1, length: 12 };
                    case 5:
                        return { width: 1, height: 1, length: 16 };
                    default:
                        return { width: 1, height: 1, length: 16 };
                }
            case 2:
                switch (format) {
                    case 6:
                        return { width: 1, height: 1, length: 2 };
                    case 7:
                        return { width: 1, height: 1, length: 4 };
                    case 4:
                        return { width: 1, height: 1, length: 6 };
                    case 5:
                        return { width: 1, height: 1, length: 8 };
                    default:
                        return { width: 1, height: 1, length: 8 };
                }
            case 10:
                return { width: 1, height: 1, length: 2 };
            case 13:
                switch (format) {
                    case 5:
                    case 11:
                        return { width: 1, height: 1, length: 4 };
                    default:
                        return { width: 1, height: 1, length: 4 };
                }
            case 14:
                switch (format) {
                    case 5:
                    case 11:
                        return { width: 1, height: 1, length: 4 };
                    default:
                        return { width: 1, height: 1, length: 4 };
                }
            case 8:
                return { width: 1, height: 1, length: 2 };
            case 9:
                return { width: 1, height: 1, length: 2 };
            case 11:
                switch (format) {
                    case 5:
                        return { width: 1, height: 1, length: 4 };
                    case 11:
                        return { width: 1, height: 1, length: 4 };
                    default:
                        return { width: 1, height: 1, length: 4 };
                }
        }
        return { width: 1, height: 1, length: 4 };
    }
}
FrameGraphTextureManager._Counter = 2; // 0 and 1 are reserved for backbuffer textures
//# sourceMappingURL=frameGraphTextureManager.js.map
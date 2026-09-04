import { type Scene, type AbstractEngine, type TextureSize, type Nullable, type FrameGraphTextureCreationOptions, type FrameGraphTextureHandle, type InternalTexture, type FrameGraphTextureOptions, type FrameGraphTextureDescription, type RenderTargetWrapper, type FrameGraphTask } from "../index.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { FrameGraphRenderTarget } from "./frameGraphRenderTarget.js";
type HistoryTexture = {
    textures: Array<Nullable<InternalTexture>>;
    handles: Array<FrameGraphTextureHandle>;
    index: number;
    references: Array<{
        renderTargetWrapper: RenderTargetWrapper;
        textureIndex: number;
    }>;
};
type TextureLifespan = {
    firstTask: number;
    lastTask: number;
};
type TextureEntry = {
    texture: Nullable<InternalTexture>;
    name: string;
    creationOptions: FrameGraphTextureCreationOptions;
    namespace: FrameGraphTextureNamespace;
    textureIndex?: number;
    debug?: Texture;
    refHandle?: FrameGraphTextureHandle;
    textureDescriptionHash?: string;
    lifespan?: TextureLifespan;
    aliasHandle?: FrameGraphTextureHandle;
    historyTexture?: boolean;
};
declare enum FrameGraphTextureNamespace {
    Task = 0,
    Graph = 1,
    External = 2
}
/**
 * Manages the textures used by a frame graph
 */
export declare class FrameGraphTextureManager {
    readonly engine: AbstractEngine;
    private readonly _debugTextures;
    private readonly _scene;
    private static _Counter;
    /** @internal */
    readonly _textures: Map<FrameGraphTextureHandle, TextureEntry>;
    /** @internal */
    readonly _historyTextures: Map<FrameGraphTextureHandle, HistoryTexture>;
    /** @internal */
    _isRecordingTask: boolean;
    /**
     * Gets or sets a boolean indicating if debug logs should be shown when applying texture allocation optimization (default: false)
     */
    showDebugLogsForTextureAllcationOptimization: boolean;
    private _backBufferTextureEntry;
    private _backBufferDepthStencilTextureEntry;
    private _backBufferTextureOverriden;
    /**
     * Constructs a new instance of the texture manager
     * @param engine The engine to use
     * @param _debugTextures If true, debug textures will be created so that they are visible in the inspector
     * @param _scene The scene the manager belongs to
     */
    constructor(engine: AbstractEngine, _debugTextures: boolean | undefined, _scene: Scene);
    /**
     * Checks if a handle is a backbuffer handle (color or depth/stencil)
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer handle
     */
    isBackbuffer(handle: FrameGraphTextureHandle): boolean;
    /** @internal */
    _isBackbuffer(handle: FrameGraphTextureHandle): boolean;
    /**
     * Checks if a handle is a backbuffer color handle
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer color handle
     */
    isBackbufferColor(handle: FrameGraphTextureHandle): boolean;
    /**
     * Checks if a handle is a backbuffer depth/stencil handle
     * @param handle The handle to check
     * @returns True if the handle is a backbuffer depth/stencil handle
     */
    isBackbufferDepthStencil(handle: FrameGraphTextureHandle): boolean;
    /**
     * Checks if a handle is a history texture (or points to a history texture, for a dangling handle)
     * @param handle The handle to check
     * @param checkAllTextures If false (default), the function will check if the handle is the main handle of a history texture (the first handle of the history texture).
     *   If true, the function will also check if the handle is one of the other handles of a history texture.
     * @returns True if the handle is a history texture, otherwise false
     */
    isHistoryTexture(handle: FrameGraphTextureHandle, checkAllTextures?: boolean): boolean;
    /**
     * Gets the creation options of a texture
     * @param handle Handle of the texture
     * @param preserveHistoryTextureFlag If true, the isHistoryTexture flag in the returned creation options will be the same as when the texture was created (default: false)
     * @returns The creation options of the texture
     */
    getTextureCreationOptions(handle: FrameGraphTextureHandle, preserveHistoryTextureFlag?: boolean): FrameGraphTextureCreationOptions;
    /**
     * Gets the description of a texture
     * @param handle Handle of the texture
     * @returns The description of the texture
     */
    getTextureDescription(handle: FrameGraphTextureHandle): FrameGraphTextureDescription;
    /**
     * Gets a texture handle or creates a new texture if the handle is not provided.
     * If handle is not provided, newTextureName and creationOptions must be provided.
     * @param handle If provided, will simply return the handle
     * @param newTextureName Name of the new texture to create
     * @param creationOptions Options to use when creating the new texture
     * @returns The handle to the texture.
     */
    getTextureHandleOrCreateTexture(handle?: FrameGraphTextureHandle, newTextureName?: string, creationOptions?: FrameGraphTextureCreationOptions): FrameGraphTextureHandle;
    /**
     * Gets a texture from a handle.
     * Note that if the texture is a history texture, the read texture for the current frame will be returned, except if historyGetWriteTexture is true.
     * @param handle The handle of the texture
     * @param historyGetWriteTexture If true and the texture is a history texture, the write texture for the current frame will be returned (default: false)
     * @returns The texture or null if not found
     */
    getTextureFromHandle(handle: FrameGraphTextureHandle, historyGetWriteTexture?: boolean): Nullable<InternalTexture>;
    /**
     * Imports a texture into the texture manager
     * @param name Name of the texture
     * @param texture Texture to import
     * @param handle Existing handle to use for the texture. If not provided (default), a new handle will be created.
     * @returns The handle to the texture
     */
    importTexture(name: string, texture: InternalTexture, handle?: FrameGraphTextureHandle): FrameGraphTextureHandle;
    /**
     * Creates a new render target texture
     * If multiple textures are described in FrameGraphTextureCreationOptions, the handle of the first texture is returned, handle+1 is the handle of the second texture, etc.
     * @param name Name of the texture
     * @param creationOptions Options to use when creating the texture
     * @param handle Existing handle to use for the texture. If not provided (default), a new handle will be created.
     * @returns The handle to the texture
     */
    createRenderTargetTexture(name: string, creationOptions: FrameGraphTextureCreationOptions, handle?: FrameGraphTextureHandle): FrameGraphTextureHandle;
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
    createRenderTarget(name: string, renderTargets?: FrameGraphTextureHandle | FrameGraphTextureHandle[], renderTargetDepth?: FrameGraphTextureHandle, depthReadOnly?: boolean, stencilReadOnly?: boolean): FrameGraphRenderTarget;
    /**
     * Creates a handle which is not associated with any texture.
     * Call resolveDanglingHandle to associate the handle with a valid texture handle.
     * @returns The dangling handle
     */
    createDanglingHandle(): number;
    /**
     * Associates a texture with a dangling handle
     * @param danglingHandle The dangling handle
     * @param handle The handle to associate with the dangling handle (if not provided, a new texture handle will be created, using the newTextureName and creationOptions parameters)
     * @param newTextureName The name of the new texture to create (if handle is not provided)
     * @param creationOptions The options to use when creating the new texture (if handle is not provided)
     */
    resolveDanglingHandle(danglingHandle: FrameGraphTextureHandle, handle?: FrameGraphTextureHandle, newTextureName?: string, creationOptions?: FrameGraphTextureCreationOptions): void;
    /**
     * Gets the absolute dimensions of a texture.
     * @param size The size of the texture. Width and height must be expressed as a percentage of the screen size (100=100%)!
     * @param screenWidth The width of the screen (default: the width of the rendering canvas)
     * @param screenHeight The height of the screen (default: the height of the rendering canvas)
     * @returns The absolute dimensions of the texture
     */
    getAbsoluteDimensions(size: TextureSize, screenWidth?: number, screenHeight?: number): {
        width: number;
        height: number;
    };
    /**
     * Gets the absolute dimensions of a texture from its handle or creation options.
     * @param handleOrCreationOptions The handle or creation options of the texture
     * @returns The absolute dimensions of the texture
     */
    getTextureAbsoluteDimensions(handleOrCreationOptions: FrameGraphTextureHandle | FrameGraphTextureCreationOptions): {
        width: number;
        height: number;
    };
    /**
     * Calculates the total byte size of all textures used by the frame graph texture manager (including external textures)
     * @param optimizedSize True if the calculation should not factor in aliased textures
     * @param outputWidth The output width of the frame graph. Will be used to calculate the size of percentage-based textures
     * @param outputHeight The output height of the frame graph. Will be used to calculate the size of percentage-based textures
     * @returns The total size of all textures
     */
    computeTotalTextureSize(optimizedSize: boolean, outputWidth: number, outputHeight: number): number;
    /**
     * True if the back buffer texture has been overriden by a call to setBackBufferTexture
     */
    get backBufferTextureOverriden(): boolean;
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
    setBackBufferTextures(width: number, height: number, textureCreationOptions?: FrameGraphTextureCreationOptions, depthStencilTextureCreationOptions?: FrameGraphTextureCreationOptions): void;
    /**
     * Resets the back buffer color/depth-stencil textures to the default (the engine's current back buffer textures)
     * It has no effect if setBackBufferTextures has not been called before.
     */
    resetBackBufferTextures(): void;
    /**
     * Returns true if the texture manager has at least one history texture
     */
    get hasHistoryTextures(): boolean;
    /** @internal */
    _dispose(): void;
    /** @internal */
    _allocateTextures(tasks?: FrameGraphTask[]): void;
    /** @internal */
    _releaseTextures(releaseAll?: boolean): void;
    /** @internal */
    _updateHistoryTextures(): void;
    private _addSystemTextures;
    private _createDebugTexture;
    private _freeEntry;
    private _createHandleForTexture;
    private _createTextureDescriptionHash;
    private _optimizeTextureAllocation;
    private _computeTextureLifespan;
    private _computeTextureLifespanForPasses;
    private _updateLifespan;
    /**
     * Clones a texture options
     * @param options The options to clone
     * @param textureIndex The index of the texture in the types, formats, etc array of FrameGraphTextureOptions. If not provided, all options are cloned.
     * @param preserveLabels True if the labels should be preserved (default: false)
     * @returns The cloned options
     */
    static CloneTextureOptions(options: FrameGraphTextureOptions, textureIndex?: number, preserveLabels?: boolean): FrameGraphTextureOptions;
    /**
     * Gets the texture block information.
     * @param type Type of the texture.
     * @param format Format of the texture.
     * @returns The texture block information. You can calculate the byte size of the texture by doing: Math.ceil(width / blockInfo.width) * Math.ceil(height / blockInfo.height) * blockInfo.length
     */
    private static _GetTextureBlockInformation;
}
export {};

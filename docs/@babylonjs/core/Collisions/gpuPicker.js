
import { MultiRenderTarget } from "../Materials/Textures/multiRenderTarget.pure.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { ShaderMaterial } from "../Materials/shaderMaterial.pure.js";
import { GaussianSplattingMaterial } from "../Materials/GaussianSplatting/gaussianSplattingMaterial.pure.js";
import { GaussianSplattingGpuPickingMaterialPlugin } from "../Materials/GaussianSplatting/gaussianSplattingGpuPickingMaterialPlugin.pure.js";
import { IsGaussianSplattingClassName } from "../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Matrix, TmpVectors, Vector3 } from "../Maths/math.vector.pure.js";
import { VertexBuffer } from "../Meshes/buffer.js";
import { Logger } from "../Misc/logger.js";
/**
 * Defines how multi pick texture readbacks should be performed.
 */
export var GPUMultiPickReadbackStrategy;
(function (GPUMultiPickReadbackStrategy) {
    /**
     * Chooses between a single rectangle readback and small per-point readbacks using the thresholds in IGPUMultiPickOptions.
     */
    GPUMultiPickReadbackStrategy[GPUMultiPickReadbackStrategy["Auto"] = 0] = "Auto";
    /**
     * Always reads the full bounding rectangle of the picked points. This minimizes readback calls and is best for dense point sets.
     */
    GPUMultiPickReadbackStrategy[GPUMultiPickReadbackStrategy["Rectangle"] = 1] = "Rectangle";
    /**
     * Always reads each picked point independently. This minimizes transferred pixels for sparse point sets but can be slower when many points are picked.
     */
    GPUMultiPickReadbackStrategy[GPUMultiPickReadbackStrategy["Individual"] = 2] = "Individual";
})(GPUMultiPickReadbackStrategy || (GPUMultiPickReadbackStrategy = {}));
/**
 * Class used to perform a picking operation using GPU
 * GPUPicker can pick meshes, instances and thin instances
 */
export class GPUPicker {
    constructor() {
        this._pickingTexture = null;
        this._idMap = [];
        this._thinIdMap = [];
        this._meshUniqueIdToPickerId = [];
        this._idWarningIssued = false;
        this._cachedScene = null;
        this._engine = null;
        this._pickingMaterialCache = new Array(9).fill(null);
        this._pickableMeshes = [];
        this._meshMaterialMap = new Map();
        this._readbuffer = null;
        this._depthReadbuffer = null;
        this._depthTextureType = 0;
        this._isDepthTexturePacked = false;
        this._useDepthPicking = false;
        this._isUsingDepthPickingRenderTarget = false;
        this._meshRenderingCount = 0;
        this._renderWarningIssued = false;
        this._renderPickingTexture = false;
        this._sceneBeforeRenderObserver = null;
        this._pickingTextureClearObserver = null;
        this._pickingTextureAfterRenderObserver = null;
        this._nextFreeId = 1;
        this._gsPickingMaterials = [];
        this._gsCompoundRenderMeshes = [];
        /** Shader language used by the generator */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        this._pickingInProgress = false;
    }
    /**
     * Gets the shader language used in this generator.
     */
    get shaderLanguage() {
        return this._shaderLanguage;
    }
    /**
     * Gets a boolean indicating if the picking is in progress
     */
    get pickingInProgress() {
        return this._pickingInProgress;
    }
    /**
     * Gets the default render materials used by the picker.
     *
     * index is Material filling mode
     */
    get defaultRenderMaterials() {
        return this._pickingMaterialCache;
    }
    /**
     * Gets or sets a boolean indicating if depth-based pickedPoint and normal reconstruction should be enabled.
     *
     * When disabled, GPUPicker uses the original single-color render target and shader path. When enabled, GPUPicker
     * switches to a MultiRenderTarget and compiles the default picking shader with GPUPICKER_DEPTH to output both the
     * picking id and the depth required to reconstruct the picked point and normal.
     *
     * Custom picking materials and special picking material plugins should also write the depth attachment. If they do
     * not, GPUPicker will still try to reconstruct pickedPoint and normal from the depth target, but the returned values
     * may be missing or incorrect.
     */
    get enableDepthPicking() {
        return this._useDepthPicking;
    }
    set enableDepthPicking(value) {
        if (this._useDepthPicking === value) {
            return;
        }
        this._useDepthPicking = value;
        this._isUsingDepthPickingRenderTarget = false;
        this._depthReadbuffer = null;
        let pickableMeshes = [];
        if (this._cachedScene && this._pickingTexture) {
            pickableMeshes = this._pickableMeshes.map((mesh) => {
                const material = this._meshMaterialMap.get(mesh);
                const className = mesh.getClassName();
                if (material instanceof ShaderMaterial &&
                    !this._pickingMaterialCache.includes(material) &&
                    !IsGaussianSplattingClassName(className) &&
                    className !== "GaussianSplattingPartProxyMesh") {
                    return { mesh, material };
                }
                return mesh;
            });
        }
        this._clearPickingMaterials();
        if (this._cachedScene && this._pickingTexture) {
            this.clearPickingList();
            this._pickingTexture.dispose();
            this._pickingTexture = null;
            if (pickableMeshes.length > 0) {
                this.addPickingList(pickableMeshes);
            }
        }
    }
    _getColorIdFromReadBuffer(offset) {
        const r = this._readbuffer[offset];
        const g = this._readbuffer[offset + 1];
        const b = this._readbuffer[offset + 2];
        return (r << 16) + (g << 8) + b;
    }
    _getReadBufferOffset(x, y, width, height) {
        const bufferY = this._cachedScene?.getEngine().isWebGPU ? height - y - 1 : y;
        return (bufferY * width + x) * 4;
    }
    _createColorPickingRenderTarget(scene, width, height) {
        return new RenderTargetTexture("pickingTexture", { width: width, height: height }, scene, {
            generateMipMaps: false,
            type: 0,
            samplingMode: 1,
        });
    }
    _createRenderTarget(scene, width, height) {
        if (this._cachedScene && this._pickingTexture) {
            const index = this._cachedScene.customRenderTargets.indexOf(this._pickingTexture);
            if (index > -1) {
                this._cachedScene.customRenderTargets.splice(index, 1);
                this._renderPickingTexture = false;
            }
        }
        if (this._pickingTexture) {
            this._pickingTexture.dispose();
        }
        if (this._useDepthPicking) {
            const engine = scene.getEngine();
            const supportsDepthPickingRenderTarget = engine.isWebGPU || engine.webGLVersion !== 1;
            if (!supportsDepthPickingRenderTarget) {
                Logger.Warn("GPUPicker depth picking requires WebGL2, WebGPU, or Native engine support. Falling back to color-only GPU picking.");
                this._useDepthPicking = false;
                this._isUsingDepthPickingRenderTarget = false;
                this._isDepthTexturePacked = false;
                this._pickingTexture = this._createColorPickingRenderTarget(scene, width, height);
                return;
            }
            if (engine.getCaps().textureFloatRender) {
                this._depthTextureType = 1;
            }
            else if (engine.getCaps().textureHalfFloatRender) {
                this._depthTextureType = 2;
            }
            else {
                this._depthTextureType = 0;
            }
            this._isDepthTexturePacked = this._depthTextureType === 0;
            const pickingTexture = new MultiRenderTarget("pickingTexture", { width: width, height: height }, 2, scene, {
                generateMipMaps: false,
                generateDepthBuffer: true,
                generateStencilBuffer: false,
                types: [0, this._depthTextureType],
                samplingModes: [1, 1],
                formats: [5, 5],
            }, ["pickingTexture_id", "pickingTexture_depth"]);
            if (pickingTexture.isSupported) {
                this._pickingTexture = pickingTexture;
                this._isUsingDepthPickingRenderTarget = true;
            }
            else {
                Logger.Warn("GPUPicker depth picking requires MultiRenderTarget support. Falling back to color-only GPU picking.");
                this._useDepthPicking = false;
                this._isUsingDepthPickingRenderTarget = false;
                this._isDepthTexturePacked = false;
                pickingTexture.dispose();
                this._pickingTexture = this._createColorPickingRenderTarget(scene, width, height);
            }
        }
        else {
            this._pickingTexture = this._createColorPickingRenderTarget(scene, width, height);
            this._isUsingDepthPickingRenderTarget = false;
            this._isDepthTexturePacked = false;
        }
    }
    _clearPickingMaterials() {
        for (let i = 0; i < this._pickingMaterialCache.length; i++) {
            const material = this._pickingMaterialCache[i];
            if (material !== null) {
                material.dispose();
                this._pickingMaterialCache[i] = null;
            }
        }
    }
    _getPickingMaterial(scene, fillMode) {
        if (fillMode < 0 || 8 < fillMode) {
            fillMode = 0;
        }
        const cachedMaterial = this._pickingMaterialCache[fillMode];
        if (cachedMaterial) {
            return cachedMaterial;
        }
        const engine = scene.getEngine();
        if (engine.isWebGPU) {
            this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
        }
        const defines = [];
        if (this._useDepthPicking) {
            defines.push("#define GPUPICKER_DEPTH");
            if (this._isDepthTexturePacked) {
                defines.push("#define GPUPICKER_PACK_DEPTH");
            }
        }
        const options = {
            attributes: [VertexBuffer.PositionKind, GPUPicker._AttributeName],
            uniforms: ["world", "viewProjection", "meshID"],
            needAlphaBlending: false,
            defines: defines,
            useClipPlane: null,
            shaderLanguage: this._shaderLanguage,
            extraInitializationsAsync: async () => {
                if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await Promise.all([import("../ShadersWGSL/picking.fragment.js"), import("../ShadersWGSL/picking.vertex.js")]);
                }
                else {
                    await Promise.all([import("../Shaders/picking.fragment.js"), import("../Shaders/picking.vertex.js")]);
                }
            },
        };
        const newMaterial = new ShaderMaterial("pickingShader", scene, "picking", options, false);
        newMaterial.fillMode = fillMode;
        newMaterial.onBindObservable.add(this._materialBindCallback, undefined, undefined, this);
        this._pickingMaterialCache[fillMode] = newMaterial;
        return newMaterial;
    }
    _materialBindCallback(mesh) {
        if (!mesh) {
            return;
        }
        const material = this._meshMaterialMap.get(mesh);
        if (!material) {
            if (!this._renderWarningIssued) {
                this._renderWarningIssued = true;
                Logger.Warn("GPUPicker issue: Mesh not found in the material map. This may happen when the root mesh of an instance is not in the picking list.");
            }
            return;
        }
        const effect = material.getEffect();
        if (!effect) {
            return;
        }
        if (!mesh.hasInstances && !mesh.isAnInstance && !mesh.hasThinInstances && this._meshUniqueIdToPickerId[mesh.uniqueId] !== undefined) {
            effect.setFloat("meshID", this._meshUniqueIdToPickerId[mesh.uniqueId]);
        }
        this._meshRenderingCount++;
    }
    /**
     * Set the list of meshes to pick from
     * Set that value to null to clear the list (and avoid leaks)
     * The module will read and delete from the array provided by reference. Disposing the module or setting the value to null will clear the array.
     * @param list defines the list of meshes to pick from
     */
    setPickingList(list) {
        this.clearPickingList();
        if (!list || list.length === 0) {
            return;
        }
        // Prepare target
        const scene = ("mesh" in list[0] ? list[0].mesh : list[0]).getScene();
        if (!this._cachedScene || this._cachedScene !== scene) {
            this._clearPickingMaterials();
        }
        this.addPickingList(list);
    }
    /**
     * Clear the current picking list and free resources
     */
    clearPickingList() {
        if (this._pickableMeshes) {
            // Cleanup
            for (let index = 0; index < this._pickableMeshes.length; index++) {
                const mesh = this._pickableMeshes[index];
                const className = mesh.getClassName();
                // Skip GS part proxies - they don't have instance buffers or render list entries
                if (className === "GaussianSplattingPartProxyMesh") {
                    continue;
                }
                // Skip thin instance cleanup for Gaussian Splatting meshes (thin instances are for batching, not picking)
                if (!IsGaussianSplattingClassName(className)) {
                    if (mesh.hasInstances) {
                        mesh.removeVerticesData(GPUPicker._AttributeName);
                    }
                    if (mesh.hasThinInstances) {
                        mesh.thinInstanceSetBuffer(GPUPicker._AttributeName, null);
                    }
                }
                if (this._pickingTexture) {
                    this._pickingTexture.setMaterialForRendering(mesh, undefined);
                }
                const material = this._meshMaterialMap.get(mesh);
                if (material && !this._pickingMaterialCache.includes(material)) {
                    material.onBindObservable.removeCallback(this._materialBindCallback);
                }
            }
            // Clean up GS compound meshes from render list
            for (const mesh of this._gsCompoundRenderMeshes) {
                if (this._pickingTexture) {
                    this._pickingTexture.setMaterialForRendering(mesh, undefined);
                }
            }
            this._gsCompoundRenderMeshes.length = 0;
            // Dispose GS picking materials
            for (const material of this._gsPickingMaterials) {
                material.dispose();
            }
            this._gsPickingMaterials.length = 0;
            this._pickableMeshes.length = 0;
            this._meshMaterialMap.clear();
            this._idMap.length = 0;
            this._thinIdMap.length = 0;
            this._meshUniqueIdToPickerId.length = 0;
            if (this._pickingTexture) {
                this._pickingTexture.renderList = [];
            }
        }
        this._nextFreeId = 1;
    }
    /**
     * Add array of meshes to the current picking list
     * @param list defines the array of meshes to add to the current picking list
     */
    addPickingList(list) {
        if (!list || list.length === 0) {
            return;
        }
        // Prepare target
        const scene = ("mesh" in list[0] ? list[0].mesh : list[0]).getScene();
        const engine = scene.getEngine();
        const rttSizeW = engine.getRenderWidth();
        const rttSizeH = engine.getRenderHeight();
        if (!this._pickingTexture) {
            this._createRenderTarget(scene, rttSizeW, rttSizeH);
        }
        else {
            const size = this._pickingTexture.getSize();
            if (size.width !== rttSizeW || size.height !== rttSizeH || this._cachedScene !== scene) {
                this._createRenderTarget(scene, rttSizeW, rttSizeH);
            }
        }
        this._sceneBeforeRenderObserver?.remove();
        this._sceneBeforeRenderObserver = scene.onBeforeRenderObservable.add(() => {
            if (scene.frameGraph && this._renderPickingTexture && this._cachedScene && this._pickingTexture) {
                this._cachedScene._renderRenderTarget(this._pickingTexture, this._cachedScene.cameras?.[0] ?? null);
                this._cachedScene.activeCamera = null;
            }
        });
        this._cachedScene = scene;
        this._engine = scene.getEngine();
        if (!this._pickingTexture.renderList) {
            this._pickingTexture.renderList = [];
        }
        const newPickableMeshes = new Array(list.length);
        const pickableMeshOffset = this._pickableMeshes?.length ?? 0;
        this._cachedScene = scene;
        this._engine = scene.getEngine();
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if ("mesh" in item) {
                this._meshMaterialMap.set(item.mesh, item.material);
                newPickableMeshes[i] = item.mesh;
            }
            else {
                const className = item.getClassName();
                if (IsGaussianSplattingClassName(className) || className === "GaussianSplattingPartProxyMesh") {
                    // GS meshes get special picking materials - handled in the ID assignment loop below
                    newPickableMeshes[i] = item;
                }
                else {
                    const material = this._getPickingMaterial(scene, item.material?.fillMode ?? 0);
                    this._meshMaterialMap.set(item, material);
                    newPickableMeshes[i] = item;
                }
            }
        }
        if (this._pickableMeshes !== null) {
            this._pickableMeshes = [...this._pickableMeshes, ...newPickableMeshes];
        }
        else {
            this._pickableMeshes = newPickableMeshes;
        }
        // We will affect colors and create vertex color buffers
        let nextFreeId = this._nextFreeId;
        // Collect GaussianSplatting part proxy groups for compound picking
        const gsCompoundGroups = [];
        for (let index = 0; index < newPickableMeshes.length; index++) {
            const mesh = newPickableMeshes[index];
            const className = mesh.getClassName();
            // Handle GaussianSplatting part proxy meshes - collect by compound for processing after the loop
            if (className === "GaussianSplattingPartProxyMesh") {
                const proxy = mesh; // GaussianSplattingPartProxyMesh
                const compound = proxy.compoundSplatMesh;
                const globalIndex = index + pickableMeshOffset;
                let group = gsCompoundGroups[compound.uniqueId];
                if (!group) {
                    group = { compound, partEntries: [] };
                    gsCompoundGroups[compound.uniqueId] = group;
                }
                group.partEntries.push({ proxy, globalIndex });
                continue; // Don't add to render list - the compound mesh will render for all parts
            }
            // Handle non-compound GaussianSplatting meshes (including streamed)
            if (IsGaussianSplattingClassName(className)) {
                const globalIndex = index + pickableMeshOffset;
                const pickId = nextFreeId;
                this._idMap[pickId] = globalIndex;
                this._meshUniqueIdToPickerId[mesh.uniqueId] = pickId;
                nextFreeId++;
                if (!mesh.isPickable || !mesh.isVisible) {
                    continue;
                }
                // Create a GaussianSplattingMaterial with picking plugin for GPU picking
                const gsPickingMaterial = this._createGaussianSplattingPickingMaterial(scene, mesh);
                const plugin = gsPickingMaterial.pluginManager.getPlugin("GaussianSplatGpuPicking");
                plugin.meshId = pickId;
                gsPickingMaterial.onBindObservable.add(() => {
                    this._meshRenderingCount++;
                });
                this._gsPickingMaterials.push(gsPickingMaterial);
                this._meshMaterialMap.set(mesh, gsPickingMaterial);
                this._pickingTexture.setMaterialForRendering(mesh, gsPickingMaterial);
                this._pickingTexture.renderList.push(mesh);
                continue;
            }
            // Standard mesh processing
            const material = this._meshMaterialMap.get(mesh);
            if (!this._pickingMaterialCache.includes(material)) {
                material.onBindObservable.add(this._materialBindCallback, undefined, undefined, this);
            }
            this._pickingTexture.setMaterialForRendering(mesh, material);
            this._pickingTexture.renderList.push(mesh);
            if (mesh.isAnInstance) {
                continue; // This will be handled by the source mesh
            }
            const globalIndex = index + pickableMeshOffset;
            if (mesh.hasThinInstances) {
                const thinInstanceCount = mesh.thinInstanceCount;
                const instanceIdData = new Float32Array(thinInstanceCount);
                for (let i = 0; i < thinInstanceCount; i++) {
                    instanceIdData[i] = nextFreeId;
                    this._thinIdMap[nextFreeId] = { meshId: globalIndex, thinId: i };
                    nextFreeId++;
                }
                mesh.thinInstanceSetBuffer(GPUPicker._AttributeName, instanceIdData, 1);
            }
            else {
                const currentMeshId = nextFreeId;
                this._idMap[currentMeshId] = globalIndex;
                nextFreeId++;
                if (mesh.hasInstances) {
                    // find index of instances of that mesh
                    const instancesForPick = [];
                    for (let pickableMeshIndex = 0; pickableMeshIndex < newPickableMeshes.length; ++pickableMeshIndex) {
                        const m = newPickableMeshes[pickableMeshIndex];
                        if (m.isAnInstance && m.sourceMesh === mesh) {
                            instancesForPick.push(pickableMeshIndex);
                        }
                    }
                    const instanceIdData = new Float32Array(instancesForPick.length + 1); // +1 for the source mesh
                    instanceIdData[0] = currentMeshId;
                    for (let i = 0; i < instancesForPick.length; i++) {
                        instanceIdData[i + 1] = nextFreeId;
                        const globalInstanceIndex = instancesForPick[i] + pickableMeshOffset;
                        this._idMap[nextFreeId] = globalInstanceIndex;
                        nextFreeId++;
                    }
                    const engine = mesh.getEngine();
                    const buffer = new VertexBuffer(engine, instanceIdData, GPUPicker._AttributeName, false, false, 1, true);
                    mesh.setVerticesBuffer(buffer, true);
                }
                else {
                    this._meshUniqueIdToPickerId[mesh.uniqueId] = currentMeshId;
                }
            }
        }
        // Process GaussianSplatting compound groups (part proxy meshes)
        for (const group of gsCompoundGroups) {
            if (!group) {
                continue;
            }
            const compound = group.compound;
            // Assign picking IDs for each part
            const partMeshIds = new Array(compound.partCount || 1).fill(0);
            for (const entry of group.partEntries) {
                const pickId = nextFreeId;
                this._idMap[pickId] = entry.globalIndex;
                const partIndex = entry.proxy.partIndex;
                if (partIndex < partMeshIds.length) {
                    partMeshIds[partIndex] = pickId;
                }
                nextFreeId++;
            }
            // Create compound GS picking material with plugin
            const gsPickingMaterial = this._createGaussianSplattingPickingMaterial(scene, compound);
            const plugin = gsPickingMaterial.pluginManager.getPlugin("GaussianSplatGpuPicking");
            plugin.isCompound = true;
            plugin.partMeshIds = partMeshIds;
            // Only active (included, enabled, visible, and pickable) parts should contribute to the depth buffer.
            const activeParts = group.partEntries.filter((e) => this._isPartProxyActiveForPicking(e.proxy)).map((e) => e.proxy.partIndex);
            plugin.setPartActive(activeParts);
            gsPickingMaterial.onBindObservable.add(() => {
                this._meshRenderingCount++;
            });
            this._gsPickingMaterials.push(gsPickingMaterial);
            this._meshMaterialMap.set(compound, gsPickingMaterial);
            this._pickingTexture.setMaterialForRendering(compound, gsPickingMaterial);
            this._pickingTexture.renderList.push(compound);
            this._gsCompoundRenderMeshes.push(compound);
        }
        if (GPUPicker._MaxPickingId < nextFreeId - 1) {
            if (!this._idWarningIssued) {
                this._idWarningIssued = true;
                Logger.Warn(`GPUPicker maximum number of pickable meshes and instances is ${GPUPicker._MaxPickingId}. Some meshes or instances won't be pickable.`);
            }
        }
        this._nextFreeId = nextFreeId;
    }
    /**
     * Execute a picking operation
     * @param x defines the X coordinates where to run the pick
     * @param y defines the Y coordinates where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @returns A promise with the picking results
     */
    async pickAsync(x, y, disposeWhenDone = false) {
        if (this._pickingInProgress) {
            return null;
        }
        if (!this._pickableMeshes || this._pickableMeshes.length === 0) {
            return null;
        }
        const { rttSizeW, rttSizeH, scaleX, scaleY } = this._getRenderInfo();
        const { x: adjustedX, y: adjustedY } = this._prepareForPicking(x, y, scaleX, scaleY);
        if (adjustedX < 0 || adjustedY < 0 || adjustedX >= rttSizeW || adjustedY >= rttSizeH) {
            return null;
        }
        this._pickingInProgress = true;
        // Invert Y
        const invertedY = rttSizeH - adjustedY - 1;
        const pickingRegion = this._getPickingRenderRegion(adjustedX, invertedY, rttSizeW, rttSizeH);
        this._preparePickingBuffer(this._engine, rttSizeW, rttSizeH, pickingRegion.x, pickingRegion.y, pickingRegion.width, pickingRegion.height);
        await this._waitForPickingMaterialsReadyAsync();
        this._addPickingTextureToRenderTargets();
        return await this._executePickingAsync(adjustedX, invertedY, disposeWhenDone);
    }
    /**
     * Execute a picking operation on multiple coordinates
     * @param xy defines the X,Y coordinates where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @param options defines options used to tune the multi pick readback strategy
     * @returns A promise with the picking results. Always returns an array with the same length as the number of coordinates. The mesh or null at the index where no mesh was picked.
     */
    async multiPickAsync(xy, disposeWhenDone = false, options) {
        if (this._pickingInProgress) {
            return null;
        }
        if (!this._pickableMeshes || this._pickableMeshes.length === 0 || xy.length === 0) {
            return null;
        }
        if (xy.length === 1) {
            const pi = await this.pickAsync(xy[0].x, xy[0].y, disposeWhenDone);
            const result = {
                meshes: [pi?.mesh ?? null],
                thinInstanceIndexes: pi?.thinInstanceIndex !== undefined ? [pi.thinInstanceIndex] : undefined,
            };
            if (this._useDepthPicking) {
                result.pickedPoints = [pi?.pickedPoint ?? null];
                result.normals = [pi?.normal ?? null];
            }
            return result;
        }
        this._pickingInProgress = true;
        const processedXY = new Array(xy.length);
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        const { rttSizeW, rttSizeH, scaleX, scaleY } = this._getRenderInfo();
        let hasInBoundsPoint = false;
        let inBoundsPointCount = 0;
        // Process screen coordinates adjust to dpr
        for (let i = 0; i < xy.length; i++) {
            const item = xy[i];
            const { x, y } = item;
            const { x: adjustedX, y: adjustedY } = this._prepareForPicking(x, y, scaleX, scaleY);
            processedXY[i] = {
                ...item,
                x: adjustedX,
                y: adjustedY,
            };
            if (adjustedX < 0 || adjustedY < 0 || adjustedX >= rttSizeW || adjustedY >= rttSizeH) {
                continue;
            }
            hasInBoundsPoint = true;
            inBoundsPointCount++;
            minX = Math.min(minX, adjustedX);
            maxX = Math.max(maxX, adjustedX);
            minY = Math.min(minY, adjustedY);
            maxY = Math.max(maxY, adjustedY);
        }
        if (!hasInBoundsPoint) {
            this._pickingInProgress = false;
            return null;
        }
        const depthPadding = this._useDepthPicking ? GPUPicker._DepthPixelRadius : 0;
        const regionLeft = Math.max(minX - depthPadding, 0);
        const regionRight = Math.min(maxX + depthPadding, rttSizeW - 1);
        const regionTop = Math.max(minY - depthPadding, 0);
        const regionBottom = Math.min(maxY + depthPadding, rttSizeH - 1);
        if (regionLeft >= rttSizeW || regionTop >= rttSizeH || regionRight < 0 || regionBottom < 0) {
            this._pickingInProgress = false;
            return null;
        }
        const w = regionRight - regionLeft + 1;
        const h = regionBottom - regionTop + 1;
        const partialCutH = rttSizeH - regionBottom - 1;
        const useIndividualReadback = this._shouldUseIndividualMultiPickReadback(inBoundsPointCount, w * h, options);
        this._preparePickingBuffer(this._engine, rttSizeW, rttSizeH, regionLeft, partialCutH, w, h, useIndividualReadback ? 1 : w, useIndividualReadback ? 1 : h);
        await this._waitForPickingMaterialsReadyAsync();
        this._addPickingTextureToRenderTargets();
        return await this._executeMultiPickingAsync(processedXY, regionLeft, partialCutH, rttSizeW, rttSizeH, w, h, useIndividualReadback, disposeWhenDone);
    }
    /**
     * Execute a picking operation on box defined by two screen coordinates
     * @param x1 defines the X coordinate of the first corner of the box where to run the pick
     * @param y1 defines the Y coordinate of the first corner of the box where to run the pick
     * @param x2 defines the X coordinate of the opposite corner of the box where to run the pick
     * @param y2 defines the Y coordinate of the opposite corner of the box where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @returns A promise with the picking results. Contains one entry for each picked pixel in the box.
     */
    async boxPickAsync(x1, y1, x2, y2, disposeWhenDone = false) {
        if (this._pickingInProgress) {
            return null;
        }
        if (!this._pickableMeshes || this._pickableMeshes.length === 0) {
            return null;
        }
        this._pickingInProgress = true;
        const { rttSizeW, rttSizeH, scaleX, scaleY } = this._getRenderInfo();
        const { x: adjustedX1, y: adjustedY1 } = this._prepareForPicking(x1, y1, scaleX, scaleY);
        const { x: adjustedX2, y: adjustedY2 } = this._prepareForPicking(x2, y2, scaleX, scaleY);
        const minX = Math.max(Math.min(adjustedX1, adjustedX2), 0);
        const maxX = Math.min(Math.max(adjustedX1, adjustedX2), rttSizeW - 1);
        const minY = Math.max(Math.min(adjustedY1, adjustedY2), 0);
        const maxY = Math.min(Math.max(adjustedY1, adjustedY2), rttSizeH - 1);
        if (minX >= rttSizeW || minY >= rttSizeH || maxX < 0 || maxY < 0) {
            this._pickingInProgress = false;
            return null;
        }
        const depthPadding = this._useDepthPicking ? GPUPicker._DepthPixelRadius : 0;
        const regionLeft = Math.max(minX - depthPadding, 0);
        const regionRight = Math.min(maxX + depthPadding, rttSizeW - 1);
        const regionTop = Math.max(minY - depthPadding, 0);
        const regionBottom = Math.min(maxY + depthPadding, rttSizeH - 1);
        const w = regionRight - regionLeft + 1;
        const h = regionBottom - regionTop + 1;
        const partialCutH = rttSizeH - regionBottom - 1;
        this._preparePickingBuffer(this._engine, rttSizeW, rttSizeH, regionLeft, partialCutH, w, h);
        await this._waitForPickingMaterialsReadyAsync();
        this._addPickingTextureToRenderTargets();
        return await this._executeBoxPickingAsync(minX, maxY, Math.max(maxX - minX, 1), Math.max(maxY - minY, 1), regionLeft, partialCutH, rttSizeW, rttSizeH, w, h, disposeWhenDone);
    }
    _getRenderInfo() {
        const engine = this._cachedScene.getEngine();
        const rttSizeW = engine.getRenderWidth();
        const rttSizeH = engine.getRenderHeight();
        // Picking coordinates are expected in input/canvas CSS pixels, matching Babylon pointer coordinates.
        // Use the actual client rect so CSS scaling/stretching is handled, and fall back to hardware scaling
        // for engines without a DOM input element.
        let inputElementClientRect = null;
        try {
            inputElementClientRect = engine.getInputElementClientRect();
        }
        catch {
            // Non-DOM or pure engine builds may not register the DOM side effect. Fall back below.
        }
        const scaleX = inputElementClientRect?.width ? rttSizeW / inputElementClientRect.width : 1 / engine._hardwareScalingLevel;
        const scaleY = inputElementClientRect?.height ? rttSizeH / inputElementClientRect.height : 1 / engine._hardwareScalingLevel;
        return {
            rttSizeW,
            rttSizeH,
            scaleX,
            scaleY,
        };
    }
    _prepareForPicking(x, y, scaleX, scaleY) {
        return { x: (scaleX * x) >> 0, y: (scaleY * y) >> 0 };
    }
    _getPickingRenderRegion(x, y, renderWidth, renderHeight) {
        if (!this._useDepthPicking) {
            return { x, y, width: 1, height: 1 };
        }
        const radius = GPUPicker._DepthPixelRadius;
        const left = Math.max(x - radius, 0);
        const bottom = Math.max(y - radius, 0);
        const right = Math.min(x + radius, renderWidth - 1);
        const top = Math.min(y + radius, renderHeight - 1);
        return {
            x: left,
            y: bottom,
            width: right - left + 1,
            height: top - bottom + 1,
        };
    }
    _shouldUseIndividualMultiPickReadback(inBoundsPointCount, readArea, options) {
        const readbackStrategy = options?.readbackStrategy ?? 0 /* GPUMultiPickReadbackStrategy.Auto */;
        if (inBoundsPointCount === 0 || readbackStrategy === 1 /* GPUMultiPickReadbackStrategy.Rectangle */) {
            return false;
        }
        if (readbackStrategy === 2 /* GPUMultiPickReadbackStrategy.Individual */) {
            return true;
        }
        const maxIndividualReadbackCount = options?.maxIndividualReadbackCount !== undefined && Number.isFinite(options.maxIndividualReadbackCount) && options.maxIndividualReadbackCount >= 0
            ? options.maxIndividualReadbackCount
            : GPUPicker._MaxMultiPickIndividualReadbackCount;
        if (inBoundsPointCount > maxIndividualReadbackCount) {
            return false;
        }
        const individualReadbackAreaRatio = options?.individualReadbackAreaRatio !== undefined && Number.isFinite(options.individualReadbackAreaRatio) && options.individualReadbackAreaRatio > 0
            ? options.individualReadbackAreaRatio
            : GPUPicker._MultiPickIndividualReadbackAreaRatio;
        const pointReadArea = inBoundsPointCount * (this._useDepthPicking ? 1 + (GPUPicker._DepthPixelRadius * 2 + 1) ** 2 : 1);
        return readArea > pointReadArea * individualReadbackAreaRatio;
    }
    _isPartProxyActiveForPicking(proxy) {
        return proxy.isEnabled() && proxy.isPickable && proxy.isVisible;
    }
    _preparePickingBuffer(engine, rttSizeW, rttSizeH, x, y, w = 1, h = 1, readBufferW = w, readBufferH = h) {
        this._meshRenderingCount = 0;
        const requiredBufferSize = engine.isWebGPU ? (4 * readBufferW * readBufferH + 255) & ~255 : 4 * readBufferW * readBufferH;
        if (!this._readbuffer || this._readbuffer.length < requiredBufferSize) {
            this._readbuffer = new Uint8Array(requiredBufferSize);
        }
        // Do we need to rebuild the RTT?
        const size = this._pickingTexture.getSize();
        if (size.width !== rttSizeW || size.height !== rttSizeH) {
            this._createRenderTarget(this._cachedScene, rttSizeW, rttSizeH);
            this._updateRenderList();
        }
        this._pickingTexture.clearColor = new Color4(0, 0, 0, 0);
        this._pickingTextureClearObserver?.remove();
        this._pickingTextureClearObserver = this._pickingTexture.onClearObservable.add((engine) => {
            if (this._isUsingDepthPickingRenderTarget) {
                engine.bindAttachments(engine.buildTextureLayout([true, false]));
            }
            engine.clear(this._pickingTexture.clearColor, true, true, true);
            if (this._isUsingDepthPickingRenderTarget) {
                engine.bindAttachments(engine.buildTextureLayout([true, true]));
            }
        });
        this._pickingTexture.onBeforeRender = () => {
            this._enableScissor(x, y, w, h);
        };
        this._pickingTextureAfterRenderObserver?.remove();
        this._pickingTextureAfterRenderObserver = this._pickingTexture.onAfterRenderObservable.add(() => {
            this._disableScissor();
        });
    }
    _addPickingTextureToRenderTargets() {
        this._removePickingTextureFromRenderTargets();
        this._cachedScene.customRenderTargets.push(this._pickingTexture);
        this._renderPickingTexture = true;
    }
    _removePickingTextureFromRenderTargets() {
        if (!this._cachedScene || !this._pickingTexture) {
            return;
        }
        const index = this._cachedScene.customRenderTargets.indexOf(this._pickingTexture);
        if (index > -1) {
            this._cachedScene.customRenderTargets.splice(index, 1);
            this._renderPickingTexture = false;
        }
    }
    // pick one pixel
    async _executePickingAsync(x, y, disposeWhenDone) {
        return await new Promise((resolve, reject) => {
            if (!this._pickingTexture) {
                this._pickingInProgress = false;
                reject(new Error("Picking texture not created"));
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this._pickingTexture.onAfterRender = async () => {
                if (this._checkRenderStatus()) {
                    try {
                        this._pickingTexture.onAfterRender = null;
                        let pickedMesh = null;
                        let thinInstanceIndex = undefined;
                        this._removePickingTextureFromRenderTargets();
                        // Do the actual picking
                        if (await this._readTexturePixelsAsync(x, y)) {
                            const colorId = this._getColorIdFromReadBuffer(0);
                            // Thin?
                            if (this._thinIdMap[colorId]) {
                                pickedMesh = this._pickableMeshes[this._thinIdMap[colorId].meshId];
                                thinInstanceIndex = this._thinIdMap[colorId].thinId;
                            }
                            else {
                                pickedMesh = this._pickableMeshes[this._idMap[colorId]];
                            }
                        }
                        // Depth reconstruction is guaranteed for GPUPicker's default picking shader. Custom picking
                        // materials and special material plugins can also work if they write the second MRT attachment;
                        // otherwise the reconstructed pickedPoint/normal may be missing or incorrect.
                        let depthPickingInfo = null;
                        if (this._useDepthPicking && pickedMesh) {
                            const camera = this._cachedScene.activeCamera;
                            if (camera) {
                                const { rttSizeW, rttSizeH } = this._getRenderInfo();
                                const viewport = camera.viewport.toGlobal(rttSizeW, rttSizeH);
                                const view = this._cachedScene.getViewMatrix().clone();
                                const projection = this._cachedScene.getProjectionMatrix().clone();
                                const cameraPosition = camera.globalPosition.clone();
                                depthPickingInfo = await this._getDepthPickingInfoAsync(x, y, rttSizeW, rttSizeH, view, projection, cameraPosition, viewport);
                            }
                        }
                        if (disposeWhenDone) {
                            this.dispose();
                        }
                        this._pickingInProgress = false;
                        if (pickedMesh) {
                            resolve({ mesh: pickedMesh, thinInstanceIndex: thinInstanceIndex, ...depthPickingInfo });
                        }
                        else {
                            resolve(null);
                        }
                    }
                    catch (error) {
                        this._removePickingTextureFromRenderTargets();
                        this._pickingInProgress = false;
                        reject(error instanceof Error ? error : new Error(`${error}`));
                    }
                }
            };
        });
    }
    // pick multiple pixels
    async _executeMultiPickingAsync(xy, readX, readY, rttSizeW, rttSizeH, w, h, useIndividualReadback, disposeWhenDone) {
        return await new Promise((resolve, reject) => {
            if (!this._pickingTexture) {
                this._pickingInProgress = false;
                reject(new Error("Picking texture not created"));
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this._pickingTexture.onAfterRender = async () => {
                if (this._checkRenderStatus()) {
                    try {
                        this._pickingTexture.onAfterRender = null;
                        const pickedMeshes = new Array(xy.length).fill(null);
                        const thinInstanceIndexes = new Array(xy.length).fill(0);
                        if (useIndividualReadback) {
                            for (let i = 0; i < xy.length; i++) {
                                const pointBottomY = rttSizeH - xy[i].y - 1;
                                if (xy[i].x < 0 || pointBottomY < 0 || xy[i].x >= rttSizeW || pointBottomY >= rttSizeH) {
                                    continue;
                                }
                                // eslint-disable-next-line no-await-in-loop
                                if (await this._readTexturePixelsAsync(xy[i].x, pointBottomY, 1, 1)) {
                                    const { pickedMesh, thinInstanceIndex } = this._getMeshFromReadBuffer(0);
                                    pickedMeshes[i] = pickedMesh;
                                    thinInstanceIndexes[i] = thinInstanceIndex ?? 0;
                                }
                            }
                        }
                        else {
                            if (await this._readTexturePixelsAsync(readX, readY, w, h)) {
                                for (let i = 0; i < xy.length; i++) {
                                    const { pickedMesh, thinInstanceIndex } = this._getMeshFromMultiplePoints(xy[i].x, xy[i].y, readX, readY, rttSizeH, w, h);
                                    pickedMeshes[i] = pickedMesh;
                                    thinInstanceIndexes[i] = thinInstanceIndex ?? 0;
                                }
                            }
                        }
                        let pickedPoints;
                        let normals;
                        if (this._useDepthPicking) {
                            pickedPoints = new Array(xy.length).fill(null);
                            normals = new Array(xy.length).fill(null);
                        }
                        if (pickedPoints && normals && pickedMeshes.some((mesh) => !!mesh)) {
                            const camera = this._cachedScene.activeCamera;
                            if (camera) {
                                const viewport = camera.viewport.toGlobal(rttSizeW, rttSizeH);
                                const view = this._cachedScene.getViewMatrix().clone();
                                const projection = this._cachedScene.getProjectionMatrix().clone();
                                const cameraPosition = camera.globalPosition.clone();
                                if (useIndividualReadback) {
                                    for (let i = 0; i < xy.length; i++) {
                                        if (!pickedMeshes[i]) {
                                            continue;
                                        }
                                        const pointY = rttSizeH - xy[i].y - 1;
                                        // eslint-disable-next-line no-await-in-loop
                                        const depthPickingInfo = await this._getDepthPickingInfoAsync(xy[i].x, pointY, rttSizeW, rttSizeH, view, projection, cameraPosition, viewport);
                                        pickedPoints[i] = depthPickingInfo?.pickedPoint ?? null;
                                        normals[i] = depthPickingInfo?.normal ?? null;
                                    }
                                }
                                else {
                                    const depthPixels = await this._readDepthTexturePixelsAsync(readX, readY, w, h);
                                    if (depthPixels) {
                                        for (let i = 0; i < xy.length; i++) {
                                            if (!pickedMeshes[i]) {
                                                continue;
                                            }
                                            const pointY = rttSizeH - xy[i].y - 1;
                                            const depthPickingInfo = this._getDepthPickingInfoFromBuffer(depthPixels, xy[i].x, pointY, readX, readY, w, h, rttSizeH, view, projection, cameraPosition, viewport);
                                            pickedPoints[i] = depthPickingInfo?.pickedPoint ?? null;
                                            normals[i] = depthPickingInfo?.normal ?? null;
                                        }
                                    }
                                }
                            }
                        }
                        if (disposeWhenDone) {
                            this.dispose();
                        }
                        this._pickingInProgress = false;
                        resolve({ meshes: pickedMeshes, thinInstanceIndexes: thinInstanceIndexes, pickedPoints, normals });
                    }
                    catch (error) {
                        this._removePickingTextureFromRenderTargets();
                        this._pickingInProgress = false;
                        reject(error instanceof Error ? error : new Error(`${error}`));
                    }
                }
            };
        });
    }
    // pick box area
    async _executeBoxPickingAsync(scanX, scanMaxY, scanW, scanH, readX, readY, rttSizeW, rttSizeH, readW, readH, disposeWhenDone) {
        return await new Promise((resolve, reject) => {
            if (!this._pickingTexture) {
                this._pickingInProgress = false;
                reject(new Error("Picking texture not created"));
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this._pickingTexture.onAfterRender = async () => {
                if (this._checkRenderStatus()) {
                    try {
                        this._pickingTexture.onAfterRender = null;
                        const pickedMeshes = [];
                        const thinInstanceIndexes = [];
                        const pickedPixelCoordinates = [];
                        const scanBufferX = scanX - readX;
                        const scanBufferY = rttSizeH - scanMaxY - 1 - readY;
                        if (await this._readTexturePixelsAsync(readX, readY, readW, readH)) {
                            for (let offsetY = 0; offsetY < scanH; ++offsetY) {
                                for (let offsetX = 0; offsetX < scanW; ++offsetX) {
                                    const bufferX = scanBufferX + offsetX;
                                    const bufferY = scanBufferY + offsetY;
                                    if (bufferX < 0 || bufferY < 0 || bufferX >= readW || bufferY >= readH) {
                                        continue;
                                    }
                                    const colorId = this._getColorIdFromReadBuffer(this._getReadBufferOffset(bufferX, bufferY, readW, readH));
                                    if (colorId > 0) {
                                        // Thin?
                                        if (this._thinIdMap[colorId]) {
                                            const pickedMesh = this._pickableMeshes[this._thinIdMap[colorId].meshId];
                                            const thinInstanceIndex = this._thinIdMap[colorId].thinId;
                                            pickedMeshes.push(pickedMesh);
                                            thinInstanceIndexes.push(thinInstanceIndex);
                                            pickedPixelCoordinates.push({ x: scanX + offsetX, y: scanMaxY - offsetY });
                                        }
                                        else {
                                            const pickedMesh = this._pickableMeshes[this._idMap[colorId]];
                                            pickedMeshes.push(pickedMesh);
                                            thinInstanceIndexes.push(0);
                                            pickedPixelCoordinates.push({ x: scanX + offsetX, y: scanMaxY - offsetY });
                                        }
                                    }
                                }
                            }
                        }
                        let pickedPoints;
                        let normals;
                        if (this._useDepthPicking) {
                            pickedPoints = new Array(pickedMeshes.length).fill(null);
                            normals = new Array(pickedMeshes.length).fill(null);
                        }
                        if (pickedPoints && normals && pickedMeshes.length > 0) {
                            const camera = this._cachedScene.activeCamera;
                            const depthPixels = await this._readDepthTexturePixelsAsync(readX, readY, readW, readH);
                            if (camera && depthPixels) {
                                const viewport = camera.viewport.toGlobal(rttSizeW, rttSizeH);
                                const view = this._cachedScene.getViewMatrix().clone();
                                const projection = this._cachedScene.getProjectionMatrix().clone();
                                const cameraPosition = camera.globalPosition.clone();
                                for (let i = 0; i < pickedPixelCoordinates.length; i++) {
                                    const point = pickedPixelCoordinates[i];
                                    const pointY = rttSizeH - point.y - 1;
                                    const depthPickingInfo = this._getDepthPickingInfoFromBuffer(depthPixels, point.x, pointY, readX, readY, readW, readH, rttSizeH, view, projection, cameraPosition, viewport);
                                    pickedPoints[i] = depthPickingInfo?.pickedPoint ?? null;
                                    normals[i] = depthPickingInfo?.normal ?? null;
                                }
                            }
                        }
                        if (disposeWhenDone) {
                            this.dispose();
                        }
                        this._pickingInProgress = false;
                        resolve({ meshes: pickedMeshes, thinInstanceIndexes: thinInstanceIndexes, pickedPoints, normals });
                    }
                    catch (error) {
                        this._removePickingTextureFromRenderTargets();
                        this._pickingInProgress = false;
                        reject(error instanceof Error ? error : new Error(`${error}`));
                    }
                }
            };
        });
    }
    _enableScissor(x, y, w = 1, h = 1) {
        if (this._engine.enableScissor) {
            const scissorY = this._engine?.isWebGPU && this._pickingTexture ? this._pickingTexture.getSize().height - y - h : y;
            this._engine.enableScissor(x, scissorY, w, h);
        }
    }
    _disableScissor() {
        if (this._engine.disableScissor) {
            this._engine.disableScissor();
        }
    }
    /**
     * @returns true if rendering if the picking texture has finished, otherwise false
     */
    _checkRenderStatus() {
        const wasSuccessful = this._meshRenderingCount > 0;
        if (wasSuccessful) {
            // Remove from the active RTTs
            const index = this._cachedScene.customRenderTargets.indexOf(this._pickingTexture);
            if (index > -1) {
                this._cachedScene.customRenderTargets.splice(index, 1);
                this._renderPickingTexture = false;
            }
            return true;
        }
        this._meshRenderingCount = 0;
        return false; // Wait for shaders to be ready
    }
    /**
     * Polls the picking material variant for every mesh in the render list until every
     * variant is ready. Picking materials use parallel shader compilation, and a single
     * ShaderMaterial may produce different effect variants per mesh (instances, thin
     * instances, vertex colors, ...). If we render the picking texture before all variants
     * are compiled, the renderer silently skips meshes whose effect is not yet ready, which
     * can leave the click pixel cleared (0,0,0,0) and cause pickAsync to incorrectly return
     * null. Once compiled, effects are cached by define string in the engine, so this
     * polling only blocks on the very first pick (or whenever the render list changes to
     * include meshes with new define combinations).
     */
    async _waitForPickingMaterialsReadyAsync() {
        const renderList = this._pickingTexture?.renderList;
        if (!renderList || renderList.length === 0) {
            return;
        }
        const engine = this._cachedScene.getEngine();
        // Cap the number of polling attempts to avoid hanging forever if a shader fails to compile.
        const maxAttempts = 200;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let allReady = true;
            // Compile picking effects under the picking texture's render pass id so per-pass effect caches
            // (e.g. GaussianSplattingMaterial) don't stamp them onto the main pass draw wrapper.
            const previousRenderPassId = engine.currentRenderPassId;
            engine.currentRenderPassId = this._pickingTexture.renderPassId;
            try {
                // Iterate every mesh (do not break early): each isReady call kicks off compilation
                // of that mesh's effect variant if not yet started, so visiting them all on the first
                // attempt lets the compiles run in parallel (KHR_parallel_shader_compile) instead of
                // being serialized one variant per render frame.
                for (let i = 0; i < renderList.length; i++) {
                    const mesh = renderList[i];
                    const material = this._meshMaterialMap.get(mesh);
                    // Match the canonical "uses instanced shader variant" check used elsewhere in this file
                    // (see addPickingList) — InstancedMesh entries report isAnInstance=true while
                    // hasInstances=false, so omitting isAnInstance would validate the wrong shader variant.
                    const useInstances = mesh.hasInstances || mesh.isAnInstance || mesh.hasThinInstances;
                    if (material && !material.isReady(mesh, useInstances)) {
                        allReady = false;
                    }
                }
            }
            finally {
                engine.currentRenderPassId = previousRenderPassId;
            }
            if (allReady) {
                return;
            }
            // Wait for the next scene render before re-checking. Effect compilation status
            // (especially with KHR_parallel_shader_compile) is typically observed between
            // frames, so tying the poll to the render loop is more efficient than a fixed timer.
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => {
                this._cachedScene.onAfterRenderObservable.addOnce(() => resolve());
            });
        }
        Logger.Warn(`GPUPicker: gave up waiting for picking materials to compile after ${maxAttempts} attempts; picking results may be incorrect.`);
    }
    _getMeshFromMultiplePoints(x, y, readX, readY, renderHeight, readWidth, readHeight) {
        const bufferX = x - readX;
        const bufferY = renderHeight - y - 1 - readY;
        let pickedMesh = null;
        let thinInstanceIndex;
        if (bufferX < 0 || bufferY < 0 || bufferX >= readWidth || bufferY >= readHeight) {
            return { pickedMesh, thinInstanceIndex };
        }
        const colorId = this._getColorIdFromReadBuffer(this._getReadBufferOffset(bufferX, bufferY, readWidth, readHeight));
        if (colorId > 0) {
            if (this._thinIdMap[colorId]) {
                pickedMesh = this._pickableMeshes[this._thinIdMap[colorId].meshId];
                thinInstanceIndex = this._thinIdMap[colorId].thinId;
            }
            else {
                pickedMesh = this._pickableMeshes[this._idMap[colorId]];
            }
        }
        return { pickedMesh, thinInstanceIndex };
    }
    _getMeshFromReadBuffer(offset) {
        const colorId = this._getColorIdFromReadBuffer(offset);
        let pickedMesh = null;
        let thinInstanceIndex;
        if (colorId > 0) {
            if (this._thinIdMap[colorId]) {
                pickedMesh = this._pickableMeshes[this._thinIdMap[colorId].meshId];
                thinInstanceIndex = this._thinIdMap[colorId].thinId;
            }
            else {
                pickedMesh = this._pickableMeshes[this._idMap[colorId]];
            }
        }
        return { pickedMesh, thinInstanceIndex };
    }
    /**
     * Updates the render list with the current pickable meshes.
     */
    _updateRenderList() {
        this._pickingTexture.renderList = [];
        for (const mesh of this._pickableMeshes) {
            const className = mesh.getClassName();
            // Part proxies don't render directly - their compound renders for them
            if (className === "GaussianSplattingPartProxyMesh") {
                continue;
            }
            this._pickingTexture.setMaterialForRendering(mesh, this._meshMaterialMap.get(mesh));
            this._pickingTexture.renderList.push(mesh);
        }
        // Also add compound GS meshes that render on behalf of part proxies
        for (const mesh of this._gsCompoundRenderMeshes) {
            this._pickingTexture.setMaterialForRendering(mesh, this._meshMaterialMap.get(mesh));
            this._pickingTexture.renderList.push(mesh);
        }
    }
    /**
     * Creates a GaussianSplattingMaterial configured for GPU picking by attaching
     * a GaussianSplattingGpuPickingMaterialPlugin. The plugin injects picking ID
     * encoding into the existing Gaussian Splatting shaders via material plugin hooks.
     * @param scene The scene
     * @param gsMesh The Gaussian Splatting mesh (used to set the source mesh on the material)
     * @returns A GaussianSplattingMaterial with the picking plugin attached
     */
    _createGaussianSplattingPickingMaterial(scene, gsMesh) {
        const gsPickingMaterial = new GaussianSplattingMaterial("gaussianSplattingGpuPicking", scene);
        gsPickingMaterial.setSourceMesh(gsMesh);
        gsPickingMaterial.needAlphaBlending = () => false;
        gsPickingMaterial.backFaceCulling = false;
        // Attach the GPU picking plugin
        const plugin = new GaussianSplattingGpuPickingMaterialPlugin(gsPickingMaterial);
        plugin.enableDepthPicking = this._useDepthPicking;
        plugin.enablePackedDepthPicking = this._isDepthTexturePacked;
        return gsPickingMaterial;
    }
    async _readTexturePixelsAsync(x, y, w = 1, h = 1) {
        if (!this._cachedScene || !this._pickingTexture) {
            return false;
        }
        const engine = this._cachedScene.getEngine();
        const texture = this._isUsingDepthPickingRenderTarget ? this._pickingTexture.textures[0]._texture : this._pickingTexture._texture;
        if (!texture) {
            return false;
        }
        const readY = engine.isWebGPU ? texture.height - y - h : y;
        await engine._readTexturePixels(texture, w, h, -1, 0, this._readbuffer, true, true, x, readY);
        return true;
    }
    async _readDepthTexturePixelsAsync(x, y, w, h) {
        if (!this._cachedScene || !this._isUsingDepthPickingRenderTarget || !(this._pickingTexture instanceof MultiRenderTarget)) {
            return null;
        }
        const texture = this._pickingTexture.textures[1]._texture;
        if (!texture) {
            return null;
        }
        const engine = this._cachedScene.getEngine();
        const requiredByteLength = engine.isWebGPU ? (4 * 4 * w * h + 255) & ~255 : 4 * 4 * w * h;
        if (!this._depthReadbuffer || this._depthReadbuffer.byteLength < requiredByteLength) {
            this._depthReadbuffer = this._depthTextureType === 0 ? new Uint8Array(requiredByteLength) : new Float32Array(requiredByteLength / 4);
        }
        const readY = engine.isWebGPU ? texture.height - y - h : y;
        return await engine._readTexturePixels(texture, w, h, -1, 0, this._depthReadbuffer, true, false, x, readY);
    }
    async _getDepthPickingInfoAsync(x, y, renderWidth, renderHeight, view, projection, cameraPosition, viewport) {
        const radius = GPUPicker._DepthPixelRadius;
        const left = Math.max(x - radius, 0);
        const bottom = Math.max(y - radius, 0);
        const right = Math.min(x + radius, renderWidth - 1);
        const top = Math.min(y + radius, renderHeight - 1);
        const width = right - left + 1;
        const height = top - bottom + 1;
        const pixels = await this._readDepthTexturePixelsAsync(left, bottom, width, height);
        if (!pixels) {
            return null;
        }
        return this._getDepthPickingInfoFromBuffer(pixels, x, y, left, bottom, width, height, renderHeight, view, projection, cameraPosition, viewport);
    }
    _getDepthPickingInfoFromBuffer(pixels, x, y, bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, cameraPosition, viewport) {
        let centerBufferX = x - bufferLeft;
        let centerBufferY = y - bufferBottom;
        let centerDepth = this._getDepthFromBuffer(pixels, centerBufferX, centerBufferY, bufferWidth, bufferHeight);
        if (centerDepth === null) {
            let closestDistanceSquared = Infinity;
            for (let yy = 0; yy < bufferHeight; yy++) {
                for (let xx = 0; xx < bufferWidth; xx++) {
                    const depth = this._getDepthFromBuffer(pixels, xx, yy, bufferWidth, bufferHeight);
                    if (depth === null) {
                        continue;
                    }
                    const dx = xx - centerBufferX;
                    const dy = yy - centerBufferY;
                    const distanceSquared = dx * dx + dy * dy;
                    if (distanceSquared < closestDistanceSquared) {
                        closestDistanceSquared = distanceSquared;
                        centerBufferX = xx;
                        centerBufferY = yy;
                        centerDepth = depth;
                    }
                }
            }
        }
        if (centerDepth === null) {
            return null;
        }
        x = bufferLeft + centerBufferX;
        y = bufferBottom + centerBufferY;
        const viewportTop = renderHeight - viewport.y - viewport.height;
        const centerViewportX = x - viewport.x;
        const centerViewportY = renderHeight - y - 1 - viewportTop;
        if (centerViewportX < 0 || centerViewportY < 0 || centerViewportX >= viewport.width || centerViewportY >= viewport.height) {
            return null;
        }
        const pickedPoint = Vector3.UnprojectFloatsToRef(centerViewportX, centerViewportY, centerDepth, viewport.width, viewport.height, Matrix.IdentityReadOnly, view, projection, new Vector3());
        const fallbackNormal = () => cameraPosition.subtractToRef(pickedPoint, new Vector3()).normalize();
        let bestOffsetA = null;
        let bestOffsetB = null;
        let bestDepthDelta = Infinity;
        const offsets = GPUPicker._DepthNeighborOffsets;
        const depthNeighbors = [];
        const epsilonSquared = Epsilon * Epsilon;
        for (let i = 0; i < offsets.length; i++) {
            const offset = offsets[i];
            const depth = this._getDepthFromBuffer(pixels, centerBufferX + offset[0], centerBufferY + offset[1], bufferWidth, bufferHeight);
            if (depth === null ||
                !this._getDepthPointFromBufferToRef(pixels, x, y, offset[0], offset[1], bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, TmpVectors.Vector3[3])) {
                continue;
            }
            depthNeighbors.push({ offset, depth, depthDelta: Math.abs(centerDepth - depth) });
        }
        depthNeighbors.sort((a, b) => a.depthDelta - b.depthDelta);
        for (let i = 0; i < depthNeighbors.length; i++) {
            const neighborA = depthNeighbors[i];
            this._getDepthPointFromBufferToRef(pixels, x, y, neighborA.offset[0], neighborA.offset[1], bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, TmpVectors.Vector3[3]);
            for (let j = i + 1; j < depthNeighbors.length; j++) {
                const neighborB = depthNeighbors[j];
                this._getDepthPointFromBufferToRef(pixels, x, y, neighborB.offset[0], neighborB.offset[1], bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, TmpVectors.Vector3[4]);
                const toA = TmpVectors.Vector3[3].subtractToRef(pickedPoint, TmpVectors.Vector3[0]);
                const toB = TmpVectors.Vector3[4].subtractToRef(pickedPoint, TmpVectors.Vector3[1]);
                if (toA.lengthSquared() < epsilonSquared || toB.lengthSquared() < epsilonSquared) {
                    continue;
                }
                Vector3.CrossToRef(toB, toA, TmpVectors.Vector3[5]);
                if (TmpVectors.Vector3[5].lengthSquared() < epsilonSquared) {
                    continue;
                }
                const depthDelta = neighborA.depthDelta + neighborB.depthDelta + Math.abs(neighborA.depth - neighborB.depth);
                if (depthDelta < bestDepthDelta) {
                    bestDepthDelta = depthDelta;
                    bestOffsetA = neighborA.offset;
                    bestOffsetB = neighborB.offset;
                }
            }
        }
        if (!bestOffsetA || !bestOffsetB) {
            return { pickedPoint, normal: fallbackNormal() };
        }
        this._getDepthPointFromBufferToRef(pixels, x, y, bestOffsetA[0], bestOffsetA[1], bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, TmpVectors.Vector3[3]);
        this._getDepthPointFromBufferToRef(pixels, x, y, bestOffsetB[0], bestOffsetB[1], bufferLeft, bufferBottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, TmpVectors.Vector3[4]);
        const toA = TmpVectors.Vector3[3].subtractToRef(pickedPoint, TmpVectors.Vector3[0]);
        const toB = TmpVectors.Vector3[4].subtractToRef(pickedPoint, TmpVectors.Vector3[1]);
        if (toA.lengthSquared() < epsilonSquared || toB.lengthSquared() < epsilonSquared) {
            return { pickedPoint, normal: fallbackNormal() };
        }
        toA.normalize();
        toB.normalize();
        const normal = Vector3.CrossToRef(toB, toA, new Vector3());
        if (normal.lengthSquared() < epsilonSquared) {
            return { pickedPoint, normal: fallbackNormal() };
        }
        normal.normalize();
        const cameraDirection = pickedPoint.subtractToRef(cameraPosition, TmpVectors.Vector3[2]).normalize();
        if (Vector3.Dot(normal, cameraDirection) > 0) {
            normal.negateInPlace();
        }
        return { pickedPoint, normal };
    }
    _getDepthPointFromBufferToRef(pixels, x, y, offsetX, offsetY, left, bottom, bufferWidth, bufferHeight, renderHeight, view, projection, viewport, result) {
        const bufferX = x + offsetX - left;
        const bufferY = y + offsetY - bottom;
        const depth = this._getDepthFromBuffer(pixels, bufferX, bufferY, bufferWidth, bufferHeight);
        if (depth === null) {
            return false;
        }
        const viewportTop = renderHeight - viewport.y - viewport.height;
        const viewportX = x + offsetX - viewport.x;
        const viewportY = renderHeight - (y + offsetY) - 1 - viewportTop;
        if (viewportX < 0 || viewportY < 0 || viewportX >= viewport.width || viewportY >= viewport.height) {
            return false;
        }
        Vector3.UnprojectFloatsToRef(viewportX, viewportY, depth, viewport.width, viewport.height, Matrix.IdentityReadOnly, view, projection, result);
        return true;
    }
    _getDepthFromBuffer(pixels, x, y, width, height) {
        if (x < 0 || y < 0 || x >= width || y >= height) {
            return null;
        }
        const index = this._getReadBufferOffset(x, y, width, height);
        let depth;
        if (pixels instanceof Uint8Array || pixels instanceof Uint8ClampedArray) {
            if (this._isDepthTexturePacked) {
                depth = pixels[index] / (255 * 255 * 255 * 255) + pixels[index + 1] / (255 * 255 * 255) + pixels[index + 2] / (255 * 255) + pixels[index + 3] / 255;
            }
            else {
                depth = pixels[index] / 255;
            }
        }
        else {
            depth = pixels[index];
        }
        if (!Number.isFinite(depth) || depth <= 0 || depth >= 1) {
            return null;
        }
        return depth;
    }
    /** Release the resources */
    dispose() {
        this.setPickingList(null);
        this._cachedScene = null;
        // Cleaning up
        this._pickingTexture?.dispose();
        this._pickingTexture = null;
        this._clearPickingMaterials();
        this._sceneBeforeRenderObserver?.remove();
        this._sceneBeforeRenderObserver = null;
        this._pickingTextureClearObserver?.remove();
        this._pickingTextureClearObserver = null;
        this._pickingTextureAfterRenderObserver?.remove();
        this._pickingTextureAfterRenderObserver = null;
    }
}
GPUPicker._AttributeName = "instanceMeshID";
GPUPicker._MaxPickingId = 0x00ffffff; // 24 bits unsigned integer max
GPUPicker._DepthPixelRadius = 1;
GPUPicker._MaxMultiPickIndividualReadbackCount = 32;
GPUPicker._MultiPickIndividualReadbackAreaRatio = 16;
GPUPicker._DepthNeighborOffsets = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
];
//# sourceMappingURL=gpuPicker.js.map
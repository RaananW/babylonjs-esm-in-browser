/** This file must only contain pure code and pure imports */

import { ShaderMaterial } from "../../Materials/shaderMaterial.pure.js";
import { MultiRenderTarget } from "../../Materials/Textures/multiRenderTarget.pure.js";
import { RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.pure.js";
import { Color4 } from "../../Maths/math.color.pure.js";
import { Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";
import { Logger } from "../../Misc/logger.js";
import { Observable } from "../../Misc/observable.pure.js";
import { ProceduralTexture } from "../../Materials/Textures/Procedurals/proceduralTexture.pure.js";
import { EffectRenderer, EffectWrapper } from "../../Materials/effectRenderer.pure.js";
import { StorageBuffer } from "../../Buffers/storageBuffer.js";
import { ComputeShader } from "../../Compute/computeShader.pure.js";
import { IsGaussianSplattingClassName } from "../../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
// Max frames _renderVoxelGrid waits for splat depth sorts to settle before voxelizing anyway
// (~3s at 60fps). Bounds the wait so a continuously re-sorting (orbiting) splat can't block it.
const _MaxSortSettleWaitFrames = 180;
/**
 * Returns true if any of the given meshes (or their children) is a Gaussian splatting mesh.
 * Used to decide whether WebGPU voxelization needs the opacity accumulator buffer + copy pass.
 * @param meshes meshes included in the voxelization
 * @returns whether any included mesh (or child) is a Gaussian splatting mesh
 */
function _HasGaussianSplatting(meshes) {
    for (const mesh of meshes) {
        if (!mesh) {
            continue;
        }
        if (IsGaussianSplattingClassName(mesh.getClassName())) {
            return true;
        }
        for (const child of mesh.getChildMeshes()) {
            if (IsGaussianSplattingClassName(child.getClassName())) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Voxel-based shadow rendering for IBL's.
 * This should not be instanciated directly, as it is part of a scene component
 * @internal
 * @see https://playground.babylonjs.com/#8R5SSE#222
 */
export class _IblShadowsVoxelRenderer {
    /**
     * Return the voxel grid texture.
     * @returns The voxel grid texture.
     */
    getVoxelGrid() {
        if (this._engine.isWebGPU) {
            return this._voxelGrid;
        }
        else if (this._triPlanarVoxelization) {
            return this._combinedVoxelGridPT;
        }
        else {
            return this._voxelGridZaxis;
        }
    }
    /**
     * Return the voxel render target used during voxelization.
     * @returns The voxel render target.
     */
    getRT() {
        if (this._engine.isWebGPU) {
            return this._voxelGridRT;
        }
        else if (this._triPlanarVoxelization) {
            return this._combinedVoxelGridPT;
        }
        else {
            return this._voxelGridZaxis;
        }
    }
    /**
     * Whether to use tri-planar voxelization. More expensive, but can help with artifacts.
     */
    get triPlanarVoxelization() {
        return this._triPlanarVoxelization;
    }
    /**
     * Whether to use tri-planar voxelization. More expensive, but can help with artifacts.
     */
    set triPlanarVoxelization(enabled) {
        if (this._engine.isWebGPU) {
            // WebGPU only supports tri-planar voxelization.
            this._triPlanarVoxelization = true;
            return;
        }
        if (this._triPlanarVoxelization === enabled) {
            return;
        }
        this._disposeVoxelTextures();
        this._triPlanarVoxelization = enabled;
        this._createTextures();
    }
    /**
     * Set the matrix to use for scaling the world space to voxel space
     * @param matrix The matrix to use for scaling the world space to voxel space
     */
    setWorldScaleMatrix(matrix) {
        this._invWorldScaleMatrix = matrix;
    }
    /**
     * @returns Whether voxelization is currently happening.
     */
    isVoxelizationInProgress() {
        return this._voxelizationInProgress;
    }
    /**
     * Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     */
    get voxelResolutionExp() {
        return this._voxelResolutionExp;
    }
    /**
     * Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     */
    set voxelResolutionExp(resolutionExp) {
        if (this._voxelResolutionExp === resolutionExp && this._voxelGridZaxis) {
            return;
        }
        this._voxelResolutionExp = Math.round(Math.min(Math.max(resolutionExp, 3), 9));
        this._voxelResolution = Math.pow(2.0, this._voxelResolutionExp);
        this._disposeVoxelTextures();
        this._createTextures();
    }
    /**
     * Instanciates the voxel renderer
     * @param scene Scene to attach to
     * @param iblShadowsRenderPipeline The render pipeline this pass is associated with
     * @param resolutionExp Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     * @param triPlanarVoxelization Whether to use tri-planar voxelization. Only applies to WebGL. Voxelization will take longer but will reduce missing geometry.
     * @returns The voxel renderer
     */
    constructor(scene, iblShadowsRenderPipeline, resolutionExp = 6, triPlanarVoxelization = true) {
        this._voxelMrtsXaxis = [];
        this._voxelMrtsYaxis = [];
        this._voxelMrtsZaxis = [];
        this._useOpacityBuffer = false;
        this._voxelClearColor = new Color4(0, 0, 0, 1);
        /**
         * Observable that triggers when the voxelization is complete
         */
        this.onVoxelizationCompleteObservable = new Observable();
        this._renderTargets = [];
        /** Per-mesh voxel ShaderMaterials for GaussianSplattingMesh, keyed by mesh uniqueId. */
        this._gsVoxelMaterialCache = new Map();
        this._triPlanarVoxelization = true;
        this._voxelizationInProgress = false;
        // Frames spent waiting for shadow-casting splats' depth sort to settle before voxelizing; see
        // _renderVoxelGrid. Capped so a continuously re-sorting (e.g. orbiting) splat can't starve it.
        this._sortSettleWaitFrames = 0;
        this._invWorldScaleMatrix = Matrix.Identity();
        this._voxelResolution = 64;
        this._voxelResolutionExp = 6;
        this._copyMipLayer = 0;
        this._mipArray = [];
        this._scene = scene;
        this._engine = scene.getEngine();
        this._triPlanarVoxelization = this._engine.isWebGPU || triPlanarVoxelization;
        if (!this._engine.getCaps().drawBuffersExtension) {
            Logger.Error("Can't do voxel rendering without the draw buffers extension.");
        }
        const isWebGPU = this._engine.isWebGPU;
        // Round down to a power of 2 so it evenly divides the power-of-2 voxel resolution,
        // preventing out-of-bounds layer indices in the last MRT slab.
        // This shader implementation writes up to 16 MRT outputs, so clamp to 16 to keep
        // active draw buffers aligned with declared/written fragment outputs.
        const rawMaxDrawBuffers = this._engine.getCaps().maxDrawBuffers || 0;
        const cappedMaxDrawBuffers = Math.min(rawMaxDrawBuffers, 16);
        this._maxDrawBuffers = cappedMaxDrawBuffers >= 1 ? 1 << Math.floor(Math.log2(cappedMaxDrawBuffers)) : 0;
        this._copyMipEffectRenderer = new EffectRenderer(this._engine);
        this._copyMipEffectWrapper = new EffectWrapper({
            engine: this._engine,
            fragmentShader: "copyTexture3DLayerToTexture",
            useShaderStore: true,
            uniformNames: ["layerNum"],
            samplerNames: ["textureSampler"],
            shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await import("../../ShadersWGSL/copyTexture3DLayerToTexture.fragment.js");
                }
                else {
                    await import("../../Shaders/copyTexture3DLayerToTexture.fragment.js");
                }
            },
        });
        this._copyMipEffectWrapper.onApplyObservable.add(() => {
            const effect = this._copyMipEffectWrapper.effect;
            if (!effect || !this._copyMipSourceTexture) {
                return;
            }
            effect.setTexture("textureSampler", this._copyMipSourceTexture);
            effect.setInt("layerNum", this._copyMipLayer);
        });
        this.voxelResolutionExp = resolutionExp;
    }
    _generateMipMaps() {
        const iterations = Math.ceil(Math.log2(this._voxelResolution));
        for (let i = 1; i < iterations + 1; i++) {
            this._generateMipMap(i);
        }
    }
    _generateMipMap(lodLevel) {
        // Generate a mip map for the given level by triggering the render of the procedural mip texture.
        const mipTarget = this._mipArray[lodLevel - 1];
        if (!mipTarget) {
            return;
        }
        mipTarget.setTexture("srcMip", lodLevel === 1 ? this.getVoxelGrid() : this._mipArray[lodLevel - 2]);
        mipTarget.render();
    }
    _copyMipMaps() {
        const iterations = Math.ceil(Math.log2(this._voxelResolution));
        for (let i = 1; i < iterations + 1; i++) {
            this._copyMipMap(i);
        }
    }
    _copyMipMap(lodLevel) {
        // Now, copy this mip into the mip chain of the voxel grid.
        const mipTarget = this._mipArray[lodLevel - 1];
        if (!mipTarget) {
            return;
        }
        const voxelGrid = this.getVoxelGrid();
        let rt;
        if (voxelGrid instanceof RenderTargetTexture && voxelGrid.renderTarget) {
            rt = voxelGrid.renderTarget;
        }
        else {
            rt = voxelGrid._rtWrapper;
        }
        if (rt) {
            this._copyMipEffectRenderer.saveStates();
            const previousColorWrite = this._engine.getColorWrite();
            const previousDepthBuffer = this._engine.getDepthBuffer();
            const previousDepthWrite = this._engine.getDepthWrite();
            const previousAlphaMode = this._engine.getAlphaMode();
            this._engine.setColorWrite(true);
            this._engine.setDepthBuffer(false);
            this._engine.setDepthWrite(false);
            this._engine.setAlphaMode(0);
            const bindSize = mipTarget.getSize().width;
            let sourceDepth = mipTarget.getInternalTexture()?.depth;
            sourceDepth = Math.max(1, sourceDepth || bindSize);
            const destinationMipDepth = Math.max(1, this._voxelResolution >> lodLevel);
            const layersToCopy = Math.min(sourceDepth, destinationMipDepth);
            const destinationTexture = rt.texture;
            const previousGenerateMipMaps = destinationTexture?.generateMipMaps;
            if (destinationTexture) {
                destinationTexture.generateMipMaps = false;
            }
            try {
                // Render to each layer of the voxel grid.
                for (let layer = 0; layer < layersToCopy; layer++) {
                    this._engine.bindFramebuffer(rt, 0, bindSize, bindSize, true, lodLevel, layer);
                    this._copyMipSourceTexture = mipTarget;
                    this._copyMipLayer = layer;
                    this._copyMipEffectRenderer.applyEffectWrapper(this._copyMipEffectWrapper);
                    this._copyMipEffectRenderer.draw();
                    this._engine.unBindFramebuffer(rt, true);
                }
                if (!this._engine.isWebGPU) {
                    this._engine.unbindAllTextures();
                }
            }
            finally {
                if (destinationTexture && previousGenerateMipMaps !== undefined) {
                    destinationTexture.generateMipMaps = previousGenerateMipMaps;
                }
                this._engine.setAlphaMode(previousAlphaMode);
                this._engine.setDepthWrite(previousDepthWrite);
                this._engine.setDepthBuffer(previousDepthBuffer);
                this._engine.setColorWrite(previousColorWrite);
            }
            this._copyMipSourceTexture = undefined;
            this._copyMipEffectRenderer.restoreStates();
        }
    }
    _computeNumberOfSlabs() {
        return Math.ceil(this._voxelResolution / this._maxDrawBuffers);
    }
    _createTextures() {
        const isWebGPU = this._engine.isWebGPU;
        const size = {
            width: this._voxelResolution,
            height: this._voxelResolution,
            depth: this._voxelResolution,
        };
        const voxelAxisOptions = {
            generateDepthBuffer: false,
            generateMipMaps: false,
            type: 0,
            format: 6,
            samplingMode: 1,
        };
        // We can render up to maxDrawBuffers voxel slices of the grid per render.
        // We call this a slab.
        const numSlabs = this._computeNumberOfSlabs();
        const voxelCombinedOptions = {
            generateDepthBuffer: false,
            generateMipMaps: true,
            type: 0,
            format: 6,
            samplingMode: 4,
            shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await import("../../ShadersWGSL/iblCombineVoxelGrids.fragment.js");
                }
                else {
                    await import("../../Shaders/iblCombineVoxelGrids.fragment.js");
                }
            },
        };
        if (this._engine.isWebGPU) {
            this._voxelGrid = new RenderTargetTexture("voxelGrid", size, this._scene, {
                ...voxelCombinedOptions,
                format: 6,
                creationFlags: 1,
            });
            this._voxelGridRT = new RenderTargetTexture("voxelGridRT", { width: Math.min(size.width * 2.0, 2048), height: Math.min(size.height * 2.0, 2048) }, this._scene, voxelAxisOptions);
            // The opacity accumulator is created lazily, only when a voxelization includes Gaussian
            // splats (see _ensureVoxelOpacityAccumulator).
        }
        else if (this._triPlanarVoxelization) {
            this._voxelGridXaxis = new RenderTargetTexture("voxelGridXaxis", size, this._scene, voxelAxisOptions);
            this._voxelGridYaxis = new RenderTargetTexture("voxelGridYaxis", size, this._scene, voxelAxisOptions);
            this._voxelGridZaxis = new RenderTargetTexture("voxelGridZaxis", size, this._scene, voxelAxisOptions);
            this._voxelMrtsXaxis = this._createVoxelMRTs("x_axis_", this._voxelGridXaxis, numSlabs);
            this._voxelMrtsYaxis = this._createVoxelMRTs("y_axis_", this._voxelGridYaxis, numSlabs);
            this._voxelMrtsZaxis = this._createVoxelMRTs("z_axis_", this._voxelGridZaxis, numSlabs);
            this._combinedVoxelGridPT = new ProceduralTexture("combinedVoxelGrid", size, "iblCombineVoxelGrids", this._scene, voxelCombinedOptions, false);
            this._scene.proceduralTextures.splice(this._scene.proceduralTextures.indexOf(this._combinedVoxelGridPT), 1);
            this._combinedVoxelGridPT.setFloat("layer", 0.0);
            this._combinedVoxelGridPT.setTexture("voxelXaxisSampler", this._voxelGridXaxis);
            this._combinedVoxelGridPT.setTexture("voxelYaxisSampler", this._voxelGridYaxis);
            this._combinedVoxelGridPT.setTexture("voxelZaxisSampler", this._voxelGridZaxis);
            // We will render this only after voxelization is completed for the 3 axes.
            this._combinedVoxelGridPT.autoClear = false;
            this._combinedVoxelGridPT.wrapU = Texture.CLAMP_ADDRESSMODE;
            this._combinedVoxelGridPT.wrapV = Texture.CLAMP_ADDRESSMODE;
            this._combinedVoxelGridPT.wrapR = Texture.CLAMP_ADDRESSMODE;
        }
        else {
            this._voxelGridZaxis = new RenderTargetTexture("voxelGridZaxis", size, this._scene, voxelCombinedOptions);
            this._voxelMrtsZaxis = this._createVoxelMRTs("z_axis_", this._voxelGridZaxis, numSlabs);
        }
        const generateVoxelMipOptions = {
            generateDepthBuffer: false,
            generateMipMaps: false,
            type: 0,
            format: 6,
            samplingMode: 1,
            shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await import("../../ShadersWGSL/iblGenerateVoxelMip.fragment.js");
                }
                else {
                    await import("../../Shaders/iblGenerateVoxelMip.fragment.js");
                }
            },
        };
        this._mipArray = new Array(Math.ceil(Math.log2(this._voxelResolution)));
        for (let mipIdx = 1; mipIdx <= this._mipArray.length; mipIdx++) {
            const mipDim = this._voxelResolution >> mipIdx;
            const mipSize = { width: mipDim, height: mipDim, depth: mipDim };
            this._mipArray[mipIdx - 1] = new ProceduralTexture("voxelMip" + mipIdx, mipSize, "iblGenerateVoxelMip", this._scene, generateVoxelMipOptions, false);
            this._scene.proceduralTextures.splice(this._scene.proceduralTextures.indexOf(this._mipArray[mipIdx - 1]), 1);
            const mipTarget = this._mipArray[mipIdx - 1];
            mipTarget.autoClear = false;
            mipTarget.wrapU = Texture.CLAMP_ADDRESSMODE;
            mipTarget.wrapV = Texture.CLAMP_ADDRESSMODE;
            mipTarget.wrapR = Texture.CLAMP_ADDRESSMODE;
            mipTarget.setTexture("srcMip", mipIdx > 1 ? this._mipArray[mipIdx - 2] : this.getVoxelGrid());
            mipTarget.setInt("layerNum", 0);
        }
        this._createVoxelMaterials();
    }
    /**
     * WebGPU only. Allocates the opacity accumulator buffer and the compute shader that copies it into
     * the r8 grid. Storage textures can't blend or do float atomics, so splats accumulate via atomicMax
     * and this compute pass decodes the result into mip 0.
     */
    _ensureVoxelOpacityAccumulator() {
        if (this._voxelOpacityBuffer) {
            return;
        }
        const res = this._voxelResolution;
        // Packed 4 voxels/u32, so res^3 bytes. res is a power of two >= 8, so res^3 is a multiple of 4.
        this._voxelOpacityBuffer = new StorageBuffer(this._engine, res * res * res);
        void (async () => {
            await import("../../ShadersWGSL/iblCopyVoxelBufferToGrid.compute.js");
            this._copyBufferToGridCompute = new ComputeShader("iblCopyVoxelBufferToGrid", this._engine, "iblCopyVoxelBufferToGrid", {
                bindingsMapping: {
                    voxelOpacityBuffer: { group: 0, binding: 0 },
                    voxelGridTarget: { group: 0, binding: 1 },
                },
            });
        })();
    }
    /**
     * WebGPU only. Dispatches the compute pass that decodes the per-voxel opacity accumulator buffer
     * into the r8 voxel grid (mip 0). Runs after all voxelization passes and before mip generation.
     */
    _copyVoxelOpacityBufferToGrid() {
        const compute = this._copyBufferToGridCompute;
        if (!compute || !this._voxelOpacityBuffer) {
            return;
        }
        compute.setStorageBuffer("voxelOpacityBuffer", this._voxelOpacityBuffer);
        compute.setStorageTexture("voxelGridTarget", this._voxelGrid);
        // Workgroup size is 4x4x4; cover the whole grid.
        const groups = Math.ceil(this._voxelResolution / 4);
        compute.dispatch(groups, groups, groups);
    }
    _createVoxelMRTs(name, voxelRT, numSlabs) {
        voxelRT.wrapU = Texture.CLAMP_ADDRESSMODE;
        voxelRT.wrapV = Texture.CLAMP_ADDRESSMODE;
        // 3D texture: clamp the depth (R) axis too. The combine shader samples each grid with the depth
        // coordinate spanning [0,1], so without this it wraps to the opposite face at the boundaries.
        voxelRT.wrapR = Texture.CLAMP_ADDRESSMODE;
        voxelRT.noPrePassRenderer = true;
        const mrtArray = [];
        const targetTypes = new Array(this._maxDrawBuffers).fill(32879);
        for (let mrtIndex = 0; mrtIndex < numSlabs; mrtIndex++) {
            let layerIndices = new Array(this._maxDrawBuffers).fill(0);
            layerIndices = layerIndices.map((value, index) => mrtIndex * this._maxDrawBuffers + index);
            let textureNames = new Array(this._maxDrawBuffers).fill("");
            textureNames = textureNames.map((value, index) => "voxel_grid_" + name + (mrtIndex * this._maxDrawBuffers + index));
            const mrt = new MultiRenderTarget("mrt_" + name + mrtIndex, { width: this._voxelResolution, height: this._voxelResolution, depth: this._voxelResolution }, this._maxDrawBuffers, // number of draw buffers
            this._scene, {
                types: new Array(this._maxDrawBuffers).fill(0),
                samplingModes: new Array(this._maxDrawBuffers).fill(3),
                generateMipMaps: false,
                targetTypes,
                formats: new Array(this._maxDrawBuffers).fill(6),
                faceIndex: new Array(this._maxDrawBuffers).fill(0),
                layerIndex: layerIndices,
                layerCounts: new Array(this._maxDrawBuffers).fill(this._voxelResolution),
                generateDepthBuffer: false,
                generateStencilBuffer: false,
            }, textureNames);
            mrt.clearColor = new Color4(0, 0, 0, 1);
            mrt.noPrePassRenderer = true;
            for (let i = 0; i < this._maxDrawBuffers; i++) {
                mrt.setInternalTexture(voxelRT.getInternalTexture(), i);
            }
            mrtArray.push(mrt);
        }
        return mrtArray;
    }
    _disposeVoxelTextures() {
        this._stopVoxelization();
        for (let i = 0; i < this._voxelMrtsZaxis.length; i++) {
            if (this._triPlanarVoxelization) {
                this._voxelMrtsXaxis[i].dispose(true);
                this._voxelMrtsYaxis[i].dispose(true);
            }
            this._voxelMrtsZaxis[i].dispose(true);
        }
        if (this._triPlanarVoxelization) {
            this._voxelGridXaxis?.dispose();
            this._voxelGridYaxis?.dispose();
            this._combinedVoxelGridPT?.dispose();
        }
        this._voxelGridZaxis?.dispose();
        for (const mip of this._mipArray) {
            mip.dispose();
        }
        this._voxelMaterial?.dispose();
        this._voxelOpacityBuffer?.dispose();
        this._voxelOpacityBuffer = undefined;
        this._copyBufferToGridCompute = undefined;
        // The recreated _voxelMaterial has no IBL_VOXEL_OPACITY_BUFFER define; reset the flag so
        // updateVoxelGrid re-adds it (its change check would otherwise skip it after a resolution change).
        this._useOpacityBuffer = false;
        this._mipArray = [];
        this._voxelMrtsXaxis = [];
        this._voxelMrtsYaxis = [];
        this._voxelMrtsZaxis = [];
    }
    _createVoxelMaterials() {
        const isWebGPU = this._engine.isWebGPU;
        this._voxelMaterial = new ShaderMaterial("voxelization", this._scene, "iblVoxelGrid", {
            uniforms: ["world", "viewMatrix", "invTransWorld", "invWorldScale", "nearPlane", "farPlane", "stepSize"],
            // WebGPU accumulates non-binary voxel opacity via atomicMax into this storage buffer.
            storageBuffers: isWebGPU ? ["voxelOpacityBuffer"] : [],
            defines: ["MAX_DRAW_BUFFERS " + this._maxDrawBuffers],
            shaderLanguage: isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await Promise.all([import("../../ShadersWGSL/iblVoxelGrid.fragment.js"), import("../../ShadersWGSL/iblVoxelGrid.vertex.js")]);
                }
                else {
                    await Promise.all([import("../../Shaders/iblVoxelGrid.fragment.js"), import("../../Shaders/iblVoxelGrid.vertex.js")]);
                }
            },
        });
        this._voxelMaterial.cullBackFaces = false;
        this._voxelMaterial.backFaceCulling = false;
        this._voxelMaterial.depthFunction = 519;
    }
    /**
     * Checks if the voxel renderer is ready to voxelize scene
     * @returns true if the voxel renderer is ready to voxelize scene
     */
    isReady() {
        let allReady = this.getVoxelGrid().isReady();
        for (let i = 0; i < this._mipArray.length; i++) {
            const mipReady = this._mipArray[i].isReady();
            allReady && (allReady = mipReady);
        }
        if (!allReady || this._voxelizationInProgress) {
            return false;
        }
        return true;
    }
    /**
     * If the MRT's are already in the list of render targets, this will
     * remove them so that they don't get rendered again.
     */
    _stopVoxelization() {
        // If the MRT's are already in the list of render targets, remove them.
        this._removeVoxelRTs(this._voxelMrtsXaxis);
        this._removeVoxelRTs(this._voxelMrtsYaxis);
        this._removeVoxelRTs(this._voxelMrtsZaxis);
        this._removeVoxelRTs([this._voxelGridRT]);
    }
    _removeVoxelRTs(rts) {
        // const currentRTs = this._scene.customRenderTargets;
        const rtIdx = this._renderTargets.findIndex((rt) => {
            if (rt === rts[0]) {
                return true;
            }
            return false;
        });
        if (rtIdx >= 0) {
            this._renderTargets.splice(rtIdx, rts.length);
        }
        else {
            const rtIdx = this._scene.customRenderTargets.findIndex((rt) => {
                if (rt === rts[0]) {
                    return true;
                }
                return false;
            });
            if (rtIdx >= 0) {
                this._scene.customRenderTargets.splice(rtIdx, rts.length);
            }
        }
    }
    /**
     * Renders voxel grid of scene for IBL shadows
     * @param includedMeshes
     * @param registerAfterRenderObservable Whether to register scene onAfterRender callback (legacy path).
     */
    updateVoxelGrid(includedMeshes, registerAfterRenderObservable = true) {
        if (this._voxelizationInProgress) {
            return;
        }
        this._stopVoxelization();
        this._voxelizationInProgress = true;
        if (this._engine.isWebGPU) {
            // Route through the opacity accumulator only when Gaussian splats are present (they need
            // non-binary accumulation). Regular-mesh-only voxelization writes the grid directly.
            const useBuffer = _HasGaussianSplatting(includedMeshes);
            if (useBuffer) {
                this._ensureVoxelOpacityAccumulator();
            }
            if (useBuffer !== this._useOpacityBuffer) {
                this._useOpacityBuffer = useBuffer;
                this._voxelMaterial.setDefine("IBL_VOXEL_OPACITY_BUFFER", useBuffer);
            }
        }
        if (this._engine.isWebGPU) {
            this._voxelGridRT.renderList = includedMeshes;
            this._addRTsForRender([this._voxelGridRT], includedMeshes, 0);
        }
        else if (this._triPlanarVoxelization) {
            this._addRTsForRender(this._voxelMrtsXaxis, includedMeshes, 0);
            this._addRTsForRender(this._voxelMrtsYaxis, includedMeshes, 1);
            this._addRTsForRender(this._voxelMrtsZaxis, includedMeshes, 2);
        }
        else {
            this._addRTsForRender(this._voxelMrtsZaxis, includedMeshes, 2);
        }
        if (registerAfterRenderObservable) {
            this._renderVoxelGridBound = this._renderVoxelGrid.bind(this);
            this._scene.onAfterRenderObservable.add(this._renderVoxelGridBound);
        }
    }
    /**
     * Advances voxelization work when running in custom render loops (for example FrameGraph tasks)
     * where scene onAfterRender timing may differ from classic pipeline flow.
     */
    processVoxelization() {
        this._renderVoxelGrid();
    }
    _renderVoxelGrid() {
        if (this._voxelizationInProgress) {
            // Wait for shadow-casting GaussianSplatting meshes' depth sort to settle before
            // rasterizing. Voxelization is order-independent — the order splats are drawn never
            // affects the grid — but the GS voxel draw still *indexes* each splat through the
            // `splatIndex` thin-instance buffer, and that buffer is (re)sized, filled and rebound by
            // the sort worker's callback (the same callback that flips `_isDepthSortSettled`). After
            // addPart() merges a splat, `forcedInstanceCount` jumps to the new total synchronously
            // but the index buffer is only finalized when the sort lands; rasterizing in between
            // indexes a stale/mismatched buffer and writes an empty grid (no IBL shadow until a
            // later refresh). Frame-capped so a continuously re-sorting (orbiting) splat still
            // voxelizes eventually rather than blocking forever.
            let gsSortPending = false;
            for (let i = 0; i < this._renderTargets.length && !gsSortPending; i++) {
                const renderList = this._renderTargets[i].renderList;
                if (!renderList) {
                    continue;
                }
                for (const mesh of renderList) {
                    if (IsGaussianSplattingClassName(mesh.getClassName()) && !mesh._isDepthSortSettled) {
                        gsSortPending = true;
                        break;
                    }
                }
            }
            if (gsSortPending && this._sortSettleWaitFrames < _MaxSortSettleWaitFrames) {
                this._sortSettleWaitFrames++;
                return;
            }
            this._sortSettleWaitFrames = 0;
            let allReady = this.getVoxelGrid().isReady();
            for (let i = 0; i < this._mipArray.length; i++) {
                const mipReady = this._mipArray[i].isReady();
                allReady && (allReady = mipReady);
            }
            for (let i = 0; i < this._renderTargets.length; i++) {
                const rttReady = this._renderTargets[i].isReadyForRendering();
                allReady && (allReady = rttReady);
            }
            for (const gsVoxelMat of Array.from(this._gsVoxelMaterialCache.values())) {
                allReady && (allReady = gsVoxelMat.isReady());
            }
            if (!allReady) {
                return;
            }
            const copyMipEffect = this._copyMipEffectWrapper.effect;
            if (!copyMipEffect.isReady()) {
                return;
            }
            if (this._engine.isWebGPU) {
                if (this._useOpacityBuffer) {
                    // The copy compute must be ready before we voxelize, else the grid stays unpopulated.
                    if (!this._copyBufferToGridCompute || !this._copyBufferToGridCompute.isReady()) {
                        return;
                    }
                    // Reset the accumulator. clear() is a command-encoder op, so it must run before any
                    // render pass opens (here, not mid-render).
                    this._voxelOpacityBuffer?.clear();
                }
                else if (this._voxelGrid && this._voxelGrid.renderTarget) {
                    // Direct mode (no splats): regular meshes textureStore into the grid, so clear each
                    // layer first.
                    for (let layer = 0; layer < this._voxelResolution; layer++) {
                        this._engine.bindFramebuffer(this._voxelGrid.renderTarget, 0, undefined, undefined, true, 0, layer);
                        this._engine.clear(this._voxelClearColor, true, false, false);
                        this._engine.unBindFramebuffer(this._voxelGrid.renderTarget, true);
                    }
                }
            }
            for (const rt of this._renderTargets) {
                rt.render();
            }
            this._stopVoxelization();
            if (this._engine.isWebGPU) {
                if (this._useOpacityBuffer) {
                    // Decode the atomically-accumulated opacity buffer into the r8 voxel grid (mip 0).
                    this._copyVoxelOpacityBufferToGrid();
                }
            }
            else if (this._triPlanarVoxelization) {
                this._combinedVoxelGridPT.render();
            }
            this._generateMipMaps();
            this._copyMipMaps();
            this._scene.onAfterRenderObservable.removeCallback(this._renderVoxelGridBound);
            this._voxelizationInProgress = false;
            this.onVoxelizationCompleteObservable.notifyObservers();
        }
    }
    /**
     * Splits rendering for every voxel RT: non–Gaussian splatting meshes use subMesh.render
     * (material override from setMaterialForRendering); GaussianSplattingMesh uses a custom draw path with its cached voxel ShaderMaterial.
     * @param rtt - the render target texture to install the custom render function on
     */
    _installVoxelMixedCustomRender(rtt) {
        const scene = this._scene;
        const engine = scene.getEngine();
        const renderGsSplat = (sm) => {
            const renderingMesh = sm.getRenderingMesh();
            const effectiveMesh = sm.getEffectiveMesh();
            const gsVoxelMaterial = this._gsVoxelMaterialCache.get(effectiveMesh.uniqueId);
            if (!gsVoxelMaterial || !gsVoxelMaterial.isReady()) {
                return;
            }
            const drawWrapper = gsVoxelMaterial._getDrawWrapper();
            if (!drawWrapper?.effect) {
                return;
            }
            const effect = drawWrapper.effect;
            const batch = renderingMesh._getInstancesRenderList(sm._id, !!sm.getReplacementMesh());
            if (batch.mustReturn) {
                return;
            }
            const hardwareInstancedRendering = engine.getCaps().instancedArrays && ((batch.visibleInstances[sm._id] !== null && batch.visibleInstances[sm._id] !== undefined) || renderingMesh.hasThinInstances);
            const fillMode = sm.getMaterial()?.fillMode ?? 0;
            engine.enableEffect(drawWrapper);
            renderingMesh._bind(sm, effect, fillMode);
            gsVoxelMaterial._preBind(drawWrapper);
            gsVoxelMaterial.bind(effectiveMesh.getWorldMatrix(), effectiveMesh, effect);
            // If rotation/scale textures are missing, bind() logged the warning; skip the draw to avoid GPU errors.
            if (!effectiveMesh.rotationsATexture) {
                gsVoxelMaterial.unbind();
                return;
            }
            if (engine.isWebGPU) {
                // A GSplat is a 3D Gaussian ellipsoid. To approximate its volume in the voxel grid
                // we rasterize three planar cross-section quads — one per principal axis — each
                // spanning the ellipsoid cross-section perpendicular to that axis. A quad rendered
                // edge-on produces zero fragments, so we draw once per world axis: each draw lets
                // computeVoxelSplatWorldPos pick the quad whose normal best aligns with that view,
                // guaranteeing every splat is captured face-on from at least one direction.
                const viewMatrices = _IblShadowsVoxelRenderer._VOXEL_VIEW_MATRICES;
                for (let axisIdx = 0; axisIdx < 3; axisIdx++) {
                    effect.setMatrix("viewMatrix", viewMatrices[axisIdx]);
                    renderingMesh._processRendering(effectiveMesh, sm, effect, fillMode, batch, hardwareInstancedRendering, (_isInstance, world) => {
                        effect.setMatrix("world", world);
                    });
                }
            }
            else {
                // Accumulate overlapping splats with a MAX blend equation (dst = max(src, dst)) so each
                // cell keeps the strongest occluder; writing 0.0 into non-slab draw buffers is a no-op.
                // Matches the WebGPU atomicMax path; see the opacity-compositing limitation in
                // iblVoxelOpacityAtomicMax.
                const previousAlphaMode = engine.getAlphaMode();
                engine.setAlphaMode(19, true);
                renderingMesh._processRendering(effectiveMesh, sm, effect, fillMode, batch, hardwareInstancedRendering, (_isInstance, world) => effect.setMatrix("world", world));
                engine.setAlphaMode(previousAlphaMode, true);
            }
            gsVoxelMaterial.unbind();
        };
        const processBucket = (subMeshes, enableAlphaMode) => {
            for (let i = 0; i < subMeshes.length; i++) {
                const sm = subMeshes.data[i];
                const effective = sm.getEffectiveMesh();
                if (IsGaussianSplattingClassName(effective.getClassName())) {
                    renderGsSplat(sm);
                }
                else {
                    sm.render(enableAlphaMode);
                }
            }
        };
        rtt.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
            if (depthOnlySubMeshes.length) {
                engine.setColorWrite(false);
                processBucket(depthOnlySubMeshes, false);
                engine.setColorWrite(true);
            }
            processBucket(opaqueSubMeshes, false);
            processBucket(alphaTestSubMeshes, false);
            processBucket(transparentSubMeshes, true);
        };
    }
    _addGsMeshToVoxelRT(mrt, mesh) {
        let gsVoxelMaterial = this._gsVoxelMaterialCache.get(mesh.uniqueId);
        if (!gsVoxelMaterial) {
            const gsMaterial = mesh.material;
            if (!gsMaterial) {
                return;
            }
            const shaderLanguage = this._engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */;
            gsVoxelMaterial = gsMaterial.makeVoxelRenderingMaterial(this._scene, shaderLanguage, this._maxDrawBuffers, mesh.isCompound);
            this._gsVoxelMaterialCache.set(mesh.uniqueId, gsVoxelMaterial);
        }
        mrt.renderList?.push(mesh);
        mrt.setMaterialForRendering(mesh, gsVoxelMaterial);
    }
    _addRTsForRender(mrts, includedMeshes, axis) {
        const slabSize = 1.0 / this._computeNumberOfSlabs();
        const voxelMaterial = this._voxelMaterial;
        // We need to update the world scale uniform for every mesh being rendered to the voxel grid.
        for (let mrtIndex = 0; mrtIndex < mrts.length; mrtIndex++) {
            const mrt = mrts[mrtIndex];
            mrt._disableEngineStages = true;
            mrt.useCameraPostProcesses = false;
            mrt.renderParticles = false;
            mrt.renderSprites = false;
            mrt.enableOutlineRendering = false;
            const renderBucket = (bucket) => {
                for (let index = 0; index < bucket.length; index++) {
                    const subMesh = bucket.data[index];
                    if (subMesh.getMaterial() !== voxelMaterial) {
                        continue;
                    }
                    subMesh.render(false);
                }
            };
            mrt.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
                renderBucket(depthOnlySubMeshes);
                renderBucket(opaqueSubMeshes);
                renderBucket(alphaTestSubMeshes);
                renderBucket(transparentSubMeshes);
            };
            mrt.renderList = [];
            const nearPlane = mrtIndex * slabSize;
            const farPlane = (mrtIndex + 1) * slabSize;
            const stepSize = slabSize / this._maxDrawBuffers;
            const viewMatrix = _IblShadowsVoxelRenderer._VOXEL_VIEW_MATRICES[axis];
            mrt.onBeforeRenderObservable.clear();
            mrt.onBeforeRenderObservable.add(() => {
                voxelMaterial.setMatrix("viewMatrix", viewMatrix);
                voxelMaterial.setMatrix("invWorldScale", this._invWorldScaleMatrix);
                voxelMaterial.setFloat("nearPlane", nearPlane);
                voxelMaterial.setFloat("farPlane", farPlane);
                voxelMaterial.setFloat("stepSize", stepSize);
                if (this._engine.isWebGPU) {
                    this._voxelMaterial.useVertexPulling = true;
                    this._voxelMaterial.setTexture("voxel_storage", this.getVoxelGrid());
                    if (this._voxelOpacityBuffer) {
                        this._voxelMaterial.setStorageBuffer("voxelOpacityBuffer", this._voxelOpacityBuffer);
                    }
                }
                // Push per-slab uniforms to each GS voxel material in this MRT's render list.
                for (const m of mrt.renderList ?? []) {
                    if (IsGaussianSplattingClassName(m.getClassName())) {
                        const gsVoxelMat = this._gsVoxelMaterialCache.get(m.uniqueId);
                        if (gsVoxelMat) {
                            gsVoxelMat.setMatrix("invWorldScale", this._invWorldScaleMatrix);
                            if (this._engine.isWebGPU) {
                                // WGSL GS voxel shader uses the same viewMatrix approach as WebGL; the per-axis viewMatrix is set per-draw in renderGsSplat.
                                gsVoxelMat.setTexture("voxel_storage", this.getVoxelGrid());
                                if (this._voxelOpacityBuffer) {
                                    gsVoxelMat.setStorageBuffer("voxelOpacityBuffer", this._voxelOpacityBuffer);
                                }
                            }
                            else {
                                gsVoxelMat.setMatrix("viewMatrix", viewMatrix);
                                gsVoxelMat.setFloat("nearPlane", nearPlane);
                                gsVoxelMat.setFloat("farPlane", farPlane);
                                gsVoxelMat.setFloat("stepSize", stepSize);
                            }
                        }
                    }
                }
            });
            // Set this material on every mesh in the scene (for this RT)
            if (includedMeshes.length === 0) {
                return;
            }
            for (const mesh of includedMeshes) {
                if (!mesh) {
                    continue;
                }
                if (IsGaussianSplattingClassName(mesh.getClassName())) {
                    this._addGsMeshToVoxelRT(mrt, mesh);
                }
                else if (mesh.subMeshes && mesh.subMeshes.length > 0) {
                    mrt.renderList?.push(mesh);
                    mrt.setMaterialForRendering(mesh, voxelMaterial);
                }
                const meshes = mesh.getChildMeshes();
                for (const childMesh of meshes) {
                    if (IsGaussianSplattingClassName(childMesh.getClassName())) {
                        this._addGsMeshToVoxelRT(mrt, childMesh);
                    }
                    else if (childMesh.subMeshes && childMesh.subMeshes.length > 0) {
                        mrt.renderList?.push(childMesh);
                        mrt.setMaterialForRendering(childMesh, voxelMaterial);
                    }
                }
            }
            this._installVoxelMixedCustomRender(mrt);
        }
        this._renderTargets = this._renderTargets.concat(mrts);
    }
    /**
     * Called by the pipeline to resize resources.
     */
    resize() { }
    /**
     * Disposes the voxel renderer and associated resources
     */
    dispose() {
        this._disposeVoxelTextures();
        for (const mat of Array.from(this._gsVoxelMaterialCache.values())) {
            mat.dispose();
        }
        this._gsVoxelMaterialCache.clear();
    }
}
// View matrices for the three voxelization axes.
_IblShadowsVoxelRenderer._VOXEL_VIEW_MATRICES = [
    Matrix.LookAtLH(Vector3.Zero(), new Vector3(1, 0, 0), Vector3.Up()),
    Matrix.LookAtLH(Vector3.Zero(), new Vector3(0, 1, 0), new Vector3(1, 0, 0)),
    Matrix.LookAtLH(Vector3.Zero(), new Vector3(0, 0, 1), Vector3.Up()),
];
//# sourceMappingURL=iblShadowsVoxelRenderer.pure.js.map
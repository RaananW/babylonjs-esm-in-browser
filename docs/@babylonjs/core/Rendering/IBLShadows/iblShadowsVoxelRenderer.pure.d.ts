/** This file must only contain pure code and pure imports */
import { RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.pure.js";
import { Matrix } from "../../Maths/math.vector.pure.js";
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
import { ProceduralTexture } from "../../Materials/Textures/Procedurals/proceduralTexture.pure.js";
import { type IblShadowsRenderPipeline } from "./iblShadowsRenderPipeline.pure.js";
/**
 * Voxel-based shadow rendering for IBL's.
 * This should not be instanciated directly, as it is part of a scene component
 * @internal
 * @see https://playground.babylonjs.com/#8R5SSE#222
 */
export declare class _IblShadowsVoxelRenderer {
    private static readonly _VOXEL_VIEW_MATRICES;
    private _scene;
    private _engine;
    private _voxelGrid;
    private _voxelGridRT;
    private _combinedVoxelGridPT;
    private _voxelGridXaxis;
    private _voxelGridYaxis;
    private _voxelGridZaxis;
    private _voxelMrtsXaxis;
    private _voxelMrtsYaxis;
    private _voxelMrtsZaxis;
    private _voxelMaterial;
    private _voxelOpacityBuffer?;
    private _copyBufferToGridCompute?;
    private _useOpacityBuffer;
    private _voxelClearColor;
    /**
     * Return the voxel grid texture.
     * @returns The voxel grid texture.
     */
    getVoxelGrid(): ProceduralTexture | RenderTargetTexture;
    /**
     * Return the voxel render target used during voxelization.
     * @returns The voxel render target.
     */
    getRT(): ProceduralTexture | RenderTargetTexture;
    /**
     * Observable that triggers when the voxelization is complete
     */
    onVoxelizationCompleteObservable: Observable<void>;
    private _maxDrawBuffers;
    private _renderTargets;
    /** Per-mesh voxel ShaderMaterials for GaussianSplattingMesh, keyed by mesh uniqueId. */
    private _gsVoxelMaterialCache;
    private _triPlanarVoxelization;
    /**
     * Whether to use tri-planar voxelization. More expensive, but can help with artifacts.
     */
    get triPlanarVoxelization(): boolean;
    /**
     * Whether to use tri-planar voxelization. More expensive, but can help with artifacts.
     */
    set triPlanarVoxelization(enabled: boolean);
    private _voxelizationInProgress;
    private _sortSettleWaitFrames;
    private _invWorldScaleMatrix;
    /**
     * Set the matrix to use for scaling the world space to voxel space
     * @param matrix The matrix to use for scaling the world space to voxel space
     */
    setWorldScaleMatrix(matrix: Matrix): void;
    /**
     * @returns Whether voxelization is currently happening.
     */
    isVoxelizationInProgress(): boolean;
    private _voxelResolution;
    private _voxelResolutionExp;
    /**
     * Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     */
    get voxelResolutionExp(): number;
    /**
     * Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     */
    set voxelResolutionExp(resolutionExp: number);
    private _copyMipEffectRenderer;
    private _copyMipEffectWrapper;
    private _copyMipSourceTexture?;
    private _copyMipLayer;
    private _mipArray;
    /**
     * Instanciates the voxel renderer
     * @param scene Scene to attach to
     * @param iblShadowsRenderPipeline The render pipeline this pass is associated with
     * @param resolutionExp Resolution of the voxel grid. The final resolution will be 2^resolutionExp.
     * @param triPlanarVoxelization Whether to use tri-planar voxelization. Only applies to WebGL. Voxelization will take longer but will reduce missing geometry.
     * @returns The voxel renderer
     */
    constructor(scene: Scene, iblShadowsRenderPipeline: IblShadowsRenderPipeline, resolutionExp?: number, triPlanarVoxelization?: boolean);
    private _generateMipMaps;
    private _generateMipMap;
    private _copyMipMaps;
    private _copyMipMap;
    private _computeNumberOfSlabs;
    private _createTextures;
    /**
     * WebGPU only. Allocates the opacity accumulator buffer and the compute shader that copies it into
     * the r8 grid. Storage textures can't blend or do float atomics, so splats accumulate via atomicMax
     * and this compute pass decodes the result into mip 0.
     */
    private _ensureVoxelOpacityAccumulator;
    /**
     * WebGPU only. Dispatches the compute pass that decodes the per-voxel opacity accumulator buffer
     * into the r8 voxel grid (mip 0). Runs after all voxelization passes and before mip generation.
     */
    private _copyVoxelOpacityBufferToGrid;
    private _createVoxelMRTs;
    private _disposeVoxelTextures;
    private _createVoxelMaterials;
    /**
     * Checks if the voxel renderer is ready to voxelize scene
     * @returns true if the voxel renderer is ready to voxelize scene
     */
    isReady(): boolean;
    /**
     * If the MRT's are already in the list of render targets, this will
     * remove them so that they don't get rendered again.
     */
    private _stopVoxelization;
    private _removeVoxelRTs;
    /**
     * Renders voxel grid of scene for IBL shadows
     * @param includedMeshes
     * @param registerAfterRenderObservable Whether to register scene onAfterRender callback (legacy path).
     */
    updateVoxelGrid(includedMeshes: Mesh[], registerAfterRenderObservable?: boolean): void;
    /**
     * Advances voxelization work when running in custom render loops (for example FrameGraph tasks)
     * where scene onAfterRender timing may differ from classic pipeline flow.
     */
    processVoxelization(): void;
    private _renderVoxelGridBound;
    private _renderVoxelGrid;
    /**
     * Splits rendering for every voxel RT: non–Gaussian splatting meshes use subMesh.render
     * (material override from setMaterialForRendering); GaussianSplattingMesh uses a custom draw path with its cached voxel ShaderMaterial.
     * @param rtt - the render target texture to install the custom render function on
     */
    private _installVoxelMixedCustomRender;
    private _addGsMeshToVoxelRT;
    private _addRTsForRender;
    /**
     * Called by the pipeline to resize resources.
     */
    resize(): void;
    /**
     * Disposes the voxel renderer and associated resources
     */
    dispose(): void;
}

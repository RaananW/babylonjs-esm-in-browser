import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { type EffectLayer } from "../Layers/effectLayer.js";
import { type Scene } from "../scene.pure.js";
import { type IParticleSystem } from "../Particles/IParticleSystem.js";
import { FrameGraphBaseLayerTask } from "../FrameGraph/Tasks/Layers/baseLayerTask.js";
/**
 * Options for the snapshot rendering helper
 */
export interface SnapshotRenderingHelpersOptions {
    /**
     * Maximum number of influences for morph target managers
     * In FAST snapshot mode, the number of influences must be fixed and cannot change from one frame to the next.
     * morphTargetsNumMaxInfluences is the maximum number of non-zero influences allowed in a morph target manager.
     * The final value defined for a morph target manager is: Math.min(morphTargetManager.numTargets, morphTargetsNumMaxInfluences)
     * Default: 20
     */
    morphTargetsNumMaxInfluences?: number;
}
/**
 * A helper class to simplify work with FAST snapshot mode (WebGPU only - can be used in WebGL too, but won't do anything).
 */
export declare class SnapshotRenderingHelper {
    private readonly _engine;
    private readonly _scene;
    private readonly _options;
    private readonly _onBeforeRenderObserver;
    private _onBeforeRenderObserverUpdateLayer;
    private readonly _onResizeObserver;
    private _disableRenderingRefCount;
    private _currentPerformancePriorityMode;
    private _pendingCurrentPerformancePriorityMode?;
    private _isEnabling;
    private _enableCancelFunctions;
    private _disableCancelFunctions;
    /**
     * Indicates if debug logs should be displayed
     */
    showDebugLogs: boolean;
    /**
     * Creates a new snapshot rendering helper
     * Note that creating an instance of the helper will set the snapshot rendering mode to SNAPSHOTRENDERING_FAST but will not enable snapshot rendering (engine.snapshotRendering is not updated).
     * Note also that fixMeshes() is called as part of the construction
     * @param scene The scene to use the helper in
     * @param options The options for the helper
     */
    constructor(scene: Scene, options?: SnapshotRenderingHelpersOptions);
    /**
     * Gets a value indicating if the helper is in a steady state (not in the process of enabling snapshot rendering).
     */
    get isReady(): boolean;
    /**
     * Enable snapshot rendering
     * Use this method instead of engine.snapshotRendering=true, to make sure everything is ready before enabling snapshot rendering.
     * Note that this method is ref-counted and works in pair with disableSnapshotRendering(): you should call enableSnapshotRendering() as many times as you call disableSnapshotRendering().
     * @param debugMessage An optional message to display in debug logs to help identify the context of the call to enableSnapshotRendering
     */
    enableSnapshotRendering(debugMessage?: string): void;
    /**
     * Disable snapshot rendering
     * Note that this method is ref-counted and works in pair with enableSnapshotRendering(): you should call enableSnapshotRendering() as many times as you call disableSnapshotRendering().
     * @param debugMessage An optional message to display in debug logs to help identify the context of the call to disableSnapshotRendering
     */
    disableSnapshotRendering(debugMessage?: string): void;
    /**
     * Fix meshes for snapshot rendering.
     * This method will make sure that some features are disabled or fixed to make sure snapshot rendering works correctly.
     * @param meshes List of meshes to fix. If not provided, all meshes in the scene will be fixed.
     */
    fixMeshes(meshes?: AbstractMesh[]): void;
    /**
     * Call this method to update a mesh on the GPU after some properties have changed (position, rotation, scaling).
     * Note: in FAST snapshot mode the GPU bundle is recorded once and replayed every frame, so draw calls
     * (including instance counts) are baked in. This method updates per-mesh GPU data such as transforms and
     * `mesh.visibility`, but it cannot change whether a recorded draw call is emitted. To apply changes such as
     * `mesh.isVisible`, `setEnabled(false)`, or per-instance visibility/state changes that affect instance counts,
     * wrap the change in a disableSnapshotRendering() / enableSnapshotRendering() pair so the snapshot is
     * re-recorded.
     * @param mesh The mesh to update. Can be a single mesh or an array of meshes to update.
     * @param updateInstancedMeshes If true, the method will also update instanced meshes. Default is true. If you know instanced meshes won't move (or you don't have instanced meshes), you can set this to false to save some CPU time.
     */
    updateMesh(mesh: AbstractMesh | AbstractMesh[], updateInstancedMeshes?: boolean): void;
    private _updateInstancedMesh;
    /**
     * Update the meshes used in an effect layer to ensure that snapshot rendering works correctly for these meshes in this layer.
     * @param layer The effect layer or frame graph layer
     * @param autoUpdate If true, the helper will automatically update the meshes of the layer with each frame. If false, you'll need to call this method manually when the camera or layer meshes move or rotate.
     */
    updateMeshesForEffectLayer(layer: EffectLayer | FrameGraphBaseLayerTask, autoUpdate?: boolean): void;
    /**
     * Dispose the helper
     */
    dispose(): void;
    private get _fastSnapshotRenderingEnabled();
    private _updateMeshMatricesForRenderPassId;
    private _spriteRendererDirectMatrixUpdate;
    private _spriteRendererUpdateEffects;
    /**
     * Make a CPU particle system compatible with FAST snapshot rendering.
     * The particle system will always render at full capacity (`getCapacity()` quads), with inactive slots collapsed
     * to degenerate triangles via zero-fill. This keeps the recorded GPU bundle's draw call valid every frame, while
     * the live particle data is uploaded to the bundle-referenced vertex buffer through the normal `animate()` path.
     *
     * The helper additionally advances the particle simulation and updates view/projection (and `eyePosition`/`invView`
     * for billboard modes) into the particle system's draw wrappers each frame, because FAST snapshot replay skips the
     * normal scene particle evaluation path after the bundle is recorded.
     *
     * Notes:
     * - Call this BEFORE `enableSnapshotRendering()` so the recording sees the correct draw count.
     * - GPU particle systems (`GPUParticleSystem`) are not supported by this method.
     * - Vertex shader cost scales with `getCapacity()` rather than the live particle count, so size capacity realistically.
     * - Per-frame uniforms other than camera matrices (e.g. `textureMask`, `translationPivot`, clip planes, fog) are
     *   baked at recording time and will not update during snapshot replay.
     * @param particleSystem The particle system to fix
     */
    fixParticleSystem(particleSystem: IParticleSystem): void;
    private _updateFixedCapacityParticleSystem;
    private _particleSystemUpdateEffects;
    private _particleSystemBillboardFlags;
    private _particleSystemDirectMatrixUpdate;
    private _executeAtFrame;
    private _log;
}

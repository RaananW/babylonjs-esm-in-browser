import { IsGaussianSplattingClassName } from "../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";

import { BindMorphTargetParameters } from "../Materials/materialHelper.functions.js";
import { TmpVectors } from "../Maths/math.vector.pure.js";
import { Logger } from "./logger.js";
import { FrameGraphBaseLayerTask } from "../FrameGraph/Tasks/Layers/baseLayerTask.js";
import { FrameGraphUtils } from "../FrameGraph/frameGraphUtils.js";
/**
 * A helper class to simplify work with FAST snapshot mode (WebGPU only - can be used in WebGL too, but won't do anything).
 */
export class SnapshotRenderingHelper {
    /**
     * Creates a new snapshot rendering helper
     * Note that creating an instance of the helper will set the snapshot rendering mode to SNAPSHOTRENDERING_FAST but will not enable snapshot rendering (engine.snapshotRendering is not updated).
     * Note also that fixMeshes() is called as part of the construction
     * @param scene The scene to use the helper in
     * @param options The options for the helper
     */
    constructor(scene, options) {
        this._disableRenderingRefCount = 0;
        this._currentPerformancePriorityMode = 0 /* ScenePerformancePriority.BackwardCompatible */;
        this._isEnabling = false;
        this._enableCancelFunctions = new Map(); // first function is the callback, second function is the cancel function
        this._disableCancelFunctions = new Map(); // same as above
        /**
         * Indicates if debug logs should be displayed
         */
        this.showDebugLogs = false;
        this._particleSystemBillboardFlags = new WeakMap();
        this._scene = scene;
        this._engine = scene.getEngine();
        if (!this._engine.isWebGPU) {
            return;
        }
        this._options = {
            morphTargetsNumMaxInfluences: 20,
            ...options,
        };
        this._engine.snapshotRenderingMode = 1;
        this.fixMeshes();
        this._onResizeObserver = this._engine.onResizeObservable.add(() => {
            this._log("onResize", "start");
            // enableSnapshotRendering() will delay the actual enabling of snapshot rendering by at least a frame, so these two lines are not redundant!
            if (this._fastSnapshotRenderingEnabled) {
                this.disableSnapshotRendering();
                this.enableSnapshotRendering();
            }
            else if (this._isEnabling) {
                // We are in the process of enabling snapshot rendering, but the engine got resized before we could actually enable it:
                // * cancel all "enable" pending callbacks
                // * increase the ref count to balance the decrease that enableSnapshotRendering() will do
                // * call enableSnapshotRendering() again to restart the enabling process
                this._enableCancelFunctions.forEach((cancel) => cancel());
                this._enableCancelFunctions.clear();
                this._disableRenderingRefCount++;
                this.enableSnapshotRendering();
            }
            this._log("onResize", "end");
        });
        this._onBeforeRenderObserver = this._scene.onBeforeRenderObservable.add(() => {
            if (!this._fastSnapshotRenderingEnabled) {
                return;
            }
            // Animates skeletons
            for (const skeleton of scene.skeletons) {
                skeleton.prepare(true);
            }
            // Handles meshes
            for (const mesh of scene.meshes) {
                if (mesh.infiniteDistance) {
                    mesh.transferToEffect(mesh.computeWorldMatrix(true));
                }
                if (mesh.skeleton) {
                    mesh.transferToEffect(mesh.computeWorldMatrix(true));
                }
                if (IsGaussianSplattingClassName(mesh.getClassName())) {
                    mesh._postToWorker();
                }
                if (mesh.morphTargetManager && mesh.subMeshes) {
                    // Make sure morph target animations work
                    for (const subMesh of mesh.subMeshes) {
                        const dw = subMesh._drawWrapper;
                        const effect = dw.effect;
                        if (effect) {
                            const dataBuffer = dw.drawContext.buffers["LeftOver"];
                            const ubLeftOver = effect._pipelineContext?.uniformBuffer;
                            if (dataBuffer && ubLeftOver && ubLeftOver.setDataBuffer(dataBuffer)) {
                                mesh.morphTargetManager._bind(effect);
                                BindMorphTargetParameters(mesh, effect);
                                ubLeftOver.update();
                            }
                        }
                    }
                }
            }
            // Handles sprite renderers
            let camera = scene.activeCamera;
            if (scene.frameGraph) {
                camera = FrameGraphUtils.FindMainCamera(scene.frameGraph) || camera;
            }
            if (scene.spriteManagers && camera) {
                for (const imanager of scene.spriteManagers) {
                    const manager = imanager;
                    const renderer = manager.spriteRenderer;
                    this._spriteRendererUpdateEffects(renderer._drawWrapperBase, renderer._drawWrapperDepth, camera);
                }
            }
            // Handles fixed-capacity particle systems
            if (scene.particleSystems && camera) {
                for (const ps of scene.particleSystems) {
                    const particleSystem = ps;
                    if (particleSystem._useFixedCapacityForSnapshot) {
                        this._updateFixedCapacityParticleSystem(particleSystem, camera);
                    }
                }
            }
        });
    }
    /**
     * Gets a value indicating if the helper is in a steady state (not in the process of enabling snapshot rendering).
     */
    get isReady() {
        return !this._isEnabling;
    }
    /**
     * Enable snapshot rendering
     * Use this method instead of engine.snapshotRendering=true, to make sure everything is ready before enabling snapshot rendering.
     * Note that this method is ref-counted and works in pair with disableSnapshotRendering(): you should call enableSnapshotRendering() as many times as you call disableSnapshotRendering().
     * @param debugMessage An optional message to display in debug logs to help identify the context of the call to enableSnapshotRendering
     */
    enableSnapshotRendering(debugMessage) {
        if (!this._engine.isWebGPU) {
            return;
        }
        this._log("enableSnapshotRendering", `called (refCount: ${this._disableRenderingRefCount - 1})${debugMessage ? ` - ${debugMessage}` : ""}`);
        if (--this._disableRenderingRefCount > 0) {
            return;
        }
        this._log("enableSnapshotRendering", `execute`);
        if (this._disableCancelFunctions.size > 0) {
            this._log("enableSnapshotRendering", `cancelling ${this._disableCancelFunctions.size} "disable" callbacks`);
        }
        this._disableCancelFunctions.forEach((cancel) => cancel());
        this._disableCancelFunctions.clear();
        this._isEnabling = true;
        this._disableRenderingRefCount = 0;
        this._currentPerformancePriorityMode = this._pendingCurrentPerformancePriorityMode ?? this._scene.performancePriority;
        this._pendingCurrentPerformancePriorityMode = undefined;
        this._scene.performancePriority = 0 /* ScenePerformancePriority.BackwardCompatible */;
        const callbackWhenSceneReady = () => {
            this._enableCancelFunctions.delete(callbackWhenSceneReady);
            // Make sure a full frame is rendered before enabling snapshot rendering, so use "+2" instead of "+1"
            const targetFrameId = this._engine.frameId + 2;
            this._log("enableSnapshotRendering", `scene ready, add callbacks for frames ${targetFrameId} and ${targetFrameId + 1}`);
            this._executeAtFrame(targetFrameId, () => {
                this._log("enableSnapshotRendering", `callback #1, enable snapshot rendering at the engine level`);
                this._engine.snapshotRendering = true;
            });
            // Render one frame with snapshot rendering enabled to make sure everything is ready
            this._executeAtFrame(targetFrameId + 1, () => {
                this._log("enableSnapshotRendering", `callback #2, signals that snapshot rendering helper is ready`);
                this._isEnabling = false;
            });
        };
        this._enableCancelFunctions.set(callbackWhenSceneReady, () => this._scene.onReadyObservable.removeCallback(callbackWhenSceneReady));
        this._scene.executeWhenReady(callbackWhenSceneReady);
    }
    /**
     * Disable snapshot rendering
     * Note that this method is ref-counted and works in pair with enableSnapshotRendering(): you should call enableSnapshotRendering() as many times as you call disableSnapshotRendering().
     * @param debugMessage An optional message to display in debug logs to help identify the context of the call to disableSnapshotRendering
     */
    disableSnapshotRendering(debugMessage) {
        if (!this._engine.isWebGPU) {
            return;
        }
        this._log("disableSnapshotRendering", `called (refCount: ${this._disableRenderingRefCount === 0 ? 0 : this._disableRenderingRefCount + 1})${debugMessage ? ` - ${debugMessage}` : ""}`);
        if (this._disableRenderingRefCount === 0) {
            this._log("disableSnapshotRendering", `execute (refCount set to 1 after execution)`);
            if (this._enableCancelFunctions.size > 0) {
                this._log("disableSnapshotRendering", `cancelling ${this._enableCancelFunctions.size} "enable" callbacks`);
            }
            this._enableCancelFunctions.forEach((cancel) => cancel());
            this._enableCancelFunctions.clear();
            this._isEnabling = false;
            // Snapshot rendering switches from enabled to disabled
            // We reset the performance priority mode to that which it was before enabling snapshot rendering, but first set it to “BackwardCompatible” to allow the system to regenerate resources that may have been optimized for snapshot rendering.
            // We'll then restore the original mode at the next frame.
            this._scene.performancePriority = 0 /* ScenePerformancePriority.BackwardCompatible */;
            if (this._currentPerformancePriorityMode !== 0 /* ScenePerformancePriority.BackwardCompatible */) {
                this._log("disableSnapshotRendering", `makes sure that the scene is rendered once in BackwardCompatible mode (code: ${0 /* ScenePerformancePriority.BackwardCompatible */}) before switching to mode ${this._currentPerformancePriorityMode}`);
                this._pendingCurrentPerformancePriorityMode = this._currentPerformancePriorityMode;
                const callbackWhenSceneReady = () => {
                    this._log("disableSnapshotRendering", `scene ready, add callback for frame ${this._engine.frameId + 2}`);
                    this._executeAtFrame(this._engine.frameId + 2, () => {
                        this._log("disableSnapshotRendering", `switching to performance priority mode ${this._pendingCurrentPerformancePriorityMode}`);
                        this._scene.performancePriority = this._pendingCurrentPerformancePriorityMode;
                        this._pendingCurrentPerformancePriorityMode = undefined;
                    }, "whenDisabled");
                };
                this._disableCancelFunctions.set(callbackWhenSceneReady, () => this._scene.onReadyObservable.removeCallback(callbackWhenSceneReady));
                this._scene.executeWhenReady(callbackWhenSceneReady);
            }
        }
        this._engine.snapshotRendering = false;
        this._disableRenderingRefCount++;
    }
    /**
     * Fix meshes for snapshot rendering.
     * This method will make sure that some features are disabled or fixed to make sure snapshot rendering works correctly.
     * @param meshes List of meshes to fix. If not provided, all meshes in the scene will be fixed.
     */
    fixMeshes(meshes) {
        if (!this._engine.isWebGPU) {
            return;
        }
        meshes = meshes || this._scene.meshes;
        for (const mesh of meshes) {
            mesh.ignoreCameraMaxZ = false;
            if (mesh.morphTargetManager) {
                mesh.morphTargetManager.numMaxInfluencers = Math.min(mesh.morphTargetManager.numTargets, this._options.morphTargetsNumMaxInfluences);
            }
        }
    }
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
    updateMesh(mesh, updateInstancedMeshes = true) {
        if (!this._fastSnapshotRenderingEnabled) {
            return;
        }
        if (Array.isArray(mesh)) {
            for (const m of mesh) {
                if (!updateInstancedMeshes || !this._updateInstancedMesh(m)) {
                    m.transferToEffect(m.computeWorldMatrix());
                }
            }
            return;
        }
        if (!updateInstancedMeshes || !this._updateInstancedMesh(mesh)) {
            mesh.transferToEffect(mesh.computeWorldMatrix());
        }
    }
    _updateInstancedMesh(mesh) {
        if (mesh.hasInstances) {
            if (mesh.subMeshes) {
                const sourceMesh = mesh;
                for (const subMesh of sourceMesh.subMeshes) {
                    const batch = sourceMesh._getInstancesRenderList(subMesh._id);
                    sourceMesh._updateInstancedBuffers(subMesh, batch, batch.parent.instancesBufferSize, this._engine);
                }
            }
            return true;
        }
        else if (mesh.isAnInstance) {
            return true;
        }
        return false;
    }
    /**
     * Update the meshes used in an effect layer to ensure that snapshot rendering works correctly for these meshes in this layer.
     * @param layer The effect layer or frame graph layer
     * @param autoUpdate If true, the helper will automatically update the meshes of the layer with each frame. If false, you'll need to call this method manually when the camera or layer meshes move or rotate.
     */
    updateMeshesForEffectLayer(layer, autoUpdate = true) {
        if (!this._engine.isWebGPU) {
            return;
        }
        const renderPassId = layer instanceof FrameGraphBaseLayerTask ? layer.objectRendererForLayer.objectRenderer.renderPassId : layer.mainTexture.renderPassId;
        if (autoUpdate) {
            this._onBeforeRenderObserverUpdateLayer = this._scene.onBeforeRenderObservable.add(() => {
                this._updateMeshMatricesForRenderPassId(renderPassId);
            });
        }
        else {
            this._updateMeshMatricesForRenderPassId(renderPassId);
        }
    }
    /**
     * Dispose the helper
     */
    dispose() {
        if (!this._engine.isWebGPU) {
            return;
        }
        this._scene.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
        this._scene.onBeforeRenderObservable.remove(this._onBeforeRenderObserverUpdateLayer);
        this._engine.onResizeObservable.remove(this._onResizeObserver);
    }
    get _fastSnapshotRenderingEnabled() {
        return this._engine.snapshotRendering && this._engine.snapshotRenderingMode === 1;
    }
    _updateMeshMatricesForRenderPassId(renderPassId) {
        if (!this._fastSnapshotRenderingEnabled) {
            return;
        }
        const sceneTransformationMatrix = this._scene.objectRenderers.find((renderer) => renderer.renderPassId === renderPassId)?.activeCamera?.getTransformationMatrix() ?? this._scene.getTransformMatrix();
        for (let i = 0; i < this._scene.meshes.length; ++i) {
            const mesh = this._scene.meshes[i];
            if (!mesh.subMeshes) {
                continue;
            }
            for (let j = 0; j < mesh.subMeshes.length; ++j) {
                const dw = mesh.subMeshes[j]._getDrawWrapper(renderPassId);
                const effect = dw?.effect;
                if (effect) {
                    const dataBuffer = dw.drawContext.buffers["LeftOver"];
                    const ubLeftOver = effect._pipelineContext?.uniformBuffer;
                    if (dataBuffer && ubLeftOver && ubLeftOver.setDataBuffer(dataBuffer)) {
                        effect.setMatrix("viewProjection", sceneTransformationMatrix);
                        effect.setMatrix("world", mesh.computeWorldMatrix());
                        ubLeftOver.update();
                    }
                }
            }
        }
    }
    _spriteRendererDirectMatrixUpdate(dw, camera) {
        const effect = dw?.effect;
        if (effect) {
            const dataBuffer = dw.drawContext.buffers["LeftOver"];
            const ubLeftOver = effect._pipelineContext?.uniformBuffer;
            if (dataBuffer && ubLeftOver && ubLeftOver.setDataBuffer(dataBuffer)) {
                effect.setMatrix("view", camera.getViewMatrix());
                effect.setMatrix("projection", camera.getProjectionMatrix());
                ubLeftOver.update();
            }
        }
    }
    _spriteRendererUpdateEffects(drawWrapperBase, drawWrapperDepth, camera) {
        this._spriteRendererDirectMatrixUpdate(drawWrapperBase, camera);
        this._spriteRendererDirectMatrixUpdate(drawWrapperDepth, camera);
    }
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
    fixParticleSystem(particleSystem) {
        if (!this._engine.isWebGPU) {
            return;
        }
        if (particleSystem.getClassName() !== "ParticleSystem") {
            this._log("fixParticleSystem", `skipping ${particleSystem.name}: only CPU ParticleSystem is supported (got ${particleSystem.getClassName()})`);
            return;
        }
        const ps = particleSystem;
        const fixedCapacityInitialized = ps._initFixedCapacitySnapshotData();
        // The recorded bundle bakes in the draw-call vertex/instance count. If snapshot rendering is already active
        // (or in the process of being enabled) when we flip the flag, the bundle was recorded with the live particle
        // count and is now stale. Cycle disable/enable so the next recording picks up the fixed-capacity draw count.
        if (fixedCapacityInitialized && (this._fastSnapshotRenderingEnabled || this._isEnabling)) {
            Logger.Warn(`SnapshotRenderingHelper.fixParticleSystem("${particleSystem.name}") was called after snapshot rendering was enabled. ` +
                `Forcing a re-record so the bundle uses the fixed-capacity draw count. Call fixParticleSystem before enableSnapshotRendering to avoid this.`);
            this.disableSnapshotRendering("fixParticleSystem auto-recover");
            this.enableSnapshotRendering("fixParticleSystem auto-recover");
        }
    }
    _updateFixedCapacityParticleSystem(ps, camera) {
        if (!this._scene.particlesEnabled || !ps.isStarted() || !ps.emitter) {
            ps._clearFixedCapacitySnapshotData();
            return;
        }
        const emitter = ps.emitter;
        if (!emitter.position || emitter.isEnabled?.()) {
            ps.animate();
            this._particleSystemUpdateEffects(ps, camera);
        }
        else {
            ps._clearFixedCapacitySnapshotData();
        }
    }
    _particleSystemUpdateEffects(ps, camera) {
        const drawWrappers = ps._drawWrappers;
        if (!drawWrappers) {
            return;
        }
        const viewMatrix = ps.defaultViewMatrix ?? camera.getViewMatrix();
        const projectionMatrix = ps.defaultProjectionMatrix ?? camera.getProjectionMatrix();
        // Compute invView lazily once per system per frame, only if any draw wrapper actually needs it.
        let invViewMatrix = null;
        for (const perPass of drawWrappers) {
            if (!perPass) {
                continue;
            }
            for (const dw of perPass) {
                invViewMatrix = this._particleSystemDirectMatrixUpdate(dw, viewMatrix, projectionMatrix, camera, invViewMatrix);
            }
        }
    }
    _particleSystemDirectMatrixUpdate(dw, viewMatrix, projectionMatrix, camera, invViewMatrix) {
        const effect = dw?.effect;
        if (!effect) {
            return invViewMatrix;
        }
        const dataBuffer = dw.drawContext.buffers["LeftOver"];
        const ubLeftOver = effect._pipelineContext?.uniformBuffer;
        if (!dataBuffer || !ubLeftOver || !ubLeftOver.setDataBuffer(dataBuffer)) {
            return invViewMatrix;
        }
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("projection", projectionMatrix);
        let flags = this._particleSystemBillboardFlags.get(effect);
        if (!flags) {
            const defines = effect.defines ?? "";
            flags = { billboard: defines.indexOf("#define BILLBOARD") >= 0, billboardAll: defines.indexOf("#define BILLBOARDMODE_ALL") >= 0 };
            this._particleSystemBillboardFlags.set(effect, flags);
        }
        if (flags.billboard) {
            effect.setVector3("eyePosition", camera.globalPosition);
        }
        if (flags.billboardAll) {
            if (!invViewMatrix) {
                invViewMatrix = TmpVectors.Matrix[0];
                viewMatrix.invertToRef(invViewMatrix);
            }
            effect.setMatrix("invView", invViewMatrix);
        }
        ubLeftOver.update();
        return invViewMatrix;
    }
    _executeAtFrame(frameId, func, mode = "whenEnabled") {
        const callback = () => {
            if (this._engine.frameId >= frameId) {
                this._engine.onEndFrameObservable.remove(obs);
                if (mode === "whenEnabled") {
                    this._enableCancelFunctions.delete(callback);
                }
                else {
                    this._disableCancelFunctions.delete(callback);
                }
                func();
            }
        };
        const obs = this._engine.onEndFrameObservable.add(callback);
        if (mode === "whenEnabled") {
            this._enableCancelFunctions.set(callback, () => this._engine.onEndFrameObservable.remove(obs));
        }
        else {
            this._disableCancelFunctions.set(callback, () => this._engine.onEndFrameObservable.remove(obs));
        }
    }
    _log(funcName, message) {
        if (this.showDebugLogs) {
            Logger.Log(`[Frame: ${this._engine.frameId}] SnapshotRenderingHelper:${funcName} - ${message}`);
        }
    }
}
//# sourceMappingURL=snapshotRenderingHelper.js.map
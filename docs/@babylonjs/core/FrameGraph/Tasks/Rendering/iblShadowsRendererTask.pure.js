/** This file must only contain pure code and pure imports */

import { PBRBaseMaterial } from "../../../Materials/PBR/pbrBaseMaterial.pure.js";
import { OpenPBRMaterial } from "../../../Materials/PBR/openpbrMaterial.pure.js";
import { StandardMaterial } from "../../../Materials/standardMaterial.pure.js";
import { IBLShadowsPluginMaterial } from "../../../Rendering/IBLShadows/iblShadowsPluginMaterial.pure.js";
import { FrameGraphIblShadowsAccumulationTask } from "./iblShadows/iblShadowsAccumulationTask.js";
import { FrameGraphIblShadowsSpatialBlurTask } from "./iblShadows/iblShadowsSpatialBlurTask.js";
import { FrameGraphIblShadowsTracingTask } from "./iblShadows/iblShadowsTracingTask.js";
import { FrameGraphIblShadowsVoxelizationTask } from "./iblShadows/iblShadowsVoxelizationTask.js";
import { Texture } from "../../../Materials/Textures/texture.pure.js";
import { CubeTexture } from "../../../Materials/Textures/cubeTexture.pure.js";
import { Tools } from "../../../Misc/tools.pure.js";
import { Observable } from "../../../Misc/observable.pure.js";
import { IblCdfGenerator } from "../../../Rendering/iblCdfGenerator.js";
import { RegisterIblCdfGeneratorSceneComponent } from "../../../Rendering/iblCdfGeneratorSceneComponent.pure.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Composite task that owns the individual IBL shadows frame graph tasks.
 * The frame graph remains flat internally, but this task groups the pipeline
 * and owns the child task implementation details.
 */
export class FrameGraphIblShadowsRendererTask extends FrameGraphTask {
    /**
     * Gets the class name.
     * @returns The class name.
     */
    getClassName() {
        return "FrameGraphIblShadowsRendererTask";
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        if (this._voxelizationTask) {
            this._voxelizationTask.name = `${value} Voxelization`;
        }
        if (this._tracingTask) {
            this._tracingTask.name = `${value} Tracing`;
        }
        if (this._spatialBlurTask) {
            this._spatialBlurTask.name = `${value} Blur`;
        }
        if (this._accumulationTask) {
            this._accumulationTask.name = `${value} Accumulation`;
        }
    }
    /**
     * Whether the task is disabled.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        if (!this._disabled && this._dependenciesResolved) {
            this._accumulationTask.reset = true;
        }
        this._applyMaterialPluginParameters();
    }
    // ------ Common properties ------
    /** Camera used by the tracing stage. */
    get camera() {
        return this._tracingTask.camera;
    }
    /** Camera used by the tracing stage. */
    set camera(value) {
        this._setCamera(value);
    }
    /** Object list used by voxelization. */
    get objectList() {
        return this._voxelizationTask.objectList;
    }
    /** Object list used by voxelization. */
    set objectList(value) {
        if (this._voxelizationTask.objectList === value) {
            return;
        }
        this._voxelizationTask.objectList = value;
        this._voxelizationTask.updateSceneBounds();
        this._voxelizationTask.requestVoxelizationUpdate();
        this._accumulationTask.reset = true;
    }
    // ------ Tracing properties ------
    /** Number of tracing sample directions. */
    get sampleDirections() {
        return this._tracingTask.sampleDirections;
    }
    /** Number of tracing sample directions. */
    set sampleDirections(value) {
        this._tracingTask.sampleDirections = value;
        this.resetAccumulation();
    }
    /** Whether traced shadows preserve environment color. */
    get coloredShadows() {
        return this._tracingTask.coloredShadows;
    }
    /** Whether traced shadows preserve environment color. */
    set coloredShadows(value) {
        if (this._tracingTask.coloredShadows === value) {
            return;
        }
        this._tracingTask.coloredShadows = value;
        this._applyMaterialPluginParameters();
        this.resetAccumulation();
    }
    /** Opacity of voxel-traced shadows. */
    get voxelShadowOpacity() {
        return this._tracingTask.voxelShadowOpacity;
    }
    /** Opacity of voxel-traced shadows. */
    set voxelShadowOpacity(value) {
        this._tracingTask.voxelShadowOpacity = value;
        this.resetAccumulation();
    }
    /** Opacity of screen-space shadows. */
    get ssShadowOpacity() {
        return this._tracingTask.ssShadowOpacity;
    }
    /** Opacity of screen-space shadows. */
    set ssShadowOpacity(value) {
        this._tracingTask.ssShadowOpacity = value;
        this.resetAccumulation();
    }
    /** Number of screen-space shadow samples. */
    get ssShadowSampleCount() {
        return this._tracingTask.ssShadowSampleCount;
    }
    /** Number of screen-space shadow samples. */
    set ssShadowSampleCount(value) {
        this._tracingTask.ssShadowSampleCount = value;
        this.resetAccumulation();
    }
    /** Stride used by screen-space shadow sampling. */
    get ssShadowStride() {
        return this._tracingTask.ssShadowStride;
    }
    /** Stride used by screen-space shadow sampling. */
    set ssShadowStride(value) {
        this._tracingTask.ssShadowStride = value;
        this.resetAccumulation();
    }
    /** Distance scale used by screen-space shadow tracing. */
    get ssShadowDistanceScale() {
        return this._tracingTask.ssShadowDistanceScale;
    }
    /** Distance scale used by screen-space shadow tracing. */
    set ssShadowDistanceScale(value) {
        this._tracingTask.ssShadowDistanceScale = value;
        this.resetAccumulation();
    }
    /** Thickness scale used by screen-space shadow tracing. */
    get ssShadowThicknessScale() {
        return this._tracingTask.ssShadowThicknessScale;
    }
    /** Thickness scale used by screen-space shadow tracing. */
    set ssShadowThicknessScale(value) {
        this._tracingTask.ssShadowThicknessScale = value;
        this.resetAccumulation();
    }
    /** Voxel tracing normal bias. */
    get voxelNormalBias() {
        return this._tracingTask.voxelNormalBias;
    }
    /** Voxel tracing normal bias. */
    set voxelNormalBias(value) {
        this._tracingTask.voxelNormalBias = value;
        this.resetAccumulation();
    }
    /** Voxel tracing direction bias. */
    get voxelDirectionBias() {
        return this._tracingTask.voxelDirectionBias;
    }
    /** Voxel tracing direction bias. */
    set voxelDirectionBias(value) {
        this._tracingTask.voxelDirectionBias = value;
        this.resetAccumulation();
    }
    /** Environment rotation in radians. */
    get envRotation() {
        return this._tracingTask.envRotation;
    }
    /** Environment rotation in radians. */
    set envRotation(value) {
        this._tracingTask.envRotation = value;
        this.resetAccumulation();
    }
    // ------ Accumulation properties ------
    /** Temporal shadow remanence while moving. */
    get shadowRemanence() {
        return this._accumulationTask.remanence;
    }
    /** Temporal shadow remanence while moving. */
    set shadowRemanence(value) {
        this._accumulationTask.remanence = value;
    }
    /** Final material shadow opacity. */
    get shadowOpacity() {
        return this._shadowOpacity;
    }
    /** Final material shadow opacity. */
    set shadowOpacity(value) {
        this._shadowOpacity = Math.max(0, Math.min(value, 1));
        this._applyMaterialPluginParameters();
    }
    // ------ Voxelization properties ------
    /** Voxelization resolution exponent. */
    get resolutionExp() {
        return this._voxelizationTask.resolutionExp;
    }
    /** Voxelization resolution exponent. */
    set resolutionExp(value) {
        this._voxelizationTask.resolutionExp = value;
        this.resetAccumulation();
    }
    /** Voxelization refresh rate. */
    get refreshRate() {
        return this._voxelizationTask.refreshRate;
    }
    /** Voxelization refresh rate. */
    set refreshRate(value) {
        this._voxelizationTask.refreshRate = value;
    }
    /** Whether tri-planar voxelization is used. */
    get triPlanarVoxelization() {
        return this._voxelizationTask.triPlanarVoxelization;
    }
    /** Whether tri-planar voxelization is used. */
    set triPlanarVoxelization(value) {
        this._voxelizationTask.triPlanarVoxelization = value;
    }
    /** Current world-space voxel grid size. */
    get voxelGridSize() {
        return this._voxelizationTask.voxelGridSize;
    }
    /** True when the accumulated output texture is ready. */
    get outputTextureReady() {
        return !!this._getAccumulationOutputTexture()?.isReady;
    }
    /** Notifies when the accumulated output texture becomes ready. */
    get onOutputTextureReadyObservable() {
        return this._outputTextureReadyObservable;
    }
    // ------ Public methods ------
    /** Triggers a voxelization refresh on the next eligible frame. */
    updateVoxelization() {
        this._voxelizationTask.requestVoxelizationUpdate();
    }
    /** Recomputes the voxelization scene bounds from the current object list. */
    updateSceneBounds() {
        this._voxelizationTask.updateSceneBounds();
    }
    /** Resets temporal accumulation. */
    resetAccumulation() {
        this._accumulationTask.reset = true;
    }
    /**
     * Adds one or more materials that should receive IBL shadows.
     * @param material The material or materials to register. If omitted, all scene materials are added.
     */
    addShadowReceivingMaterial(material) {
        if (!material) {
            for (const sceneMaterial of this._frameGraph.scene.materials) {
                this._addShadowReceivingMaterialInternal(sceneMaterial);
            }
        }
        else if (Array.isArray(material)) {
            for (const sceneMaterial of material) {
                this._addShadowReceivingMaterialInternal(sceneMaterial);
            }
        }
        else {
            this._addShadowReceivingMaterialInternal(material);
        }
        this._applyMaterialPluginParameters();
    }
    /**
     * Removes one or more materials from IBL shadow reception.
     * @param material The material or materials to unregister.
     */
    removeShadowReceivingMaterial(material) {
        const materials = Array.isArray(material) ? material : [material];
        for (const mat of materials) {
            const index = this._materialsWithRenderPlugin.indexOf(mat);
            if (index !== -1) {
                this._materialsWithRenderPlugin.splice(index, 1);
            }
            const plugin = mat.pluginManager?.getPlugin(IBLShadowsPluginMaterial.Name);
            if (plugin) {
                plugin.isEnabled = false;
            }
        }
    }
    /** Clears all registered shadow-receiving materials. */
    clearShadowReceivingMaterials() {
        for (const mat of this._materialsWithRenderPlugin) {
            const plugin = mat.pluginManager?.getPlugin(IBLShadowsPluginMaterial.Name);
            if (plugin) {
                plugin.isEnabled = false;
            }
        }
        this._materialsWithRenderPlugin.length = 0;
    }
    /**
     * Adds one or more meshes to the voxelization object list.
     * @param mesh The mesh or meshes to add.
     */
    addShadowCastingMesh(mesh) {
        const meshes = Array.isArray(mesh) ? mesh : [mesh];
        const objectMeshes = this._voxelizationTask.objectList.meshes;
        for (const currentMesh of meshes) {
            if (currentMesh && objectMeshes.indexOf(currentMesh) === -1) {
                objectMeshes.push(currentMesh);
            }
        }
    }
    /**
     * Removes one or more meshes from the voxelization object list.
     * @param mesh The mesh or meshes to remove.
     */
    removeShadowCastingMesh(mesh) {
        const meshes = Array.isArray(mesh) ? mesh : [mesh];
        const objectMeshes = this._voxelizationTask.objectList.meshes;
        for (const currentMesh of meshes) {
            const index = objectMeshes.indexOf(currentMesh);
            if (index !== -1) {
                objectMeshes.splice(index, 1);
            }
        }
    }
    /** Clears all shadow-casting meshes from the voxelization object list. */
    clearShadowCastingMeshes() {
        const objectMeshes = this._voxelizationTask.objectList.meshes;
        objectMeshes.length = 0;
    }
    // ------ Framework overrides ------
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    initAsync() {
        this._frameGraph.scene.enableIblCdfGenerator();
        // Don't poll for shadow dependencies here.  _tryEnableShadowsTasks() is called
        // in record() (where it imports a placeholder ICDF if the real one isn't ready yet,
        // preventing any "handle not found" errors) and by _beforeRenderDependencyObserver
        // on every frame.  Shadows enable automatically once the CDF, environment texture,
        // and blue-noise texture are all ready — no timeout involved.git pu
        return Promise.resolve();
    }
    isReady() {
        return this._voxelizationTask.isReady() && this._tracingTask.isReady() && this._spatialBlurTask.isReady() && this._accumulationTask.isReady();
    }
    /**
     * Records the parent task.
     * Child tasks record the actual passes.
     */
    record() {
        if (this.depthTexture === undefined || this.normalTexture === undefined || this.positionTexture === undefined || this.velocityTexture === undefined) {
            throw new Error(`FrameGraphIblShadowsRendererTask "${this.name}": depthTexture, normalTexture, positionTexture and velocityTexture are required`);
        }
        this._lastImportedIcdfTexture = null;
        this._lastImportedEnvironmentTexture = null;
        this._lastImportedBlueNoiseTexture = null;
        this._tryEnableShadowsTasks();
        // Set sub-task texture inputs (these are set here because handles may not be available at construction time)
        this._tracingTask.depthTexture = this.depthTexture;
        this._tracingTask.normalTexture = this.normalTexture;
        this._spatialBlurTask.depthTexture = this.depthTexture;
        this._spatialBlurTask.normalTexture = this.normalTexture;
        this._accumulationTask.positionTexture = this.positionTexture;
        this._accumulationTask.velocityTexture = this.velocityTexture;
        this._voxelizationTask.record();
        this._tracingTask.record();
        this._spatialBlurTask.record();
        this._accumulationTask.record();
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => { });
    }
    /**
     * Disposes the task and owned resources.
     */
    dispose() {
        this._disposeObservers();
        this._voxelizationTask.dispose();
        this._tracingTask.dispose();
        this._spatialBlurTask.dispose();
        this._accumulationTask.dispose();
        super.dispose();
    }
    /**
     * Creates a new IBL shadows composite task.
     * @param name The task name.
     * @param frameGraph The owning frame graph.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        this._dependenciesResolved = false;
        this._shadowOpacity = 1.0;
        this._materialsWithRenderPlugin = [];
        this._outputTextureReadyObservable = new Observable();
        this._lastNotifiedOutputTexture = null;
        this._observedEnvironmentTexture = null;
        this._observedEnvironmentTextureUnsubscribe = null;
        this._lastImportedIcdfTexture = null;
        this._lastImportedEnvironmentTexture = null;
        this._lastImportedBlueNoiseTexture = null;
        this._cameraViewChangedObserver = null;
        this._cdfTextureChangedObserver = null;
        this._cdfGeneratedObserver = null;
        this._environmentTextureChangedObserver = null;
        this._beforeRenderDependencyObserver = null;
        this._beforeRenderOutputReadyObserver = null;
        this._blueNoiseLoadObserver = null;
        this._texturesAllocatedObserver = null;
        this._voxelizationCompleteObserver = null;
        this._onEnvironmentTextureLoaded = () => {
            this._tryEnableShadowsTasks();
        };
        RegisterIblCdfGeneratorSceneComponent(IblCdfGenerator);
        this._voxelizationTask = new FrameGraphIblShadowsVoxelizationTask(`${name} Voxelization`, frameGraph);
        this._tracingTask = new FrameGraphIblShadowsTracingTask(`${name} Tracing`, frameGraph);
        this._tracingTask.voxelGridTexture = this._voxelizationTask.outputVoxelGridTexture;
        this._tracingTask.worldScaleMatrix = this._voxelizationTask.worldScaleMatrix;
        this._tracingTask.voxelizationTask = this._voxelizationTask;
        this._spatialBlurTask = new FrameGraphIblShadowsSpatialBlurTask(`${name} Blur`, frameGraph);
        this._spatialBlurTask.sourceTexture = this._tracingTask.outputTexture;
        this._spatialBlurTask.voxelizationTask = this._voxelizationTask;
        this._accumulationTask = new FrameGraphIblShadowsAccumulationTask(`${name} Accumulation`, frameGraph);
        this._accumulationTask.sourceTexture = this._spatialBlurTask.outputTexture;
        this._accumulationTask.voxelizationTask = this._voxelizationTask;
        this.outputTexture = this._accumulationTask.outputTexture;
        this._blueNoiseTexture = new Texture(Tools.GetAssetUrl("https://assets.babylonjs.com/core/blue_noise/blue_noise_rgb.png"), frameGraph.scene, false, true, 1);
        this._initialize();
    }
    _disposeDependencyObservers() {
        this._observedEnvironmentTextureUnsubscribe?.();
        this._observedEnvironmentTextureUnsubscribe = null;
        this._observedEnvironmentTexture = null;
    }
    _disposeObservers() {
        this._disposeDependencyObservers();
        this._tracingTask.camera?.onViewMatrixChangedObservable.remove(this._cameraViewChangedObserver);
        this._frameGraph.scene.iblCdfGenerator?.onTextureChangedObservable.remove(this._cdfTextureChangedObserver);
        this._frameGraph.scene.iblCdfGenerator?.onGeneratedObservable.remove(this._cdfGeneratedObserver);
        this._frameGraph.scene.onEnvironmentTextureChangedObservable.remove(this._environmentTextureChangedObserver);
        this._frameGraph.scene.onBeforeRenderObservable.remove(this._beforeRenderDependencyObserver);
        this._frameGraph.scene.onBeforeRenderObservable.remove(this._beforeRenderOutputReadyObserver);
        this._blueNoiseTexture.onLoadObservable.remove(this._blueNoiseLoadObserver);
        this.onTexturesAllocatedObservable.remove(this._texturesAllocatedObserver);
        this._voxelizationTask.onVoxelizationCompleteObservable.remove(this._voxelizationCompleteObserver);
        this._cameraViewChangedObserver = null;
        this._cdfTextureChangedObserver = null;
        this._cdfGeneratedObserver = null;
        this._environmentTextureChangedObserver = null;
        this._beforeRenderDependencyObserver = null;
        this._beforeRenderOutputReadyObserver = null;
        this._blueNoiseLoadObserver = null;
        this._texturesAllocatedObserver = null;
        this._voxelizationCompleteObserver = null;
        this._blueNoiseTexture.dispose();
    }
    _setCamera(camera) {
        const currentCamera = this._tracingTask.camera;
        if (currentCamera === camera && this._cameraViewChangedObserver !== null) {
            return;
        }
        if (currentCamera && this._cameraViewChangedObserver) {
            currentCamera.onViewMatrixChangedObservable.remove(this._cameraViewChangedObserver);
            this._cameraViewChangedObserver = null;
        }
        this._tracingTask.camera = camera;
        this._cameraViewChangedObserver = camera.onViewMatrixChangedObservable.add(() => {
            this._accumulationTask.isMoving = true;
        });
        this._accumulationTask.reset = true;
    }
    _observeEnvironmentTexture() {
        const env = this._frameGraph.scene.environmentTexture;
        const currentEnvironmentTexture = env instanceof Texture || env instanceof CubeTexture ? env : null;
        if (currentEnvironmentTexture === this._observedEnvironmentTexture) {
            return;
        }
        this._observedEnvironmentTextureUnsubscribe?.();
        this._observedEnvironmentTextureUnsubscribe = null;
        this._observedEnvironmentTexture = currentEnvironmentTexture;
        if (currentEnvironmentTexture instanceof Texture) {
            const observer = currentEnvironmentTexture.onLoadObservable.add(this._onEnvironmentTextureLoaded);
            if (observer) {
                this._observedEnvironmentTextureUnsubscribe = () => currentEnvironmentTexture.onLoadObservable.remove(observer);
            }
        }
        else if (currentEnvironmentTexture instanceof CubeTexture) {
            const observer = currentEnvironmentTexture.onLoadObservable.add(this._onEnvironmentTextureLoaded);
            if (observer) {
                this._observedEnvironmentTextureUnsubscribe = () => currentEnvironmentTexture.onLoadObservable.remove(observer);
            }
        }
    }
    _getEnvironmentTextureInternal() {
        const currentEnvironmentTexture = this._frameGraph.scene.environmentTexture;
        if (!currentEnvironmentTexture || !currentEnvironmentTexture.isReadyOrNotBlocking()) {
            return null;
        }
        const internalTexture = currentEnvironmentTexture.getInternalTexture();
        return internalTexture?.isReady ? internalTexture : null;
    }
    _getAccumulationOutputTexture() {
        try {
            return this._frameGraph.textureManager.getTextureFromHandle(this._accumulationTask.outputTexture);
        }
        catch {
            return null;
        }
    }
    _notifyIfOutputTextureReady() {
        const outputTexture = this._getAccumulationOutputTexture();
        if (!outputTexture?.isReady || this._lastNotifiedOutputTexture === outputTexture) {
            return;
        }
        this._lastNotifiedOutputTexture = outputTexture;
        this._outputTextureReadyObservable.notifyObservers(outputTexture);
    }
    _applyMaterialPluginParameters() {
        const accumulationTexture = this._getAccumulationOutputTexture();
        for (const material of this._materialsWithRenderPlugin) {
            const plugin = material.pluginManager?.getPlugin(IBLShadowsPluginMaterial.Name);
            if (!plugin) {
                continue;
            }
            if (accumulationTexture && accumulationTexture.isReady) {
                plugin.iblShadowsTexture = accumulationTexture;
            }
            plugin.shadowOpacity = this._shadowOpacity;
            plugin.isColored = this._tracingTask.coloredShadows;
            plugin.isEnabled = !this._disabled && this._dependenciesResolved && !!accumulationTexture;
        }
    }
    _addShadowReceivingMaterialInternal(material) {
        const isSupportedMaterial = material instanceof PBRBaseMaterial || material instanceof StandardMaterial || material instanceof OpenPBRMaterial;
        if (!isSupportedMaterial || this._materialsWithRenderPlugin.indexOf(material) !== -1) {
            return;
        }
        const plugin = material.pluginManager?.getPlugin(IBLShadowsPluginMaterial.Name);
        if (!plugin) {
            new IBLShadowsPluginMaterial(material);
        }
        this._materialsWithRenderPlugin.push(material);
    }
    _tryEnableShadowsTasks() {
        const scene = this._frameGraph.scene;
        const icdfTexture = scene.iblCdfGenerator?.getIcdfTexture().getInternalTexture();
        const environmentTexture = this._getEnvironmentTextureInternal();
        const blueNoiseInternalTexture = this._blueNoiseTexture.getInternalTexture();
        // Always import whatever textures are currently available so that their handles
        // remain valid in the texture manager across rebuilds.  After a frameGraph.clear()
        // all texture entries are wiped — without this, stale handles left in the tracing
        // task would cause _computeTextureLifespan to throw "texture handle not found"
        // even when CDF generation is still in progress.  Importing the 1×1 placeholder
        // ICDF (returned by getIcdfTexture() when real generation hasn't completed) is
        // harmless: _dependenciesResolved stays false, the tracing execute function clears
        // to white, and the real texture is swapped in the moment CDF is ready.
        const icdfChanged = this._lastImportedIcdfTexture !== icdfTexture;
        if (icdfChanged && icdfTexture) {
            this._tracingTask.icdfTexture = this._frameGraph.textureManager.importTexture(`ICDF Texture`, icdfTexture, this._tracingTask.icdfTexture);
            this._lastImportedIcdfTexture = icdfTexture;
        }
        const environmentChanged = this._lastImportedEnvironmentTexture !== environmentTexture;
        if (environmentChanged || !environmentTexture) {
            if (environmentTexture) {
                this._tracingTask.environmentTexture = this._frameGraph.textureManager.importTexture(`Environment Texture`, environmentTexture, this._tracingTask.environmentTexture);
                this._lastImportedEnvironmentTexture = environmentTexture;
            }
            else {
                // No environment texture (null or not yet ready) — clear any stale handle so
                // it is not added to pass dependencies where _computeTextureLifespan would
                // fail to find it.  This happens when a new IBL is dragged in: the environment
                // texture temporarily returns null from _getEnvironmentTextureInternal() while
                // it is still loading, but _lastImportedEnvironmentTexture was reset to null in
                // record(), so environmentChanged is false and the old stale handle is never
                // cleared — unless we add the || !environmentTexture guard here.
                this._tracingTask.environmentTexture = undefined;
                this._lastImportedEnvironmentTexture = null;
            }
        }
        const blueNoiseChanged = this._lastImportedBlueNoiseTexture !== blueNoiseInternalTexture;
        if (blueNoiseChanged || !blueNoiseInternalTexture) {
            if (blueNoiseInternalTexture) {
                this._tracingTask.blueNoiseTexture = this._frameGraph.textureManager.importTexture(`Blue Noise Texture`, blueNoiseInternalTexture, this._tracingTask.blueNoiseTexture);
                this._lastImportedBlueNoiseTexture = blueNoiseInternalTexture;
            }
            else {
                // Same null-guard as environment above.
                this._tracingTask.blueNoiseTexture = undefined;
                this._lastImportedBlueNoiseTexture = null;
            }
        }
        // Only mark dependencies as resolved when all textures are genuinely ready.
        //
        // Use IblCdfGenerator.isReady() rather than icdfTexture?.isReady (the raw
        // InternalTexture property).  For a ProceduralTexture render target, InternalTexture
        // .isReady can remain false after onGeneratedObservable fires — it reflects GPU
        // texture object creation state, not whether the ICDF effect has been compiled and
        // the texture has been rendered.  IblCdfGenerator.isReady() checks _icdfPT.isReady()
        // (ProceduralTexture readiness = effect compiled AND rendered at least once) plus all
        // intermediate CDF textures.  Without this, _dependenciesResolved never flips to true
        // when a new model is loaded (the CDF regenerates but isReady stays false), so the
        // IBLShadowsPluginMaterial plugin is never enabled on any material.
        const cdfReady = scene.iblCdfGenerator?.isReady() ?? false;
        const ready = cdfReady && !!environmentTexture?.isReady && !!blueNoiseInternalTexture?.isReady;
        if (!ready) {
            if (this._dependenciesResolved) {
                this._dependenciesResolved = false;
            }
            return false;
        }
        if (!this._dependenciesResolved) {
            this._dependenciesResolved = true;
            if (!this._disabled) {
                this._accumulationTask.reset = true;
            }
            this._disposeDependencyObservers();
        }
        else if (icdfChanged || environmentChanged || blueNoiseChanged) {
            this._accumulationTask.reset = true;
        }
        this._applyMaterialPluginParameters();
        return true;
    }
    _initialize() {
        const scene = this._frameGraph.scene;
        this._voxelizationCompleteObserver = this._voxelizationTask.onVoxelizationCompleteObservable.add(() => {
            this._tracingTask.voxelGridTexture = this._voxelizationTask.outputVoxelGridTexture;
            this._accumulationTask.reset = true;
        });
        this._cdfTextureChangedObserver =
            scene.iblCdfGenerator?.onTextureChangedObservable.add(() => {
                this._lastImportedIcdfTexture = null;
                this._accumulationTask.reset = true;
            }) ?? null;
        this._cdfGeneratedObserver =
            scene.iblCdfGenerator?.onGeneratedObservable.add(() => {
                this._lastImportedIcdfTexture = null;
                this._tryEnableShadowsTasks();
            }) ?? null;
        this._environmentTextureChangedObserver = scene.onEnvironmentTextureChangedObservable.add(() => {
            this._lastImportedEnvironmentTexture = null;
            this._dependenciesResolved = false;
            this._observeEnvironmentTexture();
            this._applyMaterialPluginParameters();
            this._tryEnableShadowsTasks();
        });
        this._observeEnvironmentTexture();
        if (scene.environmentTexture?.isReadyOrNotBlocking()) {
            this._tryEnableShadowsTasks();
        }
        this._blueNoiseLoadObserver = this._blueNoiseTexture.onLoadObservable.add(() => {
            this._tryEnableShadowsTasks();
        });
        this._beforeRenderDependencyObserver = scene.onBeforeRenderObservable.add(() => {
            this._tryEnableShadowsTasks();
        });
        this._beforeRenderOutputReadyObserver = scene.onBeforeRenderObservable.add(() => {
            this._notifyIfOutputTextureReady();
        });
        this._tryEnableShadowsTasks();
        this._texturesAllocatedObserver = this.onTexturesAllocatedObservable.add(() => {
            this._applyMaterialPluginParameters();
            this._notifyIfOutputTextureReady();
        });
    }
}
//# sourceMappingURL=iblShadowsRendererTask.pure.js.map
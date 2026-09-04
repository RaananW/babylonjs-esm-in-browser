import { UniformBuffer } from "../Materials/uniformBuffer.js";
import { Observable } from "../Misc/observable.js";
import { RenderingManager } from "../Rendering/renderingManager.js";

import { _ObserveArray } from "../Misc/arrayTools.js";
import { _RetryWithInterval } from "../Misc/timingTools.js";
import { Logger } from "../Misc/logger.js";
import { SmartArray } from "../Misc/smartArray.js";
import { LightConstants } from "../Lights/lightConstants.js";
/**
 * A class that renders objects to the currently bound render target.
 * This class only renders objects, and is not concerned with the output texture or post-processing.
 */
export class ObjectRenderer {
    /**
     * Use this list to define the list of mesh you want to render.
     */
    get renderList() {
        return this._renderList;
    }
    set renderList(value) {
        if (this._renderList === value) {
            return;
        }
        if (this._unObserveRenderList) {
            this._unObserveRenderList();
            this._unObserveRenderList = null;
        }
        if (value) {
            this._unObserveRenderList = _ObserveArray(value, this._renderListHasChanged);
        }
        this._renderList = value;
    }
    /**
     * If true, the object renderer will render all objects without any image processing applied.
     * If false (default value), the renderer will use the current setting of the scene's image processing configuration.
     */
    get disableImageProcessing() {
        return this._disableImageProcessing;
    }
    set disableImageProcessing(value) {
        if (value === this._disableImageProcessing) {
            return;
        }
        this._disableImageProcessing = value;
        this._scene.markAllMaterialsAsDirty(64);
    }
    /**
     * Specifies to disable depth pre-pass if true (default: false)
     */
    get disableDepthPrePass() {
        return this._disableDepthPrePass;
    }
    set disableDepthPrePass(value) {
        this._disableDepthPrePass = value;
        this._renderingManager.disableDepthPrePass = value;
    }
    /**
     * Friendly name of the object renderer
     */
    get name() {
        return this._name;
    }
    set name(value) {
        if (this._name === value) {
            return;
        }
        this._name = value;
        if (this._sceneUBOs) {
            for (let i = 0; i < this._sceneUBOs.length; ++i) {
                this._sceneUBOs[i].name = `Scene ubo #${i} for ${this.name}`;
            }
        }
        if (!this._scene) {
            return;
        }
        for (let i = 0; i < this._renderPassIds.length; ++i) {
            const renderPassId = this._renderPassIds[i];
            this._engine._renderPassNames[renderPassId] = `${this._name}#${i}`;
        }
    }
    /**
     * Gets the render pass ids used by the object renderer.
     */
    get renderPassIds() {
        return this._renderPassIds;
    }
    /**
     * Gets the current value of the refreshId counter
     */
    get currentRefreshId() {
        return this._currentRefreshId;
    }
    /**
     * Gets the array of active meshes
     * @returns an array of AbstractMesh
     */
    getActiveMeshes() {
        return this._activeMeshes;
    }
    /**
     * Sets a specific material to be used to render a mesh/a list of meshes with this object renderer
     * @param mesh mesh or array of meshes
     * @param material material or array of materials to use for this render pass. If undefined is passed, no specific material will be used but the regular material instead (mesh.material). It's possible to provide an array of materials to use a different material for each rendering pass.
     */
    setMaterialForRendering(mesh, material) {
        let meshes;
        if (!Array.isArray(mesh)) {
            meshes = [mesh];
        }
        else {
            meshes = mesh;
        }
        for (let j = 0; j < meshes.length; ++j) {
            for (let i = 0; i < this.options.numPasses; ++i) {
                let mesh = meshes[j];
                if (meshes[j].isAnInstance) {
                    mesh = meshes[j].sourceMesh;
                }
                mesh.setMaterialForRenderPass(this._renderPassIds[i], material !== undefined ? (Array.isArray(material) ? material[i] : material) : undefined);
            }
        }
    }
    /** @internal */
    _freezeActiveMeshes(freezeMeshes) {
        this._freezeActiveMeshesCancel = _RetryWithInterval(() => {
            return this._checkReadiness();
        }, () => {
            this._freezeActiveMeshesCancel = null;
            if (freezeMeshes) {
                for (let index = 0; index < this._activeMeshes.length; index++) {
                    this._activeMeshes.data[index]._freeze();
                }
            }
            this._prepareRenderingManager(0, true);
            this._isFrozen = true;
        }, (err, isTimeout) => {
            this._freezeActiveMeshesCancel = null;
            if (!isTimeout) {
                Logger.Error("ObjectRenderer: An unexpected error occurred while waiting for the renderer to be ready.");
                if (err) {
                    Logger.Error(err);
                    if (err.stack) {
                        Logger.Error(err.stack);
                    }
                }
            }
            else {
                Logger.Error(`ObjectRenderer: Timeout while waiting for the renderer to be ready.`);
                if (err) {
                    Logger.Error(err);
                }
            }
        });
    }
    /** @internal */
    _unfreezeActiveMeshes() {
        this._freezeActiveMeshesCancel?.();
        this._freezeActiveMeshesCancel = null;
        for (let index = 0; index < this._activeMeshes.length; index++) {
            this._activeMeshes.data[index]._unFreeze();
        }
        this._isFrozen = false;
    }
    /**
     * Instantiates an object renderer.
     * @param name The friendly name of the object renderer
     * @param scene The scene the renderer belongs to
     * @param options The options used to create the renderer (optional)
     */
    constructor(name, scene, options) {
        this._unObserveRenderList = null;
        this._renderListHasChanged = (_functionName, previousLength) => {
            const newLength = this._renderList ? this._renderList.length : 0;
            if ((previousLength === 0 && newLength > 0) || newLength === 0) {
                for (const mesh of this._scene.meshes) {
                    mesh._markSubMeshesAsLightDirty();
                }
            }
        };
        /**
         * Define the list of particle systems to render. If not provided, will render all the particle systems of the scene.
         * Note that the particle systems are rendered only if renderParticles is set to true.
         */
        this.particleSystemList = null;
        /**
         * Use this function to overload the renderList array at rendering time.
         * Return null to render with the current renderList, else return the list of meshes to use for rendering.
         * For 2DArray, layerOrFace is the index of the layer that is going to be rendered, else it is the faceIndex of
         * the cube (if the RTT is a cube, else layerOrFace=0).
         * The renderList passed to the function is the current render list (the one that will be used if the function returns null).
         * The length of this list is passed through renderListLength: don't use renderList.length directly because the array can
         * hold dummy elements!
         */
        this.getCustomRenderList = null;
        /**
         * Define if meshes should be rendered (default is true).
         */
        this.renderMeshes = true;
        /**
         * Define if depth only meshes should be rendered (default is true). No effect if renderMeshes is false.
         */
        this.renderDepthOnlyMeshes = true;
        /**
         * Define if opaque meshes should be rendered (default is true). No effect if renderMeshes is false.
         */
        this.renderOpaqueMeshes = true;
        /**
         * Define if alpha test meshes should be rendered (default is true). No effect if renderMeshes is false.
         */
        this.renderAlphaTestMeshes = true;
        /**
         * Define if transparent meshes should be rendered (default is true). No effect if renderMeshes is false.
         */
        this.renderTransparentMeshes = true;
        /**
         * Define if particles should be rendered (default is true).
         */
        this.renderParticles = true;
        /**
         * Define if sprites should be rendered (default is false).
         */
        this.renderSprites = false;
        /**
         * Force checking the layerMask property even if a custom list of meshes is provided (ie. if renderList is not undefined)
         */
        this.forceLayerMaskCheck = false;
        /**
         * Enables the rendering of bounding boxes for meshes (still subject to Mesh.showBoundingBox or scene.forceShowBoundingBoxes). Default is false.
         */
        this.enableBoundingBoxRendering = false;
        /**
         * Enables the rendering of outline/overlay for meshes (still subject to Mesh.renderOutline/Mesh.renderOverlay). Default is true.
         */
        this.enableOutlineRendering = true;
        this._disableImageProcessing = false;
        /**
         * If true, the object renderer will not set the view/projection/transformation matrices for the active camera (default: false).
         * By default, the view/projection/transformation matrices are set from the active camera (either ObjectRenderer.activeCamera or scene.activeCamera).
         * Sets this property to true if you want to define your own transformation matrices (use the onInitRenderingObservable observable
         * to set your own matrices, to be sure they will be correctly taken into account)
         */
        this.dontSetTransformationMatrix = false;
        this._disableDepthPrePass = false;
        /**
         * An event triggered before rendering the objects.
         * Note: This observable is also triggered during readiness checks (e.g. when calling scene.isReady()),
         * in which case the render target is not bound to the output. Observers should avoid performing
         * GPU state changes (such as clearing or modifying the framebuffer) unless the render target is actually bound.
         */
        this.onBeforeRenderObservable = new Observable();
        /**
         * An event triggered after rendering the objects.
         * Note: This observable is also triggered during readiness checks (e.g. when calling scene.isReady()),
         * in which case the render target is not bound to the output. Observers should avoid performing
         * GPU state changes (such as clearing or modifying the framebuffer) unless the render target is actually bound.
         */
        this.onAfterRenderObservable = new Observable();
        /**
         * An event triggered before the rendering group is processed
         */
        this.onBeforeRenderingManagerRenderObservable = new Observable();
        /**
         * An event triggered after the rendering group is processed
         */
        this.onAfterRenderingManagerRenderObservable = new Observable();
        /**
         * An event triggered when initRender is called
         */
        this.onInitRenderingObservable = new Observable();
        /**
         * An event triggered when finishRender is called
         */
        this.onFinishRenderingObservable = new Observable();
        /**
         * An event triggered when fast path rendering is used
         */
        this.onFastPathRenderObservable = new Observable();
        this._currentRefreshId = -1;
        this._refreshRate = 1;
        this._currentApplyByPostProcessSetting = false;
        this._activeMeshes = new SmartArray(256);
        this._activeBoundingBoxes = new SmartArray(32);
        this._currentFrameId = -1;
        this._currentSceneUBOIndex = 0;
        /** @internal */
        this._isFrozen = false;
        /** @internal */
        this._freezeActiveMeshesCancel = null;
        this._currentSceneCamera = null;
        this.name = name;
        this._scene = scene;
        this._engine = this._scene.getEngine();
        this._useUBO = this._engine.supportsUniformBuffers;
        this.renderList = [];
        this._renderPassIds = [];
        this.options = {
            numPasses: 1,
            doNotChangeAspectRatio: true,
            enableClusteredLights: false,
            ...options,
        };
        this._createRenderPassId();
        this.renderPassId = this._renderPassIds[0];
        // Rendering groups
        this._renderingManager = new RenderingManager(scene);
        this._renderingManager._useSceneAutoClearSetup = true;
        if (this.options.enableClusteredLights) {
            this.onInitRenderingObservable.add(() => {
                for (const light of this._scene.lights) {
                    if (light.getTypeID() === LightConstants.LIGHTTYPEID_CLUSTERED_CONTAINER && light.isSupported) {
                        light._updateBatches(this.activeCamera).render();
                    }
                }
            });
        }
        this._scene.addObjectRenderer(this);
    }
    _releaseRenderPassId() {
        for (let i = 0; i < this.options.numPasses; ++i) {
            this._engine.releaseRenderPassId(this._renderPassIds[i]);
        }
        this._renderPassIds.length = 0;
    }
    _createRenderPassId() {
        this._releaseRenderPassId();
        for (let i = 0; i < this.options.numPasses; ++i) {
            this._renderPassIds[i] = this._engine.createRenderPassId(`${this.name}#${i}`);
        }
    }
    _createSceneUBO(name, isMultiview) {
        const engine = this._scene.getEngine();
        const ubo = new UniformBuffer(engine, undefined, isMultiview, name, undefined, false);
        ubo.addUniform("viewProjection", 16);
        if (isMultiview) {
            ubo.addUniform("viewProjectionR", 16);
        }
        ubo.addUniform("view", 16);
        ubo.addUniform("projection", 16);
        ubo.addUniform("vEyePosition", 4);
        ubo.addUniform("inverseProjection", 16);
        return ubo;
    }
    _getSceneUBO() {
        if (this._currentFrameId !== this._engine.frameId) {
            this._currentSceneUBOIndex = 0;
            this._currentFrameId = this._engine.frameId;
        }
        if (!this._sceneUBOs) {
            this._sceneUBOs = [];
            this._sceneUBOIsMultiview = [];
        }
        const activeRenderTarget = this._engine._currentRenderTarget;
        const isMultiview = !!(activeRenderTarget && activeRenderTarget.texture?.isMultiview) || !!this._scene._multiviewSceneUboIsActive;
        // Check if we have enough UBOs or if the current one is compatible
        if (this._currentSceneUBOIndex >= this._sceneUBOs.length) {
            const index = this._sceneUBOs.length;
            this._sceneUBOs.push(this._createSceneUBO(`Scene ubo #${index} for ${this.name}`, isMultiview));
            this._sceneUBOIsMultiview.push(isMultiview);
        }
        else if (this._sceneUBOIsMultiview[this._currentSceneUBOIndex] !== isMultiview) {
            // Layout mismatch, recreate
            this._sceneUBOs[this._currentSceneUBOIndex].dispose();
            this._sceneUBOs[this._currentSceneUBOIndex] = this._createSceneUBO(`Scene ubo #${this._currentSceneUBOIndex} for ${this.name}`, isMultiview);
            this._sceneUBOIsMultiview[this._currentSceneUBOIndex] = isMultiview;
        }
        const ubo = this._sceneUBOs[this._currentSceneUBOIndex++];
        ubo.unbindEffect();
        return ubo;
    }
    /**
     * Resets the refresh counter of the renderer and start back from scratch.
     * Could be useful to re-render if it is setup to render only once.
     */
    resetRefreshCounter() {
        this._currentRefreshId = -1;
    }
    /**
     * Defines the refresh rate of the rendering or the rendering frequency.
     * Use 0 to render just once, 1 to render on every frame, 2 to render every two frames and so on...
     */
    get refreshRate() {
        return this._refreshRate;
    }
    set refreshRate(value) {
        this._refreshRate = value;
        this.resetRefreshCounter();
    }
    /**
     * Indicates if the renderer should render the current frame.
     * The output is based on the specified refresh rate.
     * When snapshot rendering is active, this always returns true to ensure render pass
     * topology stays consistent between the recording frame and playback frames.
     * @returns true if the renderer should render the current frame
     */
    shouldRender() {
        if (this._engine.snapshotRendering) {
            // When snapshot rendering is active (recording or playing), we must always render
            // to ensure the number of render passes stays consistent between the recording frame
            // and all playback frames. If a render target is skipped during recording but not
            // during playback (or vice versa), the recorded bundle list indices become misaligned,
            // causing visual artifacts such as flickering.
            return true;
        }
        if (this._currentRefreshId === -1) {
            // At least render once
            this._currentRefreshId = 1;
            return true;
        }
        if (this.refreshRate === this._currentRefreshId) {
            this._currentRefreshId = 1;
            return true;
        }
        this._currentRefreshId++;
        return false;
    }
    /**
     * This function will check if the renderer is ready to render (textures are loaded, shaders are compiled)
     * @param viewportWidth defines the width of the viewport
     * @param viewportHeight defines the height of the viewport
     * @returns true if all required resources are ready
     */
    isReadyForRendering(viewportWidth, viewportHeight) {
        this.prepareRenderList();
        this.initRender(viewportWidth, viewportHeight);
        const isReady = this._checkReadiness();
        this.finishRender();
        return isReady;
    }
    /**
     * Makes sure the list of meshes is ready to be rendered
     * You should call this function before "initRender", but if you know the render list is ok, you may call "initRender" directly
     */
    prepareRenderList() {
        const scene = this._scene;
        if (this._waitingRenderList) {
            if (!this.renderListPredicate) {
                this.renderList = [];
                for (let index = 0; index < this._waitingRenderList.length; index++) {
                    const id = this._waitingRenderList[index];
                    const mesh = scene.getMeshById(id);
                    if (mesh) {
                        this.renderList.push(mesh);
                    }
                }
            }
            this._waitingRenderList = undefined;
        }
        // Is predicate defined?
        if (this.renderListPredicate) {
            if (this.renderList) {
                this.renderList.length = 0; // Clear previous renderList
            }
            else {
                this.renderList = [];
            }
            const sceneMeshes = this._scene.meshes;
            for (let index = 0; index < sceneMeshes.length; index++) {
                const mesh = sceneMeshes[index];
                if (this.renderListPredicate(mesh)) {
                    this.renderList.push(mesh);
                }
            }
        }
        this._currentApplyByPostProcessSetting = this._scene.imageProcessingConfiguration.applyByPostProcess;
        if (this._disableImageProcessing) {
            // we do not use the applyByPostProcess setter to avoid flagging all the materials as "image processing dirty"!
            this._scene.imageProcessingConfiguration._applyByPostProcess = this._disableImageProcessing;
        }
    }
    /**
     * This method makes sure everything is setup before "render" can be called
     * @param viewportWidth Width of the viewport to render to
     * @param viewportHeight Height of the viewport to render to
     */
    initRender(viewportWidth, viewportHeight) {
        const camera = this.activeCamera ?? this._scene.activeCamera;
        this._currentSceneCamera = this._scene.activeCamera;
        if (this._useUBO) {
            this._currentSceneUBO = this._scene.getSceneUniformBuffer();
            this._currentSceneUBO.unbindEffect();
            this._scene.setSceneUniformBuffer(this._getSceneUBO());
        }
        this.onInitRenderingObservable.notifyObservers(this);
        if (camera) {
            if (!this.dontSetTransformationMatrix) {
                this._scene.setTransformMatrix(camera.getViewMatrix(), camera.getProjectionMatrix(true));
            }
            // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged for this internal render pass.
            this._scene._activeCamera = camera;
            this._engine.setViewport(camera.rigParent ? camera.rigParent.viewport : camera.viewport, viewportWidth, viewportHeight);
        }
        if (this._useUBO) {
            this._scene.finalizeSceneUbo();
        }
        this._defaultRenderListPrepared = false;
    }
    /**
     * This method must be called after the "render" call(s), to complete the rendering process.
     */
    finishRender() {
        const scene = this._scene;
        if (this._useUBO) {
            this._scene.setSceneUniformBuffer(this._currentSceneUBO);
        }
        if (this._disableImageProcessing) {
            scene.imageProcessingConfiguration._applyByPostProcess = this._currentApplyByPostProcessSetting;
        }
        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged for this internal render pass.
        scene._activeCamera = this._currentSceneCamera;
        if (this._currentSceneCamera) {
            if (this.activeCamera && this.activeCamera !== scene.activeCamera) {
                scene.setTransformMatrix(this._currentSceneCamera.getViewMatrix(), this._currentSceneCamera.getProjectionMatrix(true));
            }
            this._engine.setViewport(this._currentSceneCamera.viewport);
        }
        scene.resetCachedMaterial();
        this.onFinishRenderingObservable.notifyObservers(this);
    }
    /**
     * Renders all the objects (meshes, particles systems, sprites) to the currently bound render target texture.
     * @param passIndex defines the pass index to use (default: 0)
     * @param skipOnAfterRenderObservable defines a flag to skip raising the onAfterRenderObservable
     */
    render(passIndex = 0, skipOnAfterRenderObservable = false) {
        const currentRenderPassId = this._engine.currentRenderPassId;
        this._engine.currentRenderPassId = this._renderPassIds[passIndex];
        this.onBeforeRenderObservable.notifyObservers(passIndex);
        const fastPath = this._engine.snapshotRendering && this._engine.snapshotRenderingMode === 1;
        if (!fastPath) {
            const currentRenderList = this._prepareRenderingManager(passIndex);
            // The cast to "any" is to avoid an error in ES6 in case you don't import outlineRenderer
            const outlineRenderer = this._scene.getOutlineRenderer?.();
            const outlineRendererIsEnabled = outlineRenderer?.enabled;
            if (outlineRenderer) {
                outlineRenderer.enabled = this.enableOutlineRendering;
            }
            this.onBeforeRenderingManagerRenderObservable.notifyObservers(passIndex);
            this._renderingManager.render(this.customRenderFunction, currentRenderList, this.renderParticles, this.renderSprites, this.renderDepthOnlyMeshes, this.renderOpaqueMeshes, this.renderAlphaTestMeshes, this.renderTransparentMeshes, this.customRenderTransparentSubMeshes);
            this.onAfterRenderingManagerRenderObservable.notifyObservers(passIndex);
            if (outlineRenderer) {
                outlineRenderer.enabled = outlineRendererIsEnabled;
            }
        }
        else {
            this.onFastPathRenderObservable.notifyObservers(passIndex);
        }
        if (!skipOnAfterRenderObservable) {
            this.onAfterRenderObservable.notifyObservers(passIndex);
        }
        this._engine.currentRenderPassId = currentRenderPassId;
    }
    /** @internal */
    _checkReadiness() {
        const scene = this._scene;
        const currentRenderPassId = this._engine.currentRenderPassId;
        let returnValue = true;
        if (!scene.getViewMatrix()) {
            // We probably didn't execute scene.render() yet, so make sure we have a view/projection matrix setup for the scene
            scene.updateTransformMatrix();
        }
        const numPasses = this.options.numPasses;
        for (let passIndex = 0; passIndex < numPasses && returnValue; passIndex++) {
            const defaultRenderList = this.renderList ? this.renderList : scene.frameGraph ? scene.meshes : scene.getActiveMeshes().data;
            const defaultRenderListLength = this.renderList || scene.frameGraph ? defaultRenderList.length : scene.getActiveMeshes().length;
            this._engine.currentRenderPassId = this._renderPassIds[passIndex];
            this.onBeforeRenderObservable.notifyObservers(passIndex);
            let currentRenderList = null;
            let currentRenderListLength = defaultRenderListLength;
            if (this.getCustomRenderList) {
                currentRenderList = this.getCustomRenderList(passIndex, defaultRenderList, defaultRenderListLength);
                if (currentRenderList) {
                    currentRenderListLength = currentRenderList.length;
                }
            }
            if (!currentRenderList) {
                currentRenderList = defaultRenderList;
            }
            if (!this.options.doNotChangeAspectRatio) {
                scene.updateTransformMatrix(true);
            }
            for (let i = 0; i < currentRenderListLength && returnValue; ++i) {
                const mesh = currentRenderList[i];
                if (!mesh.isEnabled() || mesh.isBlocked || !mesh.isVisible || !mesh.subMeshes) {
                    continue;
                }
                if (this.customIsReadyFunction) {
                    if (!this.customIsReadyFunction(mesh, this.refreshRate, true)) {
                        returnValue = false;
                        continue;
                    }
                }
                else if (!mesh.isReady(true)) {
                    returnValue = false;
                    continue;
                }
            }
            this.onAfterRenderObservable.notifyObservers(passIndex);
            if (numPasses > 1) {
                scene.incrementRenderId();
                scene.resetCachedMaterial();
            }
        }
        const particleSystems = this.particleSystemList || scene.particleSystems;
        for (const particleSystem of particleSystems) {
            if (!particleSystem.isReady()) {
                returnValue = false;
            }
        }
        this._engine.currentRenderPassId = currentRenderPassId;
        return returnValue;
    }
    _prepareRenderingManager(passIndex = 0, winterIsComing = false) {
        const scene = this._scene;
        // Get the list of meshes to dispatch to the rendering manager
        let currentRenderList = null;
        let currentRenderListLength;
        let checkLayerMask;
        const defaultRenderList = this.renderList ? this.renderList : scene.frameGraph ? scene.meshes : scene.getActiveMeshes().data;
        const defaultRenderListLength = this.renderList || scene.frameGraph ? defaultRenderList.length : scene.getActiveMeshes().length;
        if (this.getCustomRenderList) {
            currentRenderList = this.getCustomRenderList(passIndex, defaultRenderList, defaultRenderListLength);
        }
        if (!currentRenderList) {
            // No custom render list provided, we prepare the rendering for the default list, but check
            // first if we did not already performed the preparation (in this frame) before so as to avoid re-doing it several times.
            // In WebGPU, instance data (visibleInstances) is stored per render pass ID. Each cascade/face (in CSM) uses a different
            // render pass ID, so we must re-prepare for each pass to register instances in the correct per-pass storage.
            if (this._defaultRenderListPrepared && !winterIsComing && !this._engine.isWebGPU) {
                return defaultRenderList;
            }
            this._defaultRenderListPrepared = true;
            currentRenderList = defaultRenderList;
            currentRenderListLength = defaultRenderListLength;
            checkLayerMask = !this.renderList || this.forceLayerMaskCheck;
        }
        else {
            // Prepare the rendering for the custom render list provided
            currentRenderListLength = currentRenderList.length;
            checkLayerMask = this.forceLayerMaskCheck;
        }
        const camera = scene.activeCamera; // note that at this point, scene.activeCamera == this.activeCamera if defined, because initRender() has been called before
        const cameraForLOD = this.cameraForLOD ?? camera;
        // The cast to "any" is to avoid an error in ES6 in case you don't import boundingBoxRenderer
        const boundingBoxRenderer = scene.getBoundingBoxRenderer?.();
        if (scene._activeMeshesFrozen && this._isFrozen) {
            this._renderingManager.resetSprites();
            if (this.enableBoundingBoxRendering && boundingBoxRenderer) {
                boundingBoxRenderer.reset();
                for (let i = 0; i < this._activeBoundingBoxes.length; i++) {
                    const boundingBox = this._activeBoundingBoxes.data[i];
                    boundingBoxRenderer.renderList.push(boundingBox);
                }
            }
            return currentRenderList;
        }
        this._renderingManager.reset();
        this._activeMeshes.reset();
        this._activeBoundingBoxes.reset();
        // We do not check option.enableBoundingBoxRendering before resetting the current list of bounding boxes, because:
        // * if bounding box rendering is enabled, we want to start with an empty list and add new bounding boxes to it
        // * if bounding box rendering is disabled, we don't want to render any bounding boxes that may have been generated by previous code
        boundingBoxRenderer && boundingBoxRenderer.reset();
        if (this.renderMeshes) {
            const sceneRenderId = scene.getRenderId();
            const currentFrameId = scene.getFrameId();
            for (let meshIndex = 0; meshIndex < currentRenderListLength; meshIndex++) {
                const mesh = currentRenderList[meshIndex];
                if (mesh && !mesh.isBlocked) {
                    if (this.customIsReadyFunction) {
                        if (!this.customIsReadyFunction(mesh, this.refreshRate, false)) {
                            this.resetRefreshCounter();
                            continue;
                        }
                    }
                    else if (!mesh.isReady(this.refreshRate === 0)) {
                        this.resetRefreshCounter();
                        continue;
                    }
                    let meshToRender;
                    if (cameraForLOD) {
                        const meshToRenderAndFrameId = mesh._internalAbstractMeshDataInfo._currentLOD.get(cameraForLOD);
                        if (!meshToRenderAndFrameId || meshToRenderAndFrameId[1] !== currentFrameId) {
                            meshToRender = scene.customLODSelector ? scene.customLODSelector(mesh, cameraForLOD) : mesh.getLOD(cameraForLOD);
                            if (!meshToRenderAndFrameId) {
                                mesh._internalAbstractMeshDataInfo._currentLOD.set(cameraForLOD, [meshToRender, currentFrameId]);
                            }
                            else {
                                meshToRenderAndFrameId[0] = meshToRender;
                                meshToRenderAndFrameId[1] = currentFrameId;
                            }
                        }
                        else {
                            meshToRender = meshToRenderAndFrameId[0];
                        }
                    }
                    else {
                        meshToRender = mesh;
                    }
                    if (!meshToRender) {
                        continue;
                    }
                    if (meshToRender !== mesh && meshToRender.billboardMode !== 0) {
                        meshToRender.computeWorldMatrix(); // Compute world matrix if LOD is billboard
                    }
                    meshToRender._preActivateForIntermediateRendering(sceneRenderId);
                    let isMasked;
                    if (checkLayerMask && camera) {
                        isMasked = (mesh.layerMask & camera.layerMask) === 0;
                    }
                    else {
                        isMasked = false;
                    }
                    if (mesh.isEnabled() && mesh.isVisible && mesh.subMeshes && !isMasked) {
                        this._activeMeshes.push(mesh);
                        meshToRender._internalAbstractMeshDataInfo._wasActiveLastFrame = true;
                        if (meshToRender !== mesh) {
                            meshToRender._activate(sceneRenderId, true);
                        }
                        this.enableBoundingBoxRendering && boundingBoxRenderer && boundingBoxRenderer._preActiveMesh(mesh);
                        if (mesh._activate(sceneRenderId, true) && mesh.subMeshes.length) {
                            if (!mesh.isAnInstance) {
                                meshToRender._internalAbstractMeshDataInfo._onlyForInstancesIntermediate = false;
                            }
                            else {
                                if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
                                    meshToRender = mesh;
                                }
                            }
                            meshToRender._internalAbstractMeshDataInfo._isActiveIntermediate = true;
                            scene._prepareSkeleton(meshToRender);
                            for (let subIndex = 0; subIndex < meshToRender.subMeshes.length; subIndex++) {
                                const subMesh = meshToRender.subMeshes[subIndex];
                                this.enableBoundingBoxRendering && boundingBoxRenderer && boundingBoxRenderer._evaluateSubMesh(mesh, subMesh);
                                this._renderingManager.dispatch(subMesh, meshToRender);
                            }
                        }
                        mesh._postActivate();
                    }
                }
            }
        }
        if (this.enableBoundingBoxRendering && boundingBoxRenderer && winterIsComing) {
            for (let i = 0; i < boundingBoxRenderer.renderList.length; i++) {
                const boundingBox = boundingBoxRenderer.renderList.data[i];
                this._activeBoundingBoxes.push(boundingBox);
            }
        }
        if (this._scene.particlesEnabled && this.renderParticles) {
            this._scene.onBeforeParticlesRenderingObservable.notifyObservers(this._scene);
            const particleSystems = this.particleSystemList || scene.particleSystems;
            for (let particleIndex = 0; particleIndex < particleSystems.length; particleIndex++) {
                const particleSystem = particleSystems[particleIndex];
                const emitter = particleSystem.emitter;
                if (!particleSystem.isStarted() || !emitter || (emitter.position && !emitter.isEnabled())) {
                    continue;
                }
                this._renderingManager.dispatchParticles(particleSystem);
            }
            this._scene.onAfterParticlesRenderingObservable.notifyObservers(this._scene);
        }
        return currentRenderList;
    }
    /**
     * Gets the rendering manager
     */
    get renderingManager() {
        return this._renderingManager;
    }
    /**
     * Overrides the default sort function applied in the rendering group to prepare the meshes.
     * This allowed control for front to back rendering or reversely depending of the special needs.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
     * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
     * @param transparentSortCompareFn The transparent queue comparison function use to sort.
     */
    setRenderingOrder(renderingGroupId, opaqueSortCompareFn = null, alphaTestSortCompareFn = null, transparentSortCompareFn = null) {
        this._renderingManager.setRenderingOrder(renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn);
    }
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     * @param depth Automatically clears depth between groups if true and autoClear is true.
     * @param stencil Automatically clears stencil between groups if true and autoClear is true.
     */
    setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth = true, stencil = true) {
        this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth, stencil);
        this._renderingManager._useSceneAutoClearSetup = false;
    }
    /**
     * Clones the renderer.
     * @returns the cloned renderer
     */
    clone() {
        const newRenderer = new ObjectRenderer(this.name, this._scene, this.options);
        if (this.renderList) {
            newRenderer.renderList = this.renderList.slice(0);
        }
        return newRenderer;
    }
    /**
     * Dispose the renderer and release its associated resources.
     */
    dispose() {
        const renderList = this.renderList ? this.renderList : this._scene.getActiveMeshes().data;
        const renderListLength = this.renderList ? this.renderList.length : this._scene.getActiveMeshes().length;
        for (let i = 0; i < renderListLength; i++) {
            const mesh = renderList[i];
            if (mesh && mesh.getMaterialForRenderPass(this.renderPassId) !== undefined) {
                mesh.setMaterialForRenderPass(this.renderPassId, undefined);
            }
        }
        this.onInitRenderingObservable.clear();
        this.onFinishRenderingObservable.clear();
        this.onBeforeRenderObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onBeforeRenderingManagerRenderObservable.clear();
        this.onAfterRenderingManagerRenderObservable.clear();
        this.onFastPathRenderObservable.clear();
        this._releaseRenderPassId();
        this.renderList = null;
        if (this._sceneUBOs) {
            for (const ubo of this._sceneUBOs) {
                ubo.dispose();
            }
        }
        this._sceneUBOs = undefined;
        this._scene.removeObjectRenderer(this);
    }
    /** @internal */
    _rebuild() {
        if (this.refreshRate === ObjectRenderer.REFRESHRATE_RENDER_ONCE) {
            this.refreshRate = ObjectRenderer.REFRESHRATE_RENDER_ONCE;
        }
    }
    /**
     * Clear the info related to rendering groups preventing retention point in material dispose.
     */
    freeRenderingGroups() {
        if (this._renderingManager) {
            this._renderingManager.freeRenderingGroups();
        }
    }
}
/**
 * Objects will only be rendered once which can be useful to improve performance if everything in your render is static for instance.
 */
ObjectRenderer.REFRESHRATE_RENDER_ONCE = 0;
/**
 * Objects will be rendered every frame and is recommended for dynamic contents.
 */
ObjectRenderer.REFRESHRATE_RENDER_ONEVERYFRAME = 1;
/**
 * Objects will be rendered every 2 frames which could be enough if your dynamic objects are not
 * the central point of your effect and can save a lot of performances.
 */
ObjectRenderer.REFRESHRATE_RENDER_ONEVERYTWOFRAMES = 2;
//# sourceMappingURL=objectRenderer.js.map
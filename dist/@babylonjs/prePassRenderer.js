import { PrePassRenderTarget } from "../Materials/Textures/prePassRenderTarget.js";

import { _WarnImport } from "../Misc/devTools.js";
import { Color4 } from "../Maths/math.color.js";
import { Material } from "../Materials/material.js";
import { GeometryBufferRenderer } from "../Rendering/geometryBufferRenderer.js";
/**
 * Renders a pre pass of the scene
 * This means every mesh in the scene will be rendered to a render target texture
 * And then this texture will be composited to the rendering canvas with post processes
 * It is necessary for effects like subsurface scattering or deferred shading
 */
export class PrePassRenderer {
    /**
     * Instantiates a prepass renderer
     * @param scene The scene
     */
    constructor(scene) {
        /**
         * To save performance, we can excluded skinned meshes from the prepass
         */
        this.excludedSkinnedMesh = [];
        /**
         * Force material to be excluded from the prepass
         * Can be useful when `useGeometryBufferFallback` is set to `true`
         * and you don't want a material to show in the effect.
         */
        this.excludedMaterials = [];
        /**
         * Number of textures in the multi render target texture where the scene is directly rendered
         */
        this.mrtCount = 0;
        this._mrtFormats = [];
        this._mrtLayout = [];
        this._mrtNames = [];
        this._textureIndices = [];
        this._isDirty = true;
        /**
         * Configuration for prepass effects
         */
        this._effectConfigurations = [];
        /**
         * Prevents the PrePassRenderer from using the GeometryBufferRenderer as a fallback
         */
        this.doNotUseGeometryRendererFallback = true;
        /**
         * All the render targets generated by prepass
         */
        this.renderTargets = [];
        this._clearColor = new Color4(0, 0, 0, 0);
        this._enabled = false;
        this._needsCompositionForThisPass = false;
        /**
         * Set to true to disable gamma transform in PrePass.
         * Can be useful in case you already proceed to gamma transform on a material level
         * and your post processes don't need to be in linear color space.
         */
        this.disableGammaTransform = false;
        this._scene = scene;
        this._engine = scene.getEngine();
        PrePassRenderer._SceneComponentInitialization(this._scene);
        this.defaultRT = this._createRenderTarget("sceneprePassRT", null);
        this._currentTarget = this.defaultRT;
    }
    /**
     * Returns the index of a texture in the multi render target texture array.
     * @param type Texture type
     * @returns The index
     */
    getIndex(type) {
        return this._textureIndices[type];
    }
    /**
     * How many samples are used for MSAA of the scene render target
     */
    get samples() {
        return this.defaultRT.samples;
    }
    set samples(n) {
        this.defaultRT.samples = n;
    }
    /**
     * @returns the prepass render target for the rendering pass.
     * If we are currently rendering a render target, it returns the PrePassRenderTarget
     * associated with that render target. Otherwise, it returns the scene default PrePassRenderTarget
     */
    getRenderTarget() {
        return this._currentTarget;
    }
    /**
     * @internal
     * Managed by the scene component
     * @param prePassRenderTarget
     */
    _setRenderTarget(prePassRenderTarget) {
        if (prePassRenderTarget) {
            this._currentTarget = prePassRenderTarget;
        }
        else {
            this._currentTarget = this.defaultRT;
            this._engine.currentRenderPassId = this._currentTarget.renderPassId;
        }
    }
    /**
     * Returns true if the currently rendered prePassRenderTarget is the one
     * associated with the scene.
     */
    get currentRTisSceneRT() {
        return this._currentTarget === this.defaultRT;
    }
    _refreshGeometryBufferRendererLink() {
        if (!this.doNotUseGeometryRendererFallback) {
            this._geometryBuffer = this._scene.enableGeometryBufferRenderer();
            if (!this._geometryBuffer) {
                // Not supported
                this.doNotUseGeometryRendererFallback = true;
                return;
            }
            this._geometryBuffer._linkPrePassRenderer(this);
        }
        else {
            if (this._geometryBuffer) {
                this._geometryBuffer._unlinkPrePassRenderer();
            }
            this._geometryBuffer = null;
            this._scene.disableGeometryBufferRenderer();
        }
    }
    /**
     * Indicates if the prepass is enabled
     */
    get enabled() {
        return this._enabled;
    }
    /**
     * Creates a new PrePassRenderTarget
     * This should be the only way to instantiate a `PrePassRenderTarget`
     * @param name Name of the `PrePassRenderTarget`
     * @param renderTargetTexture RenderTarget the `PrePassRenderTarget` will be attached to.
     * Can be `null` if the created `PrePassRenderTarget` is attached to the scene (default framebuffer).
     * @internal
     */
    _createRenderTarget(name, renderTargetTexture) {
        const rt = new PrePassRenderTarget(name, renderTargetTexture, { width: this._engine.getRenderWidth(), height: this._engine.getRenderHeight() }, 0, this._scene, {
            generateMipMaps: false,
            generateStencilBuffer: this._engine.isStencilEnable,
            defaultType: 0,
            types: [],
            drawOnlyOnFirstAttachmentByDefault: true,
        });
        this.renderTargets.push(rt);
        return rt;
    }
    /**
     * Indicates if rendering a prepass is supported
     */
    get isSupported() {
        return this._scene.getEngine().getCaps().drawBuffersExtension;
    }
    /**
     * Sets the proper output textures to draw in the engine.
     * @param effect The effect that is drawn. It can be or not be compatible with drawing to several output textures.
     * @param subMesh Submesh on which the effect is applied
     */
    bindAttachmentsForEffect(effect, subMesh) {
        const material = subMesh.getMaterial();
        const isPrePassCapable = material && material.isPrePassCapable;
        const excluded = material && this.excludedMaterials.indexOf(material) !== -1;
        if (this.enabled && this._currentTarget.enabled) {
            if (effect._multiTarget && isPrePassCapable && !excluded) {
                this._engine.bindAttachments(this._multiRenderAttachments);
            }
            else {
                if (this._engine._currentRenderTarget) {
                    this._engine.bindAttachments(this._defaultAttachments);
                }
                else {
                    this._engine.restoreSingleAttachment();
                }
                if (this._geometryBuffer && this.currentRTisSceneRT && !excluded) {
                    this._geometryBuffer.renderList.push(subMesh.getRenderingMesh());
                }
            }
        }
    }
    _reinitializeAttachments() {
        const multiRenderLayout = [];
        const clearLayout = [false];
        const defaultLayout = [true];
        for (let i = 0; i < this.mrtCount; i++) {
            multiRenderLayout.push(true);
            if (i > 0) {
                clearLayout.push(true);
                defaultLayout.push(false);
            }
        }
        this._multiRenderAttachments = this._engine.buildTextureLayout(multiRenderLayout);
        this._clearAttachments = this._engine.buildTextureLayout(clearLayout);
        this._defaultAttachments = this._engine.buildTextureLayout(defaultLayout);
    }
    _resetLayout() {
        for (let i = 0; i < PrePassRenderer._TextureFormats.length; i++) {
            this._textureIndices[PrePassRenderer._TextureFormats[i].type] = -1;
        }
        this._textureIndices[4] = 0;
        this._mrtLayout = [4];
        this._mrtFormats = [PrePassRenderer._TextureFormats[4].format];
        this._mrtNames = [PrePassRenderer._TextureFormats[4].name];
        this.mrtCount = 1;
    }
    _updateGeometryBufferLayout() {
        this._refreshGeometryBufferRendererLink();
        if (this._geometryBuffer) {
            this._geometryBuffer._resetLayout();
            const texturesActivated = [];
            for (let i = 0; i < this._mrtLayout.length; i++) {
                texturesActivated.push(false);
            }
            this._geometryBuffer._linkInternalTexture(this.defaultRT.getInternalTexture());
            const matches = [
                {
                    prePassConstant: 5,
                    geometryBufferConstant: GeometryBufferRenderer.DEPTH_TEXTURE_TYPE,
                },
                {
                    prePassConstant: 6,
                    geometryBufferConstant: GeometryBufferRenderer.NORMAL_TEXTURE_TYPE,
                },
                {
                    prePassConstant: 1,
                    geometryBufferConstant: GeometryBufferRenderer.POSITION_TEXTURE_TYPE,
                },
                {
                    prePassConstant: 3,
                    geometryBufferConstant: GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE,
                },
                {
                    prePassConstant: 2,
                    geometryBufferConstant: GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE,
                },
            ];
            // replace textures in the geometryBuffer RT
            for (let i = 0; i < matches.length; i++) {
                const index = this._mrtLayout.indexOf(matches[i].prePassConstant);
                if (index !== -1) {
                    this._geometryBuffer._forceTextureType(matches[i].geometryBufferConstant, index);
                    texturesActivated[index] = true;
                }
            }
            this._geometryBuffer._setAttachments(this._engine.buildTextureLayout(texturesActivated));
        }
    }
    /**
     * Restores attachments for single texture draw.
     */
    restoreAttachments() {
        if (this.enabled && this._currentTarget.enabled && this._defaultAttachments) {
            if (this._engine._currentRenderTarget) {
                this._engine.bindAttachments(this._defaultAttachments);
            }
            else {
                this._engine.restoreSingleAttachment();
            }
        }
    }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _beforeDraw(camera, faceIndex, layer) {
        // const previousEnabled = this._enabled && this._currentTarget.enabled;
        if (this._isDirty) {
            this._update();
        }
        if (!this._enabled || !this._currentTarget.enabled) {
            return;
        }
        if (this._geometryBuffer) {
            this._geometryBuffer.renderList = [];
        }
        this._setupOutputForThisPass(this._currentTarget, camera);
    }
    _prepareFrame(prePassRenderTarget, faceIndex, layer) {
        if (prePassRenderTarget.renderTargetTexture) {
            prePassRenderTarget.renderTargetTexture._prepareFrame(this._scene, faceIndex, layer, prePassRenderTarget.renderTargetTexture.useCameraPostProcesses);
        }
        else if (this._postProcessesSourceForThisPass.length) {
            this._scene.postProcessManager._prepareFrame();
        }
        else {
            this._engine.restoreDefaultFramebuffer();
        }
    }
    /**
     * Sets an intermediary texture between prepass and postprocesses. This texture
     * will be used as input for post processes
     * @param rt
     * @returns true if there are postprocesses that will use this texture,
     * false if there is no postprocesses - and the function has no effect
     */
    setCustomOutput(rt) {
        const firstPP = this._postProcessesSourceForThisPass[0];
        if (!firstPP) {
            return false;
        }
        firstPP.inputTexture = rt.renderTarget;
        return true;
    }
    _renderPostProcesses(prePassRenderTarget, faceIndex) {
        var _a;
        const firstPP = this._postProcessesSourceForThisPass[0];
        const outputTexture = firstPP ? firstPP.inputTexture : prePassRenderTarget.renderTargetTexture ? prePassRenderTarget.renderTargetTexture.renderTarget : null;
        // Build post process chain for this prepass post draw
        let postProcessChain = this._currentTarget._beforeCompositionPostProcesses;
        if (this._needsCompositionForThisPass) {
            postProcessChain = postProcessChain.concat([this._currentTarget.imageProcessingPostProcess]);
        }
        // Activates and renders the chain
        if (postProcessChain.length) {
            this._scene.postProcessManager._prepareFrame((_a = this._currentTarget.renderTarget) === null || _a === void 0 ? void 0 : _a.texture, postProcessChain);
            this._scene.postProcessManager.directRender(postProcessChain, outputTexture, false, faceIndex);
        }
    }
    /**
     * @internal
     */
    _afterDraw(faceIndex, layer) {
        if (this._enabled && this._currentTarget.enabled) {
            this._prepareFrame(this._currentTarget, faceIndex, layer);
            this._renderPostProcesses(this._currentTarget, faceIndex);
        }
    }
    /**
     * Clears the current prepass render target (in the sense of settings pixels to the scene clear color value)
     * @internal
     */
    _clear() {
        if (this._enabled && this._currentTarget.enabled) {
            this._bindFrameBuffer(this._currentTarget);
            // Clearing other attachment with 0 on all other attachments
            this._engine.bindAttachments(this._clearAttachments);
            this._engine.clear(this._clearColor, true, false, false);
            // Regular clear color with the scene clear color of the 1st attachment
            this._engine.bindAttachments(this._defaultAttachments);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bindFrameBuffer(prePassRenderTarget) {
        if (this._enabled && this._currentTarget.enabled) {
            this._currentTarget._checkSize();
            const internalTexture = this._currentTarget.renderTarget;
            if (internalTexture) {
                this._engine.bindFramebuffer(internalTexture);
            }
        }
    }
    _setEnabled(enabled) {
        this._enabled = enabled;
    }
    _setRenderTargetEnabled(prePassRenderTarget, enabled) {
        prePassRenderTarget.enabled = enabled;
        if (!enabled) {
            this._unlinkInternalTexture(prePassRenderTarget);
        }
    }
    /**
     * Adds an effect configuration to the prepass render target.
     * If an effect has already been added, it won't add it twice and will return the configuration
     * already present.
     * @param cfg the effect configuration
     * @returns the effect configuration now used by the prepass
     */
    addEffectConfiguration(cfg) {
        // Do not add twice
        for (let i = 0; i < this._effectConfigurations.length; i++) {
            if (this._effectConfigurations[i].name === cfg.name) {
                return this._effectConfigurations[i];
            }
        }
        this._effectConfigurations.push(cfg);
        return cfg;
    }
    _enable() {
        const previousMrtCount = this.mrtCount;
        for (let i = 0; i < this._effectConfigurations.length; i++) {
            if (this._effectConfigurations[i].enabled) {
                this._enableTextures(this._effectConfigurations[i].texturesRequired);
            }
        }
        for (let i = 0; i < this.renderTargets.length; i++) {
            if (this.mrtCount !== previousMrtCount || this.renderTargets[i].count !== this.mrtCount) {
                this.renderTargets[i].updateCount(this.mrtCount, { types: this._mrtFormats }, this._mrtNames.concat("prePass_DepthBuffer"));
            }
            this.renderTargets[i]._resetPostProcessChain();
            for (let j = 0; j < this._effectConfigurations.length; j++) {
                if (this._effectConfigurations[j].enabled) {
                    // TODO : subsurface scattering has 1 scene-wide effect configuration
                    // solution : do not stock postProcess on effectConfiguration, but in the prepassRenderTarget (hashmap configuration => postProcess)
                    // And call createPostProcess whenever the post process does not exist in the RT
                    if (!this._effectConfigurations[j].postProcess && this._effectConfigurations[j].createPostProcess) {
                        this._effectConfigurations[j].createPostProcess();
                    }
                    if (this._effectConfigurations[j].postProcess) {
                        this.renderTargets[i]._beforeCompositionPostProcesses.push(this._effectConfigurations[j].postProcess);
                    }
                }
            }
        }
        this._reinitializeAttachments();
        this._setEnabled(true);
        this._updateGeometryBufferLayout();
    }
    _disable() {
        this._setEnabled(false);
        for (let i = 0; i < this.renderTargets.length; i++) {
            this._setRenderTargetEnabled(this.renderTargets[i], false);
        }
        this._resetLayout();
        for (let i = 0; i < this._effectConfigurations.length; i++) {
            this._effectConfigurations[i].enabled = false;
        }
    }
    _getPostProcessesSource(prePassRenderTarget, camera) {
        if (camera) {
            return camera._postProcesses;
        }
        else if (prePassRenderTarget.renderTargetTexture) {
            if (prePassRenderTarget.renderTargetTexture.useCameraPostProcesses) {
                const camera = prePassRenderTarget.renderTargetTexture.activeCamera ? prePassRenderTarget.renderTargetTexture.activeCamera : this._scene.activeCamera;
                return camera ? camera._postProcesses : [];
            }
            else if (prePassRenderTarget.renderTargetTexture.postProcesses) {
                return prePassRenderTarget.renderTargetTexture.postProcesses;
            }
            else {
                return [];
            }
        }
        else {
            return this._scene.activeCamera ? this._scene.activeCamera._postProcesses : [];
        }
    }
    _setupOutputForThisPass(prePassRenderTarget, camera) {
        // Order is : draw ===> prePassRenderTarget._postProcesses ==> ipp ==> camera._postProcesses
        const secondaryCamera = camera && this._scene.activeCameras && !!this._scene.activeCameras.length && this._scene.activeCameras.indexOf(camera) !== 0;
        this._postProcessesSourceForThisPass = this._getPostProcessesSource(prePassRenderTarget, camera);
        this._postProcessesSourceForThisPass = this._postProcessesSourceForThisPass.filter((pp) => {
            return pp != null;
        });
        this._scene.autoClear = true;
        const cameraHasImageProcessing = this._hasImageProcessing(this._postProcessesSourceForThisPass);
        this._needsCompositionForThisPass = !cameraHasImageProcessing && !this.disableGammaTransform && this._needsImageProcessing() && !secondaryCamera;
        const firstCameraPP = this._getFirstPostProcess(this._postProcessesSourceForThisPass);
        const firstPrePassPP = prePassRenderTarget._beforeCompositionPostProcesses && prePassRenderTarget._beforeCompositionPostProcesses[0];
        let firstPP = null;
        // Setting the scene-wide post process configuration
        this._scene.imageProcessingConfiguration.applyByPostProcess = this._needsCompositionForThisPass || cameraHasImageProcessing;
        // Create composition effect if needed
        if (this._needsCompositionForThisPass && !prePassRenderTarget.imageProcessingPostProcess) {
            prePassRenderTarget._createCompositionEffect();
        }
        // Setting the prePassRenderTarget as input texture of the first PP
        if (firstPrePassPP) {
            firstPP = firstPrePassPP;
        }
        else if (this._needsCompositionForThisPass) {
            firstPP = prePassRenderTarget.imageProcessingPostProcess;
        }
        else if (firstCameraPP) {
            firstPP = firstCameraPP;
        }
        this._bindFrameBuffer(prePassRenderTarget);
        this._linkInternalTexture(prePassRenderTarget, firstPP);
    }
    _linkInternalTexture(prePassRenderTarget, postProcess) {
        if (postProcess) {
            postProcess.autoClear = false;
            postProcess.inputTexture = prePassRenderTarget.renderTarget;
        }
        if (prePassRenderTarget._outputPostProcess !== postProcess) {
            if (prePassRenderTarget._outputPostProcess) {
                this._unlinkInternalTexture(prePassRenderTarget);
            }
            prePassRenderTarget._outputPostProcess = postProcess;
        }
        if (prePassRenderTarget._internalTextureDirty) {
            this._updateGeometryBufferLayout();
            prePassRenderTarget._internalTextureDirty = false;
        }
    }
    /**
     * @internal
     */
    _unlinkInternalTexture(prePassRenderTarget) {
        if (prePassRenderTarget._outputPostProcess) {
            prePassRenderTarget._outputPostProcess.autoClear = true;
            prePassRenderTarget._outputPostProcess.restoreDefaultInputTexture();
            prePassRenderTarget._outputPostProcess = null;
        }
    }
    _needsImageProcessing() {
        for (let i = 0; i < this._effectConfigurations.length; i++) {
            if (this._effectConfigurations[i].enabled && this._effectConfigurations[i].needsImageProcessing) {
                return true;
            }
        }
        return false;
    }
    _hasImageProcessing(postProcesses) {
        var _a;
        let isIPPAlreadyPresent = false;
        if (postProcesses) {
            for (let i = 0; i < postProcesses.length; i++) {
                if (((_a = postProcesses[i]) === null || _a === void 0 ? void 0 : _a.getClassName()) === "ImageProcessingPostProcess") {
                    isIPPAlreadyPresent = true;
                    break;
                }
            }
        }
        return isIPPAlreadyPresent;
    }
    /**
     * Internal, gets the first post proces.
     * @param postProcesses
     * @returns the first post process to be run on this camera.
     */
    _getFirstPostProcess(postProcesses) {
        for (let ppIndex = 0; ppIndex < postProcesses.length; ppIndex++) {
            if (postProcesses[ppIndex] !== null) {
                return postProcesses[ppIndex];
            }
        }
        return null;
    }
    /**
     * Marks the prepass renderer as dirty, triggering a check if the prepass is necessary for the next rendering.
     */
    markAsDirty() {
        this._isDirty = true;
    }
    /**
     * Enables a texture on the MultiRenderTarget for prepass
     * @param types
     */
    _enableTextures(types) {
        // For velocity : enable storage of previous matrices for instances
        this._scene.needsPreviousWorldMatrices = false;
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            if (this._textureIndices[type] === -1) {
                this._textureIndices[type] = this._mrtLayout.length;
                this._mrtLayout.push(type);
                this._mrtFormats.push(PrePassRenderer._TextureFormats[type].format);
                this._mrtNames.push(PrePassRenderer._TextureFormats[type].name);
                this.mrtCount++;
            }
            if (type === 2) {
                this._scene.needsPreviousWorldMatrices = true;
            }
        }
    }
    _update() {
        this._disable();
        let enablePrePass = false;
        this._scene.imageProcessingConfiguration.applyByPostProcess = false;
        if (this._scene._depthPeelingRenderer && this._scene.useOrderIndependentTransparency) {
            this._scene._depthPeelingRenderer.setPrePassRenderer(this);
            enablePrePass = true;
        }
        for (let i = 0; i < this._scene.materials.length; i++) {
            if (this._scene.materials[i].setPrePassRenderer(this)) {
                enablePrePass = true;
            }
        }
        if (enablePrePass) {
            this._setRenderTargetEnabled(this.defaultRT, true);
        }
        let postProcesses;
        for (let i = 0; i < this.renderTargets.length; i++) {
            if (this.renderTargets[i].renderTargetTexture) {
                postProcesses = this._getPostProcessesSource(this.renderTargets[i]);
            }
            else {
                const camera = this._scene.activeCamera;
                if (!camera) {
                    continue;
                }
                postProcesses = camera._postProcesses;
            }
            if (!postProcesses) {
                continue;
            }
            postProcesses = postProcesses.filter((pp) => {
                return pp != null;
            });
            if (postProcesses) {
                for (let j = 0; j < postProcesses.length; j++) {
                    if (postProcesses[j].setPrePassRenderer(this)) {
                        this._setRenderTargetEnabled(this.renderTargets[i], true);
                        enablePrePass = true;
                    }
                }
                if (this._hasImageProcessing(postProcesses)) {
                    this._scene.imageProcessingConfiguration.applyByPostProcess = true;
                }
            }
        }
        this._markAllMaterialsAsPrePassDirty();
        this._isDirty = false;
        if (enablePrePass) {
            this._enable();
        }
    }
    _markAllMaterialsAsPrePassDirty() {
        const materials = this._scene.materials;
        for (let i = 0; i < materials.length; i++) {
            materials[i].markAsDirty(Material.PrePassDirtyFlag);
        }
    }
    /**
     * Disposes the prepass renderer.
     */
    dispose() {
        for (let i = this.renderTargets.length - 1; i >= 0; i--) {
            this.renderTargets[i].dispose();
        }
        for (let i = 0; i < this._effectConfigurations.length; i++) {
            if (this._effectConfigurations[i].dispose) {
                this._effectConfigurations[i].dispose();
            }
        }
    }
}
/**
 * @internal
 */
PrePassRenderer._SceneComponentInitialization = (_) => {
    throw _WarnImport("PrePassRendererSceneComponent");
};
PrePassRenderer._TextureFormats = [
    {
        type: 0,
        format: 2,
        name: "prePass_Irradiance",
    },
    {
        type: 1,
        format: 2,
        name: "prePass_Position",
    },
    {
        type: 2,
        format: 0,
        name: "prePass_Velocity",
    },
    {
        type: 3,
        format: 0,
        name: "prePass_Reflectivity",
    },
    {
        type: 4,
        format: 2,
        name: "prePass_Color",
    },
    {
        type: 5,
        format: 2,
        name: "prePass_Depth",
    },
    {
        type: 6,
        format: 2,
        name: "prePass_Normal",
    },
    {
        type: 7,
        format: 0,
        name: "prePass_Albedo",
    },
];
//# sourceMappingURL=prePassRenderer.js.map
import { backbufferColorTextureHandle, backbufferDepthStencilTextureHandle } from "../../frameGraphTypes.js";
import { FrameGraphTaskMultiRenderTarget } from "../../frameGraphTaskMultiRenderTarget.js";
import { ObjectRenderer } from "../../../Rendering/objectRenderer.js";

import { ThinDepthPeelingRenderer } from "../../../Rendering/thinDepthPeelingRenderer.pure.js";
import { FrameGraphRenderTarget } from "../../frameGraphRenderTarget.js";
/**
 * Task used to render objects to a texture.
 */
export class FrameGraphObjectRendererTask extends FrameGraphTaskMultiRenderTarget {
    /**
     * Gets or sets the camera used to render the objects.
     */
    get camera() {
        return this._camera;
    }
    set camera(camera) {
        this._camera = camera;
        this._renderer.activeCamera = this.camera;
    }
    /**
     * If image processing should be disabled (default is false).
     * false means that the default image processing configuration will be applied (the one from the scene)
     */
    get disableImageProcessing() {
        return this._disableImageProcessing;
    }
    set disableImageProcessing(value) {
        if (value === this._disableImageProcessing) {
            return;
        }
        this._disableImageProcessing = value;
        this._renderer.disableImageProcessing = value;
    }
    /**
     * Defines if meshes should be rendered (default is true).
     */
    get renderMeshes() {
        return this._renderMeshes;
    }
    set renderMeshes(value) {
        if (value === this._renderMeshes) {
            return;
        }
        this._renderMeshes = value;
        this._renderer.renderMeshes = value;
    }
    /**
     * Defines if depth only meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderDepthOnlyMeshes() {
        return this._renderDepthOnlyMeshes;
    }
    set renderDepthOnlyMeshes(value) {
        if (value === this._renderDepthOnlyMeshes) {
            return;
        }
        this._renderDepthOnlyMeshes = value;
        this._renderer.renderDepthOnlyMeshes = value;
    }
    /**
     * Defines if opaque meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderOpaqueMeshes() {
        return this._renderOpaqueMeshes;
    }
    set renderOpaqueMeshes(value) {
        if (value === this._renderOpaqueMeshes) {
            return;
        }
        this._renderOpaqueMeshes = value;
        this._renderer.renderOpaqueMeshes = value;
    }
    /**
     * Defines if alpha test meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderAlphaTestMeshes() {
        return this._renderAlphaTestMeshes;
    }
    set renderAlphaTestMeshes(value) {
        if (value === this._renderAlphaTestMeshes) {
            return;
        }
        this._renderAlphaTestMeshes = value;
        this._renderer.renderAlphaTestMeshes = value;
    }
    /**
     * Defines if transparent meshes should be rendered (default is true). Always subject to the renderMeshes property, though.
     */
    get renderTransparentMeshes() {
        return this._renderTransparentMeshes;
    }
    set renderTransparentMeshes(value) {
        if (value === this._renderTransparentMeshes) {
            return;
        }
        this._renderTransparentMeshes = value;
        this._renderer.renderTransparentMeshes = value;
    }
    /**
     * Defines if Order Independent Transparency should be used for transparent meshes (default is false).
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get useOITForTransparentMeshes() {
        return this._useOITForTransparentMeshes;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    set useOITForTransparentMeshes(value) {
        if (value === this._useOITForTransparentMeshes) {
            return;
        }
        this._useOITForTransparentMeshes = value;
        this._renderer.customRenderTransparentSubMeshes = this._useOITForTransparentMeshes
            ? (transparentSubMeshes, renderingGroup) => this._renderTransparentMeshesWithOIT(transparentSubMeshes, renderingGroup)
            : undefined;
        this._oitRenderer.blendOutput = value && this._rtForOrderIndependentTransparency ? this._rtForOrderIndependentTransparency.renderTargetWrapper : null;
    }
    /**
     * Defines the number of passes to use for Order Independent Transparency (default is 5).
     */
    get oitPassCount() {
        return this._oitRenderer.passCount;
    }
    set oitPassCount(value) {
        if (value === this._oitRenderer.passCount) {
            return;
        }
        this._oitRenderer.passCount = value;
    }
    /**
     * Defines if particles should be rendered (default is true).
     */
    get renderParticles() {
        return this._renderParticles;
    }
    set renderParticles(value) {
        if (value === this._renderParticles) {
            return;
        }
        this._renderParticles = value;
        this._renderer.renderParticles = value;
    }
    /**
     * Defines if sprites should be rendered (default is true).
     */
    get renderSprites() {
        return this._renderSprites;
    }
    set renderSprites(value) {
        if (value === this._renderSprites) {
            return;
        }
        this._renderSprites = value;
        this._renderer.renderSprites = value;
    }
    /**
     * Forces checking the layerMask property even if a custom list of meshes is provided (ie. if renderList is not undefined). Default is true.
     */
    get forceLayerMaskCheck() {
        return this._forceLayerMaskCheck;
    }
    set forceLayerMaskCheck(value) {
        if (value === this._forceLayerMaskCheck) {
            return;
        }
        this._forceLayerMaskCheck = value;
        this._renderer.forceLayerMaskCheck = value;
    }
    /**
     * Enables the rendering of bounding boxes for meshes (still subject to Mesh.showBoundingBox or scene.forceShowBoundingBoxes). Default is true.
     */
    get enableBoundingBoxRendering() {
        return this._enableBoundingBoxRendering;
    }
    set enableBoundingBoxRendering(value) {
        if (value === this._enableBoundingBoxRendering) {
            return;
        }
        this._enableBoundingBoxRendering = value;
        this._renderer.enableBoundingBoxRendering = value;
    }
    /**
     * Enables the rendering of outlines/overlays for meshes (still subject to Mesh.renderOutline/Mesh.renderOverlay). Default is true.
     */
    get enableOutlineRendering() {
        return this._enableOutlineRendering;
    }
    set enableOutlineRendering(value) {
        if (value === this._enableOutlineRendering) {
            return;
        }
        this._enableOutlineRendering = value;
        this._renderer.enableOutlineRendering = value;
    }
    /**
     * The object renderer used to render the objects.
     */
    get objectRenderer() {
        return this._renderer;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        if (this._renderer) {
            this._renderer.name = value;
        }
    }
    /**
     * Constructs a new object renderer task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param scene The scene the frame graph is associated with.
     * @param options The options of the object renderer.
     * @param existingObjectRenderer An existing object renderer to use (optional). If provided, the options parameter will be ignored.
     */
    constructor(name, frameGraph, scene, options, existingObjectRenderer) {
        super(name, frameGraph);
        /**
         * The shadow generators used to render the objects (optional).
         */
        this.shadowGenerators = [];
        /**
         * If depth testing should be enabled (default is true).
         */
        this.depthTest = true;
        /**
         * If depth writing should be enabled (default is true).
         */
        this.depthWrite = true;
        /**
         * If shadows should be disabled (default is false).
         */
        this.disableShadows = false;
        this._disableImageProcessing = false;
        /**
         * Sets this property to true if this task is the main object renderer of the frame graph.
         * It will help to locate the main object renderer in the frame graph when multiple object renderers are used.
         * This is useful for the inspector to know which object renderer to use for additional rendering features like wireframe rendering or frustum light debugging.
         * It is also used to determine the main camera used by the frame graph: this is the camera used by the main object renderer.
         */
        this.isMainObjectRenderer = false;
        this._renderMeshes = true;
        this._renderDepthOnlyMeshes = true;
        this._renderOpaqueMeshes = true;
        this._renderAlphaTestMeshes = true;
        this._renderTransparentMeshes = true;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this._useOITForTransparentMeshes = false;
        this._renderParticles = true;
        this._renderSprites = true;
        this._forceLayerMaskCheck = true;
        this._enableBoundingBoxRendering = true;
        this._enableOutlineRendering = true;
        /**
         * If true, targetTexture will be resolved at the end of the render pass, if this/these texture(s) is/are MSAA (default: true)
         */
        this.resolveMSAAColors = true;
        /**
         * If true, depthTexture will be resolved at the end of the render pass, if this texture is provided and is MSAA (default: false).
         */
        this.resolveMSAADepth = false;
        this._onBeforeRenderObservable = null;
        this._onAfterRenderObservable = null;
        this._externalObjectRenderer = false;
        this._scene = scene;
        this._engine = scene.getEngine();
        this._externalObjectRenderer = !!existingObjectRenderer;
        this._renderer = existingObjectRenderer ?? new ObjectRenderer(name, scene, options);
        this.name = name;
        this._renderer.disableImageProcessing = this._disableImageProcessing;
        this._renderer.renderParticles = this._renderParticles;
        this._renderer.renderSprites = this._renderSprites;
        this._renderer.enableBoundingBoxRendering = this._enableBoundingBoxRendering;
        this._renderer.forceLayerMaskCheck = this._forceLayerMaskCheck;
        if (!this._externalObjectRenderer) {
            this._renderer.onBeforeRenderingManagerRenderObservable.add(() => {
                if (!this._renderer.options.doNotChangeAspectRatio) {
                    scene.updateTransformMatrix(true);
                }
            });
        }
        this._oitRenderer = new ThinDepthPeelingRenderer(scene);
        this._oitRenderer.useRenderPasses = true;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.outputDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    isReady() {
        this._renderer.renderList = this.objectList.meshes;
        this._renderer.particleSystemList = this.objectList.particleSystems;
        return this._renderer.isReadyForRendering(this._textureWidth, this._textureHeight);
    }
    getClassName() {
        return "FrameGraphObjectRendererTask";
    }
    /**
     * Records the object renderer task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses = false, additionalExecute) {
        this._checkParameters();
        const targetTextures = this._getTargetHandles();
        const depthEnabled = this._checkTextureCompatibility(targetTextures);
        this._resolveDanglingHandles(targetTextures);
        this._setLightsForShadow();
        this._rtForOrderIndependentTransparency?.dispose();
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.setRenderTarget(targetTextures);
        pass.setRenderTargetDepth(this.depthTexture);
        pass.setInitializeFunc(() => {
            // Note: we don't use pass.frameGraphRenderTarget.renderTargetWrapper for OIT but recreate our own render target wrapper because this.targetTexture may not be the first one of the wrapper in the geometry renderer task case
            this._rtForOrderIndependentTransparency = new FrameGraphRenderTarget(this.name + "_oitRT", this._frameGraph.textureManager, this.targetTexture, this.depthTexture);
        });
        pass.setExecuteFunc((context) => {
            this._renderer.renderList = this.objectList.meshes;
            this._renderer.particleSystemList = this.objectList.particleSystems;
            this._updateLayerAndFaceIndices(pass);
            const renderTargetWrapper = pass.frameGraphRenderTarget.renderTargetWrapper;
            if (renderTargetWrapper) {
                renderTargetWrapper.resolveMSAAColors = this.resolveMSAAColors;
                renderTargetWrapper.resolveMSAADepth = this.resolveMSAADepth;
            }
            if (this._useOITForTransparentMeshes && this._oitRenderer.blendOutput !== this._rtForOrderIndependentTransparency.renderTargetWrapper) {
                this._oitRenderer.blendOutput = this._rtForOrderIndependentTransparency.renderTargetWrapper;
            }
            // The cast to "any" is to avoid an error in ES6 in case you don't import boundingBoxRenderer
            const boundingBoxRenderer = this.getBoundingBoxRenderer?.();
            const currentBoundingBoxMeshList = boundingBoxRenderer && boundingBoxRenderer.renderList.length > 0 ? boundingBoxRenderer.renderList.data.slice() : [];
            if (boundingBoxRenderer) {
                currentBoundingBoxMeshList.length = boundingBoxRenderer.renderList.length;
            }
            const attachments = this._prepareRendering(context, depthEnabled);
            const currentOITRenderer = this._scene._depthPeelingRenderer;
            this._scene._depthPeelingRenderer = this._oitRenderer;
            const camera = this._renderer.activeCamera;
            if (camera && camera.cameraRigMode !== 0 && !camera._renderingMultiview) {
                for (let index = 0; index < camera._rigCameras.length; index++) {
                    const rigCamera = camera._rigCameras[index];
                    rigCamera.rigParent = undefined; // for some reasons, ObjectRenderer uses the rigParent viewport if rigParent is defined (we want to use rigCamera.viewport instead)
                    this._renderer.activeCamera = rigCamera;
                    context.pushDebugGroup(`Render objects for camera rig ${index} "${rigCamera.name}"`);
                    context.bindRenderTarget(pass.frameGraphRenderTarget);
                    attachments && context.bindAttachments(attachments);
                    context.render(this._renderer, this._textureWidth, this._textureHeight, true);
                    context.popDebugGroup();
                    rigCamera.rigParent = camera;
                }
                this._renderer.activeCamera = camera;
            }
            else {
                context.pushDebugGroup(`Render objects for camera "${this._renderer.activeCamera?.name ?? "undefined"}"`);
                context.bindRenderTarget(pass.frameGraphRenderTarget);
                attachments && context.bindAttachments(attachments);
                context.render(this._renderer, this._textureWidth, this._textureHeight, true);
                context.popDebugGroup();
            }
            additionalExecute?.(context);
            this._scene._depthPeelingRenderer = currentOITRenderer;
            if (boundingBoxRenderer) {
                boundingBoxRenderer.renderList.data = currentBoundingBoxMeshList;
                boundingBoxRenderer.renderList.length = currentBoundingBoxMeshList.length;
            }
        });
        if (!skipCreationOfDisabledPasses) {
            const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
            passDisabled.setRenderTarget(targetTextures);
            passDisabled.setRenderTargetDepth(this.depthTexture);
            passDisabled.setExecuteFunc((_context) => { });
        }
        return pass;
    }
    dispose() {
        this._renderer.onBeforeRenderObservable.remove(this._onBeforeRenderObservable);
        this._renderer.onAfterRenderObservable.remove(this._onAfterRenderObservable);
        if (!this._externalObjectRenderer) {
            this._renderer.dispose();
        }
        this._oitRenderer.dispose();
        this._rtForOrderIndependentTransparency?.dispose();
        super.dispose();
    }
    _resolveDanglingHandles(targetTextures) {
        if (targetTextures.length > 0) {
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, targetTextures[0]);
        }
        if (this.depthTexture !== undefined) {
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputDepthTexture, this.depthTexture);
        }
    }
    _checkParameters() {
        if (this.targetTexture === undefined || this.objectList === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphObjectRendererTask ${this.name}: targetTexture, objectList, and camera are required`);
        }
    }
    _checkTextureCompatibility(targetTextures) {
        const className = this.getClassName();
        let outputTextureDescription = targetTextures.length > 0 ? this._frameGraph.textureManager.getTextureDescription(targetTextures[0]) : null;
        let depthEnabled = false;
        if (this.depthTexture !== undefined) {
            if (outputTextureDescription && this.depthTexture !== backbufferDepthStencilTextureHandle && targetTextures[0] === backbufferColorTextureHandle) {
                throw new Error(`${className} ${this.name}: the back buffer depth/stencil texture is the only depth texture allowed when the target is the back buffer color`);
            }
            const depthTextureDescription = this._frameGraph.textureManager.getTextureDescription(this.depthTexture);
            if (!outputTextureDescription) {
                outputTextureDescription = depthTextureDescription;
            }
            if (depthTextureDescription.options.samples !== outputTextureDescription.options.samples) {
                throw new Error(`${className} ${this.name}: the depth texture "${depthTextureDescription.options.labels?.[0] ?? "noname"}" (${depthTextureDescription.options.samples} samples) and the output texture "${outputTextureDescription.options.labels?.[0] ?? "noname"}" (${outputTextureDescription.options.samples} samples) must have the same number of samples`);
            }
            if (depthTextureDescription.size.width !== outputTextureDescription.size.width || depthTextureDescription.size.height !== outputTextureDescription.size.height) {
                throw new Error(`${className} ${this.name}: the depth texture (size: ${depthTextureDescription.size.width}x${depthTextureDescription.size.height}) and the target texture (size: ${outputTextureDescription.size.width}x${outputTextureDescription.size.height}) must have the same dimensions.`);
            }
            depthEnabled = true;
        }
        this._textureWidth = outputTextureDescription?.size.width ?? 1;
        this._textureHeight = outputTextureDescription?.size.height ?? 1;
        return depthEnabled;
    }
    _getTargetHandles() {
        return Array.isArray(this.targetTexture) ? this.targetTexture : [this.targetTexture];
    }
    _prepareRendering(context, depthEnabled) {
        context.setDepthStates(this.depthTest && depthEnabled, this.depthWrite && depthEnabled);
        return null;
    }
    _setLightsForShadow() {
        const lightsForShadow = new Set();
        const shadowEnabled = new Map();
        if (this.shadowGenerators) {
            for (const shadowGeneratorTask of this.shadowGenerators) {
                const shadowGenerator = shadowGeneratorTask.shadowGenerator;
                const light = shadowGenerator.getLight();
                if (light.isEnabled() && light.shadowEnabled) {
                    lightsForShadow.add(light);
                    if (shadowGeneratorTask.getClassName() === "FrameGraphCascadedShadowGeneratorTask") {
                        light._shadowGenerators.set(shadowGeneratorTask.camera, shadowGenerator);
                    }
                    else {
                        light._shadowGenerators.set(null, shadowGenerator);
                    }
                }
            }
        }
        this._renderer.onBeforeRenderObservable.remove(this._onBeforeRenderObservable);
        this._onBeforeRenderObservable = this._renderer.onBeforeRenderObservable.add(() => {
            for (let i = 0; i < this._scene.lights.length; i++) {
                const light = this._scene.lights[i];
                if (!light.setShadowProjectionMatrix) {
                    continue; // Ignore lights that cannot cast shadows
                }
                shadowEnabled.set(light, light.shadowEnabled);
                light.shadowEnabled = !this.disableShadows && lightsForShadow.has(light);
            }
        });
        this._renderer.onAfterRenderObservable.remove(this._onAfterRenderObservable);
        this._onAfterRenderObservable = this._renderer.onAfterRenderObservable.add(() => {
            for (let i = 0; i < this._scene.lights.length; i++) {
                const light = this._scene.lights[i];
                if (!light.setShadowProjectionMatrix) {
                    continue; // Ignore lights that cannot cast shadows
                }
                light.shadowEnabled = shadowEnabled.get(light);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _renderTransparentMeshesWithOIT(transparentSubMeshes, renderingGroup) {
        const saveOIT = this._scene._useOrderIndependentTransparency;
        this._scene._useOrderIndependentTransparency = true;
        const excludedMeshes = this._oitRenderer.render(transparentSubMeshes);
        if (excludedMeshes.length) {
            // Render leftover meshes that could not be processed by depth peeling
            renderingGroup._renderTransparent(excludedMeshes);
        }
        this._scene._useOrderIndependentTransparency = saveOIT;
    }
}
//# sourceMappingURL=objectRendererTask.js.map
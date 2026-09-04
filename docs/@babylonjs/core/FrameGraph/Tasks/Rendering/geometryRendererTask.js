import { Color4 } from "../../../Maths/math.color.pure.js";
import { MaterialHelperGeometryRendering } from "../../../Materials/materialHelper.geometryrendering.js";

import { FrameGraphObjectRendererTask } from "./objectRendererTask.js";
const ClearColors = [new Color4(0, 0, 0, 0), new Color4(1, 1, 1, 1), new Color4(0, 0, 0, 0)];
/**
 * Task used to render geometry to a set of textures.
 */
export class FrameGraphGeometryRendererTask extends FrameGraphObjectRendererTask {
    /**
     * Whether to reverse culling (default is false).
     */
    get reverseCulling() {
        return this._reverseCulling;
    }
    set reverseCulling(value) {
        this._reverseCulling = value;
        const configuration = MaterialHelperGeometryRendering.GetConfiguration(this._renderer.renderPassId);
        if (configuration) {
            configuration.reverseCulling = value;
        }
    }
    /**
     * Indicates whether the depth pre-pass is disabled (default is true).
     * Materials that require depth pre-pass (Material.needDepthPrePass == true) don't work with the geometry renderer, that's why this setting is true by default.
     * However, if the geometry renderer doesn't generate any geometry textures but only renders to the main target texture, then depth pre-pass can be enabled.
     */
    get disableDepthPrePass() {
        return this._disableDepthPrePass;
    }
    set disableDepthPrePass(value) {
        this._disableDepthPrePass = value;
        this._renderer.disableDepthPrePass = value;
    }
    /**
     * Gets or sets the name of the task.
     */
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
     * Constructs a new geometry renderer task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param scene The scene the frame graph is associated with.
     * @param options The options of the object renderer.
     * @param existingObjectRenderer An existing object renderer to use (optional). If provided, the options parameter will be ignored.
     */
    constructor(name, frameGraph, scene, options, existingObjectRenderer) {
        super(name, frameGraph, scene, options, existingObjectRenderer);
        /**
         * The size of the output textures (default is 100% of the back buffer texture size).
         */
        this.size = { width: 100, height: 100 };
        /**
         * Whether the size is a percentage of the back buffer size (default is true).
         */
        this.sizeIsPercentage = true;
        /**
         * The number of samples to use for the output textures (default is 1).
         */
        this.samples = 1;
        this._reverseCulling = false;
        /**
         * Indicates if a mesh shouldn't be rendered when its material has depth write disabled (default is true).
         */
        this.dontRenderWhenMaterialDepthWriteIsDisabled = true;
        this._disableDepthPrePass = true;
        /**
         * The list of texture descriptions used by the geometry renderer task.
         */
        this.textureDescriptions = [];
        this.renderSprites = false;
        this.renderParticles = false;
        this.enableBoundingBoxRendering = false;
        this.enableOutlineRendering = false;
        this._renderer.disableDepthPrePass = true;
        this._renderer.customIsReadyFunction = (mesh, refreshRate, preWarm) => {
            if (this.dontRenderWhenMaterialDepthWriteIsDisabled && mesh.material && mesh.material.disableDepthWrite) {
                return !!preWarm;
            }
            return mesh.isReady(refreshRate === 0);
        };
        this._renderer.onBeforeRenderingManagerRenderObservable.add(() => {
            if (!this._renderer.options.doNotChangeAspectRatio) {
                scene.updateTransformMatrix(true);
            }
        });
        this._clearAttachmentsLayout = new Map();
        this._allAttachmentsLayout = [];
        this.geometryIrradianceTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryViewDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryNormViewDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryScreenDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryViewNormalTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryWorldNormalTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryLocalPositionTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryWorldPositionTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryAlbedoTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryReflectivityTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryVelocityTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.geometryLinearVelocityTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    /**
     * Gets the list of excluded meshes from the velocity texture.
     */
    get excludedSkinnedMeshFromVelocityTexture() {
        return MaterialHelperGeometryRendering.GetConfiguration(this._renderer.renderPassId).excludedSkinnedMesh;
    }
    /**
     * Excludes the given skinned mesh from computing bones velocities.
     * Computing bones velocities can have a cost. The cost can be saved by calling this function and by passing the skinned mesh to ignore.
     * @param skinnedMesh The mesh containing the skeleton to ignore when computing the velocity map.
     */
    excludeSkinnedMeshFromVelocityTexture(skinnedMesh) {
        if (skinnedMesh.skeleton) {
            const list = this.excludedSkinnedMeshFromVelocityTexture;
            if (list.indexOf(skinnedMesh) === -1) {
                list.push(skinnedMesh);
            }
        }
    }
    /**
     * Removes the given skinned mesh from the excluded meshes to integrate bones velocities while rendering the velocity map.
     * @param skinnedMesh The mesh containing the skeleton that has been ignored previously.
     * @see excludeSkinnedMesh to exclude a skinned mesh from bones velocity computation.
     */
    removeExcludedSkinnedMeshFromVelocityTexture(skinnedMesh) {
        const list = this.excludedSkinnedMeshFromVelocityTexture;
        const index = list.indexOf(skinnedMesh);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
    getClassName() {
        return "FrameGraphGeometryRendererTask";
    }
    /**
     * Records the geometry renderer task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses = false, additionalExecute) {
        this._buildClearAttachmentsLayout();
        this._registerForRenderPassId(this._renderer.renderPassId);
        MaterialHelperGeometryRendering.MarkAsDirty(this._renderer.renderPassId, this.objectList.meshes || this._scene.meshes);
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute);
        const outputTextureHandles = pass.renderTarget;
        let needPreviousWorldMatrices = false;
        for (let i = 0; i < this.textureDescriptions.length; i++) {
            const description = this.textureDescriptions[i];
            const handle = outputTextureHandles[i];
            const index = MaterialHelperGeometryRendering.GeometryTextureDescriptions.findIndex((f) => f.type === description.type);
            const geometryDescription = MaterialHelperGeometryRendering.GeometryTextureDescriptions[index];
            switch (geometryDescription.type) {
                case 14:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryIrradianceTexture, handle);
                    break;
                case 5:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryViewDepthTexture, handle);
                    break;
                case 13:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryNormViewDepthTexture, handle);
                    break;
                case 10:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryScreenDepthTexture, handle);
                    break;
                case 6:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryViewNormalTexture, handle);
                    break;
                case 8:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryWorldNormalTexture, handle);
                    break;
                case 9:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryLocalPositionTexture, handle);
                    break;
                case 1:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryWorldPositionTexture, handle);
                    break;
                case 12:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryAlbedoTexture, handle);
                    break;
                case 3:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryReflectivityTexture, handle);
                    break;
                case 2:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryVelocityTexture, handle);
                    needPreviousWorldMatrices = true;
                    break;
                case 11:
                    this._frameGraph.textureManager.resolveDanglingHandle(this.geometryLinearVelocityTexture, handle);
                    needPreviousWorldMatrices = true;
                    break;
            }
        }
        this._scene.needsPreviousWorldMatrices = needPreviousWorldMatrices;
        return pass;
    }
    dispose() {
        MaterialHelperGeometryRendering.DeleteConfiguration(this._renderer.renderPassId);
        this._renderer.dispose();
        super.dispose();
    }
    _resolveDanglingHandles(_targetTextures) {
        if (this.targetTexture !== undefined) {
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, Array.isArray(this.targetTexture) ? this.targetTexture[0] : this.targetTexture);
        }
        if (this.depthTexture !== undefined) {
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputDepthTexture, this.depthTexture);
        }
    }
    _checkParameters() {
        if (this.objectList === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphGeometryRendererTask ${this.name}: object list and camera must be provided`);
        }
    }
    _checkTextureCompatibility(targetTextures) {
        let depthEnabled = false;
        let dimensions = null;
        if (this.targetTexture !== undefined) {
            const outputTextureDescription = this._frameGraph.textureManager.getTextureDescription(Array.isArray(this.targetTexture) ? this.targetTexture[0] : this.targetTexture);
            if (this.samples !== outputTextureDescription.options.samples) {
                throw new Error(`FrameGraphGeometryRendererTask ${this.name}: the target texture and the output geometry textures  must have the same number of samples`);
            }
            dimensions = outputTextureDescription.size;
        }
        if (this.depthTexture !== undefined) {
            const depthTextureDescription = this._frameGraph.textureManager.getTextureDescription(this.depthTexture);
            if (depthTextureDescription.options.samples !== this.samples && this.textureDescriptions.length > 0) {
                throw new Error(`FrameGraphGeometryRendererTask ${this.name}: the depth texture and the output geometry textures must have the same number of samples`);
            }
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputDepthTexture, this.depthTexture);
            depthEnabled = true;
            dimensions = depthTextureDescription.size;
        }
        const geomTextureDimensions = this.sizeIsPercentage ? this._frameGraph.textureManager.getAbsoluteDimensions(this.size) : this.size;
        if (dimensions !== null) {
            if (geomTextureDimensions.width !== dimensions.width || geomTextureDimensions.height !== dimensions.height) {
                throw new Error(`FrameGraphGeometryRendererTask ${this.name}: the geometry textures (size: ${geomTextureDimensions.width}x${geomTextureDimensions.height}) and the target/depth texture (size: ${dimensions.width}x${dimensions.height}) must have the same dimensions.`);
            }
        }
        depthEnabled = depthEnabled || super._checkTextureCompatibility(targetTextures);
        return depthEnabled;
    }
    _getTargetHandles() {
        const types = [];
        const formats = [];
        const labels = [];
        const useSRGBBuffers = [];
        for (let i = 0; i < this.textureDescriptions.length; i++) {
            const description = this.textureDescriptions[i];
            const index = MaterialHelperGeometryRendering.GeometryTextureDescriptions.findIndex((f) => f.type === description.type);
            if (index === -1) {
                throw new Error(`FrameGraphGeometryRendererTask ${this.name}: unknown texture type ${description.type}`);
            }
            types[i] = description.textureType;
            formats[i] = description.textureFormat;
            labels[i] = MaterialHelperGeometryRendering.GeometryTextureDescriptions[index].name;
            useSRGBBuffers[i] = false;
        }
        const handles = [];
        if (this.textureDescriptions.length > 0) {
            const baseHandle = this._frameGraph.textureManager.createRenderTargetTexture(this.name, {
                size: this.size,
                sizeIsPercentage: this.sizeIsPercentage,
                options: {
                    createMipMaps: false,
                    samples: this.samples,
                    types,
                    formats,
                    useSRGBBuffers,
                    labels,
                },
            });
            for (let i = 0; i < this.textureDescriptions.length; i++) {
                handles.push(baseHandle + i);
            }
        }
        if (this.targetTexture !== undefined) {
            if (Array.isArray(this.targetTexture)) {
                handles.push(...this.targetTexture);
            }
            else {
                handles.push(this.targetTexture);
            }
        }
        return handles;
    }
    _prepareRendering(context, depthEnabled) {
        context.setDepthStates(this.depthTest && depthEnabled, this.depthWrite && depthEnabled);
        context.pushDebugGroup(`Clear attachments`);
        this._clearAttachmentsLayout.forEach((layout, clearType) => {
            context.clearColorAttachments(ClearColors[clearType], layout);
        });
        context.restoreDefaultFramebuffer();
        context.popDebugGroup();
        return this._allAttachmentsLayout;
    }
    _buildClearAttachmentsLayout() {
        const clearAttachmentsLayout = new Map();
        const allAttachmentsLayout = [];
        for (let i = 0; i < this.textureDescriptions.length; i++) {
            const description = this.textureDescriptions[i];
            const index = MaterialHelperGeometryRendering.GeometryTextureDescriptions.findIndex((f) => f.type === description.type);
            const geometryDescription = MaterialHelperGeometryRendering.GeometryTextureDescriptions[index];
            const clearType = geometryDescription.type === 10 && this._engine.useReverseDepthBuffer
                ? 0 /* GeometryRenderingTextureClearType.Zero */
                : geometryDescription.clearType;
            let layout = clearAttachmentsLayout.get(clearType);
            if (layout === undefined) {
                layout = [];
                clearAttachmentsLayout.set(clearType, layout);
                for (let j = 0; j < i; j++) {
                    layout[j] = false;
                }
            }
            clearAttachmentsLayout.forEach((layout, layoutClearType) => {
                layout.push(layoutClearType === clearType);
            });
            allAttachmentsLayout.push(true);
        }
        if (this.targetTexture !== undefined) {
            // We don't clear the target texture, but we need to add a layout for it in clearAttachmentsLayout to be able to use clearColorAttachments with the correct number of attachments in _prepareRendering.
            // We also need to add a value in allAttachmentsLayout for the target texture.
            let layout = clearAttachmentsLayout.get(0 /* GeometryRenderingTextureClearType.Zero */);
            if (layout === undefined) {
                layout = [];
                clearAttachmentsLayout.set(0 /* GeometryRenderingTextureClearType.Zero */, layout);
                for (let j = 0; j < this.textureDescriptions.length - 1; j++) {
                    layout[j] = false;
                }
            }
            clearAttachmentsLayout.forEach((layout) => {
                layout.push(false);
            });
            allAttachmentsLayout.push(true);
        }
        this._clearAttachmentsLayout = new Map();
        clearAttachmentsLayout.forEach((layout, clearType) => {
            this._clearAttachmentsLayout.set(clearType, this._engine.buildTextureLayout(layout));
        });
        this._allAttachmentsLayout = this._engine.buildTextureLayout(allAttachmentsLayout);
    }
    _registerForRenderPassId(renderPassId) {
        const configuration = MaterialHelperGeometryRendering.CreateConfiguration(renderPassId);
        for (let i = 0; i < this.textureDescriptions.length; i++) {
            const description = this.textureDescriptions[i];
            const index = MaterialHelperGeometryRendering.GeometryTextureDescriptions.findIndex((f) => f.type === description.type);
            const geometryDescription = MaterialHelperGeometryRendering.GeometryTextureDescriptions[index];
            configuration.defines[geometryDescription.defineIndex] = i;
        }
        if (this.targetTexture !== undefined) {
            configuration.defines["PREPASS_COLOR_INDEX"] = this.textureDescriptions.length;
        }
        configuration.reverseCulling = this.reverseCulling;
    }
}
//# sourceMappingURL=geometryRendererTask.js.map
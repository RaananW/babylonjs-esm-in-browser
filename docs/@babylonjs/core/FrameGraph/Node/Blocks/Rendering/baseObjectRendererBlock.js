import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphConnectionPoint } from "../../nodeRenderGraphBlockConnectionPoint.js";
import { NodeRenderGraphConnectionPointCustomObject } from "../../nodeRenderGraphConnectionPointCustomObject.js";
import { FrameGraphObjectRendererTask } from "../../../Tasks/Rendering/objectRendererTask.js";
/**
 * @internal
 */
let NodeRenderGraphBaseObjectRendererBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_isMainObjectRenderer_decorators;
    let _get_depthTest_decorators;
    let _get_depthWrite_decorators;
    let _get_renderMeshes_decorators;
    let _get_renderDepthOnlyMeshes_decorators;
    let _get_renderOpaqueMeshes_decorators;
    let _get_renderAlphaTestMeshes_decorators;
    let _get_renderTransparentMeshes_decorators;
    let _get_useOITForTransparentMeshes_decorators;
    let _get_oitPassCount_decorators;
    let _get_renderParticles_decorators;
    let _get_renderSprites_decorators;
    let _get_forceLayerMaskCheck_decorators;
    let _get_enableBoundingBoxRendering_decorators;
    let _get_enableOutlineRendering_decorators;
    let _get_disableShadows_decorators;
    let _get_renderInLinearSpace_decorators;
    let _get_doNotChangeAspectRatio_decorators;
    let _get_enableClusteredLights_decorators;
    let _get_resolveMSAAColors_decorators;
    let _get_resolveMSAADepth_decorators;
    return _a = class NodeRenderGraphBaseObjectRendererBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphBaseObjectRendererBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param doNotChangeAspectRatio True (default) to not change the aspect ratio of the scene in the RTT
             * @param enableClusteredLights True (default) to enable clustered lights
             */
            constructor(name, frameGraph, scene, doNotChangeAspectRatio = true, enableClusteredLights = true) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [doNotChangeAspectRatio, enableClusteredLights];
                this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this.registerInput("objects", NodeRenderGraphBlockConnectionPointTypes.ObjectList);
                this._addDependenciesInput();
                this.registerInput("shadowGenerators", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.registerOutput("outputDepth", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
                this.registerOutput("objectRenderer", NodeRenderGraphBlockConnectionPointTypes.Object, new NodeRenderGraphConnectionPointCustomObject("objectRenderer", this, 1 /* NodeRenderGraphConnectionPointDirection.Output */, _a, "NodeRenderGraphBaseObjectRendererBlock"));
                this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBufferDepthStencil | NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
                this.depth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureDepthStencilAttachment | NodeRenderGraphBlockConnectionPointTypes.TextureBackBufferDepthStencilAttachment);
                this.shadowGenerators.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator | NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
                this.output._typeConnectionSource = this.target;
                this.outputDepth._typeConnectionSource = this.depth;
                this._createFrameGraphObject();
            }
            _createFrameGraphObject() {
                this._frameGraphTask?.dispose();
                this._frameGraphTask = new FrameGraphObjectRendererTask(this.name, this._frameGraph, this._scene, {
                    doNotChangeAspectRatio: this._additionalConstructionParameters[0],
                    enableClusteredLights: this._additionalConstructionParameters[1],
                });
            }
            _saveState(state) {
                state.disabled = this._frameGraphTask.disabled;
                state.isMainObjectRenderer = this.isMainObjectRenderer;
                state.depthTest = this.depthTest;
                state.depthWrite = this.depthWrite;
                state.disableShadows = this.disableShadows;
                state.renderInLinearSpace = this.renderInLinearSpace;
                state.renderMeshes = this.renderMeshes;
                state.renderDepthOnlyMeshes = this.renderDepthOnlyMeshes;
                state.renderOpaqueMeshes = this.renderOpaqueMeshes;
                state.renderAlphaTestMeshes = this.renderAlphaTestMeshes;
                state.renderTransparentMeshes = this.renderTransparentMeshes;
                state.useOITForTransparentMeshes = this.useOITForTransparentMeshes;
                state.renderParticles = this.renderParticles;
                state.renderSprites = this.renderSprites;
                state.forceLayerMaskCheck = this.forceLayerMaskCheck;
                state.enableBoundingBoxRendering = this.enableBoundingBoxRendering;
                state.enableOutlineRendering = this.enableOutlineRendering;
            }
            _restoreState(state) {
                this._frameGraphTask.disabled = state.disabled;
                this.isMainObjectRenderer = state.isMainObjectRenderer;
                this.depthTest = state.depthTest;
                this.depthWrite = state.depthWrite;
                this.disableShadows = state.disableShadows;
                this.renderInLinearSpace = state.renderInLinearSpace;
                this.renderMeshes = state.renderMeshes;
                this.renderDepthOnlyMeshes = state.renderDepthOnlyMeshes;
                this.renderOpaqueMeshes = state.renderOpaqueMeshes;
                this.renderAlphaTestMeshes = state.renderAlphaTestMeshes;
                this.renderTransparentMeshes = state.renderTransparentMeshes;
                this.useOITForTransparentMeshes = state.useOITForTransparentMeshes;
                this.renderParticles = state.renderParticles;
                this.renderSprites = state.renderSprites;
                this.forceLayerMaskCheck = state.forceLayerMaskCheck;
                this.enableBoundingBoxRendering = state.enableBoundingBoxRendering;
                this.enableOutlineRendering = state.enableOutlineRendering;
            }
            _createFrameGraphObjectWithState(doNotChangeAspectRatio, enableClusteredLights) {
                const state = {};
                this._saveState(state);
                this._additionalConstructionParameters = [doNotChangeAspectRatio, enableClusteredLights];
                this._createFrameGraphObject();
                this._restoreState(state);
            }
            /** Indicates that this object renderer is the main object renderer of the frame graph. */
            get isMainObjectRenderer() {
                return this._frameGraphTask.isMainObjectRenderer;
            }
            set isMainObjectRenderer(value) {
                this._frameGraphTask.isMainObjectRenderer = value;
            }
            /** Indicates if depth testing must be enabled or disabled */
            get depthTest() {
                return this._frameGraphTask.depthTest;
            }
            set depthTest(value) {
                this._frameGraphTask.depthTest = value;
            }
            /** Indicates if depth writing must be enabled or disabled */
            get depthWrite() {
                return this._frameGraphTask.depthWrite;
            }
            set depthWrite(value) {
                this._frameGraphTask.depthWrite = value;
            }
            /** Indicates if meshes should be rendered */
            get renderMeshes() {
                return this._frameGraphTask.renderMeshes;
            }
            set renderMeshes(value) {
                this._frameGraphTask.renderMeshes = value;
            }
            /** Indicates if depth-only meshes should be rendered */
            get renderDepthOnlyMeshes() {
                return this._frameGraphTask.renderDepthOnlyMeshes;
            }
            set renderDepthOnlyMeshes(value) {
                this._frameGraphTask.renderDepthOnlyMeshes = value;
            }
            /** Indicates if opaque meshes should be rendered */
            get renderOpaqueMeshes() {
                return this._frameGraphTask.renderOpaqueMeshes;
            }
            set renderOpaqueMeshes(value) {
                this._frameGraphTask.renderOpaqueMeshes = value;
            }
            /** Indicates if alpha tested meshes should be rendered */
            get renderAlphaTestMeshes() {
                return this._frameGraphTask.renderAlphaTestMeshes;
            }
            set renderAlphaTestMeshes(value) {
                this._frameGraphTask.renderAlphaTestMeshes = value;
            }
            /** Indicates if transparent meshes should be rendered */
            get renderTransparentMeshes() {
                return this._frameGraphTask.renderTransparentMeshes;
            }
            set renderTransparentMeshes(value) {
                this._frameGraphTask.renderTransparentMeshes = value;
            }
            /** Indicates if use of Order Independent Transparency (OIT) for transparent meshes should be enabled */
            get useOITForTransparentMeshes() {
                return this._frameGraphTask.useOITForTransparentMeshes;
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            set useOITForTransparentMeshes(value) {
                this._frameGraphTask.useOITForTransparentMeshes = value;
            }
            /** Defines the number of passes to use for Order Independent Transparency */
            get oitPassCount() {
                return this._frameGraphTask.oitPassCount;
            }
            set oitPassCount(value) {
                this._frameGraphTask.oitPassCount = value;
            }
            /** Indicates if particles should be rendered */
            get renderParticles() {
                return this._frameGraphTask.renderParticles;
            }
            set renderParticles(value) {
                this._frameGraphTask.renderParticles = value;
            }
            /** Indicates if sprites should be rendered */
            get renderSprites() {
                return this._frameGraphTask.renderSprites;
            }
            set renderSprites(value) {
                this._frameGraphTask.renderSprites = value;
            }
            /** Indicates if layer mask check must be forced */
            get forceLayerMaskCheck() {
                return this._frameGraphTask.forceLayerMaskCheck;
            }
            set forceLayerMaskCheck(value) {
                this._frameGraphTask.forceLayerMaskCheck = value;
            }
            /** Indicates if bounding boxes should be rendered */
            get enableBoundingBoxRendering() {
                return this._frameGraphTask.enableBoundingBoxRendering;
            }
            set enableBoundingBoxRendering(value) {
                this._frameGraphTask.enableBoundingBoxRendering = value;
            }
            /** Indicates if outlines/overlays should be rendered */
            get enableOutlineRendering() {
                return this._frameGraphTask.enableOutlineRendering;
            }
            set enableOutlineRendering(value) {
                this._frameGraphTask.enableOutlineRendering = value;
            }
            /** Indicates if shadows must be enabled or disabled */
            get disableShadows() {
                return this._frameGraphTask.disableShadows;
            }
            set disableShadows(value) {
                this._frameGraphTask.disableShadows = value;
            }
            /** If image processing should be disabled */
            get renderInLinearSpace() {
                return this._frameGraphTask.disableImageProcessing;
            }
            set renderInLinearSpace(value) {
                this._frameGraphTask.disableImageProcessing = value;
            }
            /** True (default) to not change the aspect ratio of the scene in the RTT */
            get doNotChangeAspectRatio() {
                return this._frameGraphTask.objectRenderer.options.doNotChangeAspectRatio;
            }
            set doNotChangeAspectRatio(value) {
                this._createFrameGraphObjectWithState(value, this.enableClusteredLights);
            }
            /** True (default) to enable clustered lights */
            get enableClusteredLights() {
                return this._frameGraphTask.objectRenderer.options.enableClusteredLights;
            }
            set enableClusteredLights(value) {
                this._createFrameGraphObjectWithState(this.doNotChangeAspectRatio, value);
            }
            /** If true, MSAA color textures will be resolved at the end of the render pass (default: true) */
            get resolveMSAAColors() {
                return this._frameGraphTask.resolveMSAAColors;
            }
            set resolveMSAAColors(value) {
                this._frameGraphTask.resolveMSAAColors = value;
            }
            /** If true, MSAA depth texture will be resolved at the end of the render pass (default: false) */
            get resolveMSAADepth() {
                return this._frameGraphTask.resolveMSAADepth;
            }
            set resolveMSAADepth(value) {
                this._frameGraphTask.resolveMSAADepth = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphBaseObjectRendererBlock";
            }
            /**
             * Gets the target texture input component
             */
            get target() {
                return this._inputs[0];
            }
            /**
             * Gets the depth texture input component
             */
            get depth() {
                return this._inputs[1];
            }
            /**
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[2];
            }
            /**
             * Gets the objects input component
             */
            get objects() {
                return this._inputs[3];
            }
            /**
             * Gets the dependencies input component
             */
            get dependencies() {
                return this._inputs[4];
            }
            /**
             * Gets the shadowGenerators input component
             */
            get shadowGenerators() {
                return this._inputs[5];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the output depth component
             */
            get outputDepth() {
                return this._outputs[1];
            }
            /**
             * Gets the objectRenderer component
             */
            get objectRenderer() {
                return this._outputs[2];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputTexture; // the value of the output connection point is the "output" texture of the task
                this.outputDepth.value = this._frameGraphTask.outputDepthTexture; // the value of the outputDepth connection point is the "outputDepth" texture of the task
                this.objectRenderer.value = this._frameGraphTask; // the value of the objectRenderer connection point is the task itself
                this._frameGraphTask.targetTexture = this._getConnectedTextures(this.target.connectedPoint); // Geometry renderer allows undefined for targetTexture
                this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
                this._frameGraphTask.objectList = this.objects.connectedPoint?.value;
                this._frameGraphTask.shadowGenerators = [];
                const shadowGeneratorsConnectedPoint = this.shadowGenerators.connectedPoint;
                if (shadowGeneratorsConnectedPoint) {
                    if (shadowGeneratorsConnectedPoint.type === NodeRenderGraphBlockConnectionPointTypes.ResourceContainer) {
                        const container = shadowGeneratorsConnectedPoint.ownerBlock;
                        for (const input of container.inputs) {
                            if (input.connectedPoint && input.connectedPoint.value !== undefined && NodeRenderGraphConnectionPoint.IsShadowGenerator(input.connectedPoint.value)) {
                                this._frameGraphTask.shadowGenerators.push(input.connectedPoint.value);
                            }
                        }
                    }
                    else if (NodeRenderGraphConnectionPoint.IsShadowGenerator(shadowGeneratorsConnectedPoint.value)) {
                        this._frameGraphTask.shadowGenerators[0] = shadowGeneratorsConnectedPoint.value;
                    }
                }
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.isMainObjectRenderer = ${this.isMainObjectRenderer};`);
                codes.push(`${this._codeVariableName}.depthTest = ${this.depthTest};`);
                codes.push(`${this._codeVariableName}.depthWrite = ${this.depthWrite};`);
                codes.push(`${this._codeVariableName}.renderMeshes = ${this.renderMeshes};`);
                codes.push(`${this._codeVariableName}.renderDepthOnlyMeshes = ${this.renderDepthOnlyMeshes};`);
                codes.push(`${this._codeVariableName}.renderOpaqueMeshes = ${this.renderOpaqueMeshes};`);
                codes.push(`${this._codeVariableName}.renderAlphaTestMeshes = ${this.renderAlphaTestMeshes};`);
                codes.push(`${this._codeVariableName}.renderTransparentMeshes = ${this.renderTransparentMeshes};`);
                codes.push(`${this._codeVariableName}.useOITForTransparentMeshes = ${this.useOITForTransparentMeshes};`);
                codes.push(`${this._codeVariableName}.oitPassCount = ${this.oitPassCount};`);
                codes.push(`${this._codeVariableName}.renderParticles = ${this.renderParticles};`);
                codes.push(`${this._codeVariableName}.renderSprites = ${this.renderSprites};`);
                codes.push(`${this._codeVariableName}.forceLayerMaskCheck = ${this.forceLayerMaskCheck};`);
                codes.push(`${this._codeVariableName}.enableBoundingBoxRendering = ${this.enableBoundingBoxRendering};`);
                codes.push(`${this._codeVariableName}.enableOutlineRendering = ${this.enableOutlineRendering};`);
                codes.push(`${this._codeVariableName}.disableShadows = ${this.disableShadows};`);
                codes.push(`${this._codeVariableName}.renderInLinearSpace = ${this.renderInLinearSpace};`);
                codes.push(`${this._codeVariableName}.resolveMSAAColors = ${this.resolveMSAAColors};`);
                codes.push(`${this._codeVariableName}.resolveMSAADepth = ${this.resolveMSAADepth};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.isMainObjectRenderer = this.isMainObjectRenderer;
                serializationObject.depthTest = this.depthTest;
                serializationObject.depthWrite = this.depthWrite;
                serializationObject.renderMeshes = this.renderMeshes;
                serializationObject.renderDepthOnlyMeshes = this.renderDepthOnlyMeshes;
                serializationObject.renderOpaqueMeshes = this.renderOpaqueMeshes;
                serializationObject.renderAlphaTestMeshes = this.renderAlphaTestMeshes;
                serializationObject.renderTransparentMeshes = this.renderTransparentMeshes;
                serializationObject.useOITForTransparentMeshes = this.useOITForTransparentMeshes;
                serializationObject.oitPassCount = this.oitPassCount;
                serializationObject.renderParticles = this.renderParticles;
                serializationObject.renderSprites = this.renderSprites;
                serializationObject.forceLayerMaskCheck = this.forceLayerMaskCheck;
                serializationObject.enableBoundingBoxRendering = this.enableBoundingBoxRendering;
                serializationObject.enableOutlineRendering = this.enableOutlineRendering;
                serializationObject.disableShadows = this.disableShadows;
                serializationObject.renderInLinearSpace = this.renderInLinearSpace;
                serializationObject.resolveMSAAColors = this.resolveMSAAColors;
                serializationObject.resolveMSAADepth = this.resolveMSAADepth;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.isMainObjectRenderer = !!serializationObject.isMainObjectRenderer;
                this.depthTest = serializationObject.depthTest;
                this.depthWrite = serializationObject.depthWrite;
                this.renderMeshes = serializationObject.renderMeshes ?? true;
                this.renderDepthOnlyMeshes = serializationObject.renderDepthOnlyMeshes ?? true;
                this.renderOpaqueMeshes = serializationObject.renderOpaqueMeshes ?? true;
                this.renderAlphaTestMeshes = serializationObject.renderAlphaTestMeshes ?? true;
                this.renderTransparentMeshes = serializationObject.renderTransparentMeshes ?? true;
                this.useOITForTransparentMeshes = serializationObject.useOITForTransparentMeshes ?? false;
                this.oitPassCount = serializationObject.oitPassCount ?? 5;
                this.renderParticles = serializationObject.renderParticles ?? true;
                this.renderSprites = serializationObject.renderSprites ?? true;
                this.forceLayerMaskCheck = serializationObject.forceLayerMaskCheck ?? true;
                this.enableBoundingBoxRendering = serializationObject.enableBoundingBoxRendering ?? true;
                this.enableOutlineRendering = serializationObject.enableOutlineRendering ?? true;
                this.disableShadows = serializationObject.disableShadows;
                this.renderInLinearSpace = !!serializationObject.renderInLinearSpace;
                this.resolveMSAAColors = serializationObject.resolveMSAAColors ?? true;
                this.resolveMSAADepth = serializationObject.resolveMSAADepth ?? false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_isMainObjectRenderer_decorators = [editableInPropertyPage("Is main object renderer", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_depthTest_decorators = [editableInPropertyPage("Depth test", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_depthWrite_decorators = [editableInPropertyPage("Depth write", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_renderMeshes_decorators = [editableInPropertyPage("Render meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_renderDepthOnlyMeshes_decorators = [editableInPropertyPage("    Render depth-only meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_renderOpaqueMeshes_decorators = [editableInPropertyPage("    Render opaque meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_renderAlphaTestMeshes_decorators = [editableInPropertyPage("    Render alpha test meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_renderTransparentMeshes_decorators = [editableInPropertyPage("    Render transparent meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_useOITForTransparentMeshes_decorators = [editableInPropertyPage("        Use OIT for transparent meshes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_oitPassCount_decorators = [editableInPropertyPage("            Pass count", 2 /* PropertyTypeForEdition.Int */, "RENDERING", { min: 1, max: 20 })];
            _get_renderParticles_decorators = [editableInPropertyPage("Render particles", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_renderSprites_decorators = [editableInPropertyPage("Render sprites", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_forceLayerMaskCheck_decorators = [editableInPropertyPage("Force layer mask check", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_enableBoundingBoxRendering_decorators = [editableInPropertyPage("Render bounding boxes", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_enableOutlineRendering_decorators = [editableInPropertyPage("Render outlines/overlays", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING")];
            _get_disableShadows_decorators = [editableInPropertyPage("Disable shadows", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_renderInLinearSpace_decorators = [editableInPropertyPage("Disable image processing", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_doNotChangeAspectRatio_decorators = [editableInPropertyPage("Do not change aspect ratio", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_enableClusteredLights_decorators = [editableInPropertyPage("Enable clustered lights", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_resolveMSAAColors_decorators = [editableInPropertyPage("Resolve MSAA colors", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            _get_resolveMSAADepth_decorators = [editableInPropertyPage("Resolve MSAA depth", 0 /* PropertyTypeForEdition.Boolean */, "GENERAL")];
            __esDecorate(_a, null, _get_isMainObjectRenderer_decorators, { kind: "getter", name: "isMainObjectRenderer", static: false, private: false, access: { has: obj => "isMainObjectRenderer" in obj, get: obj => obj.isMainObjectRenderer }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_depthTest_decorators, { kind: "getter", name: "depthTest", static: false, private: false, access: { has: obj => "depthTest" in obj, get: obj => obj.depthTest }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_depthWrite_decorators, { kind: "getter", name: "depthWrite", static: false, private: false, access: { has: obj => "depthWrite" in obj, get: obj => obj.depthWrite }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderMeshes_decorators, { kind: "getter", name: "renderMeshes", static: false, private: false, access: { has: obj => "renderMeshes" in obj, get: obj => obj.renderMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderDepthOnlyMeshes_decorators, { kind: "getter", name: "renderDepthOnlyMeshes", static: false, private: false, access: { has: obj => "renderDepthOnlyMeshes" in obj, get: obj => obj.renderDepthOnlyMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderOpaqueMeshes_decorators, { kind: "getter", name: "renderOpaqueMeshes", static: false, private: false, access: { has: obj => "renderOpaqueMeshes" in obj, get: obj => obj.renderOpaqueMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderAlphaTestMeshes_decorators, { kind: "getter", name: "renderAlphaTestMeshes", static: false, private: false, access: { has: obj => "renderAlphaTestMeshes" in obj, get: obj => obj.renderAlphaTestMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderTransparentMeshes_decorators, { kind: "getter", name: "renderTransparentMeshes", static: false, private: false, access: { has: obj => "renderTransparentMeshes" in obj, get: obj => obj.renderTransparentMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useOITForTransparentMeshes_decorators, { kind: "getter", name: "useOITForTransparentMeshes", static: false, private: false, access: { has: obj => "useOITForTransparentMeshes" in obj, get: obj => obj.useOITForTransparentMeshes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_oitPassCount_decorators, { kind: "getter", name: "oitPassCount", static: false, private: false, access: { has: obj => "oitPassCount" in obj, get: obj => obj.oitPassCount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderParticles_decorators, { kind: "getter", name: "renderParticles", static: false, private: false, access: { has: obj => "renderParticles" in obj, get: obj => obj.renderParticles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderSprites_decorators, { kind: "getter", name: "renderSprites", static: false, private: false, access: { has: obj => "renderSprites" in obj, get: obj => obj.renderSprites }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_forceLayerMaskCheck_decorators, { kind: "getter", name: "forceLayerMaskCheck", static: false, private: false, access: { has: obj => "forceLayerMaskCheck" in obj, get: obj => obj.forceLayerMaskCheck }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableBoundingBoxRendering_decorators, { kind: "getter", name: "enableBoundingBoxRendering", static: false, private: false, access: { has: obj => "enableBoundingBoxRendering" in obj, get: obj => obj.enableBoundingBoxRendering }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableOutlineRendering_decorators, { kind: "getter", name: "enableOutlineRendering", static: false, private: false, access: { has: obj => "enableOutlineRendering" in obj, get: obj => obj.enableOutlineRendering }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_disableShadows_decorators, { kind: "getter", name: "disableShadows", static: false, private: false, access: { has: obj => "disableShadows" in obj, get: obj => obj.disableShadows }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_renderInLinearSpace_decorators, { kind: "getter", name: "renderInLinearSpace", static: false, private: false, access: { has: obj => "renderInLinearSpace" in obj, get: obj => obj.renderInLinearSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_doNotChangeAspectRatio_decorators, { kind: "getter", name: "doNotChangeAspectRatio", static: false, private: false, access: { has: obj => "doNotChangeAspectRatio" in obj, get: obj => obj.doNotChangeAspectRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableClusteredLights_decorators, { kind: "getter", name: "enableClusteredLights", static: false, private: false, access: { has: obj => "enableClusteredLights" in obj, get: obj => obj.enableClusteredLights }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_resolveMSAAColors_decorators, { kind: "getter", name: "resolveMSAAColors", static: false, private: false, access: { has: obj => "resolveMSAAColors" in obj, get: obj => obj.resolveMSAAColors }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_resolveMSAADepth_decorators, { kind: "getter", name: "resolveMSAADepth", static: false, private: false, access: { has: obj => "resolveMSAADepth" in obj, get: obj => obj.resolveMSAADepth }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphBaseObjectRendererBlock };
//# sourceMappingURL=baseObjectRendererBlock.js.map
/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphIblShadowsRendererTask } from "../../../Tasks/Rendering/iblShadowsRendererTask.pure.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements IBL (image-based lighting) shadows using voxel tracing.
 */
let NodeRenderGraphIblShadowsRendererBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBlock;
    let _instanceExtraInitializers = [];
    let _get_sampleDirections_decorators;
    let _get_coloredShadows_decorators;
    let _get_voxelShadowOpacity_decorators;
    let _get_ssShadowOpacity_decorators;
    let _get_ssShadowSampleCount_decorators;
    let _get_ssShadowStride_decorators;
    let _get_ssShadowDistanceScale_decorators;
    let _get_ssShadowThicknessScale_decorators;
    let _get_voxelNormalBias_decorators;
    let _get_voxelDirectionBias_decorators;
    let _get_envRotation_decorators;
    let _get_shadowRemanence_decorators;
    let _get_shadowOpacity_decorators;
    let _get_resolutionExp_decorators;
    let _get_refreshRate_decorators;
    let _get_triPlanarVoxelization_decorators;
    return _a = class NodeRenderGraphIblShadowsRendererBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphIblShadowsRendererBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth);
                this.registerInput("normal", NodeRenderGraphBlockConnectionPointTypes.TextureWorldNormal);
                this.registerInput("position", NodeRenderGraphBlockConnectionPointTypes.TextureWorldPosition);
                this.registerInput("velocity", NodeRenderGraphBlockConnectionPointTypes.TextureLinearVelocity);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this.registerInput("objects", NodeRenderGraphBlockConnectionPointTypes.ObjectList);
                this._addDependenciesInput();
                this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.Texture);
                this._frameGraphTask = new FrameGraphIblShadowsRendererTask(name, frameGraph);
            }
            // ------ Tracing properties ------
            /** Number of tracing sample directions */
            get sampleDirections() {
                return this._frameGraphTask.sampleDirections;
            }
            set sampleDirections(value) {
                this._frameGraphTask.sampleDirections = value;
            }
            /** Whether traced shadows preserve environment color */
            get coloredShadows() {
                return this._frameGraphTask.coloredShadows;
            }
            set coloredShadows(value) {
                this._frameGraphTask.coloredShadows = value;
            }
            /** Opacity of voxel-traced shadows */
            get voxelShadowOpacity() {
                return this._frameGraphTask.voxelShadowOpacity;
            }
            set voxelShadowOpacity(value) {
                this._frameGraphTask.voxelShadowOpacity = value;
            }
            /** Opacity of screen-space shadows */
            get ssShadowOpacity() {
                return this._frameGraphTask.ssShadowOpacity;
            }
            set ssShadowOpacity(value) {
                this._frameGraphTask.ssShadowOpacity = value;
            }
            /** Number of screen-space shadow samples */
            get ssShadowSampleCount() {
                return this._frameGraphTask.ssShadowSampleCount;
            }
            set ssShadowSampleCount(value) {
                this._frameGraphTask.ssShadowSampleCount = value;
            }
            /** Stride used by screen-space shadow sampling */
            get ssShadowStride() {
                return this._frameGraphTask.ssShadowStride;
            }
            set ssShadowStride(value) {
                this._frameGraphTask.ssShadowStride = value;
            }
            /** Distance scale used by screen-space shadow tracing */
            get ssShadowDistanceScale() {
                return this._frameGraphTask.ssShadowDistanceScale;
            }
            set ssShadowDistanceScale(value) {
                this._frameGraphTask.ssShadowDistanceScale = value;
            }
            /** Thickness scale used by screen-space shadow tracing */
            get ssShadowThicknessScale() {
                return this._frameGraphTask.ssShadowThicknessScale;
            }
            set ssShadowThicknessScale(value) {
                this._frameGraphTask.ssShadowThicknessScale = value;
            }
            /** Voxel tracing normal bias */
            get voxelNormalBias() {
                return this._frameGraphTask.voxelNormalBias;
            }
            set voxelNormalBias(value) {
                this._frameGraphTask.voxelNormalBias = value;
            }
            /** Voxel tracing direction bias */
            get voxelDirectionBias() {
                return this._frameGraphTask.voxelDirectionBias;
            }
            set voxelDirectionBias(value) {
                this._frameGraphTask.voxelDirectionBias = value;
            }
            /** Environment rotation in radians */
            get envRotation() {
                return this._frameGraphTask.envRotation;
            }
            set envRotation(value) {
                this._frameGraphTask.envRotation = value;
            }
            // ------ Accumulation properties ------
            /** Temporal shadow remanence while moving */
            get shadowRemanence() {
                return this._frameGraphTask.shadowRemanence;
            }
            set shadowRemanence(value) {
                this._frameGraphTask.shadowRemanence = value;
            }
            /** Final material shadow opacity */
            get shadowOpacity() {
                return this._frameGraphTask.shadowOpacity;
            }
            set shadowOpacity(value) {
                this._frameGraphTask.shadowOpacity = value;
            }
            // ------ Voxelization properties ------
            /** Voxelization resolution exponent (actual resolution is 2^value) */
            get resolutionExp() {
                return this._frameGraphTask.resolutionExp;
            }
            set resolutionExp(value) {
                this._frameGraphTask.resolutionExp = value;
            }
            /** Voxelization refresh rate (-1: manual, 0: every frame, N: skip N frames) */
            get refreshRate() {
                return this._frameGraphTask.refreshRate;
            }
            set refreshRate(value) {
                this._frameGraphTask.refreshRate = value;
            }
            /** Whether tri-planar voxelization is used */
            get triPlanarVoxelization() {
                return this._frameGraphTask.triPlanarVoxelization;
            }
            set triPlanarVoxelization(value) {
                this._frameGraphTask.triPlanarVoxelization = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphIblShadowsRendererBlock";
            }
            /**
             * Gets the depth texture input component
             */
            get depth() {
                return this._inputs[0];
            }
            /**
             * Gets the normal texture input component
             */
            get normal() {
                return this._inputs[1];
            }
            /**
             * Gets the position texture input component
             */
            get position() {
                return this._inputs[2];
            }
            /**
             * Gets the velocity texture input component
             */
            get velocity() {
                return this._inputs[3];
            }
            /**
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[4];
            }
            /**
             * Gets the objects input component
             */
            get objects() {
                return this._inputs[5];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this.output.value = this._frameGraphTask.outputTexture;
                this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
                this._frameGraphTask.normalTexture = this.normal.connectedPoint?.value;
                this._frameGraphTask.positionTexture = this.position.connectedPoint?.value;
                this._frameGraphTask.velocityTexture = this.velocity.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
                this._frameGraphTask.objectList = this.objects.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.sampleDirections = ${this.sampleDirections};`);
                codes.push(`${this._codeVariableName}.coloredShadows = ${this.coloredShadows};`);
                codes.push(`${this._codeVariableName}.voxelShadowOpacity = ${this.voxelShadowOpacity};`);
                codes.push(`${this._codeVariableName}.ssShadowOpacity = ${this.ssShadowOpacity};`);
                codes.push(`${this._codeVariableName}.ssShadowSampleCount = ${this.ssShadowSampleCount};`);
                codes.push(`${this._codeVariableName}.ssShadowStride = ${this.ssShadowStride};`);
                codes.push(`${this._codeVariableName}.ssShadowDistanceScale = ${this.ssShadowDistanceScale};`);
                codes.push(`${this._codeVariableName}.ssShadowThicknessScale = ${this.ssShadowThicknessScale};`);
                codes.push(`${this._codeVariableName}.voxelNormalBias = ${this.voxelNormalBias};`);
                codes.push(`${this._codeVariableName}.voxelDirectionBias = ${this.voxelDirectionBias};`);
                codes.push(`${this._codeVariableName}.envRotation = ${this.envRotation};`);
                codes.push(`${this._codeVariableName}.shadowRemanence = ${this.shadowRemanence};`);
                codes.push(`${this._codeVariableName}.shadowOpacity = ${this.shadowOpacity};`);
                codes.push(`${this._codeVariableName}.resolutionExp = ${this.resolutionExp};`);
                codes.push(`${this._codeVariableName}.refreshRate = ${this.refreshRate};`);
                codes.push(`${this._codeVariableName}.triPlanarVoxelization = ${this.triPlanarVoxelization};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.sampleDirections = this.sampleDirections;
                serializationObject.coloredShadows = this.coloredShadows;
                serializationObject.voxelShadowOpacity = this.voxelShadowOpacity;
                serializationObject.ssShadowOpacity = this.ssShadowOpacity;
                serializationObject.ssShadowSampleCount = this.ssShadowSampleCount;
                serializationObject.ssShadowStride = this.ssShadowStride;
                serializationObject.ssShadowDistanceScale = this.ssShadowDistanceScale;
                serializationObject.ssShadowThicknessScale = this.ssShadowThicknessScale;
                serializationObject.voxelNormalBias = this.voxelNormalBias;
                serializationObject.voxelDirectionBias = this.voxelDirectionBias;
                serializationObject.envRotation = this.envRotation;
                serializationObject.shadowRemanence = this.shadowRemanence;
                serializationObject.shadowOpacity = this.shadowOpacity;
                serializationObject.resolutionExp = this.resolutionExp;
                serializationObject.refreshRate = this.refreshRate;
                serializationObject.triPlanarVoxelization = this.triPlanarVoxelization;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.sampleDirections = serializationObject.sampleDirections;
                this.coloredShadows = serializationObject.coloredShadows;
                this.voxelShadowOpacity = serializationObject.voxelShadowOpacity;
                this.ssShadowOpacity = serializationObject.ssShadowOpacity;
                this.ssShadowSampleCount = serializationObject.ssShadowSampleCount;
                this.ssShadowStride = serializationObject.ssShadowStride;
                this.ssShadowDistanceScale = serializationObject.ssShadowDistanceScale;
                this.ssShadowThicknessScale = serializationObject.ssShadowThicknessScale;
                this.voxelNormalBias = serializationObject.voxelNormalBias;
                this.voxelDirectionBias = serializationObject.voxelDirectionBias;
                this.envRotation = serializationObject.envRotation;
                this.shadowRemanence = serializationObject.shadowRemanence;
                this.shadowOpacity = serializationObject.shadowOpacity;
                this.resolutionExp = serializationObject.resolutionExp;
                this.refreshRate = serializationObject.refreshRate;
                this.triPlanarVoxelization = serializationObject.triPlanarVoxelization;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_sampleDirections_decorators = [editableInPropertyPage("Sample directions", 2 /* PropertyTypeForEdition.Int */, "TRACING", { min: 1, max: 16 })];
            _get_coloredShadows_decorators = [editableInPropertyPage("Colored shadows", 0 /* PropertyTypeForEdition.Boolean */, "TRACING")];
            _get_voxelShadowOpacity_decorators = [editableInPropertyPage("Voxel shadow opacity", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0, max: 1 })];
            _get_ssShadowOpacity_decorators = [editableInPropertyPage("SS shadow opacity", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0, max: 1 })];
            _get_ssShadowSampleCount_decorators = [editableInPropertyPage("SS sample count", 2 /* PropertyTypeForEdition.Int */, "TRACING", { min: 1, max: 64 })];
            _get_ssShadowStride_decorators = [editableInPropertyPage("SS stride", 2 /* PropertyTypeForEdition.Int */, "TRACING", { min: 1, max: 32 })];
            _get_ssShadowDistanceScale_decorators = [editableInPropertyPage("SS distance scale", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0 })];
            _get_ssShadowThicknessScale_decorators = [editableInPropertyPage("SS thickness scale", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0 })];
            _get_voxelNormalBias_decorators = [editableInPropertyPage("Normal bias", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0 })];
            _get_voxelDirectionBias_decorators = [editableInPropertyPage("Direction bias", 1 /* PropertyTypeForEdition.Float */, "TRACING", { min: 0 })];
            _get_envRotation_decorators = [editableInPropertyPage("Env rotation", 1 /* PropertyTypeForEdition.Float */, "TRACING")];
            _get_shadowRemanence_decorators = [editableInPropertyPage("Shadow remanence", 1 /* PropertyTypeForEdition.Float */, "ACCUMULATION", { min: 0, max: 1 })];
            _get_shadowOpacity_decorators = [editableInPropertyPage("Shadow opacity", 1 /* PropertyTypeForEdition.Float */, "ACCUMULATION", { min: 0, max: 1 })];
            _get_resolutionExp_decorators = [editableInPropertyPage("Resolution exp", 2 /* PropertyTypeForEdition.Int */, "VOXELIZATION", { min: 1, max: 8 })];
            _get_refreshRate_decorators = [editableInPropertyPage("Refresh rate", 2 /* PropertyTypeForEdition.Int */, "VOXELIZATION", { min: -1 })];
            _get_triPlanarVoxelization_decorators = [editableInPropertyPage("Tri-planar", 0 /* PropertyTypeForEdition.Boolean */, "VOXELIZATION")];
            __esDecorate(_a, null, _get_sampleDirections_decorators, { kind: "getter", name: "sampleDirections", static: false, private: false, access: { has: obj => "sampleDirections" in obj, get: obj => obj.sampleDirections }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_coloredShadows_decorators, { kind: "getter", name: "coloredShadows", static: false, private: false, access: { has: obj => "coloredShadows" in obj, get: obj => obj.coloredShadows }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_voxelShadowOpacity_decorators, { kind: "getter", name: "voxelShadowOpacity", static: false, private: false, access: { has: obj => "voxelShadowOpacity" in obj, get: obj => obj.voxelShadowOpacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssShadowOpacity_decorators, { kind: "getter", name: "ssShadowOpacity", static: false, private: false, access: { has: obj => "ssShadowOpacity" in obj, get: obj => obj.ssShadowOpacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssShadowSampleCount_decorators, { kind: "getter", name: "ssShadowSampleCount", static: false, private: false, access: { has: obj => "ssShadowSampleCount" in obj, get: obj => obj.ssShadowSampleCount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssShadowStride_decorators, { kind: "getter", name: "ssShadowStride", static: false, private: false, access: { has: obj => "ssShadowStride" in obj, get: obj => obj.ssShadowStride }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssShadowDistanceScale_decorators, { kind: "getter", name: "ssShadowDistanceScale", static: false, private: false, access: { has: obj => "ssShadowDistanceScale" in obj, get: obj => obj.ssShadowDistanceScale }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssShadowThicknessScale_decorators, { kind: "getter", name: "ssShadowThicknessScale", static: false, private: false, access: { has: obj => "ssShadowThicknessScale" in obj, get: obj => obj.ssShadowThicknessScale }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_voxelNormalBias_decorators, { kind: "getter", name: "voxelNormalBias", static: false, private: false, access: { has: obj => "voxelNormalBias" in obj, get: obj => obj.voxelNormalBias }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_voxelDirectionBias_decorators, { kind: "getter", name: "voxelDirectionBias", static: false, private: false, access: { has: obj => "voxelDirectionBias" in obj, get: obj => obj.voxelDirectionBias }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_envRotation_decorators, { kind: "getter", name: "envRotation", static: false, private: false, access: { has: obj => "envRotation" in obj, get: obj => obj.envRotation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_shadowRemanence_decorators, { kind: "getter", name: "shadowRemanence", static: false, private: false, access: { has: obj => "shadowRemanence" in obj, get: obj => obj.shadowRemanence }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_shadowOpacity_decorators, { kind: "getter", name: "shadowOpacity", static: false, private: false, access: { has: obj => "shadowOpacity" in obj, get: obj => obj.shadowOpacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_resolutionExp_decorators, { kind: "getter", name: "resolutionExp", static: false, private: false, access: { has: obj => "resolutionExp" in obj, get: obj => obj.resolutionExp }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_refreshRate_decorators, { kind: "getter", name: "refreshRate", static: false, private: false, access: { has: obj => "refreshRate" in obj, get: obj => obj.refreshRate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_triPlanarVoxelization_decorators, { kind: "getter", name: "triPlanarVoxelization", static: false, private: false, access: { has: obj => "triPlanarVoxelization" in obj, get: obj => obj.triPlanarVoxelization }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphIblShadowsRendererBlock };
let _Registered = false;
/**
 * Register side effects for iblShadowsRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterIblShadowsRendererBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphIblShadowsRendererBlock", NodeRenderGraphIblShadowsRendererBlock);
}
//# sourceMappingURL=iblShadowsRendererBlock.pure.js.map
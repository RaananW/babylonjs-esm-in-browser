/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";

import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphSSAO2RenderingPipelineTask } from "../../../Tasks/PostProcesses/ssao2RenderingPipelineTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the SSAO2 post process
 */
let NodeRenderGraphSSAO2PostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBasePostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_textureType_decorators;
    let _get_ratioSSAO_decorators;
    let _get_ratioBlur_decorators;
    let _get_samples_decorators;
    let _get_totalStrength_decorators;
    let _get_base_decorators;
    let _get_maxZ_decorators;
    let _get_minZAspect_decorators;
    let _get_radius_decorators;
    let _get_epsilon_decorators;
    let _get_useViewportInCombineStage_decorators;
    let _get_bypassBlur_decorators;
    let _get_expensiveBlur_decorators;
    let _get_bilateralSamples_decorators;
    let _get_bilateralSoften_decorators;
    let _get_bilateralTolerance_decorators;
    return _a = class NodeRenderGraphSSAO2PostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphSSAO2PostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param ratioSSAO The ratio between the SSAO texture size and the source texture size (default: 1)
             * @param ratioBlur The ratio between the SSAO blur texture size and the source texture size (default: 1)
             * @param textureType The texture type used by the different post processes created by SSAO2 (default: 0)
             */
            constructor(name, frameGraph, scene, ratioSSAO = 1, ratioBlur = 1, textureType = 0) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [ratioSSAO, ratioBlur, textureType];
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this.registerInput("geomDepth", NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this.registerInput("geomNormal", NodeRenderGraphBlockConnectionPointTypes.TextureViewNormal);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphSSAO2RenderingPipelineTask(this.name, frameGraph, ratioSSAO, ratioBlur, textureType);
            }
            _createTask(ratioSSAO, ratioBlur, textureType) {
                const sourceSamplingMode = this.sourceSamplingMode;
                const samples = this.samples;
                const totalStrength = this.totalStrength;
                const base = this.base;
                const maxZ = this.maxZ;
                const minZAspect = this.minZAspect;
                const radius = this.radius;
                const epsilon = this.epsilon;
                const useViewportInCombineStage = this.useViewportInCombineStage;
                const bypassBlur = this.bypassBlur;
                const expensiveBlur = this.expensiveBlur;
                const bilateralSoften = this.bilateralSoften;
                const bilateralSamples = this.bilateralSamples;
                const bilateralTolerance = this.bilateralTolerance;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphSSAO2RenderingPipelineTask(this.name, this._frameGraph, ratioSSAO, ratioBlur, textureType);
                this.sourceSamplingMode = sourceSamplingMode;
                this.samples = samples;
                this.totalStrength = totalStrength;
                this.base = base;
                this.maxZ = maxZ;
                this.minZAspect = minZAspect;
                this.radius = radius;
                this.epsilon = epsilon;
                this.useViewportInCombineStage = useViewportInCombineStage;
                this.bypassBlur = bypassBlur;
                this.expensiveBlur = expensiveBlur;
                this.bilateralSoften = bilateralSoften;
                this.bilateralSamples = bilateralSamples;
                this.bilateralTolerance = bilateralTolerance;
                this._additionalConstructionParameters = [ratioSSAO, ratioBlur, textureType];
            }
            /** The texture type used by the different post processes created by SSAO2 */
            get textureType() {
                return this._frameGraphTask.textureType;
            }
            set textureType(value) {
                this._createTask(this._frameGraphTask.ratioSSAO, this._frameGraphTask.ratioBlur, value);
            }
            /** The ratio between the SSAO texture size and the source texture size */
            get ratioSSAO() {
                return this._frameGraphTask.ratioSSAO;
            }
            set ratioSSAO(value) {
                this._createTask(value, this._frameGraphTask.ratioBlur, this._frameGraphTask.textureType);
            }
            /** The ratio between the SSAO blur texture size and the source texture size */
            get ratioBlur() {
                return this._frameGraphTask.ratioBlur;
            }
            set ratioBlur(value) {
                this._createTask(this._frameGraphTask.ratioSSAO, value, this._frameGraphTask.textureType);
            }
            /** Number of samples used for the SSAO calculations. Default value is 8. */
            get samples() {
                return this._frameGraphTask.ssao.samples;
            }
            set samples(value) {
                this._frameGraphTask.ssao.samples = value;
            }
            /** The strength of the SSAO post-process. Default value is 1.0. */
            get totalStrength() {
                return this._frameGraphTask.ssao.totalStrength;
            }
            set totalStrength(value) {
                this._frameGraphTask.ssao.totalStrength = value;
            }
            /** The base color of the SSAO post-process. The final result is "base + ssao" between [0, 1] */
            get base() {
                return this._frameGraphTask.ssao.base;
            }
            set base(value) {
                this._frameGraphTask.ssao.base = value;
            }
            /** Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change. */
            get maxZ() {
                return this._frameGraphTask.ssao.maxZ;
            }
            set maxZ(value) {
                this._frameGraphTask.ssao.maxZ = value;
            }
            /** In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much. */
            get minZAspect() {
                return this._frameGraphTask.ssao.minZAspect;
            }
            set minZAspect(value) {
                this._frameGraphTask.ssao.minZAspect = value;
            }
            /** The radius around the analyzed pixel used by the SSAO post-process. */
            get radius() {
                return this._frameGraphTask.ssao.radius;
            }
            set radius(value) {
                this._frameGraphTask.ssao.radius = value;
            }
            /** Used in SSAO calculations to compensate for accuracy issues with depth values. */
            get epsilon() {
                return this._frameGraphTask.ssao.epsilon;
            }
            set epsilon(value) {
                this._frameGraphTask.ssao.epsilon = value;
            }
            /** Indicates that the combine stage should use the current camera viewport to render the SSAO result on only a portion of the output texture. */
            get useViewportInCombineStage() {
                return this._frameGraphTask.ssao.useViewportInCombineStage;
            }
            set useViewportInCombineStage(value) {
                this._frameGraphTask.ssao.useViewportInCombineStage = value;
            }
            /** Skips the denoising (blur) stage of the SSAO calculations. */
            get bypassBlur() {
                return this._frameGraphTask.ssao.bypassBlur;
            }
            set bypassBlur(value) {
                this._frameGraphTask.ssao.bypassBlur = value;
            }
            /** Enables the configurable bilateral denoising (blurring) filter. */
            get expensiveBlur() {
                return this._frameGraphTask.ssao.expensiveBlur;
            }
            set expensiveBlur(value) {
                this._frameGraphTask.ssao.expensiveBlur = value;
            }
            /** The number of samples the bilateral filter uses in both dimensions when denoising the SSAO calculations. */
            get bilateralSamples() {
                return this._frameGraphTask.ssao.bilateralSamples;
            }
            set bilateralSamples(value) {
                this._frameGraphTask.ssao.bilateralSamples = value;
            }
            /** Controls the shape of the denoising kernel used by the bilateral filter. */
            get bilateralSoften() {
                return this._frameGraphTask.ssao.bilateralSoften;
            }
            set bilateralSoften(value) {
                this._frameGraphTask.ssao.bilateralSoften = value;
            }
            /** How forgiving the bilateral denoiser should be when rejecting samples. */
            get bilateralTolerance() {
                return this._frameGraphTask.ssao.bilateralTolerance;
            }
            set bilateralTolerance(value) {
                this._frameGraphTask.ssao.bilateralTolerance = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphSSAO2PostProcessBlock";
            }
            /**
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[2];
            }
            /**
             * Gets the geometry depth input component
             */
            get geomDepth() {
                return this._inputs[3];
            }
            /**
             * Gets the geometry normal input component
             */
            get geomNormal() {
                return this._inputs[4];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.normalTexture = this.geomNormal.connectedPoint?.value;
                this._frameGraphTask.depthTexture = this.geomDepth.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.samples = ${this.samples};`);
                codes.push(`${this._codeVariableName}.totalStrength = ${this.totalStrength};`);
                codes.push(`${this._codeVariableName}.base = ${this.base};`);
                codes.push(`${this._codeVariableName}.maxZ = ${this.maxZ};`);
                codes.push(`${this._codeVariableName}.minZAspect = ${this.minZAspect};`);
                codes.push(`${this._codeVariableName}.radius = ${this.radius};`);
                codes.push(`${this._codeVariableName}.epsilon = ${this.epsilon};`);
                codes.push(`${this._codeVariableName}.useViewportInCombineStage = ${this.useViewportInCombineStage};`);
                codes.push(`${this._codeVariableName}.bypassBlur = ${this.bypassBlur};`);
                codes.push(`${this._codeVariableName}.expensiveBlur = ${this.expensiveBlur};`);
                codes.push(`${this._codeVariableName}.bilateralSamples = ${this.bilateralSamples};`);
                codes.push(`${this._codeVariableName}.bilateralSoften = ${this.bilateralSoften};`);
                codes.push(`${this._codeVariableName}.bilateralTolerance = ${this.bilateralTolerance};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.samples = this.samples;
                serializationObject.totalStrength = this.totalStrength;
                serializationObject.base = this.base;
                serializationObject.maxZ = this.maxZ;
                serializationObject.minZAspect = this.minZAspect;
                serializationObject.radius = this.radius;
                serializationObject.epsilon = this.epsilon;
                serializationObject.useViewportInCombineStage = this.useViewportInCombineStage;
                serializationObject.bypassBlur = this.bypassBlur;
                serializationObject.expensiveBlur = this.expensiveBlur;
                serializationObject.bilateralSoften = this.bilateralSoften;
                serializationObject.bilateralSamples = this.bilateralSamples;
                serializationObject.bilateralTolerance = this.bilateralTolerance;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.samples = serializationObject.samples;
                this.totalStrength = serializationObject.totalStrength;
                this.base = serializationObject.base;
                this.maxZ = serializationObject.maxZ;
                this.minZAspect = serializationObject.minZAspect;
                this.radius = serializationObject.radius;
                this.epsilon = serializationObject.epsilon;
                this.useViewportInCombineStage = serializationObject.useViewportInCombineStage;
                this.bypassBlur = serializationObject.bypassBlur;
                this.expensiveBlur = serializationObject.expensiveBlur;
                this.bilateralSoften = serializationObject.bilateralSoften;
                this.bilateralSamples = serializationObject.bilateralSamples;
                this.bilateralTolerance = serializationObject.bilateralTolerance;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_textureType_decorators = [editableInPropertyPage("Texture type", 10 /* PropertyTypeForEdition.TextureType */, "TEXTURE")];
            _get_ratioSSAO_decorators = [editableInPropertyPage("SSAO texture ratio", 1 /* PropertyTypeForEdition.Float */, "TEXTURE", { min: 0.1, max: 1 })];
            _get_ratioBlur_decorators = [editableInPropertyPage("SSAO blur texture ratio", 1 /* PropertyTypeForEdition.Float */, "TEXTURE", { min: 0.1, max: 1 })];
            _get_samples_decorators = [editableInPropertyPage("Samples", 2 /* PropertyTypeForEdition.Int */, "SSAO", { min: 1, max: 128 })];
            _get_totalStrength_decorators = [editableInPropertyPage("Strength", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 3 })];
            _get_base_decorators = [editableInPropertyPage("Base", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 1 })];
            _get_maxZ_decorators = [editableInPropertyPage("Max Z", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 10000 })];
            _get_minZAspect_decorators = [editableInPropertyPage("Min Z aspect", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 0.5 })];
            _get_radius_decorators = [editableInPropertyPage("Radius", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 10 })];
            _get_epsilon_decorators = [editableInPropertyPage("Epsilon", 1 /* PropertyTypeForEdition.Float */, "SSAO", { min: 0, max: 1 })];
            _get_useViewportInCombineStage_decorators = [editableInPropertyPage("Use viewport in combine stage", 0 /* PropertyTypeForEdition.Boolean */, "SSAO")];
            _get_bypassBlur_decorators = [editableInPropertyPage("Bypass blur", 0 /* PropertyTypeForEdition.Boolean */, "Blur")];
            _get_expensiveBlur_decorators = [editableInPropertyPage("Expensive blur", 0 /* PropertyTypeForEdition.Boolean */, "Blur")];
            _get_bilateralSamples_decorators = [editableInPropertyPage("Samples", 2 /* PropertyTypeForEdition.Int */, "Blur", { min: 1, max: 128 })];
            _get_bilateralSoften_decorators = [editableInPropertyPage("Soften", 1 /* PropertyTypeForEdition.Float */, "Blur", { min: 0, max: 1 })];
            _get_bilateralTolerance_decorators = [editableInPropertyPage("Tolerance", 1 /* PropertyTypeForEdition.Float */, "Blur", { min: 0, max: 1 })];
            __esDecorate(_a, null, _get_textureType_decorators, { kind: "getter", name: "textureType", static: false, private: false, access: { has: obj => "textureType" in obj, get: obj => obj.textureType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ratioSSAO_decorators, { kind: "getter", name: "ratioSSAO", static: false, private: false, access: { has: obj => "ratioSSAO" in obj, get: obj => obj.ratioSSAO }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ratioBlur_decorators, { kind: "getter", name: "ratioBlur", static: false, private: false, access: { has: obj => "ratioBlur" in obj, get: obj => obj.ratioBlur }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_samples_decorators, { kind: "getter", name: "samples", static: false, private: false, access: { has: obj => "samples" in obj, get: obj => obj.samples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_totalStrength_decorators, { kind: "getter", name: "totalStrength", static: false, private: false, access: { has: obj => "totalStrength" in obj, get: obj => obj.totalStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_base_decorators, { kind: "getter", name: "base", static: false, private: false, access: { has: obj => "base" in obj, get: obj => obj.base }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxZ_decorators, { kind: "getter", name: "maxZ", static: false, private: false, access: { has: obj => "maxZ" in obj, get: obj => obj.maxZ }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_minZAspect_decorators, { kind: "getter", name: "minZAspect", static: false, private: false, access: { has: obj => "minZAspect" in obj, get: obj => obj.minZAspect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_epsilon_decorators, { kind: "getter", name: "epsilon", static: false, private: false, access: { has: obj => "epsilon" in obj, get: obj => obj.epsilon }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useViewportInCombineStage_decorators, { kind: "getter", name: "useViewportInCombineStage", static: false, private: false, access: { has: obj => "useViewportInCombineStage" in obj, get: obj => obj.useViewportInCombineStage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bypassBlur_decorators, { kind: "getter", name: "bypassBlur", static: false, private: false, access: { has: obj => "bypassBlur" in obj, get: obj => obj.bypassBlur }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_expensiveBlur_decorators, { kind: "getter", name: "expensiveBlur", static: false, private: false, access: { has: obj => "expensiveBlur" in obj, get: obj => obj.expensiveBlur }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralSamples_decorators, { kind: "getter", name: "bilateralSamples", static: false, private: false, access: { has: obj => "bilateralSamples" in obj, get: obj => obj.bilateralSamples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralSoften_decorators, { kind: "getter", name: "bilateralSoften", static: false, private: false, access: { has: obj => "bilateralSoften" in obj, get: obj => obj.bilateralSoften }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralTolerance_decorators, { kind: "getter", name: "bilateralTolerance", static: false, private: false, access: { has: obj => "bilateralTolerance" in obj, get: obj => obj.bilateralTolerance }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphSSAO2PostProcessBlock };
let _Registered = false;
/**
 * Register side effects for ssao2PostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSsao2PostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphSSAO2PostProcessBlock", NodeRenderGraphSSAO2PostProcessBlock);
}
//# sourceMappingURL=ssao2PostProcessBlock.pure.js.map
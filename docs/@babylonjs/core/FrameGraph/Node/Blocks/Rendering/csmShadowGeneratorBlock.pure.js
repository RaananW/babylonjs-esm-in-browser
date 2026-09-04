/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBaseShadowGeneratorBlock } from "./baseShadowGeneratorBlock.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphCascadedShadowGeneratorTask } from "../../../Tasks/Rendering/csmShadowGeneratorTask.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that generates shadows through a shadow generator
 */
let NodeRenderGraphCascadedShadowGeneratorBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseShadowGeneratorBlock;
    let _instanceExtraInitializers = [];
    let _get_numCascades_decorators;
    let _get_debug_decorators;
    let _get_stabilizeCascades_decorators;
    let _get_lambda_decorators;
    let _get_cascadeBlendPercentage_decorators;
    let _get_depthClamp_decorators;
    let _get_autoCalcDepthBounds_decorators;
    let _get_autoCalcDepthBoundsRefreshRate_decorators;
    let _get_shadowMaxZ_decorators;
    return _a = class NodeRenderGraphCascadedShadowGeneratorBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphCascadedShadowGeneratorBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("geomDepth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.geomDepth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureNormalizedViewDepth |
                    NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth |
                    NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphCascadedShadowGeneratorTask(this.name, frameGraph);
            }
            /** Sets the number of cascades */
            get numCascades() {
                return this._frameGraphTask.numCascades;
            }
            set numCascades(value) {
                this._frameGraphTask.numCascades = value;
            }
            /** Gets or sets a value indicating whether the shadow generator should display the cascades. */
            get debug() {
                return this._frameGraphTask.debug;
            }
            set debug(value) {
                this._frameGraphTask.debug = value;
            }
            /** Gets or sets a value indicating whether the shadow generator should stabilize the cascades. */
            get stabilizeCascades() {
                return this._frameGraphTask.stabilizeCascades;
            }
            set stabilizeCascades(value) {
                this._frameGraphTask.stabilizeCascades = value;
            }
            /** Gets or sets the lambda parameter of the shadow generator. */
            get lambda() {
                return this._frameGraphTask.lambda;
            }
            set lambda(value) {
                this._frameGraphTask.lambda = value;
            }
            /** Gets or sets the cascade blend percentage. */
            get cascadeBlendPercentage() {
                return this._frameGraphTask.cascadeBlendPercentage;
            }
            set cascadeBlendPercentage(value) {
                this._frameGraphTask.cascadeBlendPercentage = value;
            }
            /** Gets or sets a value indicating whether the shadow generator should use depth clamping. */
            get depthClamp() {
                return this._frameGraphTask.depthClamp;
            }
            set depthClamp(value) {
                this._frameGraphTask.depthClamp = value;
            }
            /** Gets or sets a value indicating whether the shadow generator should automatically calculate the depth bounds. */
            get autoCalcDepthBounds() {
                return this._frameGraphTask.autoCalcDepthBounds;
            }
            set autoCalcDepthBounds(value) {
                this._frameGraphTask.autoCalcDepthBounds = value;
            }
            /** Defines the refresh rate of the min/max computation used when autoCalcDepthBounds is set to true. */
            get autoCalcDepthBoundsRefreshRate() {
                return this._frameGraphTask.autoCalcDepthBoundsRefreshRate;
            }
            set autoCalcDepthBoundsRefreshRate(value) {
                this._frameGraphTask.autoCalcDepthBoundsRefreshRate = value;
            }
            /** Gets or sets the maximum shadow Z value. */
            get shadowMaxZ() {
                return this._frameGraphTask.shadowMaxZ;
            }
            set shadowMaxZ(value) {
                this._frameGraphTask.shadowMaxZ = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphCascadedShadowGeneratorBlock";
            }
            /**
             * Gets the geometry (view / normalized view) depth component
             */
            get geomDepth() {
                return this._inputs[3];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.depthTexture = this.geomDepth.connectedPoint?.value;
                if (this.geomDepth.connectedPoint) {
                    switch (this.geomDepth.connectedPoint.type) {
                        case NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth:
                            this._frameGraphTask.depthTextureType = 2 /* DepthTextureType.ScreenDepth */;
                            break;
                        case NodeRenderGraphBlockConnectionPointTypes.TextureNormalizedViewDepth:
                            this._frameGraphTask.depthTextureType = 0 /* DepthTextureType.NormalizedViewDepth */;
                            break;
                        case NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth:
                            this._frameGraphTask.depthTextureType = 1 /* DepthTextureType.ViewDepth */;
                            break;
                    }
                }
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.numCascades = ${this.numCascades};`);
                codes.push(`${this._codeVariableName}.debug = ${this.debug};`);
                codes.push(`${this._codeVariableName}.stabilizeCascades = ${this.stabilizeCascades};`);
                codes.push(`${this._codeVariableName}.lambda = ${this.lambda};`);
                codes.push(`${this._codeVariableName}.cascadeBlendPercentage = ${this.cascadeBlendPercentage};`);
                codes.push(`${this._codeVariableName}.depthClamp = ${this.depthClamp};`);
                codes.push(`${this._codeVariableName}.autoCalcDepthBounds = ${this.autoCalcDepthBounds};`);
                codes.push(`${this._codeVariableName}.autoCalcDepthBoundsRefreshRate = ${this.autoCalcDepthBoundsRefreshRate};`);
                codes.push(`${this._codeVariableName}.shadowMaxZ = ${this.shadowMaxZ};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            /**
             * Serializes this block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.numCascades = this.numCascades;
                serializationObject.debug = this.debug;
                serializationObject.stabilizeCascades = this.stabilizeCascades;
                serializationObject.lambda = this.lambda;
                serializationObject.cascadeBlendPercentage = this.cascadeBlendPercentage;
                serializationObject.depthClamp = this.depthClamp;
                serializationObject.autoCalcDepthBounds = this.autoCalcDepthBounds;
                serializationObject.autoCalcDepthBoundsRefreshRate = this.autoCalcDepthBoundsRefreshRate;
                serializationObject.shadowMaxZ = this.shadowMaxZ;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.numCascades = serializationObject.numCascades;
                this.debug = serializationObject.debug;
                this.stabilizeCascades = serializationObject.stabilizeCascades;
                this.lambda = serializationObject.lambda;
                this.cascadeBlendPercentage = serializationObject.cascadeBlendPercentage;
                this.depthClamp = serializationObject.depthClamp;
                this.autoCalcDepthBounds = serializationObject.autoCalcDepthBounds;
                this.autoCalcDepthBoundsRefreshRate = serializationObject.autoCalcDepthBoundsRefreshRate ?? 1;
                this.shadowMaxZ = serializationObject.shadowMaxZ;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_numCascades_decorators = [editableInPropertyPage("Number of cascades", 5 /* PropertyTypeForEdition.List */, "CSM PROPERTIES", {
                    options: [
                        { label: "2", value: 2 },
                        { label: "3", value: 3 },
                        { label: "4", value: 4 },
                    ],
                })];
            _get_debug_decorators = [editableInPropertyPage("Debug mode", 0 /* PropertyTypeForEdition.Boolean */, "CSM PROPERTIES")];
            _get_stabilizeCascades_decorators = [editableInPropertyPage("Stabilize cascades", 0 /* PropertyTypeForEdition.Boolean */, "CSM PROPERTIES")];
            _get_lambda_decorators = [editableInPropertyPage("Lambda", 1 /* PropertyTypeForEdition.Float */, "CSM PROPERTIES", { min: 0, max: 1 })];
            _get_cascadeBlendPercentage_decorators = [editableInPropertyPage("Cascade blend", 1 /* PropertyTypeForEdition.Float */, "CSM PROPERTIES", { min: 0, max: 1 })];
            _get_depthClamp_decorators = [editableInPropertyPage("Depth clamp", 0 /* PropertyTypeForEdition.Boolean */, "CSM PROPERTIES")];
            _get_autoCalcDepthBounds_decorators = [editableInPropertyPage("Auto-Calc depth bounds", 0 /* PropertyTypeForEdition.Boolean */, "CSM PROPERTIES")];
            _get_autoCalcDepthBoundsRefreshRate_decorators = [editableInPropertyPage("Auto-Calc depth bounds refresh rate", 2 /* PropertyTypeForEdition.Int */, "CSM PROPERTIES")];
            _get_shadowMaxZ_decorators = [editableInPropertyPage("Shadow maxZ", 1 /* PropertyTypeForEdition.Float */, "CSM PROPERTIES")];
            __esDecorate(_a, null, _get_numCascades_decorators, { kind: "getter", name: "numCascades", static: false, private: false, access: { has: obj => "numCascades" in obj, get: obj => obj.numCascades }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_debug_decorators, { kind: "getter", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_stabilizeCascades_decorators, { kind: "getter", name: "stabilizeCascades", static: false, private: false, access: { has: obj => "stabilizeCascades" in obj, get: obj => obj.stabilizeCascades }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_lambda_decorators, { kind: "getter", name: "lambda", static: false, private: false, access: { has: obj => "lambda" in obj, get: obj => obj.lambda }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_cascadeBlendPercentage_decorators, { kind: "getter", name: "cascadeBlendPercentage", static: false, private: false, access: { has: obj => "cascadeBlendPercentage" in obj, get: obj => obj.cascadeBlendPercentage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_depthClamp_decorators, { kind: "getter", name: "depthClamp", static: false, private: false, access: { has: obj => "depthClamp" in obj, get: obj => obj.depthClamp }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_autoCalcDepthBounds_decorators, { kind: "getter", name: "autoCalcDepthBounds", static: false, private: false, access: { has: obj => "autoCalcDepthBounds" in obj, get: obj => obj.autoCalcDepthBounds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_autoCalcDepthBoundsRefreshRate_decorators, { kind: "getter", name: "autoCalcDepthBoundsRefreshRate", static: false, private: false, access: { has: obj => "autoCalcDepthBoundsRefreshRate" in obj, get: obj => obj.autoCalcDepthBoundsRefreshRate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_shadowMaxZ_decorators, { kind: "getter", name: "shadowMaxZ", static: false, private: false, access: { has: obj => "shadowMaxZ" in obj, get: obj => obj.shadowMaxZ }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphCascadedShadowGeneratorBlock };
let _Registered = false;
/**
 * Register side effects for csmShadowGeneratorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCsmShadowGeneratorBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphCascadedShadowGeneratorBlock", NodeRenderGraphCascadedShadowGeneratorBlock);
}
//# sourceMappingURL=csmShadowGeneratorBlock.pure.js.map
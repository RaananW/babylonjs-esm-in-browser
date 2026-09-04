/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphMotionBlurTask } from "../../../Tasks/PostProcesses/motionBlurTask.js";
import { ThinMotionBlurPostProcess } from "../../../../PostProcesses/thinMotionBlurPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the motion blur post process
 */
let NodeRenderGraphMotionBlurPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_motionStrength_decorators;
    let _get_motionBlurSamples_decorators;
    let _get_isObjectBased_decorators;
    return _a = class NodeRenderGraphMotionBlurPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphMotionBlurPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("geomVelocity", NodeRenderGraphBlockConnectionPointTypes.TextureVelocity, true);
                this.registerInput("geomViewDepth", NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth, true);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphMotionBlurTask(this.name, frameGraph, new ThinMotionBlurPostProcess(name, frameGraph.scene));
            }
            /** Defines how much the image is blurred by the movement. */
            get motionStrength() {
                return this._frameGraphTask.postProcess.motionStrength;
            }
            set motionStrength(value) {
                this._frameGraphTask.postProcess.motionStrength = value;
            }
            /** Gets the number of iterations that are used for motion blur quality. */
            get motionBlurSamples() {
                return this._frameGraphTask.postProcess.motionBlurSamples;
            }
            set motionBlurSamples(value) {
                this._frameGraphTask.postProcess.motionBlurSamples = value;
            }
            /** Gets whether or not the motion blur post-process is in object based mode. */
            get isObjectBased() {
                return this._frameGraphTask.postProcess.isObjectBased;
            }
            set isObjectBased(value) {
                this._frameGraphTask.postProcess.isObjectBased = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphMotionBlurPostProcessBlock";
            }
            /**
             * Gets the geometry velocity input component
             */
            get geomVelocity() {
                return this._inputs[2];
            }
            /**
             * Gets the geometry view depth input component
             */
            get geomViewDepth() {
                return this._inputs[3];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.velocityTexture = this.geomVelocity.connectedPoint?.value;
                this._frameGraphTask.depthTexture = this.geomViewDepth.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.motionStrength = ${this.motionStrength};`);
                codes.push(`${this._codeVariableName}.motionBlurSamples = ${this.motionBlurSamples};`);
                codes.push(`${this._codeVariableName}.isObjectBased = ${this.isObjectBased};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.motionStrength = this.motionStrength;
                serializationObject.motionBlurSamples = this.motionBlurSamples;
                serializationObject.isObjectBased = this.isObjectBased;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.motionStrength = serializationObject.motionStrength;
                this.motionBlurSamples = serializationObject.motionBlurSamples;
                this.isObjectBased = serializationObject.isObjectBased;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_motionStrength_decorators = [editableInPropertyPage("Strength", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_motionBlurSamples_decorators = [editableInPropertyPage("Samples", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_isObjectBased_decorators = [editableInPropertyPage("Object based", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            __esDecorate(_a, null, _get_motionStrength_decorators, { kind: "getter", name: "motionStrength", static: false, private: false, access: { has: obj => "motionStrength" in obj, get: obj => obj.motionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_motionBlurSamples_decorators, { kind: "getter", name: "motionBlurSamples", static: false, private: false, access: { has: obj => "motionBlurSamples" in obj, get: obj => obj.motionBlurSamples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_isObjectBased_decorators, { kind: "getter", name: "isObjectBased", static: false, private: false, access: { has: obj => "isObjectBased" in obj, get: obj => obj.isObjectBased }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphMotionBlurPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for motionBlurPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMotionBlurPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphMotionBlurPostProcessBlock", NodeRenderGraphMotionBlurPostProcessBlock);
}
//# sourceMappingURL=motionBlurPostProcessBlock.pure.js.map
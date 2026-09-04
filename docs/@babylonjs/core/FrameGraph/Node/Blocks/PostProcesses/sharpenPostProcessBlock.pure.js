/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphSharpenTask } from "../../../Tasks/PostProcesses/sharpenTask.js";
import { ThinSharpenPostProcess } from "../../../../PostProcesses/thinSharpenPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the sharpen post process
 */
let NodeRenderGraphSharpenPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_colorAmount_decorators;
    let _get_edgeAmount_decorators;
    return _a = class NodeRenderGraphSharpenPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new sharpen post process block
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphSharpenTask(this.name, frameGraph, new ThinSharpenPostProcess(name, scene.getEngine()));
            }
            /** How much of the original color should be applied. Setting this to 0 will display edge detection. */
            get colorAmount() {
                return this._frameGraphTask.postProcess.colorAmount;
            }
            set colorAmount(value) {
                this._frameGraphTask.postProcess.colorAmount = value;
            }
            /** How much sharpness should be applied. */
            get edgeAmount() {
                return this._frameGraphTask.postProcess.edgeAmount;
            }
            set edgeAmount(value) {
                this._frameGraphTask.postProcess.edgeAmount = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphSharpenPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.colorAmount = ${this.colorAmount};`);
                codes.push(`${this._codeVariableName}.edgeAmount = ${this.edgeAmount};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.colorAmount = this.colorAmount;
                serializationObject.edgeAmount = this.edgeAmount;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.colorAmount = serializationObject.colorAmount;
                this.edgeAmount = serializationObject.edgeAmount;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_colorAmount_decorators = [editableInPropertyPage("Color Amount", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 3 })];
            _get_edgeAmount_decorators = [editableInPropertyPage("Edge Amount", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 5 })];
            __esDecorate(_a, null, _get_colorAmount_decorators, { kind: "getter", name: "colorAmount", static: false, private: false, access: { has: obj => "colorAmount" in obj, get: obj => obj.colorAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_edgeAmount_decorators, { kind: "getter", name: "edgeAmount", static: false, private: false, access: { has: obj => "edgeAmount" in obj, get: obj => obj.edgeAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphSharpenPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for sharpenPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSharpenPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphSharpenPostProcessBlock", NodeRenderGraphSharpenPostProcessBlock);
}
//# sourceMappingURL=sharpenPostProcessBlock.pure.js.map
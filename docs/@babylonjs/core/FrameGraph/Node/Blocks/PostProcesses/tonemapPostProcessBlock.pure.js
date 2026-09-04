/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphTonemapTask } from "../../../Tasks/PostProcesses/tonemapTask.js";
import { ThinTonemapPostProcess } from "../../../../PostProcesses/thinTonemapPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the tonemap post process
 */
let NodeRenderGraphTonemapPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_operator_decorators;
    let _get_exposureAdjustment_decorators;
    return _a = class NodeRenderGraphTonemapPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphTonemapPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param operator defines the operator to use (default: Reinhard)
             */
            constructor(name, frameGraph, scene, operator = 1 /* TonemappingOperator.Reinhard */) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [operator];
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphTonemapTask(this.name, frameGraph, new ThinTonemapPostProcess(name, frameGraph.engine, { operator }));
            }
            _createTask(operator) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                const exposureAdjustment = this._frameGraphTask.postProcess.exposureAdjustment;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphTonemapTask(this.name, this._frameGraph, new ThinTonemapPostProcess(this.name, this._frameGraph.engine, { operator }));
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._frameGraphTask.postProcess.exposureAdjustment = exposureAdjustment;
                this._additionalConstructionParameters = [operator];
            }
            get operator() {
                return this._frameGraphTask.postProcess.operator;
            }
            set operator(value) {
                this._createTask(value);
            }
            /** Defines the required exposure adjustment */
            get exposureAdjustment() {
                return this._frameGraphTask.postProcess.exposureAdjustment;
            }
            set exposureAdjustment(value) {
                this._frameGraphTask.postProcess.exposureAdjustment = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphTonemapPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.exposureAdjustment = ${this.exposureAdjustment};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.exposureAdjustment = this.exposureAdjustment;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.exposureAdjustment = serializationObject.exposureAdjustment;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_operator_decorators = [editableInPropertyPage("Operator", 5 /* PropertyTypeForEdition.List */, "PROPERTIES", {
                    options: [
                        { label: "Hable", value: 0 /* TonemappingOperator.Hable */ },
                        { label: "Reinhard", value: 1 /* TonemappingOperator.Reinhard */ },
                        { label: "HejiDawson", value: 2 /* TonemappingOperator.HejiDawson */ },
                        { label: "Photographic", value: 3 /* TonemappingOperator.Photographic */ },
                    ],
                })];
            _get_exposureAdjustment_decorators = [editableInPropertyPage("Exposure adjustment", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            __esDecorate(_a, null, _get_operator_decorators, { kind: "getter", name: "operator", static: false, private: false, access: { has: obj => "operator" in obj, get: obj => obj.operator }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_exposureAdjustment_decorators, { kind: "getter", name: "exposureAdjustment", static: false, private: false, access: { has: obj => "exposureAdjustment" in obj, get: obj => obj.exposureAdjustment }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphTonemapPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for tonemapPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTonemapPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphTonemapPostProcessBlock", NodeRenderGraphTonemapPostProcessBlock);
}
//# sourceMappingURL=tonemapPostProcessBlock.pure.js.map
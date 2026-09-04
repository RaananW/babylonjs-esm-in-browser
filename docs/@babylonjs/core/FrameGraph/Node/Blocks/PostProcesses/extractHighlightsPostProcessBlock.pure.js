/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphExtractHighlightsTask } from "../../../Tasks/PostProcesses/extractHighlightsTask.js";
import { ThinExtractHighlightsPostProcess } from "../../../../PostProcesses/thinExtractHighlightsPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the extract highlights post process
 */
let NodeRenderGraphExtractHighlightsPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_threshold_decorators;
    return _a = class NodeRenderGraphExtractHighlightsPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new ExtractHighlightsPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphExtractHighlightsTask(this.name, frameGraph, new ThinExtractHighlightsPostProcess(name, scene.getEngine()));
            }
            /** The luminance threshold, pixels below this value will be set to black. */
            get threshold() {
                return this._frameGraphTask.postProcess.threshold;
            }
            set threshold(value) {
                this._frameGraphTask.postProcess.threshold = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphExtractHighlightsPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.threshold = ${this.threshold};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.threshold = this.threshold;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.threshold = serializationObject.threshold;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_threshold_decorators = [editableInPropertyPage("Threshold", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            __esDecorate(_a, null, _get_threshold_decorators, { kind: "getter", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphExtractHighlightsPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for extractHighlightsPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterExtractHighlightsPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphExtractHighlightsPostProcessBlock", NodeRenderGraphExtractHighlightsPostProcessBlock);
}
//# sourceMappingURL=extractHighlightsPostProcessBlock.pure.js.map
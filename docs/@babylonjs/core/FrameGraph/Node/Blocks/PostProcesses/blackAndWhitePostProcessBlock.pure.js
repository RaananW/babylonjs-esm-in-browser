/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphBlackAndWhiteTask } from "../../../Tasks/PostProcesses/blackAndWhiteTask.js";
import { ThinBlackAndWhitePostProcess } from "../../../../PostProcesses/thinBlackAndWhitePostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the black and white post process
 */
let NodeRenderGraphBlackAndWhitePostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_degree_decorators;
    return _a = class NodeRenderGraphBlackAndWhitePostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new BlackAndWhitePostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphBlackAndWhiteTask(this.name, frameGraph, new ThinBlackAndWhitePostProcess(name, scene.getEngine()));
            }
            /** Degree of conversion to black and white (default: 1 - full b&w conversion) */
            get degree() {
                return this._frameGraphTask.postProcess.degree;
            }
            set degree(value) {
                this._frameGraphTask.postProcess.degree = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphBlackAndWhitePostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.degree = ${this.degree};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.degree = this.degree;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.degree = serializationObject.degree;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_degree_decorators = [editableInPropertyPage("Degree", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            __esDecorate(_a, null, _get_degree_decorators, { kind: "getter", name: "degree", static: false, private: false, access: { has: obj => "degree" in obj, get: obj => obj.degree }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphBlackAndWhitePostProcessBlock };
let _Registered = false;
/**
 * Register side effects for blackAndWhitePostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBlackAndWhitePostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphBlackAndWhitePostProcessBlock", NodeRenderGraphBlackAndWhitePostProcessBlock);
}
//# sourceMappingURL=blackAndWhitePostProcessBlock.pure.js.map
/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphBlurTask } from "../../../Tasks/PostProcesses/blurTask.js";
import { ThinBlurPostProcess } from "../../../../PostProcesses/thinBlurPostProcess.js";
import { Vector2 } from "../../../../Maths/math.vector.pure.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the blur post process
 */
let NodeRenderGraphBlurPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_direction_decorators;
    let _get_kernel_decorators;
    return _a = class NodeRenderGraphBlurPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphBlurPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphBlurTask(this.name, frameGraph, new ThinBlurPostProcess(name, scene.getEngine(), new Vector2(1, 0), 32));
            }
            /** The direction in which to blur the image */
            get direction() {
                return this._frameGraphTask.postProcess.direction;
            }
            set direction(value) {
                this._frameGraphTask.postProcess.direction = value;
            }
            /** Length in pixels of the blur sample region */
            get kernel() {
                return this._frameGraphTask.postProcess.kernel;
            }
            set kernel(value) {
                this._frameGraphTask.postProcess.kernel = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphBlurPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.direction = new BABYLON.Vector2(${this.direction.x}, ${this.direction.y});`);
                codes.push(`${this._codeVariableName}.kernel = ${this.kernel};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.direction = this.direction.asArray();
                serializationObject.kernel = this.kernel;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.direction.fromArray(serializationObject.direction);
                this.kernel = serializationObject.kernel;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_direction_decorators = [editableInPropertyPage("Direction", 3 /* PropertyTypeForEdition.Vector2 */, "PROPERTIES")];
            _get_kernel_decorators = [editableInPropertyPage("Kernel", 2 /* PropertyTypeForEdition.Int */, "PROPERTIES", { min: 1, max: 256 })];
            __esDecorate(_a, null, _get_direction_decorators, { kind: "getter", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_kernel_decorators, { kind: "getter", name: "kernel", static: false, private: false, access: { has: obj => "kernel" in obj, get: obj => obj.kernel }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphBlurPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for blurPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBlurPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphBlurPostProcessBlock", NodeRenderGraphBlurPostProcessBlock);
}
//# sourceMappingURL=blurPostProcessBlock.pure.js.map
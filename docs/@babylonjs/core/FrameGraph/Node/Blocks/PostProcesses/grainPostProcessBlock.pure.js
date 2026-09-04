/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphGrainTask } from "../../../Tasks/PostProcesses/grainTask.js";
import { ThinGrainPostProcess } from "../../../../PostProcesses/thinGrainPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the grain post process
 */
let NodeRenderGraphGrainPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_intensity_decorators;
    let _get_animated_decorators;
    return _a = class NodeRenderGraphGrainPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new grain post process block
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphGrainTask(this.name, frameGraph, new ThinGrainPostProcess(name, scene.getEngine()));
            }
            /** The intensity of the grain added */
            get intensity() {
                return this._frameGraphTask.postProcess.intensity;
            }
            set intensity(value) {
                this._frameGraphTask.postProcess.intensity = value;
            }
            /** If the grain should be randomized on every frame */
            get animated() {
                return this._frameGraphTask.postProcess.animated;
            }
            set animated(value) {
                this._frameGraphTask.postProcess.animated = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphGrainPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.intensity = ${this.intensity};`);
                codes.push(`${this._codeVariableName}.animated = ${this.animated};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.intensity = this.intensity;
                serializationObject.animated = this.animated;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.intensity = serializationObject.intensity;
                this.animated = serializationObject.animated;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_intensity_decorators = [editableInPropertyPage("Intensity", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 200 })];
            _get_animated_decorators = [editableInPropertyPage("Animated", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            __esDecorate(_a, null, _get_intensity_decorators, { kind: "getter", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_animated_decorators, { kind: "getter", name: "animated", static: false, private: false, access: { has: obj => "animated" in obj, get: obj => obj.animated }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphGrainPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for grainPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGrainPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphGrainPostProcessBlock", NodeRenderGraphGrainPostProcessBlock);
}
//# sourceMappingURL=grainPostProcessBlock.pure.js.map
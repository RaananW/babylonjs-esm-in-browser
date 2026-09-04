/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { Vector2 } from "../../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphChromaticAberrationTask } from "../../../Tasks/PostProcesses/chromaticAberrationTask.js";
import { ThinChromaticAberrationPostProcess } from "../../../../PostProcesses/thinChromaticAberrationPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the chromatic aberration post process
 */
let NodeRenderGraphChromaticAberrationPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_aberrationAmount_decorators;
    let _get_radialIntensity_decorators;
    let _get_direction_decorators;
    return _a = class NodeRenderGraphChromaticAberrationPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new chromatic aberration post process block
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphChromaticAberrationTask(this.name, frameGraph, new ThinChromaticAberrationPostProcess(name, scene.getEngine()));
            }
            /** The amount of separation of rgb channels */
            get aberrationAmount() {
                return this._frameGraphTask.postProcess.aberrationAmount;
            }
            set aberrationAmount(value) {
                this._frameGraphTask.postProcess.aberrationAmount = value;
            }
            /** The amount the effect will increase for pixels closer to the edge of the screen */
            get radialIntensity() {
                return this._frameGraphTask.postProcess.radialIntensity;
            }
            set radialIntensity(value) {
                this._frameGraphTask.postProcess.radialIntensity = value;
            }
            /** The normalized direction in which the rgb channels should be separated. If set to 0,0 radial direction will be used. */
            get direction() {
                return this._frameGraphTask.postProcess.direction;
            }
            set direction(value) {
                this._frameGraphTask.postProcess.direction = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphChromaticAberrationPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.aberrationAmount = ${this.aberrationAmount};`);
                codes.push(`${this._codeVariableName}.radialIntensity = ${this.radialIntensity};`);
                codes.push(`${this._codeVariableName}.direction = new BABYLON.Vector2(${this.direction.x}, ${this.direction.y});`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.aberrationAmount = this.aberrationAmount;
                serializationObject.radialIntensity = this.radialIntensity;
                serializationObject.direction = this.direction.asArray();
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.aberrationAmount = serializationObject.aberrationAmount;
                this.radialIntensity = serializationObject.radialIntensity;
                this.direction = Vector2.FromArray(serializationObject.direction);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_aberrationAmount_decorators = [editableInPropertyPage("Amount", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: -1000, max: 1000 })];
            _get_radialIntensity_decorators = [editableInPropertyPage("Radial intensity", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: -1, max: 5 })];
            _get_direction_decorators = [editableInPropertyPage("Direction", 3 /* PropertyTypeForEdition.Vector2 */, "PROPERTIES")];
            __esDecorate(_a, null, _get_aberrationAmount_decorators, { kind: "getter", name: "aberrationAmount", static: false, private: false, access: { has: obj => "aberrationAmount" in obj, get: obj => obj.aberrationAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_radialIntensity_decorators, { kind: "getter", name: "radialIntensity", static: false, private: false, access: { has: obj => "radialIntensity" in obj, get: obj => obj.radialIntensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_direction_decorators, { kind: "getter", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphChromaticAberrationPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for chromaticAberrationPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterChromaticAberrationPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphChromaticAberrationPostProcessBlock", NodeRenderGraphChromaticAberrationPostProcessBlock);
}
//# sourceMappingURL=chromaticAberrationPostProcessBlock.pure.js.map
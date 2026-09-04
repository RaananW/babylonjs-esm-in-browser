/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphScreenSpaceCurvatureTask } from "../../../Tasks/PostProcesses/screenSpaceCurvatureTask.js";
import { ThinScreenSpaceCurvaturePostProcess } from "../../../../PostProcesses/thinScreenSpaceCurvaturePostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the screen space curvature post process
 */
let NodeRenderGraphScreenSpaceCurvaturePostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_ridge_decorators;
    let _get_valley_decorators;
    return _a = class NodeRenderGraphScreenSpaceCurvaturePostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphScreenSpaceCurvaturePostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("geomViewNormal", NodeRenderGraphBlockConnectionPointTypes.TextureViewNormal);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphScreenSpaceCurvatureTask(this.name, frameGraph, new ThinScreenSpaceCurvaturePostProcess(name, scene.getEngine()));
            }
            /** Defines how much ridge the curvature effect displays. */
            get ridge() {
                return this._frameGraphTask.postProcess.ridge;
            }
            set ridge(value) {
                this._frameGraphTask.postProcess.ridge = value;
            }
            /** Defines how much valley the curvature effect displays. */
            get valley() {
                return this._frameGraphTask.postProcess.valley;
            }
            set valley(value) {
                this._frameGraphTask.postProcess.valley = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphScreenSpaceCurvaturePostProcessBlock";
            }
            /**
             * Gets the geometry view normal input component
             */
            get geomViewNormal() {
                return this._inputs[2];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.normalTexture = this.geomViewNormal.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.ridge = ${this.ridge};`);
                codes.push(`${this._codeVariableName}.valley = ${this.valley};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.ridge = this.ridge;
                serializationObject.valley = this.valley;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.ridge = serializationObject.ridge;
                this.valley = serializationObject.valley;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_ridge_decorators = [editableInPropertyPage("Ridge", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            _get_valley_decorators = [editableInPropertyPage("Valley", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 1 })];
            __esDecorate(_a, null, _get_ridge_decorators, { kind: "getter", name: "ridge", static: false, private: false, access: { has: obj => "ridge" in obj, get: obj => obj.ridge }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_valley_decorators, { kind: "getter", name: "valley", static: false, private: false, access: { has: obj => "valley" in obj, get: obj => obj.valley }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphScreenSpaceCurvaturePostProcessBlock };
let _Registered = false;
/**
 * Register side effects for screenSpaceCurvaturePostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterScreenSpaceCurvaturePostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphScreenSpaceCurvaturePostProcessBlock", NodeRenderGraphScreenSpaceCurvaturePostProcessBlock);
}
//# sourceMappingURL=screenSpaceCurvaturePostProcessBlock.pure.js.map
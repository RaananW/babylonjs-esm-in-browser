/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphCircleOfConfusionTask } from "../../../Tasks/PostProcesses/circleOfConfusionTask.js";
import { ThinCircleOfConfusionPostProcess } from "../../../../PostProcesses/thinCircleOfConfusionPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the circle of confusion post process
 */
let NodeRenderGraphCircleOfConfusionPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_depthSamplingMode_decorators;
    let _get_lensSize_decorators;
    let _get_fStop_decorators;
    let _get_focusDistance_decorators;
    let _get_focalLength_decorators;
    return _a = class NodeRenderGraphCircleOfConfusionPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphCircleOfConfusionPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this.registerInput("geomViewDepth", NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphCircleOfConfusionTask(this.name, frameGraph, new ThinCircleOfConfusionPostProcess(name, scene.getEngine(), { depthNotNormalized: true }));
            }
            /** Sampling mode used to sample from the depth texture */
            get depthSamplingMode() {
                return this._frameGraphTask.depthSamplingMode;
            }
            set depthSamplingMode(value) {
                this._frameGraphTask.depthSamplingMode = value;
            }
            /** Max lens size in scene units/1000 (eg. millimeter). Standard cameras are 50mm. The diameter of the resulting aperture can be computed by lensSize/fStop. */
            get lensSize() {
                return this._frameGraphTask.postProcess.lensSize;
            }
            set lensSize(value) {
                this._frameGraphTask.postProcess.lensSize = value;
            }
            /** F-Stop of the effect's camera. The diameter of the resulting aperture can be computed by lensSize/fStop */
            get fStop() {
                return this._frameGraphTask.postProcess.fStop;
            }
            set fStop(value) {
                this._frameGraphTask.postProcess.fStop = value;
            }
            /** Distance away from the camera to focus on in scene units/1000 (eg. millimeter) */
            get focusDistance() {
                return this._frameGraphTask.postProcess.focusDistance;
            }
            set focusDistance(value) {
                this._frameGraphTask.postProcess.focusDistance = value;
            }
            /** Focal length of the effect's camera in scene units/1000 (eg. millimeter) */
            get focalLength() {
                return this._frameGraphTask.postProcess.focalLength;
            }
            set focalLength(value) {
                this._frameGraphTask.postProcess.focalLength = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphCircleOfConfusionPostProcessBlock";
            }
            /**
             * Gets the geometry view depth input component
             */
            get geomViewDepth() {
                return this._inputs[2];
            }
            /**
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[3];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.depthTexture = this.geomViewDepth.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.lensSize = ${this.lensSize};`);
                codes.push(`${this._codeVariableName}.fStop = ${this.fStop};`);
                codes.push(`${this._codeVariableName}.focusDistance = ${this.focusDistance};`);
                codes.push(`${this._codeVariableName}.focalLength = ${this.focalLength};`);
                codes.push(`${this._codeVariableName}.depthSamplingMode = ${this.depthSamplingMode};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.lensSize = this.lensSize;
                serializationObject.fStop = this.fStop;
                serializationObject.focusDistance = this.focusDistance;
                serializationObject.focalLength = this.focalLength;
                serializationObject.depthSamplingMode = this.depthSamplingMode;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.lensSize = serializationObject.lensSize;
                this.fStop = serializationObject.fStop;
                this.focusDistance = serializationObject.focusDistance;
                this.focalLength = serializationObject.focalLength;
                this.depthSamplingMode = serializationObject.depthSamplingMode;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_depthSamplingMode_decorators = [editableInPropertyPage("Depth sampling mode", 8 /* PropertyTypeForEdition.SamplingMode */, "PROPERTIES")];
            _get_lensSize_decorators = [editableInPropertyPage("Lens size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_fStop_decorators = [editableInPropertyPage("F-Stop", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_focusDistance_decorators = [editableInPropertyPage("Focus distance", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_focalLength_decorators = [editableInPropertyPage("Focal length", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            __esDecorate(_a, null, _get_depthSamplingMode_decorators, { kind: "getter", name: "depthSamplingMode", static: false, private: false, access: { has: obj => "depthSamplingMode" in obj, get: obj => obj.depthSamplingMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_lensSize_decorators, { kind: "getter", name: "lensSize", static: false, private: false, access: { has: obj => "lensSize" in obj, get: obj => obj.lensSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_fStop_decorators, { kind: "getter", name: "fStop", static: false, private: false, access: { has: obj => "fStop" in obj, get: obj => obj.fStop }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focusDistance_decorators, { kind: "getter", name: "focusDistance", static: false, private: false, access: { has: obj => "focusDistance" in obj, get: obj => obj.focusDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focalLength_decorators, { kind: "getter", name: "focalLength", static: false, private: false, access: { has: obj => "focalLength" in obj, get: obj => obj.focalLength }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphCircleOfConfusionPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for circleOfConfusionPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCircleOfConfusionPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphCircleOfConfusionPostProcessBlock", NodeRenderGraphCircleOfConfusionPostProcessBlock);
}
//# sourceMappingURL=circleOfConfusionPostProcessBlock.pure.js.map
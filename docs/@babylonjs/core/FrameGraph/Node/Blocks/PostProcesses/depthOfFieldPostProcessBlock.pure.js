/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphDepthOfFieldTask } from "../../../Tasks/PostProcesses/depthOfFieldTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the depth of field post process
 */
let NodeRenderGraphDepthOfFieldPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBasePostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_blurLevel_decorators;
    let _get_hdr_decorators;
    let _get_depthSamplingMode_decorators;
    let _get_focalLength_decorators;
    let _get_fStop_decorators;
    let _get_focusDistance_decorators;
    let _get_lensSize_decorators;
    return _a = class NodeRenderGraphDepthOfFieldPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphDepthOfFieldPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param blurLevel The quality of the depth of field effect (default: ThinDepthOfFieldEffectBlurLevel.Low)
             * @param hdr If high dynamic range textures should be used (default: false)
             */
            constructor(name, frameGraph, scene, blurLevel = 0 /* ThinDepthOfFieldEffectBlurLevel.Low */, hdr = false) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [blurLevel, hdr];
                this.registerInput("geomViewDepth", NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphDepthOfFieldTask(this.name, frameGraph, blurLevel, hdr);
            }
            _createTask(blurLevel, hdr) {
                const sourceSamplingMode = this._frameGraphTask.sourceSamplingMode;
                const depthSamplingMode = this._frameGraphTask.depthSamplingMode;
                const focalLength = this._frameGraphTask.depthOfField.focalLength;
                const fStop = this._frameGraphTask.depthOfField.fStop;
                const focusDistance = this._frameGraphTask.depthOfField.focusDistance;
                const lensSize = this._frameGraphTask.depthOfField.lensSize;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphDepthOfFieldTask(this.name, this._frameGraph, blurLevel, hdr);
                this._frameGraphTask.sourceSamplingMode = sourceSamplingMode;
                this._frameGraphTask.depthSamplingMode = depthSamplingMode;
                this._frameGraphTask.depthOfField.focalLength = focalLength;
                this._frameGraphTask.depthOfField.fStop = fStop;
                this._frameGraphTask.depthOfField.focusDistance = focusDistance;
                this._frameGraphTask.depthOfField.lensSize = lensSize;
                this._additionalConstructionParameters = [blurLevel, hdr];
            }
            /** The quality of the blur effect */
            get blurLevel() {
                return this._frameGraphTask.depthOfField.blurLevel;
            }
            set blurLevel(value) {
                this._createTask(value, this._frameGraphTask.hdr);
            }
            /** If high dynamic range textures should be used */
            get hdr() {
                return this._frameGraphTask.hdr;
            }
            set hdr(value) {
                this._createTask(this._frameGraphTask.depthOfField.blurLevel, value);
            }
            /** Sampling mode used to sample from the depth texture */
            get depthSamplingMode() {
                return this._frameGraphTask.depthSamplingMode;
            }
            set depthSamplingMode(value) {
                this._frameGraphTask.depthSamplingMode = value;
            }
            /** The focal the length of the camera used in the effect in scene units/1000 (eg. millimeter). */
            get focalLength() {
                return this._frameGraphTask.depthOfField.focalLength;
            }
            set focalLength(value) {
                this._frameGraphTask.depthOfField.focalLength = value;
            }
            /** F-Stop of the effect's camera. The diameter of the resulting aperture can be computed by lensSize/fStop. */
            get fStop() {
                return this._frameGraphTask.depthOfField.fStop;
            }
            set fStop(value) {
                this._frameGraphTask.depthOfField.fStop = value;
            }
            /** Distance away from the camera to focus on in scene units/1000 (eg. millimeter). */
            get focusDistance() {
                return this._frameGraphTask.depthOfField.focusDistance;
            }
            set focusDistance(value) {
                this._frameGraphTask.depthOfField.focusDistance = value;
            }
            /** Max lens size in scene units/1000 (eg. millimeter). Standard cameras are 50mm. The diameter of the resulting aperture can be computed by lensSize/fStop. */
            get lensSize() {
                return this._frameGraphTask.depthOfField.lensSize;
            }
            set lensSize(value) {
                this._frameGraphTask.depthOfField.lensSize = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphDepthOfFieldPostProcessBlock";
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
                this.output.value = this._frameGraphTask.outputTexture;
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
            _get_blurLevel_decorators = [editableInPropertyPage("Blur level", 5 /* PropertyTypeForEdition.List */, "PROPERTIES", {
                    options: [
                        { label: "Low", value: 0 /* ThinDepthOfFieldEffectBlurLevel.Low */ },
                        { label: "Medium", value: 1 /* ThinDepthOfFieldEffectBlurLevel.Medium */ },
                        { label: "High", value: 2 /* ThinDepthOfFieldEffectBlurLevel.High */ },
                    ],
                })];
            _get_hdr_decorators = [editableInPropertyPage("HDR", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")];
            _get_depthSamplingMode_decorators = [editableInPropertyPage("Depth sampling mode", 8 /* PropertyTypeForEdition.SamplingMode */, "PROPERTIES")];
            _get_focalLength_decorators = [editableInPropertyPage("Focal length", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_fStop_decorators = [editableInPropertyPage("F-Stop", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_focusDistance_decorators = [editableInPropertyPage("Focus distance", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            _get_lensSize_decorators = [editableInPropertyPage("Lens size", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES")];
            __esDecorate(_a, null, _get_blurLevel_decorators, { kind: "getter", name: "blurLevel", static: false, private: false, access: { has: obj => "blurLevel" in obj, get: obj => obj.blurLevel }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_hdr_decorators, { kind: "getter", name: "hdr", static: false, private: false, access: { has: obj => "hdr" in obj, get: obj => obj.hdr }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_depthSamplingMode_decorators, { kind: "getter", name: "depthSamplingMode", static: false, private: false, access: { has: obj => "depthSamplingMode" in obj, get: obj => obj.depthSamplingMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focalLength_decorators, { kind: "getter", name: "focalLength", static: false, private: false, access: { has: obj => "focalLength" in obj, get: obj => obj.focalLength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_fStop_decorators, { kind: "getter", name: "fStop", static: false, private: false, access: { has: obj => "fStop" in obj, get: obj => obj.fStop }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focusDistance_decorators, { kind: "getter", name: "focusDistance", static: false, private: false, access: { has: obj => "focusDistance" in obj, get: obj => obj.focusDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_lensSize_decorators, { kind: "getter", name: "lensSize", static: false, private: false, access: { has: obj => "lensSize" in obj, get: obj => obj.lensSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphDepthOfFieldPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for depthOfFieldPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDepthOfFieldPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphDepthOfFieldPostProcessBlock", NodeRenderGraphDepthOfFieldPostProcessBlock);
}
//# sourceMappingURL=depthOfFieldPostProcessBlock.pure.js.map
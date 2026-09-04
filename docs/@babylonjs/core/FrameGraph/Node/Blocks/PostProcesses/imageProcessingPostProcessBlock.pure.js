/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphImageProcessingTask } from "../../../Tasks/PostProcesses/imageProcessingTask.js";
import { ThinImageProcessingPostProcess } from "../../../../PostProcesses/thinImageProcessingPostProcess.js";
import { ImageProcessingConfiguration } from "../../../../Materials/imageProcessingConfiguration.pure.js";
import { Color4 } from "../../../../Maths/math.color.pure.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the image processing post process
 */
let NodeRenderGraphImageProcessingPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseWithPropertiesPostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_contrast_decorators;
    let _get_exposure_decorators;
    let _get_toneMappingEnabled_decorators;
    let _get_toneMappingType_decorators;
    let _get_vignetteEnabled_decorators;
    let _get_vignetteWeight_decorators;
    let _get_vignetteStretch_decorators;
    let _get_vignetteCameraFov_decorators;
    let _get_vignetteCenterX_decorators;
    let _get_vignetteCenterY_decorators;
    let _get_vignetteColor_decorators;
    let _get_vignetteBlendMode_decorators;
    let _get_ditheringEnabled_decorators;
    let _get_ditheringIntensity_decorators;
    return _a = class NodeRenderGraphImageProcessingPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new image processing post process block
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             */
            constructor(name, frameGraph, scene) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphImageProcessingTask(this.name, frameGraph, new ThinImageProcessingPostProcess(name, scene.getEngine(), {
                    scene,
                    imageProcessingConfiguration: new ImageProcessingConfiguration(),
                }));
            }
            /** Contrast used in the effect */
            get contrast() {
                return this._frameGraphTask.postProcess.contrast;
            }
            set contrast(value) {
                this._frameGraphTask.postProcess.contrast = value;
            }
            /** Exposure used in the effect */
            get exposure() {
                return this._frameGraphTask.postProcess.exposure;
            }
            set exposure(value) {
                this._frameGraphTask.postProcess.exposure = value;
            }
            /** Whether the tone mapping effect is enabled. */
            get toneMappingEnabled() {
                return this._frameGraphTask.postProcess.toneMappingEnabled;
            }
            set toneMappingEnabled(value) {
                this._frameGraphTask.postProcess.toneMappingEnabled = value;
            }
            /** Type of tone mapping effect. */
            get toneMappingType() {
                return this._frameGraphTask.postProcess.toneMappingType;
            }
            set toneMappingType(value) {
                this._frameGraphTask.postProcess.toneMappingType = value;
            }
            /** Whether the vignette effect is enabled. */
            get vignetteEnabled() {
                return this._frameGraphTask.postProcess.vignetteEnabled;
            }
            set vignetteEnabled(value) {
                this._frameGraphTask.postProcess.vignetteEnabled = value;
            }
            /** Vignette weight or intensity of the vignette effect. */
            get vignetteWeight() {
                return this._frameGraphTask.postProcess.vignetteWeight;
            }
            set vignetteWeight(value) {
                this._frameGraphTask.postProcess.vignetteWeight = value;
            }
            /** Vignette stretch size. */
            get vignetteStretch() {
                return this._frameGraphTask.postProcess.vignetteStretch;
            }
            set vignetteStretch(value) {
                this._frameGraphTask.postProcess.vignetteStretch = value;
            }
            /** Camera field of view used by the Vignette effect. */
            get vignetteCameraFov() {
                return this._frameGraphTask.postProcess.vignetteCameraFov;
            }
            set vignetteCameraFov(value) {
                this._frameGraphTask.postProcess.vignetteCameraFov = value;
            }
            /** Vignette center X Offset. */
            get vignetteCenterX() {
                return this._frameGraphTask.postProcess.vignetteCenterX;
            }
            set vignetteCenterX(value) {
                this._frameGraphTask.postProcess.vignetteCenterX = value;
            }
            /** Vignette center Y Offset. */
            get vignetteCenterY() {
                return this._frameGraphTask.postProcess.vignetteCenterY;
            }
            set vignetteCenterY(value) {
                this._frameGraphTask.postProcess.vignetteCenterY = value;
            }
            /** Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode) */
            get vignetteColor() {
                return this._frameGraphTask.postProcess.vignetteColor;
            }
            set vignetteColor(value) {
                this._frameGraphTask.postProcess.vignetteColor = value;
            }
            /** Vignette blend mode allowing different kind of effect. */
            get vignetteBlendMode() {
                return this._frameGraphTask.postProcess.vignetteBlendMode;
            }
            set vignetteBlendMode(value) {
                this._frameGraphTask.postProcess.vignetteBlendMode = value;
            }
            /** Whether the dithering effect is enabled. */
            get ditheringEnabled() {
                return this._frameGraphTask.postProcess.ditheringEnabled;
            }
            set ditheringEnabled(value) {
                this._frameGraphTask.postProcess.ditheringEnabled = value;
            }
            /** Sets whether the dithering effect is enabled. */
            get ditheringIntensity() {
                return this._frameGraphTask.postProcess.ditheringIntensity;
            }
            set ditheringIntensity(value) {
                this._frameGraphTask.postProcess.ditheringIntensity = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphImageProcessingPostProcessBlock";
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.contrast = ${this.contrast};`);
                codes.push(`${this._codeVariableName}.exposure = ${this.exposure};`);
                codes.push(`${this._codeVariableName}.toneMappingEnabled = ${this.toneMappingEnabled};`);
                codes.push(`${this._codeVariableName}.toneMappingType = ${this.toneMappingType};`);
                codes.push(`${this._codeVariableName}.vignetteEnabled = ${this.vignetteEnabled};`);
                codes.push(`${this._codeVariableName}.vignetteWeight = ${this.vignetteWeight};`);
                codes.push(`${this._codeVariableName}.vignetteStretch = ${this.vignetteStretch};`);
                codes.push(`${this._codeVariableName}.vignetteCameraFov = ${this.vignetteCameraFov};`);
                codes.push(`${this._codeVariableName}.vignetteCenterX = ${this.vignetteCenterX};`);
                codes.push(`${this._codeVariableName}.vignetteCenterY = ${this.vignetteCenterY};`);
                codes.push(`${this._codeVariableName}.vignetteColor = new BABYLON.Color4(${this.vignetteColor.r}, ${this.vignetteColor.g}, ${this.vignetteColor.b}, 1);`);
                codes.push(`${this._codeVariableName}.vignetteBlendMode = ${this.vignetteBlendMode};`);
                codes.push(`${this._codeVariableName}.ditheringEnabled = ${this.ditheringEnabled};`);
                codes.push(`${this._codeVariableName}.ditheringIntensity = ${this.ditheringIntensity};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.contrast = this.contrast;
                serializationObject.exposure = this.exposure;
                serializationObject.toneMappingEnabled = this.toneMappingEnabled;
                serializationObject.toneMappingType = this.toneMappingType;
                serializationObject.vignetteEnabled = this.vignetteEnabled;
                serializationObject.vignetteWeight = this.vignetteWeight;
                serializationObject.vignetteStretch = this.vignetteStretch;
                serializationObject.vignetteCameraFov = this.vignetteCameraFov;
                serializationObject.vignetteCenterX = this.vignetteCenterX;
                serializationObject.vignetteCenterY = this.vignetteCenterY;
                serializationObject.vignetteColor = this.vignetteColor.asArray();
                serializationObject.vignetteBlendMode = this.vignetteBlendMode;
                serializationObject.ditheringEnabled = this.ditheringEnabled;
                serializationObject.ditheringIntensity = this.ditheringIntensity;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.contrast = serializationObject.contrast;
                this.exposure = serializationObject.exposure;
                this.toneMappingEnabled = serializationObject.toneMappingEnabled;
                this.toneMappingType = serializationObject.toneMappingType;
                this.vignetteEnabled = serializationObject.vignetteEnabled;
                this.vignetteWeight = serializationObject.vignetteWeight;
                this.vignetteStretch = serializationObject.vignetteStretch;
                this.vignetteCameraFov = serializationObject.vignetteCameraFov;
                this.vignetteCenterX = serializationObject.vignetteCenterX;
                this.vignetteCenterY = serializationObject.vignetteCenterY;
                this.vignetteColor = Color4.FromArray(serializationObject.vignetteColor);
                this.vignetteBlendMode = serializationObject.vignetteBlendMode;
                this.ditheringEnabled = serializationObject.ditheringEnabled;
                this.ditheringIntensity = serializationObject.ditheringIntensity;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_contrast_decorators = [editableInPropertyPage("Contrast", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 4 })];
            _get_exposure_decorators = [editableInPropertyPage("Exposure", 1 /* PropertyTypeForEdition.Float */, "PROPERTIES", { min: 0, max: 4 })];
            _get_toneMappingEnabled_decorators = [editableInPropertyPage("Enabled", 0 /* PropertyTypeForEdition.Boolean */, "TONE MAPPING")];
            _get_toneMappingType_decorators = [editableInPropertyPage("Type", 5 /* PropertyTypeForEdition.List */, "TONE MAPPING", {
                    options: [
                        { value: ImageProcessingConfiguration.TONEMAPPING_STANDARD, label: "Standard" },
                        { value: ImageProcessingConfiguration.TONEMAPPING_ACES, label: "ACES" },
                        { value: ImageProcessingConfiguration.TONEMAPPING_KHR_PBR_NEUTRAL, label: "KHR PBR Neutral" },
                    ],
                })];
            _get_vignetteEnabled_decorators = [editableInPropertyPage("Enabled", 0 /* PropertyTypeForEdition.Boolean */, "VIGNETTE")];
            _get_vignetteWeight_decorators = [editableInPropertyPage("Weight", 1 /* PropertyTypeForEdition.Float */, "VIGNETTE", { min: 0, max: 200 })];
            _get_vignetteStretch_decorators = [editableInPropertyPage("Stretch", 1 /* PropertyTypeForEdition.Float */, "VIGNETTE", { min: 0, max: 1 })];
            _get_vignetteCameraFov_decorators = [editableInPropertyPage("FOV", 1 /* PropertyTypeForEdition.Float */, "VIGNETTE", { min: 0, max: 3.14159 })];
            _get_vignetteCenterX_decorators = [editableInPropertyPage("Center X", 1 /* PropertyTypeForEdition.Float */, "VIGNETTE", { min: 0, max: 1 })];
            _get_vignetteCenterY_decorators = [editableInPropertyPage("Center Y", 1 /* PropertyTypeForEdition.Float */, "VIGNETTE", { min: 0, max: 1 })];
            _get_vignetteColor_decorators = [editableInPropertyPage("Color", 7 /* PropertyTypeForEdition.Color4 */, "VIGNETTE")];
            _get_vignetteBlendMode_decorators = [editableInPropertyPage("Blend mode", 5 /* PropertyTypeForEdition.List */, "VIGNETTE", {
                    options: [
                        { value: ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY, label: "Multiply" },
                        { value: ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE, label: "Opaque" },
                    ],
                })];
            _get_ditheringEnabled_decorators = [editableInPropertyPage("Enabed", 0 /* PropertyTypeForEdition.Boolean */, "DITHERING")];
            _get_ditheringIntensity_decorators = [editableInPropertyPage("Intensity", 1 /* PropertyTypeForEdition.Float */, "DITHERING", { min: 0, max: 1 })];
            __esDecorate(_a, null, _get_contrast_decorators, { kind: "getter", name: "contrast", static: false, private: false, access: { has: obj => "contrast" in obj, get: obj => obj.contrast }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_exposure_decorators, { kind: "getter", name: "exposure", static: false, private: false, access: { has: obj => "exposure" in obj, get: obj => obj.exposure }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_toneMappingEnabled_decorators, { kind: "getter", name: "toneMappingEnabled", static: false, private: false, access: { has: obj => "toneMappingEnabled" in obj, get: obj => obj.toneMappingEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_toneMappingType_decorators, { kind: "getter", name: "toneMappingType", static: false, private: false, access: { has: obj => "toneMappingType" in obj, get: obj => obj.toneMappingType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteEnabled_decorators, { kind: "getter", name: "vignetteEnabled", static: false, private: false, access: { has: obj => "vignetteEnabled" in obj, get: obj => obj.vignetteEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteWeight_decorators, { kind: "getter", name: "vignetteWeight", static: false, private: false, access: { has: obj => "vignetteWeight" in obj, get: obj => obj.vignetteWeight }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteStretch_decorators, { kind: "getter", name: "vignetteStretch", static: false, private: false, access: { has: obj => "vignetteStretch" in obj, get: obj => obj.vignetteStretch }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteCameraFov_decorators, { kind: "getter", name: "vignetteCameraFov", static: false, private: false, access: { has: obj => "vignetteCameraFov" in obj, get: obj => obj.vignetteCameraFov }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteCenterX_decorators, { kind: "getter", name: "vignetteCenterX", static: false, private: false, access: { has: obj => "vignetteCenterX" in obj, get: obj => obj.vignetteCenterX }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteCenterY_decorators, { kind: "getter", name: "vignetteCenterY", static: false, private: false, access: { has: obj => "vignetteCenterY" in obj, get: obj => obj.vignetteCenterY }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteColor_decorators, { kind: "getter", name: "vignetteColor", static: false, private: false, access: { has: obj => "vignetteColor" in obj, get: obj => obj.vignetteColor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_vignetteBlendMode_decorators, { kind: "getter", name: "vignetteBlendMode", static: false, private: false, access: { has: obj => "vignetteBlendMode" in obj, get: obj => obj.vignetteBlendMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ditheringEnabled_decorators, { kind: "getter", name: "ditheringEnabled", static: false, private: false, access: { has: obj => "ditheringEnabled" in obj, get: obj => obj.ditheringEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ditheringIntensity_decorators, { kind: "getter", name: "ditheringIntensity", static: false, private: false, access: { has: obj => "ditheringIntensity" in obj, get: obj => obj.ditheringIntensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphImageProcessingPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for imageProcessingPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterImageProcessingPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphImageProcessingPostProcessBlock", NodeRenderGraphImageProcessingPostProcessBlock);
}
//# sourceMappingURL=imageProcessingPostProcessBlock.pure.js.map
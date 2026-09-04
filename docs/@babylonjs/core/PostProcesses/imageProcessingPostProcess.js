import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { PostProcess } from "./postProcess.pure.js";

import { _ApplyWhiteBalanceOptions, ThinImageProcessingPostProcess } from "./thinImageProcessingPostProcess.js";
/**
 * ImageProcessingPostProcess
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#imageprocessing
 */
let ImageProcessingPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_fromLinearSpace_decorators;
    return _a = class ImageProcessingPostProcess extends _classSuper {
            get _imageProcessingConfiguration() {
                return this._effectWrapper.imageProcessingConfiguration;
            }
            /**
             * Gets the image processing configuration used either in this material.
             */
            get imageProcessingConfiguration() {
                return this._effectWrapper.imageProcessingConfiguration;
            }
            /**
             * Sets the Default image processing configuration used either in the this material.
             *
             * If sets to null, the scene one is in use.
             */
            set imageProcessingConfiguration(value) {
                this._effectWrapper.imageProcessingConfiguration = value;
            }
            /**
             * If the post process is supported.
             */
            get isSupported() {
                const effect = this.getEffect();
                return !effect || effect.isSupported;
            }
            /**
             * Gets Color curves setup used in the effect if colorCurvesEnabled is set to true .
             */
            get colorCurves() {
                return this.imageProcessingConfiguration.colorCurves;
            }
            /**
             * Sets Color curves setup used in the effect if colorCurvesEnabled is set to true .
             */
            set colorCurves(value) {
                this.imageProcessingConfiguration.colorCurves = value;
            }
            /**
             * Gets whether the color curves effect is enabled.
             */
            get colorCurvesEnabled() {
                return this.imageProcessingConfiguration.colorCurvesEnabled;
            }
            /**
             * Sets whether the color curves effect is enabled.
             */
            set colorCurvesEnabled(value) {
                this.imageProcessingConfiguration.colorCurvesEnabled = value;
            }
            /**
             * Gets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
             */
            get colorGradingTexture() {
                return this.imageProcessingConfiguration.colorGradingTexture;
            }
            /**
             * Sets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
             */
            set colorGradingTexture(value) {
                this.imageProcessingConfiguration.colorGradingTexture = value;
            }
            /**
             * Gets whether the color grading effect is enabled.
             */
            get colorGradingEnabled() {
                return this.imageProcessingConfiguration.colorGradingEnabled;
            }
            /**
             * Gets whether the color grading effect is enabled.
             */
            set colorGradingEnabled(value) {
                this.imageProcessingConfiguration.colorGradingEnabled = value;
            }
            /**
             * Gets exposure used in the effect.
             */
            get exposure() {
                return this.imageProcessingConfiguration.exposure;
            }
            /**
             * Sets exposure used in the effect.
             */
            set exposure(value) {
                this.imageProcessingConfiguration.exposure = value;
            }
            /**
             * Gets whether tonemapping is enabled or not.
             */
            get toneMappingEnabled() {
                return this._imageProcessingConfiguration.toneMappingEnabled;
            }
            /**
             * Sets whether tonemapping is enabled or not
             */
            set toneMappingEnabled(value) {
                this._imageProcessingConfiguration.toneMappingEnabled = value;
            }
            /**
             * Gets the type of tone mapping effect.
             */
            get toneMappingType() {
                return this._imageProcessingConfiguration.toneMappingType;
            }
            /**
             * Sets the type of tone mapping effect.
             */
            set toneMappingType(value) {
                this._imageProcessingConfiguration.toneMappingType = value;
            }
            /**
             * Gets contrast used in the effect.
             */
            get contrast() {
                return this.imageProcessingConfiguration.contrast;
            }
            /**
             * Sets contrast used in the effect.
             */
            set contrast(value) {
                this.imageProcessingConfiguration.contrast = value;
            }
            /**
             * Gets whether the white balance effect is enabled.
             */
            get whiteBalanceEnabled() {
                return this.imageProcessingConfiguration.whiteBalanceEnabled;
            }
            /**
             * Sets whether the white balance effect is enabled.
             */
            set whiteBalanceEnabled(value) {
                this.imageProcessingConfiguration.whiteBalanceEnabled = value;
            }
            /**
             * Gets the white balance correlated color temperature, in Kelvin, used in the effect.
             */
            get temperature() {
                return this.imageProcessingConfiguration.temperature;
            }
            /**
             * Sets the white balance correlated color temperature, in Kelvin, used in the effect.
             */
            set temperature(value) {
                this.imageProcessingConfiguration.temperature = value;
            }
            /**
             * Gets the white balance tint offset used in the effect.
             */
            get tint() {
                return this.imageProcessingConfiguration.tint;
            }
            /**
             * Sets the white balance tint offset used in the effect.
             */
            set tint(value) {
                this.imageProcessingConfiguration.tint = value;
            }
            /**
             * Gets Vignette stretch size.
             */
            get vignetteStretch() {
                return this.imageProcessingConfiguration.vignetteStretch;
            }
            /**
             * Sets Vignette stretch size.
             */
            set vignetteStretch(value) {
                this.imageProcessingConfiguration.vignetteStretch = value;
            }
            /**
             * Gets Vignette center X Offset.
             * @deprecated use vignetteCenterX instead
             */
            get vignetteCentreX() {
                return this.imageProcessingConfiguration.vignetteCenterX;
            }
            /**
             * Sets Vignette center X Offset.
             * @deprecated use vignetteCenterX instead
             */
            set vignetteCentreX(value) {
                this.imageProcessingConfiguration.vignetteCenterX = value;
            }
            /**
             * Gets Vignette center Y Offset.
             * @deprecated use vignetteCenterY instead
             */
            get vignetteCentreY() {
                return this.imageProcessingConfiguration.vignetteCenterY;
            }
            /**
             * Sets Vignette center Y Offset.
             * @deprecated use vignetteCenterY instead
             */
            set vignetteCentreY(value) {
                this.imageProcessingConfiguration.vignetteCenterY = value;
            }
            /**
             * Vignette center Y Offset.
             */
            get vignetteCenterY() {
                return this.imageProcessingConfiguration.vignetteCenterY;
            }
            set vignetteCenterY(value) {
                this.imageProcessingConfiguration.vignetteCenterY = value;
            }
            /**
             * Vignette center X Offset.
             */
            get vignetteCenterX() {
                return this.imageProcessingConfiguration.vignetteCenterX;
            }
            set vignetteCenterX(value) {
                this.imageProcessingConfiguration.vignetteCenterX = value;
            }
            /**
             * Gets Vignette weight or intensity of the vignette effect.
             */
            get vignetteWeight() {
                return this.imageProcessingConfiguration.vignetteWeight;
            }
            /**
             * Sets Vignette weight or intensity of the vignette effect.
             */
            set vignetteWeight(value) {
                this.imageProcessingConfiguration.vignetteWeight = value;
            }
            /**
             * Gets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
             * if vignetteEnabled is set to true.
             */
            get vignetteColor() {
                return this.imageProcessingConfiguration.vignetteColor;
            }
            /**
             * Sets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
             * if vignetteEnabled is set to true.
             */
            set vignetteColor(value) {
                this.imageProcessingConfiguration.vignetteColor = value;
            }
            /**
             * Gets Camera field of view used by the Vignette effect.
             */
            get vignetteCameraFov() {
                return this.imageProcessingConfiguration.vignetteCameraFov;
            }
            /**
             * Sets Camera field of view used by the Vignette effect.
             */
            set vignetteCameraFov(value) {
                this.imageProcessingConfiguration.vignetteCameraFov = value;
            }
            /**
             * Gets the vignette blend mode allowing different kind of effect.
             */
            get vignetteBlendMode() {
                return this.imageProcessingConfiguration.vignetteBlendMode;
            }
            /**
             * Sets the vignette blend mode allowing different kind of effect.
             */
            set vignetteBlendMode(value) {
                this.imageProcessingConfiguration.vignetteBlendMode = value;
            }
            /**
             * Gets whether the vignette effect is enabled.
             */
            get vignetteEnabled() {
                return this.imageProcessingConfiguration.vignetteEnabled;
            }
            /**
             * Sets whether the vignette effect is enabled.
             */
            set vignetteEnabled(value) {
                this.imageProcessingConfiguration.vignetteEnabled = value;
            }
            /**
             * Gets intensity of the dithering effect.
             */
            get ditheringIntensity() {
                return this.imageProcessingConfiguration.ditheringIntensity;
            }
            /**
             * Sets intensity of the dithering effect.
             */
            set ditheringIntensity(value) {
                this.imageProcessingConfiguration.ditheringIntensity = value;
            }
            /**
             * Gets whether the dithering effect is enabled.
             */
            get ditheringEnabled() {
                return this.imageProcessingConfiguration.ditheringEnabled;
            }
            /**
             * Sets whether the dithering effect is enabled.
             */
            set ditheringEnabled(value) {
                this.imageProcessingConfiguration.ditheringEnabled = value;
            }
            /**
             * Gets whether the input of the processing is in Gamma or Linear Space.
             */
            get fromLinearSpace() {
                return this._effectWrapper.fromLinearSpace;
            }
            /**
             * Sets whether the input of the processing is in Gamma or Linear Space.
             */
            set fromLinearSpace(value) {
                this._effectWrapper.fromLinearSpace = value;
            }
            constructor(name, options, camera = null, samplingMode, engine, reusable, textureType = 0, imageProcessingConfiguration) {
                const localOptions = {
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    imageProcessingConfiguration,
                    scene: camera?.getScene(),
                    ...options,
                    blockCompilation: true,
                };
                super(name, ThinImageProcessingPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinImageProcessingPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
                // Applied here (not just inside ThinImageProcessingPostProcess's own constructor) so that `temperature`/
                // `tint` are honored even when a caller supplies their own pre-built `effectWrapper`, in which case the
                // thin wrapper above is never constructed and its own application of these options never runs.
                _ApplyWhiteBalanceOptions(this.imageProcessingConfiguration, options);
                this.onApply = () => {
                    this._effectWrapper.overrideAspectRatio = this.aspectRatio;
                };
            }
            /**
             *  "ImageProcessingPostProcess"
             * @returns "ImageProcessingPostProcess"
             */
            getClassName() {
                return "ImageProcessingPostProcess";
            }
            /**
             * @internal
             */
            _updateParameters() {
                this._effectWrapper._updateParameters();
            }
            dispose(camera) {
                super.dispose(camera);
                if (this._imageProcessingConfiguration) {
                    this.imageProcessingConfiguration.applyByPostProcess = false;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_fromLinearSpace_decorators = [serialize()];
            __esDecorate(_a, null, _get_fromLinearSpace_decorators, { kind: "getter", name: "fromLinearSpace", static: false, private: false, access: { has: obj => "fromLinearSpace" in obj, get: obj => obj.fromLinearSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ImageProcessingPostProcess };
//# sourceMappingURL=imageProcessingPostProcess.js.map
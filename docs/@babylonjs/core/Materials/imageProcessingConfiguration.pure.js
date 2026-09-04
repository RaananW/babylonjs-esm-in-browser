/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsTexture, serializeAsColorCurves, serializeAsColor4 } from "../Misc/decorators.js";
import { Observable } from "../Misc/observable.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { GetWhiteBalanceMatrix, MaxTintMagnitude, MinTemperatureKelvin } from "../Maths/colorTemperature.functions.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
import { ColorCurves, ColorCurvesBind } from "../Materials/colorCurves.pure.js";
import { Mix } from "../Misc/tools.functions.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { PrepareSamplersForImageProcessing, PrepareUniformsForImageProcessing } from "./imageProcessingConfiguration.functions.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * This groups together the common properties used for image processing either in direct forward pass
 * or through post processing effect depending on the use of the image processing pipeline in your scene
 * or not.
 */
let ImageProcessingConfiguration = (() => {
    var _a;
    let _colorCurves_decorators;
    let _colorCurves_initializers = [];
    let _colorCurves_extraInitializers = [];
    let __colorCurvesEnabled_decorators;
    let __colorCurvesEnabled_initializers = [];
    let __colorCurvesEnabled_extraInitializers = [];
    let __colorGradingTexture_decorators;
    let __colorGradingTexture_initializers = [];
    let __colorGradingTexture_extraInitializers = [];
    let __colorGradingEnabled_decorators;
    let __colorGradingEnabled_initializers = [];
    let __colorGradingEnabled_extraInitializers = [];
    let __colorGradingWithGreenDepth_decorators;
    let __colorGradingWithGreenDepth_initializers = [];
    let __colorGradingWithGreenDepth_extraInitializers = [];
    let __colorGradingBGR_decorators;
    let __colorGradingBGR_initializers = [];
    let __colorGradingBGR_extraInitializers = [];
    let __exposure_decorators;
    let __exposure_initializers = [];
    let __exposure_extraInitializers = [];
    let __toneMappingEnabled_decorators;
    let __toneMappingEnabled_initializers = [];
    let __toneMappingEnabled_extraInitializers = [];
    let __toneMappingType_decorators;
    let __toneMappingType_initializers = [];
    let __toneMappingType_extraInitializers = [];
    let __contrast_decorators;
    let __contrast_initializers = [];
    let __contrast_extraInitializers = [];
    let __whiteBalanceEnabled_decorators;
    let __whiteBalanceEnabled_initializers = [];
    let __whiteBalanceEnabled_extraInitializers = [];
    let __temperature_decorators;
    let __temperature_initializers = [];
    let __temperature_extraInitializers = [];
    let __tint_decorators;
    let __tint_initializers = [];
    let __tint_extraInitializers = [];
    let _vignetteStretch_decorators;
    let _vignetteStretch_initializers = [];
    let _vignetteStretch_extraInitializers = [];
    let _vignetteCenterX_decorators;
    let _vignetteCenterX_initializers = [];
    let _vignetteCenterX_extraInitializers = [];
    let _vignetteCenterY_decorators;
    let _vignetteCenterY_initializers = [];
    let _vignetteCenterY_extraInitializers = [];
    let _vignetteWeight_decorators;
    let _vignetteWeight_initializers = [];
    let _vignetteWeight_extraInitializers = [];
    let _vignetteColor_decorators;
    let _vignetteColor_initializers = [];
    let _vignetteColor_extraInitializers = [];
    let _vignetteCameraFov_decorators;
    let _vignetteCameraFov_initializers = [];
    let _vignetteCameraFov_extraInitializers = [];
    let __vignetteBlendMode_decorators;
    let __vignetteBlendMode_initializers = [];
    let __vignetteBlendMode_extraInitializers = [];
    let __vignetteEnabled_decorators;
    let __vignetteEnabled_initializers = [];
    let __vignetteEnabled_extraInitializers = [];
    let __ditheringEnabled_decorators;
    let __ditheringEnabled_initializers = [];
    let __ditheringEnabled_extraInitializers = [];
    let __ditheringIntensity_decorators;
    let __ditheringIntensity_initializers = [];
    let __ditheringIntensity_extraInitializers = [];
    let __skipFinalColorClamp_decorators;
    let __skipFinalColorClamp_initializers = [];
    let __skipFinalColorClamp_extraInitializers = [];
    let __applyByPostProcess_decorators;
    let __applyByPostProcess_initializers = [];
    let __applyByPostProcess_extraInitializers = [];
    let __isEnabled_decorators;
    let __isEnabled_initializers = [];
    let __isEnabled_extraInitializers = [];
    let _outputTextureWidth_decorators;
    let _outputTextureWidth_initializers = [];
    let _outputTextureWidth_extraInitializers = [];
    let _outputTextureHeight_decorators;
    let _outputTextureHeight_initializers = [];
    let _outputTextureHeight_extraInitializers = [];
    return _a = class ImageProcessingConfiguration {
            constructor() {
                /**
                 * Color curves setup used in the effect if colorCurvesEnabled is set to true
                 */
                this.colorCurves = __runInitializers(this, _colorCurves_initializers, new ColorCurves());
                this._colorCurvesEnabled = (__runInitializers(this, _colorCurves_extraInitializers), __runInitializers(this, __colorCurvesEnabled_initializers, false));
                this._colorGradingTexture = (__runInitializers(this, __colorCurvesEnabled_extraInitializers), __runInitializers(this, __colorGradingTexture_initializers, void 0));
                this._colorGradingEnabled = (__runInitializers(this, __colorGradingTexture_extraInitializers), __runInitializers(this, __colorGradingEnabled_initializers, false));
                this._colorGradingWithGreenDepth = (__runInitializers(this, __colorGradingEnabled_extraInitializers), __runInitializers(this, __colorGradingWithGreenDepth_initializers, true));
                this._colorGradingBGR = (__runInitializers(this, __colorGradingWithGreenDepth_extraInitializers), __runInitializers(this, __colorGradingBGR_initializers, true));
                /** @internal */
                this._exposure = (__runInitializers(this, __colorGradingBGR_extraInitializers), __runInitializers(this, __exposure_initializers, 1.0));
                this._toneMappingEnabled = (__runInitializers(this, __exposure_extraInitializers), __runInitializers(this, __toneMappingEnabled_initializers, false));
                this._toneMappingType = (__runInitializers(this, __toneMappingEnabled_extraInitializers), __runInitializers(this, __toneMappingType_initializers, _a.TONEMAPPING_STANDARD));
                this._contrast = (__runInitializers(this, __toneMappingType_extraInitializers), __runInitializers(this, __contrast_initializers, 1.0));
                this._whiteBalanceEnabled = (__runInitializers(this, __contrast_extraInitializers), __runInitializers(this, __whiteBalanceEnabled_initializers, false));
                this._temperature = (__runInitializers(this, __whiteBalanceEnabled_extraInitializers), __runInitializers(this, __temperature_initializers, 6500));
                this._tint = (__runInitializers(this, __temperature_extraInitializers), __runInitializers(this, __tint_initializers, 0));
                this._whiteBalanceMatrix = (__runInitializers(this, __tint_extraInitializers), null);
                this._whiteBalanceMatrixTemperature = null;
                this._whiteBalanceMatrixTint = null;
                /**
                 * Vignette stretch size.
                 */
                this.vignetteStretch = __runInitializers(this, _vignetteStretch_initializers, 0);
                /**
                 * Vignette center X Offset.
                 */
                this.vignetteCenterX = (__runInitializers(this, _vignetteStretch_extraInitializers), __runInitializers(this, _vignetteCenterX_initializers, 0));
                /**
                 * Vignette center Y Offset.
                 */
                this.vignetteCenterY = (__runInitializers(this, _vignetteCenterX_extraInitializers), __runInitializers(this, _vignetteCenterY_initializers, 0));
                /**
                 * Vignette weight or intensity of the vignette effect.
                 */
                this.vignetteWeight = (__runInitializers(this, _vignetteCenterY_extraInitializers), __runInitializers(this, _vignetteWeight_initializers, 1.5));
                /**
                 * Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
                 * if vignetteEnabled is set to true.
                 */
                this.vignetteColor = (__runInitializers(this, _vignetteWeight_extraInitializers), __runInitializers(this, _vignetteColor_initializers, new Color4(0, 0, 0, 0)));
                /**
                 * Camera field of view used by the Vignette effect.
                 */
                this.vignetteCameraFov = (__runInitializers(this, _vignetteColor_extraInitializers), __runInitializers(this, _vignetteCameraFov_initializers, 0.5));
                this._vignetteBlendMode = (__runInitializers(this, _vignetteCameraFov_extraInitializers), __runInitializers(this, __vignetteBlendMode_initializers, _a.VIGNETTEMODE_MULTIPLY));
                this._vignetteEnabled = (__runInitializers(this, __vignetteBlendMode_extraInitializers), __runInitializers(this, __vignetteEnabled_initializers, false));
                this._ditheringEnabled = (__runInitializers(this, __vignetteEnabled_extraInitializers), __runInitializers(this, __ditheringEnabled_initializers, false));
                this._ditheringIntensity = (__runInitializers(this, __ditheringEnabled_extraInitializers), __runInitializers(this, __ditheringIntensity_initializers, 1.0 / 255.0));
                /** @internal */
                this._skipFinalColorClamp = (__runInitializers(this, __ditheringIntensity_extraInitializers), __runInitializers(this, __skipFinalColorClamp_initializers, false));
                /** @internal */
                this._applyByPostProcess = (__runInitializers(this, __skipFinalColorClamp_extraInitializers), __runInitializers(this, __applyByPostProcess_initializers, false));
                this._isEnabled = (__runInitializers(this, __applyByPostProcess_extraInitializers), __runInitializers(this, __isEnabled_initializers, true));
                /**
                 * Width of the output texture used in the post process. If not provided, uses the width of the screen.
                 */
                this.outputTextureWidth = (__runInitializers(this, __isEnabled_extraInitializers), __runInitializers(this, _outputTextureWidth_initializers, 0));
                /**
                 * Height of the output texture used in the post process. If not provided, uses the height of the screen.
                 */
                this.outputTextureHeight = (__runInitializers(this, _outputTextureWidth_extraInitializers), __runInitializers(this, _outputTextureHeight_initializers, 0));
                /**
                 * An event triggered when the configuration changes and requires Shader to Update some parameters.
                 */
                this.onUpdateParameters = (__runInitializers(this, _outputTextureHeight_extraInitializers), new Observable());
            }
            /**
             * Gets whether the color curves effect is enabled.
             */
            get colorCurvesEnabled() {
                return this._colorCurvesEnabled;
            }
            /**
             * Sets whether the color curves effect is enabled.
             */
            set colorCurvesEnabled(value) {
                if (this._colorCurvesEnabled === value) {
                    return;
                }
                this._colorCurvesEnabled = value;
                this._updateParameters();
            }
            /**
             * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
             */
            get colorGradingTexture() {
                return this._colorGradingTexture;
            }
            /**
             * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
             */
            set colorGradingTexture(value) {
                if (this._colorGradingTexture === value) {
                    return;
                }
                this._colorGradingTexture = value;
                this._updateParameters();
            }
            /**
             * Gets whether the color grading effect is enabled.
             */
            get colorGradingEnabled() {
                return this._colorGradingEnabled;
            }
            /**
             * Sets whether the color grading effect is enabled.
             */
            set colorGradingEnabled(value) {
                if (this._colorGradingEnabled === value) {
                    return;
                }
                this._colorGradingEnabled = value;
                this._updateParameters();
            }
            /**
             * Gets whether the color grading effect is using a green depth for the 3d Texture.
             */
            get colorGradingWithGreenDepth() {
                return this._colorGradingWithGreenDepth;
            }
            /**
             * Sets whether the color grading effect is using a green depth for the 3d Texture.
             */
            set colorGradingWithGreenDepth(value) {
                if (this._colorGradingWithGreenDepth === value) {
                    return;
                }
                this._colorGradingWithGreenDepth = value;
                this._updateParameters();
            }
            /**
             * Gets whether the color grading texture contains BGR values.
             */
            get colorGradingBGR() {
                return this._colorGradingBGR;
            }
            /**
             * Sets whether the color grading texture contains BGR values.
             */
            set colorGradingBGR(value) {
                if (this._colorGradingBGR === value) {
                    return;
                }
                this._colorGradingBGR = value;
                this._updateParameters();
            }
            /**
             * Gets the Exposure used in the effect.
             */
            get exposure() {
                return this._exposure;
            }
            /**
             * Sets the Exposure used in the effect.
             */
            set exposure(value) {
                if (this._exposure === value) {
                    return;
                }
                this._exposure = value;
                this._updateParameters();
            }
            /**
             * Gets whether the tone mapping effect is enabled.
             */
            get toneMappingEnabled() {
                return this._toneMappingEnabled;
            }
            /**
             * Sets whether the tone mapping effect is enabled.
             */
            set toneMappingEnabled(value) {
                if (this._toneMappingEnabled === value) {
                    return;
                }
                this._toneMappingEnabled = value;
                this._updateParameters();
            }
            /**
             * Gets the type of tone mapping effect.
             */
            get toneMappingType() {
                return this._toneMappingType;
            }
            /**
             * Sets the type of tone mapping effect used in BabylonJS.
             */
            set toneMappingType(value) {
                if (this._toneMappingType === value) {
                    return;
                }
                this._toneMappingType = value;
                this._updateParameters();
            }
            /**
             * Gets the contrast used in the effect.
             */
            get contrast() {
                return this._contrast;
            }
            /**
             * Sets the contrast used in the effect.
             */
            set contrast(value) {
                if (this._contrast === value) {
                    return;
                }
                this._contrast = value;
                this._updateParameters();
            }
            /**
             * Gets whether the white balance effect is enabled.
             */
            get whiteBalanceEnabled() {
                return this._whiteBalanceEnabled;
            }
            /**
             * Sets whether the white balance effect is enabled.
             */
            set whiteBalanceEnabled(value) {
                if (this._whiteBalanceEnabled === value) {
                    return;
                }
                this._whiteBalanceEnabled = value;
                this._updateParameters();
            }
            /**
             * Gets the correlated color temperature, in Kelvin, of the illuminant to neutralize when whiteBalanceEnabled
             * is set to true - i.e. the light the scene is assumed to have been lit with, not a "warm"/"cool" creative
             * adjustment. Lower values (e.g. ~2000-3500 K) correspond to warm/orange sources such as tungsten or candle
             * light; higher values (e.g. ~7000-10000 K) correspond to cool/blue sources such as shade or overcast sky.
             * Clamped to the tabulated range (roughly 1667 K and above) - the getter reflects the clamped value. Default is 6500.
             */
            get temperature() {
                return this._temperature;
            }
            /**
             * Sets the correlated color temperature, in Kelvin, of the illuminant to neutralize when whiteBalanceEnabled
             * is set to true - i.e. the light the scene is assumed to have been lit with, not a "warm"/"cool" creative
             * adjustment. Lower values (e.g. ~2000-3500 K) correspond to warm/orange sources such as tungsten or candle
             * light; higher values (e.g. ~7000-10000 K) correspond to cool/blue sources such as shade or overcast sky.
             * Clamped to the tabulated range (roughly 1667 K and above) - the getter reflects the clamped value. Default is 6500.
             */
            set temperature(value) {
                value = Number.isNaN(value) ? MinTemperatureKelvin : Math.max(value, MinTemperatureKelvin);
                if (this._temperature === value) {
                    return;
                }
                this._temperature = value;
                this._updateParameters();
            }
            /**
             * Gets the white balance tint offset used in the effect if whiteBalanceEnabled is set to true, on the
             * green/magenta axis perpendicular to temperature - e.g. to correct for illuminants (such as some
             * fluorescent lights) that a color temperature alone can't fully neutralize. Positive values shift the
             * corrected image toward magenta (compensating a green-tinted illuminant); negative values shift it toward
             * green (compensating a magenta-tinted illuminant). Clamped to [-150, 150] - the getter reflects the clamped value. Default is 0 (no tint offset).
             */
            get tint() {
                return this._tint;
            }
            /**
             * Sets the white balance tint offset used in the effect if whiteBalanceEnabled is set to true, on the
             * green/magenta axis perpendicular to temperature - e.g. to correct for illuminants (such as some
             * fluorescent lights) that a color temperature alone can't fully neutralize. Positive values shift the
             * corrected image toward magenta (compensating a green-tinted illuminant); negative values shift it toward
             * green (compensating a magenta-tinted illuminant). Clamped to [-150, 150] - the getter reflects the clamped value. Default is 0 (no tint offset).
             */
            set tint(value) {
                value = Clamp(value, -MaxTintMagnitude, MaxTintMagnitude);
                if (this._tint === value) {
                    return;
                }
                this._tint = value;
                this._updateParameters();
            }
            /**
             * Returns the white balance matrix for the current temperature/tint, computing it on first use and
             * recomputing it if either value has changed since it was last computed. Deliberately lazy: white balance is
             * disabled by default, and every `ImageProcessingConfiguration` instance (created per scene, per material,
             * per post process) would otherwise pay this matrix's construction cost even when never enabled. Checking
             * here (rather than eagerly refreshing from the temperature/tint setters) also means paths that set the
             * private backing fields directly - such as SerializationHelper.Clone/Parse, which assign serialized
             * properties without going through their setters - still end up with a matrix that matches the current
             * temperature/tint.
             * @returns the column-major white balance matrix for the current temperature/tint
             */
            _getWhiteBalanceMatrix() {
                if (this._whiteBalanceMatrix === null || this._whiteBalanceMatrixTemperature !== this._temperature || this._whiteBalanceMatrixTint !== this._tint) {
                    this._whiteBalanceMatrixTemperature = this._temperature;
                    this._whiteBalanceMatrixTint = this._tint;
                    this._whiteBalanceMatrix = GetWhiteBalanceMatrix(this._temperature, this._tint);
                }
                return this._whiteBalanceMatrix;
            }
            /**
             * Back Compat: Vignette center Y Offset.
             * @deprecated use vignetteCenterY instead
             */
            get vignetteCentreY() {
                return this.vignetteCenterY;
            }
            set vignetteCentreY(value) {
                this.vignetteCenterY = value;
            }
            /**
             * Back Compat: Vignette center X Offset.
             * @deprecated use vignetteCenterX instead
             */
            get vignetteCentreX() {
                return this.vignetteCenterX;
            }
            set vignetteCentreX(value) {
                this.vignetteCenterX = value;
            }
            /**
             * Gets the vignette blend mode allowing different kind of effect.
             */
            get vignetteBlendMode() {
                return this._vignetteBlendMode;
            }
            /**
             * Sets the vignette blend mode allowing different kind of effect.
             */
            set vignetteBlendMode(value) {
                if (this._vignetteBlendMode === value) {
                    return;
                }
                this._vignetteBlendMode = value;
                this._updateParameters();
            }
            /**
             * Gets whether the vignette effect is enabled.
             */
            get vignetteEnabled() {
                return this._vignetteEnabled;
            }
            /**
             * Sets whether the vignette effect is enabled.
             */
            set vignetteEnabled(value) {
                if (this._vignetteEnabled === value) {
                    return;
                }
                this._vignetteEnabled = value;
                this._updateParameters();
            }
            /**
             * Gets whether the dithering effect is enabled.
             * The dithering effect can be used to reduce banding.
             */
            get ditheringEnabled() {
                return this._ditheringEnabled;
            }
            /**
             * Sets whether the dithering effect is enabled.
             * The dithering effect can be used to reduce banding.
             */
            set ditheringEnabled(value) {
                if (this._ditheringEnabled === value) {
                    return;
                }
                this._ditheringEnabled = value;
                this._updateParameters();
            }
            /**
             * Gets the dithering intensity. 0 is no dithering. Default is 1.0 / 255.0.
             */
            get ditheringIntensity() {
                return this._ditheringIntensity;
            }
            /**
             * Sets the dithering intensity. 0 is no dithering. Default is 1.0 / 255.0.
             */
            set ditheringIntensity(value) {
                if (this._ditheringIntensity === value) {
                    return;
                }
                this._ditheringIntensity = value;
                this._updateParameters();
            }
            /**
             * If apply by post process is set to true, setting this to true will skip the final color clamp step in the fragment shader
             * Applies to PBR materials.
             */
            get skipFinalColorClamp() {
                return this._skipFinalColorClamp;
            }
            /**
             * If apply by post process is set to true, setting this to true will skip the final color clamp step in the fragment shader
             * Applies to PBR materials.
             */
            set skipFinalColorClamp(value) {
                if (this._skipFinalColorClamp === value) {
                    return;
                }
                this._skipFinalColorClamp = value;
                this._updateParameters();
            }
            /**
             * Gets whether the image processing is applied through a post process or not.
             */
            get applyByPostProcess() {
                return this._applyByPostProcess;
            }
            /**
             * Sets whether the image processing is applied through a post process or not.
             */
            set applyByPostProcess(value) {
                if (this._applyByPostProcess === value) {
                    return;
                }
                this._applyByPostProcess = value;
                this._updateParameters();
            }
            /**
             * Gets whether the image processing is enabled or not.
             */
            get isEnabled() {
                return this._isEnabled;
            }
            /**
             * Sets whether the image processing is enabled or not.
             */
            set isEnabled(value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                this._updateParameters();
            }
            /**
             * Method called each time the image processing information changes requires to recompile the effect.
             */
            _updateParameters() {
                this.onUpdateParameters.notifyObservers(this);
            }
            /**
             * Gets the current class name.
             * @returns "ImageProcessingConfiguration"
             */
            getClassName() {
                return "ImageProcessingConfiguration";
            }
            /**
             * Prepare the list of defines associated to the shader.
             * @param defines the list of defines to complete
             * @param forPostProcess Define if we are currently in post process mode or not
             */
            prepareDefines(defines, forPostProcess = false) {
                if (forPostProcess !== this.applyByPostProcess || !this._isEnabled) {
                    defines.WHITEBALANCE = false;
                    defines.VIGNETTE = false;
                    defines.TONEMAPPING = 0;
                    defines.CONTRAST = false;
                    defines.EXPOSURE = false;
                    defines.COLORCURVES = false;
                    defines.COLORGRADING = false;
                    defines.COLORGRADING3D = false;
                    defines.DITHER = false;
                    defines.IMAGEPROCESSING = false;
                    defines.SKIPFINALCOLORCLAMP = this.skipFinalColorClamp;
                    defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess && this._isEnabled;
                    return;
                }
                defines.WHITEBALANCE = this._whiteBalanceEnabled;
                defines.VIGNETTE = this.vignetteEnabled;
                defines.VIGNETTEBLENDMODEMULTIPLY = this.vignetteBlendMode === _a._VIGNETTEMODE_MULTIPLY;
                defines.VIGNETTEBLENDMODEOPAQUE = !defines.VIGNETTEBLENDMODEMULTIPLY;
                if (!this._toneMappingEnabled) {
                    defines.TONEMAPPING = 0;
                }
                else {
                    switch (this._toneMappingType) {
                        case _a.TONEMAPPING_KHR_PBR_NEUTRAL:
                            defines.TONEMAPPING = 3;
                            break;
                        case _a.TONEMAPPING_ACES:
                            defines.TONEMAPPING = 2;
                            break;
                        default:
                            defines.TONEMAPPING = 1;
                            break;
                    }
                }
                defines.CONTRAST = this.contrast !== 1.0;
                defines.EXPOSURE = this.exposure !== 1.0;
                defines.COLORCURVES = this.colorCurvesEnabled && !!this.colorCurves;
                defines.COLORGRADING = this.colorGradingEnabled && !!this.colorGradingTexture;
                if (defines.COLORGRADING) {
                    defines.COLORGRADING3D = this.colorGradingTexture.is3D;
                }
                else {
                    defines.COLORGRADING3D = false;
                }
                defines.SAMPLER3DGREENDEPTH = this.colorGradingWithGreenDepth;
                defines.SAMPLER3DBGRMAP = this.colorGradingBGR;
                defines.DITHER = this._ditheringEnabled;
                defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess;
                defines.SKIPFINALCOLORCLAMP = this.skipFinalColorClamp;
                defines.IMAGEPROCESSING =
                    defines.WHITEBALANCE ||
                        defines.VIGNETTE ||
                        !!defines.TONEMAPPING ||
                        defines.CONTRAST ||
                        defines.EXPOSURE ||
                        defines.COLORCURVES ||
                        defines.COLORGRADING ||
                        defines.DITHER;
            }
            /**
             * Returns true if all the image processing information are ready.
             * @returns True if ready, otherwise, false
             */
            isReady() {
                // Color Grading texture can not be none blocking.
                return !this.colorGradingEnabled || !this.colorGradingTexture || this.colorGradingTexture.isReady();
            }
            /**
             * Binds the image processing to the shader.
             * @param effect The effect to bind to
             * @param overrideAspectRatio Override the aspect ratio of the effect
             */
            bind(effect, overrideAspectRatio) {
                // White Balance
                if (this._whiteBalanceEnabled) {
                    effect.setMatrix3x3("whiteBalanceMatrix", this._getWhiteBalanceMatrix());
                }
                // Color Curves
                if (this._colorCurvesEnabled && this.colorCurves) {
                    ColorCurvesBind(this.colorCurves, effect);
                }
                // Vignette and dither handled together due to common uniform.
                if (this._vignetteEnabled || this._ditheringEnabled) {
                    const inverseWidth = 1 / (this.outputTextureWidth || effect.getEngine().getRenderWidth());
                    const inverseHeight = 1 / (this.outputTextureHeight || effect.getEngine().getRenderHeight());
                    effect.setFloat2("vInverseScreenSize", inverseWidth, inverseHeight);
                    if (this._ditheringEnabled) {
                        effect.setFloat("ditherIntensity", 0.5 * this._ditheringIntensity);
                    }
                    if (this._vignetteEnabled) {
                        const aspectRatio = overrideAspectRatio != null ? overrideAspectRatio : inverseHeight / inverseWidth;
                        let vignetteScaleY = Math.tan(this.vignetteCameraFov * 0.5);
                        let vignetteScaleX = vignetteScaleY * aspectRatio;
                        const vignetteScaleGeometricMean = Math.sqrt(vignetteScaleX * vignetteScaleY);
                        vignetteScaleX = Mix(vignetteScaleX, vignetteScaleGeometricMean, this.vignetteStretch);
                        vignetteScaleY = Mix(vignetteScaleY, vignetteScaleGeometricMean, this.vignetteStretch);
                        effect.setFloat4("vignetteSettings1", vignetteScaleX, vignetteScaleY, -vignetteScaleX * this.vignetteCenterX, -vignetteScaleY * this.vignetteCenterY);
                        const vignettePower = -2.0 * this.vignetteWeight;
                        effect.setFloat4("vignetteSettings2", this.vignetteColor.r, this.vignetteColor.g, this.vignetteColor.b, vignettePower);
                    }
                }
                // Exposure
                effect.setFloat("exposureLinear", this.exposure);
                // Contrast
                effect.setFloat("contrast", this.contrast);
                // Color transform settings
                if (this.colorGradingTexture) {
                    effect.setTexture("txColorTransform", this.colorGradingTexture);
                    const textureSize = this.colorGradingTexture.getSize().height;
                    effect.setFloat4("colorTransformSettings", (textureSize - 1) / textureSize, // textureScale
                    0.5 / textureSize, // textureOffset
                    textureSize, // textureSize
                    this.colorGradingTexture.level // weight
                    );
                }
            }
            /**
             * Clones the current image processing instance.
             * @returns The cloned image processing
             */
            clone() {
                return SerializationHelper.Clone(() => new _a(), this);
            }
            /**
             * Serializes the current image processing instance to a json representation.
             * @returns a JSON representation
             */
            serialize() {
                return SerializationHelper.Serialize(this);
            }
            /**
             * Used to apply the vignette as a mix with the pixel color.
             */
            static get VIGNETTEMODE_MULTIPLY() {
                return this._VIGNETTEMODE_MULTIPLY;
            }
            /**
             * Used to apply the vignette as a replacement of the pixel color.
             */
            static get VIGNETTEMODE_OPAQUE() {
                return this._VIGNETTEMODE_OPAQUE;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _colorCurves_decorators = [serializeAsColorCurves()];
            __colorCurvesEnabled_decorators = [serialize()];
            __colorGradingTexture_decorators = [serializeAsTexture("colorGradingTexture")];
            __colorGradingEnabled_decorators = [serialize()];
            __colorGradingWithGreenDepth_decorators = [serialize()];
            __colorGradingBGR_decorators = [serialize()];
            __exposure_decorators = [serialize()];
            __toneMappingEnabled_decorators = [serialize()];
            __toneMappingType_decorators = [serialize()];
            __contrast_decorators = [serialize()];
            __whiteBalanceEnabled_decorators = [serialize()];
            __temperature_decorators = [serialize()];
            __tint_decorators = [serialize()];
            _vignetteStretch_decorators = [serialize()];
            _vignetteCenterX_decorators = [serialize()];
            _vignetteCenterY_decorators = [serialize()];
            _vignetteWeight_decorators = [serialize()];
            _vignetteColor_decorators = [serializeAsColor4()];
            _vignetteCameraFov_decorators = [serialize()];
            __vignetteBlendMode_decorators = [serialize()];
            __vignetteEnabled_decorators = [serialize()];
            __ditheringEnabled_decorators = [serialize()];
            __ditheringIntensity_decorators = [serialize()];
            __skipFinalColorClamp_decorators = [serialize()];
            __applyByPostProcess_decorators = [serialize()];
            __isEnabled_decorators = [serialize()];
            _outputTextureWidth_decorators = [serialize()];
            _outputTextureHeight_decorators = [serialize()];
            __esDecorate(null, null, _colorCurves_decorators, { kind: "field", name: "colorCurves", static: false, private: false, access: { has: obj => "colorCurves" in obj, get: obj => obj.colorCurves, set: (obj, value) => { obj.colorCurves = value; } }, metadata: _metadata }, _colorCurves_initializers, _colorCurves_extraInitializers);
            __esDecorate(null, null, __colorCurvesEnabled_decorators, { kind: "field", name: "_colorCurvesEnabled", static: false, private: false, access: { has: obj => "_colorCurvesEnabled" in obj, get: obj => obj._colorCurvesEnabled, set: (obj, value) => { obj._colorCurvesEnabled = value; } }, metadata: _metadata }, __colorCurvesEnabled_initializers, __colorCurvesEnabled_extraInitializers);
            __esDecorate(null, null, __colorGradingTexture_decorators, { kind: "field", name: "_colorGradingTexture", static: false, private: false, access: { has: obj => "_colorGradingTexture" in obj, get: obj => obj._colorGradingTexture, set: (obj, value) => { obj._colorGradingTexture = value; } }, metadata: _metadata }, __colorGradingTexture_initializers, __colorGradingTexture_extraInitializers);
            __esDecorate(null, null, __colorGradingEnabled_decorators, { kind: "field", name: "_colorGradingEnabled", static: false, private: false, access: { has: obj => "_colorGradingEnabled" in obj, get: obj => obj._colorGradingEnabled, set: (obj, value) => { obj._colorGradingEnabled = value; } }, metadata: _metadata }, __colorGradingEnabled_initializers, __colorGradingEnabled_extraInitializers);
            __esDecorate(null, null, __colorGradingWithGreenDepth_decorators, { kind: "field", name: "_colorGradingWithGreenDepth", static: false, private: false, access: { has: obj => "_colorGradingWithGreenDepth" in obj, get: obj => obj._colorGradingWithGreenDepth, set: (obj, value) => { obj._colorGradingWithGreenDepth = value; } }, metadata: _metadata }, __colorGradingWithGreenDepth_initializers, __colorGradingWithGreenDepth_extraInitializers);
            __esDecorate(null, null, __colorGradingBGR_decorators, { kind: "field", name: "_colorGradingBGR", static: false, private: false, access: { has: obj => "_colorGradingBGR" in obj, get: obj => obj._colorGradingBGR, set: (obj, value) => { obj._colorGradingBGR = value; } }, metadata: _metadata }, __colorGradingBGR_initializers, __colorGradingBGR_extraInitializers);
            __esDecorate(null, null, __exposure_decorators, { kind: "field", name: "_exposure", static: false, private: false, access: { has: obj => "_exposure" in obj, get: obj => obj._exposure, set: (obj, value) => { obj._exposure = value; } }, metadata: _metadata }, __exposure_initializers, __exposure_extraInitializers);
            __esDecorate(null, null, __toneMappingEnabled_decorators, { kind: "field", name: "_toneMappingEnabled", static: false, private: false, access: { has: obj => "_toneMappingEnabled" in obj, get: obj => obj._toneMappingEnabled, set: (obj, value) => { obj._toneMappingEnabled = value; } }, metadata: _metadata }, __toneMappingEnabled_initializers, __toneMappingEnabled_extraInitializers);
            __esDecorate(null, null, __toneMappingType_decorators, { kind: "field", name: "_toneMappingType", static: false, private: false, access: { has: obj => "_toneMappingType" in obj, get: obj => obj._toneMappingType, set: (obj, value) => { obj._toneMappingType = value; } }, metadata: _metadata }, __toneMappingType_initializers, __toneMappingType_extraInitializers);
            __esDecorate(null, null, __contrast_decorators, { kind: "field", name: "_contrast", static: false, private: false, access: { has: obj => "_contrast" in obj, get: obj => obj._contrast, set: (obj, value) => { obj._contrast = value; } }, metadata: _metadata }, __contrast_initializers, __contrast_extraInitializers);
            __esDecorate(null, null, __whiteBalanceEnabled_decorators, { kind: "field", name: "_whiteBalanceEnabled", static: false, private: false, access: { has: obj => "_whiteBalanceEnabled" in obj, get: obj => obj._whiteBalanceEnabled, set: (obj, value) => { obj._whiteBalanceEnabled = value; } }, metadata: _metadata }, __whiteBalanceEnabled_initializers, __whiteBalanceEnabled_extraInitializers);
            __esDecorate(null, null, __temperature_decorators, { kind: "field", name: "_temperature", static: false, private: false, access: { has: obj => "_temperature" in obj, get: obj => obj._temperature, set: (obj, value) => { obj._temperature = value; } }, metadata: _metadata }, __temperature_initializers, __temperature_extraInitializers);
            __esDecorate(null, null, __tint_decorators, { kind: "field", name: "_tint", static: false, private: false, access: { has: obj => "_tint" in obj, get: obj => obj._tint, set: (obj, value) => { obj._tint = value; } }, metadata: _metadata }, __tint_initializers, __tint_extraInitializers);
            __esDecorate(null, null, _vignetteStretch_decorators, { kind: "field", name: "vignetteStretch", static: false, private: false, access: { has: obj => "vignetteStretch" in obj, get: obj => obj.vignetteStretch, set: (obj, value) => { obj.vignetteStretch = value; } }, metadata: _metadata }, _vignetteStretch_initializers, _vignetteStretch_extraInitializers);
            __esDecorate(null, null, _vignetteCenterX_decorators, { kind: "field", name: "vignetteCenterX", static: false, private: false, access: { has: obj => "vignetteCenterX" in obj, get: obj => obj.vignetteCenterX, set: (obj, value) => { obj.vignetteCenterX = value; } }, metadata: _metadata }, _vignetteCenterX_initializers, _vignetteCenterX_extraInitializers);
            __esDecorate(null, null, _vignetteCenterY_decorators, { kind: "field", name: "vignetteCenterY", static: false, private: false, access: { has: obj => "vignetteCenterY" in obj, get: obj => obj.vignetteCenterY, set: (obj, value) => { obj.vignetteCenterY = value; } }, metadata: _metadata }, _vignetteCenterY_initializers, _vignetteCenterY_extraInitializers);
            __esDecorate(null, null, _vignetteWeight_decorators, { kind: "field", name: "vignetteWeight", static: false, private: false, access: { has: obj => "vignetteWeight" in obj, get: obj => obj.vignetteWeight, set: (obj, value) => { obj.vignetteWeight = value; } }, metadata: _metadata }, _vignetteWeight_initializers, _vignetteWeight_extraInitializers);
            __esDecorate(null, null, _vignetteColor_decorators, { kind: "field", name: "vignetteColor", static: false, private: false, access: { has: obj => "vignetteColor" in obj, get: obj => obj.vignetteColor, set: (obj, value) => { obj.vignetteColor = value; } }, metadata: _metadata }, _vignetteColor_initializers, _vignetteColor_extraInitializers);
            __esDecorate(null, null, _vignetteCameraFov_decorators, { kind: "field", name: "vignetteCameraFov", static: false, private: false, access: { has: obj => "vignetteCameraFov" in obj, get: obj => obj.vignetteCameraFov, set: (obj, value) => { obj.vignetteCameraFov = value; } }, metadata: _metadata }, _vignetteCameraFov_initializers, _vignetteCameraFov_extraInitializers);
            __esDecorate(null, null, __vignetteBlendMode_decorators, { kind: "field", name: "_vignetteBlendMode", static: false, private: false, access: { has: obj => "_vignetteBlendMode" in obj, get: obj => obj._vignetteBlendMode, set: (obj, value) => { obj._vignetteBlendMode = value; } }, metadata: _metadata }, __vignetteBlendMode_initializers, __vignetteBlendMode_extraInitializers);
            __esDecorate(null, null, __vignetteEnabled_decorators, { kind: "field", name: "_vignetteEnabled", static: false, private: false, access: { has: obj => "_vignetteEnabled" in obj, get: obj => obj._vignetteEnabled, set: (obj, value) => { obj._vignetteEnabled = value; } }, metadata: _metadata }, __vignetteEnabled_initializers, __vignetteEnabled_extraInitializers);
            __esDecorate(null, null, __ditheringEnabled_decorators, { kind: "field", name: "_ditheringEnabled", static: false, private: false, access: { has: obj => "_ditheringEnabled" in obj, get: obj => obj._ditheringEnabled, set: (obj, value) => { obj._ditheringEnabled = value; } }, metadata: _metadata }, __ditheringEnabled_initializers, __ditheringEnabled_extraInitializers);
            __esDecorate(null, null, __ditheringIntensity_decorators, { kind: "field", name: "_ditheringIntensity", static: false, private: false, access: { has: obj => "_ditheringIntensity" in obj, get: obj => obj._ditheringIntensity, set: (obj, value) => { obj._ditheringIntensity = value; } }, metadata: _metadata }, __ditheringIntensity_initializers, __ditheringIntensity_extraInitializers);
            __esDecorate(null, null, __skipFinalColorClamp_decorators, { kind: "field", name: "_skipFinalColorClamp", static: false, private: false, access: { has: obj => "_skipFinalColorClamp" in obj, get: obj => obj._skipFinalColorClamp, set: (obj, value) => { obj._skipFinalColorClamp = value; } }, metadata: _metadata }, __skipFinalColorClamp_initializers, __skipFinalColorClamp_extraInitializers);
            __esDecorate(null, null, __applyByPostProcess_decorators, { kind: "field", name: "_applyByPostProcess", static: false, private: false, access: { has: obj => "_applyByPostProcess" in obj, get: obj => obj._applyByPostProcess, set: (obj, value) => { obj._applyByPostProcess = value; } }, metadata: _metadata }, __applyByPostProcess_initializers, __applyByPostProcess_extraInitializers);
            __esDecorate(null, null, __isEnabled_decorators, { kind: "field", name: "_isEnabled", static: false, private: false, access: { has: obj => "_isEnabled" in obj, get: obj => obj._isEnabled, set: (obj, value) => { obj._isEnabled = value; } }, metadata: _metadata }, __isEnabled_initializers, __isEnabled_extraInitializers);
            __esDecorate(null, null, _outputTextureWidth_decorators, { kind: "field", name: "outputTextureWidth", static: false, private: false, access: { has: obj => "outputTextureWidth" in obj, get: obj => obj.outputTextureWidth, set: (obj, value) => { obj.outputTextureWidth = value; } }, metadata: _metadata }, _outputTextureWidth_initializers, _outputTextureWidth_extraInitializers);
            __esDecorate(null, null, _outputTextureHeight_decorators, { kind: "field", name: "outputTextureHeight", static: false, private: false, access: { has: obj => "outputTextureHeight" in obj, get: obj => obj.outputTextureHeight, set: (obj, value) => { obj.outputTextureHeight = value; } }, metadata: _metadata }, _outputTextureHeight_initializers, _outputTextureHeight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Default tone mapping applied in BabylonJS.
         */
        _a.TONEMAPPING_STANDARD = 0,
        /**
         * ACES Tone mapping (used by default in unreal and unity). This can help getting closer
         * to other engines rendering to increase portability.
         */
        _a.TONEMAPPING_ACES = 1,
        /**
         * Neutral Tone mapping developped by the Khronos group in order to constrain
         * values between 0 and 1 without shifting Hue.
         */
        _a.TONEMAPPING_KHR_PBR_NEUTRAL = 2,
        /**
         * Prepare the list of uniforms associated with the Image Processing effects.
         * @param uniforms The list of uniforms used in the effect
         * @param defines the list of defines currently in use
         */
        _a.PrepareUniforms = PrepareUniformsForImageProcessing,
        /**
         * Prepare the list of samplers associated with the Image Processing effects.
         * @param samplersList The list of uniforms used in the effect
         * @param defines the list of defines currently in use
         */
        _a.PrepareSamplers = PrepareSamplersForImageProcessing,
        // Static constants associated to the image processing.
        _a._VIGNETTEMODE_MULTIPLY = 0,
        _a._VIGNETTEMODE_OPAQUE = 1,
        _a;
})();
export { ImageProcessingConfiguration };
let _Registered = false;
/**
 * Parses the image processing from a json representation.
 * @param source the JSON source to parse
 * @returns The parsed image processing
 */
export function ImageProcessingConfigurationParse(source) {
    const parsed = SerializationHelper.Parse(() => new ImageProcessingConfiguration(), source, null, null);
    // Backward compatibility
    if (source.vignetteCentreX !== undefined) {
        parsed.vignetteCenterX = source.vignetteCentreX;
    }
    if (source.vignetteCentreY !== undefined) {
        parsed.vignetteCenterY = source.vignetteCentreY;
    }
    return parsed;
}
/**
 * Register side effects for imageProcessingConfiguration.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterImageProcessingConfiguration() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // References the dependencies.
    ImageProcessingConfiguration.Parse = ImageProcessingConfigurationParse;
    SerializationHelper._ImageProcessingConfigurationParser = ImageProcessingConfigurationParse;
    // Register Class Name
    RegisterClass("BABYLON.ImageProcessingConfiguration", ImageProcessingConfiguration);
}
//# sourceMappingURL=imageProcessingConfiguration.pure.js.map
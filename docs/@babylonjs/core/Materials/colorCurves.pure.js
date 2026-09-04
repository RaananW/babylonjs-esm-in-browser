/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { PrepareUniformsForColorCurves } from "./colorCurves.functions.js";
/**
 * The color grading curves provide additional color adjustment that is applied after any color grading transform (3D LUT).
 * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
 * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
 * corresponding to low luminance, medium luminance, and high luminance areas respectively.
 */
let ColorCurves = (() => {
    var _a;
    let __globalHue_decorators;
    let __globalHue_initializers = [];
    let __globalHue_extraInitializers = [];
    let __globalDensity_decorators;
    let __globalDensity_initializers = [];
    let __globalDensity_extraInitializers = [];
    let __globalSaturation_decorators;
    let __globalSaturation_initializers = [];
    let __globalSaturation_extraInitializers = [];
    let __globalExposure_decorators;
    let __globalExposure_initializers = [];
    let __globalExposure_extraInitializers = [];
    let __highlightsHue_decorators;
    let __highlightsHue_initializers = [];
    let __highlightsHue_extraInitializers = [];
    let __highlightsDensity_decorators;
    let __highlightsDensity_initializers = [];
    let __highlightsDensity_extraInitializers = [];
    let __highlightsSaturation_decorators;
    let __highlightsSaturation_initializers = [];
    let __highlightsSaturation_extraInitializers = [];
    let __highlightsExposure_decorators;
    let __highlightsExposure_initializers = [];
    let __highlightsExposure_extraInitializers = [];
    let __midtonesHue_decorators;
    let __midtonesHue_initializers = [];
    let __midtonesHue_extraInitializers = [];
    let __midtonesDensity_decorators;
    let __midtonesDensity_initializers = [];
    let __midtonesDensity_extraInitializers = [];
    let __midtonesSaturation_decorators;
    let __midtonesSaturation_initializers = [];
    let __midtonesSaturation_extraInitializers = [];
    let __midtonesExposure_decorators;
    let __midtonesExposure_initializers = [];
    let __midtonesExposure_extraInitializers = [];
    return _a = class ColorCurves {
            constructor() {
                this._dirty = true;
                this._tempColor = new Color4(0, 0, 0, 0);
                this._globalCurve = new Color4(0, 0, 0, 0);
                this._highlightsCurve = new Color4(0, 0, 0, 0);
                this._midtonesCurve = new Color4(0, 0, 0, 0);
                this._shadowsCurve = new Color4(0, 0, 0, 0);
                this._positiveCurve = new Color4(0, 0, 0, 0);
                this._negativeCurve = new Color4(0, 0, 0, 0);
                this._globalHue = __runInitializers(this, __globalHue_initializers, 30);
                this._globalDensity = (__runInitializers(this, __globalHue_extraInitializers), __runInitializers(this, __globalDensity_initializers, 0));
                this._globalSaturation = (__runInitializers(this, __globalDensity_extraInitializers), __runInitializers(this, __globalSaturation_initializers, 0));
                this._globalExposure = (__runInitializers(this, __globalSaturation_extraInitializers), __runInitializers(this, __globalExposure_initializers, 0));
                this._highlightsHue = (__runInitializers(this, __globalExposure_extraInitializers), __runInitializers(this, __highlightsHue_initializers, 30));
                this._highlightsDensity = (__runInitializers(this, __highlightsHue_extraInitializers), __runInitializers(this, __highlightsDensity_initializers, 0));
                this._highlightsSaturation = (__runInitializers(this, __highlightsDensity_extraInitializers), __runInitializers(this, __highlightsSaturation_initializers, 0));
                this._highlightsExposure = (__runInitializers(this, __highlightsSaturation_extraInitializers), __runInitializers(this, __highlightsExposure_initializers, 0));
                this._midtonesHue = (__runInitializers(this, __highlightsExposure_extraInitializers), __runInitializers(this, __midtonesHue_initializers, 30));
                this._midtonesDensity = (__runInitializers(this, __midtonesHue_extraInitializers), __runInitializers(this, __midtonesDensity_initializers, 0));
                this._midtonesSaturation = (__runInitializers(this, __midtonesDensity_extraInitializers), __runInitializers(this, __midtonesSaturation_initializers, 0));
                this._midtonesExposure = (__runInitializers(this, __midtonesSaturation_extraInitializers), __runInitializers(this, __midtonesExposure_initializers, 0));
                this._shadowsHue = (__runInitializers(this, __midtonesExposure_extraInitializers), 30);
                this._shadowsDensity = 0;
                this._shadowsSaturation = 0;
                this._shadowsExposure = 0;
            }
            /**
             * Gets the global Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            get globalHue() {
                return this._globalHue;
            }
            /**
             * Sets the global Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            set globalHue(value) {
                this._globalHue = value;
                this._dirty = true;
            }
            /**
             * Gets the global Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            get globalDensity() {
                return this._globalDensity;
            }
            /**
             * Sets the global Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            set globalDensity(value) {
                this._globalDensity = value;
                this._dirty = true;
            }
            /**
             * Gets the global Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            get globalSaturation() {
                return this._globalSaturation;
            }
            /**
             * Sets the global Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            set globalSaturation(value) {
                this._globalSaturation = value;
                this._dirty = true;
            }
            /**
             * Gets the global Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            get globalExposure() {
                return this._globalExposure;
            }
            /**
             * Sets the global Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            set globalExposure(value) {
                this._globalExposure = value;
                this._dirty = true;
            }
            /**
             * Gets the highlights Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            get highlightsHue() {
                return this._highlightsHue;
            }
            /**
             * Sets the highlights Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            set highlightsHue(value) {
                this._highlightsHue = value;
                this._dirty = true;
            }
            /**
             * Gets the highlights Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            get highlightsDensity() {
                return this._highlightsDensity;
            }
            /**
             * Sets the highlights Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            set highlightsDensity(value) {
                this._highlightsDensity = value;
                this._dirty = true;
            }
            /**
             * Gets the highlights Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            get highlightsSaturation() {
                return this._highlightsSaturation;
            }
            /**
             * Sets the highlights Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            set highlightsSaturation(value) {
                this._highlightsSaturation = value;
                this._dirty = true;
            }
            /**
             * Gets the highlights Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            get highlightsExposure() {
                return this._highlightsExposure;
            }
            /**
             * Sets the highlights Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            set highlightsExposure(value) {
                this._highlightsExposure = value;
                this._dirty = true;
            }
            /**
             * Gets the midtones Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            get midtonesHue() {
                return this._midtonesHue;
            }
            /**
             * Sets the midtones Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            set midtonesHue(value) {
                this._midtonesHue = value;
                this._dirty = true;
            }
            /**
             * Gets the midtones Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            get midtonesDensity() {
                return this._midtonesDensity;
            }
            /**
             * Sets the midtones Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            set midtonesDensity(value) {
                this._midtonesDensity = value;
                this._dirty = true;
            }
            /**
             * Gets the midtones Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            get midtonesSaturation() {
                return this._midtonesSaturation;
            }
            /**
             * Sets the midtones Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            set midtonesSaturation(value) {
                this._midtonesSaturation = value;
                this._dirty = true;
            }
            /**
             * Gets the midtones Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            get midtonesExposure() {
                return this._midtonesExposure;
            }
            /**
             * Sets the midtones Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            set midtonesExposure(value) {
                this._midtonesExposure = value;
                this._dirty = true;
            }
            /**
             * Gets the shadows Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            get shadowsHue() {
                return this._shadowsHue;
            }
            /**
             * Sets the shadows Hue value.
             * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
             */
            set shadowsHue(value) {
                this._shadowsHue = value;
                this._dirty = true;
            }
            /**
             * Gets the shadows Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            get shadowsDensity() {
                return this._shadowsDensity;
            }
            /**
             * Sets the shadows Density value.
             * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
             * Values less than zero provide a filter of opposite hue.
             */
            set shadowsDensity(value) {
                this._shadowsDensity = value;
                this._dirty = true;
            }
            /**
             * Gets the shadows Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            get shadowsSaturation() {
                return this._shadowsSaturation;
            }
            /**
             * Sets the shadows Saturation value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
             */
            set shadowsSaturation(value) {
                this._shadowsSaturation = value;
                this._dirty = true;
            }
            /**
             * Gets the shadows Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            get shadowsExposure() {
                return this._shadowsExposure;
            }
            /**
             * Sets the shadows Exposure value.
             * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
             */
            set shadowsExposure(value) {
                this._shadowsExposure = value;
                this._dirty = true;
            }
            /**
             * Returns the class name
             * @returns The class name
             */
            getClassName() {
                return "ColorCurves";
            }
            /**
             * Returns color grading data based on a hue, density, saturation and exposure value.
             * @param hue
             * @param density
             * @param saturation The saturation.
             * @param exposure The exposure.
             * @param result The result data container.
             */
            _getColorGradingDataToRef(hue, density, saturation, exposure, result) {
                if (hue == null) {
                    return;
                }
                hue = _a._Clamp(hue, 0, 360);
                density = _a._Clamp(density, -100, 100);
                saturation = _a._Clamp(saturation, -100, 100);
                exposure = _a._Clamp(exposure, -100, 100);
                // Remap the slider/config filter density with non-linear mapping and also scale by half
                // so that the maximum filter density is only 50% control. This provides fine control
                // for small values and reasonable range.
                density = _a._ApplyColorGradingSliderNonlinear(density);
                density *= 0.5;
                exposure = _a._ApplyColorGradingSliderNonlinear(exposure);
                if (density < 0) {
                    density *= -1;
                    hue = (hue + 180) % 360;
                }
                _a._FromHSBToRef(hue, density, 50 + 0.25 * exposure, result);
                result.scaleToRef(2, result);
                result.a = 1 + 0.01 * saturation;
            }
            /**
             * Takes an input slider value and returns an adjusted value that provides extra control near the centre.
             * @param value The input slider value in range [-100,100].
             * @returns Adjusted value.
             */
            static _ApplyColorGradingSliderNonlinear(value) {
                value /= 100;
                let x = Math.abs(value);
                x = Math.pow(x, 2);
                if (value < 0) {
                    x *= -1;
                }
                x *= 100;
                return x;
            }
            /**
             * Returns an RGBA Color4 based on Hue, Saturation and Brightness (also referred to as value, HSV).
             * @param hue The hue (H) input.
             * @param saturation The saturation (S) input.
             * @param brightness The brightness (B) input.
             * @param result An RGBA color represented as Vector4.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            static _FromHSBToRef(hue, saturation, brightness, result) {
                let h = _a._Clamp(hue, 0, 360);
                const s = _a._Clamp(saturation / 100, 0, 1);
                const v = _a._Clamp(brightness / 100, 0, 1);
                if (s === 0) {
                    result.r = v;
                    result.g = v;
                    result.b = v;
                }
                else {
                    // sector 0 to 5
                    h /= 60;
                    const i = Math.floor(h);
                    // fractional part of h
                    const f = h - i;
                    const p = v * (1 - s);
                    const q = v * (1 - s * f);
                    const t = v * (1 - s * (1 - f));
                    switch (i) {
                        case 0:
                            result.r = v;
                            result.g = t;
                            result.b = p;
                            break;
                        case 1:
                            result.r = q;
                            result.g = v;
                            result.b = p;
                            break;
                        case 2:
                            result.r = p;
                            result.g = v;
                            result.b = t;
                            break;
                        case 3:
                            result.r = p;
                            result.g = q;
                            result.b = v;
                            break;
                        case 4:
                            result.r = t;
                            result.g = p;
                            result.b = v;
                            break;
                        default:
                            // case 5:
                            result.r = v;
                            result.g = p;
                            result.b = q;
                            break;
                    }
                }
                result.a = 1;
            }
            /**
             * Returns a value clamped between min and max
             * @param value The value to clamp
             * @param min The minimum of value
             * @param max The maximum of value
             * @returns The clamped value.
             */
            static _Clamp(value, min, max) {
                return Math.min(Math.max(value, min), max);
            }
            /**
             * Clones the current color curve instance.
             * @returns The cloned curves
             */
            clone() {
                return SerializationHelper.Clone(() => new _a(), this);
            }
            /**
             * Serializes the current color curve instance to a json representation.
             * @returns a JSON representation
             */
            serialize() {
                return SerializationHelper.Serialize(this);
            }
            /** @internal */
            _bind(effect, positiveUniform = "vCameraColorCurvePositive", neutralUniform = "vCameraColorCurveNeutral", negativeUniform = "vCameraColorCurveNegative") {
                if (this._dirty) {
                    this._dirty = false;
                    // Fill in global info.
                    this._getColorGradingDataToRef(this._globalHue, this._globalDensity, this._globalSaturation, this._globalExposure, this._globalCurve);
                    // Compute highlights info.
                    this._getColorGradingDataToRef(this._highlightsHue, this._highlightsDensity, this._highlightsSaturation, this._highlightsExposure, this._tempColor);
                    this._tempColor.multiplyToRef(this._globalCurve, this._highlightsCurve);
                    // Compute midtones info.
                    this._getColorGradingDataToRef(this._midtonesHue, this._midtonesDensity, this._midtonesSaturation, this._midtonesExposure, this._tempColor);
                    this._tempColor.multiplyToRef(this._globalCurve, this._midtonesCurve);
                    // Compute shadows info.
                    this._getColorGradingDataToRef(this._shadowsHue, this._shadowsDensity, this._shadowsSaturation, this._shadowsExposure, this._tempColor);
                    this._tempColor.multiplyToRef(this._globalCurve, this._shadowsCurve);
                    // Compute deltas (neutral is midtones).
                    this._highlightsCurve.subtractToRef(this._midtonesCurve, this._positiveCurve);
                    this._midtonesCurve.subtractToRef(this._shadowsCurve, this._negativeCurve);
                }
                if (effect) {
                    effect.setFloat4(positiveUniform, this._positiveCurve.r, this._positiveCurve.g, this._positiveCurve.b, this._positiveCurve.a);
                    effect.setFloat4(neutralUniform, this._midtonesCurve.r, this._midtonesCurve.g, this._midtonesCurve.b, this._midtonesCurve.a);
                    effect.setFloat4(negativeUniform, this._negativeCurve.r, this._negativeCurve.g, this._negativeCurve.b, this._negativeCurve.a);
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __globalHue_decorators = [serialize()];
            __globalDensity_decorators = [serialize()];
            __globalSaturation_decorators = [serialize()];
            __globalExposure_decorators = [serialize()];
            __highlightsHue_decorators = [serialize()];
            __highlightsDensity_decorators = [serialize()];
            __highlightsSaturation_decorators = [serialize()];
            __highlightsExposure_decorators = [serialize()];
            __midtonesHue_decorators = [serialize()];
            __midtonesDensity_decorators = [serialize()];
            __midtonesSaturation_decorators = [serialize()];
            __midtonesExposure_decorators = [serialize()];
            __esDecorate(null, null, __globalHue_decorators, { kind: "field", name: "_globalHue", static: false, private: false, access: { has: obj => "_globalHue" in obj, get: obj => obj._globalHue, set: (obj, value) => { obj._globalHue = value; } }, metadata: _metadata }, __globalHue_initializers, __globalHue_extraInitializers);
            __esDecorate(null, null, __globalDensity_decorators, { kind: "field", name: "_globalDensity", static: false, private: false, access: { has: obj => "_globalDensity" in obj, get: obj => obj._globalDensity, set: (obj, value) => { obj._globalDensity = value; } }, metadata: _metadata }, __globalDensity_initializers, __globalDensity_extraInitializers);
            __esDecorate(null, null, __globalSaturation_decorators, { kind: "field", name: "_globalSaturation", static: false, private: false, access: { has: obj => "_globalSaturation" in obj, get: obj => obj._globalSaturation, set: (obj, value) => { obj._globalSaturation = value; } }, metadata: _metadata }, __globalSaturation_initializers, __globalSaturation_extraInitializers);
            __esDecorate(null, null, __globalExposure_decorators, { kind: "field", name: "_globalExposure", static: false, private: false, access: { has: obj => "_globalExposure" in obj, get: obj => obj._globalExposure, set: (obj, value) => { obj._globalExposure = value; } }, metadata: _metadata }, __globalExposure_initializers, __globalExposure_extraInitializers);
            __esDecorate(null, null, __highlightsHue_decorators, { kind: "field", name: "_highlightsHue", static: false, private: false, access: { has: obj => "_highlightsHue" in obj, get: obj => obj._highlightsHue, set: (obj, value) => { obj._highlightsHue = value; } }, metadata: _metadata }, __highlightsHue_initializers, __highlightsHue_extraInitializers);
            __esDecorate(null, null, __highlightsDensity_decorators, { kind: "field", name: "_highlightsDensity", static: false, private: false, access: { has: obj => "_highlightsDensity" in obj, get: obj => obj._highlightsDensity, set: (obj, value) => { obj._highlightsDensity = value; } }, metadata: _metadata }, __highlightsDensity_initializers, __highlightsDensity_extraInitializers);
            __esDecorate(null, null, __highlightsSaturation_decorators, { kind: "field", name: "_highlightsSaturation", static: false, private: false, access: { has: obj => "_highlightsSaturation" in obj, get: obj => obj._highlightsSaturation, set: (obj, value) => { obj._highlightsSaturation = value; } }, metadata: _metadata }, __highlightsSaturation_initializers, __highlightsSaturation_extraInitializers);
            __esDecorate(null, null, __highlightsExposure_decorators, { kind: "field", name: "_highlightsExposure", static: false, private: false, access: { has: obj => "_highlightsExposure" in obj, get: obj => obj._highlightsExposure, set: (obj, value) => { obj._highlightsExposure = value; } }, metadata: _metadata }, __highlightsExposure_initializers, __highlightsExposure_extraInitializers);
            __esDecorate(null, null, __midtonesHue_decorators, { kind: "field", name: "_midtonesHue", static: false, private: false, access: { has: obj => "_midtonesHue" in obj, get: obj => obj._midtonesHue, set: (obj, value) => { obj._midtonesHue = value; } }, metadata: _metadata }, __midtonesHue_initializers, __midtonesHue_extraInitializers);
            __esDecorate(null, null, __midtonesDensity_decorators, { kind: "field", name: "_midtonesDensity", static: false, private: false, access: { has: obj => "_midtonesDensity" in obj, get: obj => obj._midtonesDensity, set: (obj, value) => { obj._midtonesDensity = value; } }, metadata: _metadata }, __midtonesDensity_initializers, __midtonesDensity_extraInitializers);
            __esDecorate(null, null, __midtonesSaturation_decorators, { kind: "field", name: "_midtonesSaturation", static: false, private: false, access: { has: obj => "_midtonesSaturation" in obj, get: obj => obj._midtonesSaturation, set: (obj, value) => { obj._midtonesSaturation = value; } }, metadata: _metadata }, __midtonesSaturation_initializers, __midtonesSaturation_extraInitializers);
            __esDecorate(null, null, __midtonesExposure_decorators, { kind: "field", name: "_midtonesExposure", static: false, private: false, access: { has: obj => "_midtonesExposure" in obj, get: obj => obj._midtonesExposure, set: (obj, value) => { obj._midtonesExposure = value; } }, metadata: _metadata }, __midtonesExposure_initializers, __midtonesExposure_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Prepare the list of uniforms associated with the ColorCurves effects.
         * @param uniformsList The list of uniforms used in the effect
         */
        _a.PrepareUniforms = PrepareUniformsForColorCurves,
        _a;
})();
export { ColorCurves };
let _Registered = false;
/**
 * Parses the color curve from a json representation.
 * @param source the JSON source to parse
 * @returns The parsed curves
 */
export function ColorCurvesParse(source) {
    return SerializationHelper.Parse(() => new ColorCurves(), source, null, null);
}
/**
 * Binds the color curves to the shader.
 * @param colorCurves The color curve to bind
 * @param effect The effect to bind to
 * @param positiveUniform The positive uniform shader parameter
 * @param neutralUniform The neutral uniform shader parameter
 * @param negativeUniform The negative uniform shader parameter
 */
export function ColorCurvesBind(colorCurves, effect, positiveUniform = "vCameraColorCurvePositive", neutralUniform = "vCameraColorCurveNeutral", negativeUniform = "vCameraColorCurveNegative") {
    colorCurves._bind(effect, positiveUniform, neutralUniform, negativeUniform);
}
/**
 * Register side effects for colorCurves.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterColorCurves() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // References the dependencies.
    ColorCurves.Bind = ColorCurvesBind;
    ColorCurves.Parse = ColorCurvesParse;
    SerializationHelper._ColorCurvesParser = ColorCurvesParse;
}
//# sourceMappingURL=colorCurves.pure.js.map
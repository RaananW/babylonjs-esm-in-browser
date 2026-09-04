/** This file must only contain pure code and pure imports */
import { Observable } from "../Misc/observable.pure.js";
import { type Nullable } from "../types.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { ColorCurves } from "../Materials/colorCurves.pure.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type IImageProcessingConfigurationDefines } from "./imageProcessingConfiguration.defines.js";
/**
 * This groups together the common properties used for image processing either in direct forward pass
 * or through post processing effect depending on the use of the image processing pipeline in your scene
 * or not.
 */
export declare class ImageProcessingConfiguration {
    /**
     * Default tone mapping applied in BabylonJS.
     */
    static readonly TONEMAPPING_STANDARD = 0;
    /**
     * ACES Tone mapping (used by default in unreal and unity). This can help getting closer
     * to other engines rendering to increase portability.
     */
    static readonly TONEMAPPING_ACES = 1;
    /**
     * Neutral Tone mapping developped by the Khronos group in order to constrain
     * values between 0 and 1 without shifting Hue.
     */
    static readonly TONEMAPPING_KHR_PBR_NEUTRAL = 2;
    /**
     * Color curves setup used in the effect if colorCurvesEnabled is set to true
     */
    colorCurves: Nullable<ColorCurves>;
    private _colorCurvesEnabled;
    /**
     * Gets whether the color curves effect is enabled.
     */
    get colorCurvesEnabled(): boolean;
    /**
     * Sets whether the color curves effect is enabled.
     */
    set colorCurvesEnabled(value: boolean);
    private _colorGradingTexture;
    /**
     * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
     */
    get colorGradingTexture(): Nullable<BaseTexture>;
    /**
     * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
     */
    set colorGradingTexture(value: Nullable<BaseTexture>);
    private _colorGradingEnabled;
    /**
     * Gets whether the color grading effect is enabled.
     */
    get colorGradingEnabled(): boolean;
    /**
     * Sets whether the color grading effect is enabled.
     */
    set colorGradingEnabled(value: boolean);
    private _colorGradingWithGreenDepth;
    /**
     * Gets whether the color grading effect is using a green depth for the 3d Texture.
     */
    get colorGradingWithGreenDepth(): boolean;
    /**
     * Sets whether the color grading effect is using a green depth for the 3d Texture.
     */
    set colorGradingWithGreenDepth(value: boolean);
    private _colorGradingBGR;
    /**
     * Gets whether the color grading texture contains BGR values.
     */
    get colorGradingBGR(): boolean;
    /**
     * Sets whether the color grading texture contains BGR values.
     */
    set colorGradingBGR(value: boolean);
    /** @internal */
    _exposure: number;
    /**
     * Gets the Exposure used in the effect.
     */
    get exposure(): number;
    /**
     * Sets the Exposure used in the effect.
     */
    set exposure(value: number);
    private _toneMappingEnabled;
    /**
     * Gets whether the tone mapping effect is enabled.
     */
    get toneMappingEnabled(): boolean;
    /**
     * Sets whether the tone mapping effect is enabled.
     */
    set toneMappingEnabled(value: boolean);
    private _toneMappingType;
    /**
     * Gets the type of tone mapping effect.
     */
    get toneMappingType(): number;
    /**
     * Sets the type of tone mapping effect used in BabylonJS.
     */
    set toneMappingType(value: number);
    protected _contrast: number;
    /**
     * Gets the contrast used in the effect.
     */
    get contrast(): number;
    /**
     * Sets the contrast used in the effect.
     */
    set contrast(value: number);
    private _whiteBalanceEnabled;
    /**
     * Gets whether the white balance effect is enabled.
     */
    get whiteBalanceEnabled(): boolean;
    /**
     * Sets whether the white balance effect is enabled.
     */
    set whiteBalanceEnabled(value: boolean);
    private _temperature;
    /**
     * Gets the correlated color temperature, in Kelvin, of the illuminant to neutralize when whiteBalanceEnabled
     * is set to true - i.e. the light the scene is assumed to have been lit with, not a "warm"/"cool" creative
     * adjustment. Lower values (e.g. ~2000-3500 K) correspond to warm/orange sources such as tungsten or candle
     * light; higher values (e.g. ~7000-10000 K) correspond to cool/blue sources such as shade or overcast sky.
     * Clamped to the tabulated range (roughly 1667 K and above) - the getter reflects the clamped value. Default is 6500.
     */
    get temperature(): number;
    /**
     * Sets the correlated color temperature, in Kelvin, of the illuminant to neutralize when whiteBalanceEnabled
     * is set to true - i.e. the light the scene is assumed to have been lit with, not a "warm"/"cool" creative
     * adjustment. Lower values (e.g. ~2000-3500 K) correspond to warm/orange sources such as tungsten or candle
     * light; higher values (e.g. ~7000-10000 K) correspond to cool/blue sources such as shade or overcast sky.
     * Clamped to the tabulated range (roughly 1667 K and above) - the getter reflects the clamped value. Default is 6500.
     */
    set temperature(value: number);
    private _tint;
    /**
     * Gets the white balance tint offset used in the effect if whiteBalanceEnabled is set to true, on the
     * green/magenta axis perpendicular to temperature - e.g. to correct for illuminants (such as some
     * fluorescent lights) that a color temperature alone can't fully neutralize. Positive values shift the
     * corrected image toward magenta (compensating a green-tinted illuminant); negative values shift it toward
     * green (compensating a magenta-tinted illuminant). Clamped to [-150, 150] - the getter reflects the clamped value. Default is 0 (no tint offset).
     */
    get tint(): number;
    /**
     * Sets the white balance tint offset used in the effect if whiteBalanceEnabled is set to true, on the
     * green/magenta axis perpendicular to temperature - e.g. to correct for illuminants (such as some
     * fluorescent lights) that a color temperature alone can't fully neutralize. Positive values shift the
     * corrected image toward magenta (compensating a green-tinted illuminant); negative values shift it toward
     * green (compensating a magenta-tinted illuminant). Clamped to [-150, 150] - the getter reflects the clamped value. Default is 0 (no tint offset).
     */
    set tint(value: number);
    private _whiteBalanceMatrix;
    private _whiteBalanceMatrixTemperature;
    private _whiteBalanceMatrixTint;
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
    private _getWhiteBalanceMatrix;
    /**
     * Vignette stretch size.
     */
    vignetteStretch: number;
    /**
     * Vignette center X Offset.
     */
    vignetteCenterX: number;
    /**
     * Vignette center Y Offset.
     */
    vignetteCenterY: number;
    /**
     * Back Compat: Vignette center Y Offset.
     * @deprecated use vignetteCenterY instead
     */
    get vignetteCentreY(): number;
    set vignetteCentreY(value: number);
    /**
     * Back Compat: Vignette center X Offset.
     * @deprecated use vignetteCenterX instead
     */
    get vignetteCentreX(): number;
    set vignetteCentreX(value: number);
    /**
     * Vignette weight or intensity of the vignette effect.
     */
    vignetteWeight: number;
    /**
     * Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
     * if vignetteEnabled is set to true.
     */
    vignetteColor: Color4;
    /**
     * Camera field of view used by the Vignette effect.
     */
    vignetteCameraFov: number;
    private _vignetteBlendMode;
    /**
     * Gets the vignette blend mode allowing different kind of effect.
     */
    get vignetteBlendMode(): number;
    /**
     * Sets the vignette blend mode allowing different kind of effect.
     */
    set vignetteBlendMode(value: number);
    private _vignetteEnabled;
    /**
     * Gets whether the vignette effect is enabled.
     */
    get vignetteEnabled(): boolean;
    /**
     * Sets whether the vignette effect is enabled.
     */
    set vignetteEnabled(value: boolean);
    private _ditheringEnabled;
    /**
     * Gets whether the dithering effect is enabled.
     * The dithering effect can be used to reduce banding.
     */
    get ditheringEnabled(): boolean;
    /**
     * Sets whether the dithering effect is enabled.
     * The dithering effect can be used to reduce banding.
     */
    set ditheringEnabled(value: boolean);
    private _ditheringIntensity;
    /**
     * Gets the dithering intensity. 0 is no dithering. Default is 1.0 / 255.0.
     */
    get ditheringIntensity(): number;
    /**
     * Sets the dithering intensity. 0 is no dithering. Default is 1.0 / 255.0.
     */
    set ditheringIntensity(value: number);
    /** @internal */
    _skipFinalColorClamp: boolean;
    /**
     * If apply by post process is set to true, setting this to true will skip the final color clamp step in the fragment shader
     * Applies to PBR materials.
     */
    get skipFinalColorClamp(): boolean;
    /**
     * If apply by post process is set to true, setting this to true will skip the final color clamp step in the fragment shader
     * Applies to PBR materials.
     */
    set skipFinalColorClamp(value: boolean);
    /** @internal */
    _applyByPostProcess: boolean;
    /**
     * Gets whether the image processing is applied through a post process or not.
     */
    get applyByPostProcess(): boolean;
    /**
     * Sets whether the image processing is applied through a post process or not.
     */
    set applyByPostProcess(value: boolean);
    private _isEnabled;
    /**
     * Gets whether the image processing is enabled or not.
     */
    get isEnabled(): boolean;
    /**
     * Sets whether the image processing is enabled or not.
     */
    set isEnabled(value: boolean);
    /**
     * Width of the output texture used in the post process. If not provided, uses the width of the screen.
     */
    outputTextureWidth: number;
    /**
     * Height of the output texture used in the post process. If not provided, uses the height of the screen.
     */
    outputTextureHeight: number;
    /**
     * An event triggered when the configuration changes and requires Shader to Update some parameters.
     */
    onUpdateParameters: Observable<ImageProcessingConfiguration>;
    /**
     * Method called each time the image processing information changes requires to recompile the effect.
     */
    protected _updateParameters(): void;
    /**
     * Gets the current class name.
     * @returns "ImageProcessingConfiguration"
     */
    getClassName(): string;
    /**
     * Prepare the list of uniforms associated with the Image Processing effects.
     * @param uniforms The list of uniforms used in the effect
     * @param defines the list of defines currently in use
     */
    static PrepareUniforms: (uniforms: string[], defines: IImageProcessingConfigurationDefines) => void;
    /**
     * Prepare the list of samplers associated with the Image Processing effects.
     * @param samplersList The list of uniforms used in the effect
     * @param defines the list of defines currently in use
     */
    static PrepareSamplers: (samplersList: string[], defines: IImageProcessingConfigurationDefines) => void;
    /**
     * Prepare the list of defines associated to the shader.
     * @param defines the list of defines to complete
     * @param forPostProcess Define if we are currently in post process mode or not
     */
    prepareDefines(defines: IImageProcessingConfigurationDefines, forPostProcess?: boolean): void;
    /**
     * Returns true if all the image processing information are ready.
     * @returns True if ready, otherwise, false
     */
    isReady(): boolean;
    /**
     * Binds the image processing to the shader.
     * @param effect The effect to bind to
     * @param overrideAspectRatio Override the aspect ratio of the effect
     */
    bind(effect: Effect, overrideAspectRatio?: number): void;
    /**
     * Clones the current image processing instance.
     * @returns The cloned image processing
     */
    clone(): ImageProcessingConfiguration;
    /**
     * Serializes the current image processing instance to a json representation.
     * @returns a JSON representation
     */
    serialize(): any;
    private static _VIGNETTEMODE_MULTIPLY;
    private static _VIGNETTEMODE_OPAQUE;
    /**
     * Used to apply the vignette as a mix with the pixel color.
     */
    static get VIGNETTEMODE_MULTIPLY(): number;
    /**
     * Used to apply the vignette as a replacement of the pixel color.
     */
    static get VIGNETTEMODE_OPAQUE(): number;
}
/**
 * Parses the image processing from a json representation.
 * @param source the JSON source to parse
 * @returns The parsed image processing
 */
export declare function ImageProcessingConfigurationParse(source: any): ImageProcessingConfiguration;
/**
 * Register side effects for imageProcessingConfiguration.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterImageProcessingConfiguration(): void;

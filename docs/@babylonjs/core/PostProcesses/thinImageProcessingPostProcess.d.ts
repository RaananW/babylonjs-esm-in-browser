import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions, type NonNullableFields, type Scene, type ColorCurves, type BaseTexture, type Color4 } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration.pure.js";
/**
 * Options used to create a ThinImageProcessingPostProcessOptions.
 */
export interface ThinImageProcessingPostProcessOptions extends EffectWrapperCreationOptions {
    /**
     * An existing image processing configuration to use. If not provided, the scene one will be used.
     */
    imageProcessingConfiguration?: ImageProcessingConfiguration;
    /**
     * The scene to retrieve the image processing configuration from if not provided in the options.
     * If not provided, the last created scene will be used.
     */
    scene?: Nullable<Scene>;
    /**
     * The correlated color temperature, in Kelvin, of the illuminant to neutralize via white balance, applied to
     * the resolved image processing configuration - see `ImageProcessingConfiguration.temperature`. Providing
     * this (or `tint`) also enables white balance. Defaults to 6500 K.
     */
    temperature?: number;
    /**
     * The white balance tint offset to apply, on the green/magenta axis, to the resolved image processing
     * configuration - see `ImageProcessingConfiguration.tint`. Providing this (or `temperature`) also enables
     * white balance. Defaults to 0 (no tint offset).
     */
    tint?: number;
}
/**
 * Applies the `temperature`/`tint` white balance options (if provided) to an image processing configuration,
 * enabling white balance if either was supplied. Exported (but internal) so it can be applied uniformly
 * regardless of how the configuration was resolved - in particular, `ImageProcessingPostProcess` also calls this
 * directly on `this.imageProcessingConfiguration` after construction, since a caller-supplied `effectWrapper`
 * bypasses `ThinImageProcessingPostProcess`'s own constructor (and thus its own call to this function) entirely.
 * @param configuration the image processing configuration to update
 * @param options the options object that may contain `temperature`/`tint`, or a plain size number (ignored)
 * @internal
 */
export declare function _ApplyWhiteBalanceOptions(configuration: ImageProcessingConfiguration, options?: {
    temperature?: number;
    tint?: number;
} | number): void;
/**
 * Post process used to apply image processing to a scene
 */
export declare class ThinImageProcessingPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "imageProcessing";
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Default configuration related to image processing available in the PBR Material.
     */
    protected _imageProcessingConfiguration: ImageProcessingConfiguration;
    /**
     * Gets the image processing configuration used either in this material.
     */
    get imageProcessingConfiguration(): ImageProcessingConfiguration;
    /**
     * Sets the Default image processing configuration used either in the this material.
     *
     * If sets to null, the scene one is in use.
     */
    set imageProcessingConfiguration(value: ImageProcessingConfiguration);
    /**
     * Keep track of the image processing observer to allow dispose and replace.
     */
    private _imageProcessingObserver;
    /**
     * Attaches a new image processing configuration to the PBR Material.
     * @param configuration
     * @param doNotBuild
     */
    protected _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>, doNotBuild?: boolean): void;
    /**
     * Gets Color curves setup used in the effect if colorCurvesEnabled is set to true .
     */
    get colorCurves(): Nullable<ColorCurves>;
    /**
     * Sets Color curves setup used in the effect if colorCurvesEnabled is set to true .
     */
    set colorCurves(value: Nullable<ColorCurves>);
    /**
     * Gets whether the color curves effect is enabled.
     */
    get colorCurvesEnabled(): boolean;
    /**
     * Sets whether the color curves effect is enabled.
     */
    set colorCurvesEnabled(value: boolean);
    /**
     * Gets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
     */
    get colorGradingTexture(): Nullable<BaseTexture>;
    /**
     * Sets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
     */
    set colorGradingTexture(value: Nullable<BaseTexture>);
    /**
     * Gets whether the color grading effect is enabled.
     */
    get colorGradingEnabled(): boolean;
    /**
     * Gets whether the color grading effect is enabled.
     */
    set colorGradingEnabled(value: boolean);
    /**
     * Gets exposure used in the effect.
     */
    get exposure(): number;
    /**
     * Sets exposure used in the effect.
     */
    set exposure(value: number);
    /**
     * Gets whether tonemapping is enabled or not.
     */
    get toneMappingEnabled(): boolean;
    /**
     * Sets whether tonemapping is enabled or not
     */
    set toneMappingEnabled(value: boolean);
    /**
     * Gets the type of tone mapping effect.
     */
    get toneMappingType(): number;
    /**
     * Sets the type of tone mapping effect.
     */
    set toneMappingType(value: number);
    /**
     * Gets contrast used in the effect.
     */
    get contrast(): number;
    /**
     * Sets contrast used in the effect.
     */
    set contrast(value: number);
    /**
     * Gets whether the white balance effect is enabled.
     */
    get whiteBalanceEnabled(): boolean;
    /**
     * Sets whether the white balance effect is enabled.
     */
    set whiteBalanceEnabled(value: boolean);
    /**
     * Gets the white balance correlated color temperature, in Kelvin, used in the effect.
     */
    get temperature(): number;
    /**
     * Sets the white balance correlated color temperature, in Kelvin, used in the effect.
     */
    set temperature(value: number);
    /**
     * Gets the white balance tint offset used in the effect.
     */
    get tint(): number;
    /**
     * Sets the white balance tint offset used in the effect.
     */
    set tint(value: number);
    /**
     * Gets Vignette stretch size.
     */
    get vignetteStretch(): number;
    /**
     * Sets Vignette stretch size.
     */
    set vignetteStretch(value: number);
    /**
     * Gets Vignette center X Offset.
     * @deprecated use vignetteCenterX instead
     */
    get vignetteCentreX(): number;
    /**
     * Sets Vignette center X Offset.
     * @deprecated use vignetteCenterX instead
     */
    set vignetteCentreX(value: number);
    /**
     * Gets Vignette center Y Offset.
     * @deprecated use vignetteCenterY instead
     */
    get vignetteCentreY(): number;
    /**
     * Sets Vignette center Y Offset.
     * @deprecated use vignetteCenterY instead
     */
    set vignetteCentreY(value: number);
    /**
     * Vignette center Y Offset.
     */
    get vignetteCenterY(): number;
    set vignetteCenterY(value: number);
    /**
     * Vignette center X Offset.
     */
    get vignetteCenterX(): number;
    set vignetteCenterX(value: number);
    /**
     * Gets Vignette weight or intensity of the vignette effect.
     */
    get vignetteWeight(): number;
    /**
     * Sets Vignette weight or intensity of the vignette effect.
     */
    set vignetteWeight(value: number);
    /**
     * Gets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
     * if vignetteEnabled is set to true.
     */
    get vignetteColor(): Color4;
    /**
     * Sets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
     * if vignetteEnabled is set to true.
     */
    set vignetteColor(value: Color4);
    /**
     * Gets Camera field of view used by the Vignette effect.
     */
    get vignetteCameraFov(): number;
    /**
     * Sets Camera field of view used by the Vignette effect.
     */
    set vignetteCameraFov(value: number);
    /**
     * Gets the vignette blend mode allowing different kind of effect.
     */
    get vignetteBlendMode(): number;
    /**
     * Sets the vignette blend mode allowing different kind of effect.
     */
    set vignetteBlendMode(value: number);
    /**
     * Gets whether the vignette effect is enabled.
     */
    get vignetteEnabled(): boolean;
    /**
     * Sets whether the vignette effect is enabled.
     */
    set vignetteEnabled(value: boolean);
    /**
     * Gets intensity of the dithering effect.
     */
    get ditheringIntensity(): number;
    /**
     * Sets intensity of the dithering effect.
     */
    set ditheringIntensity(value: number);
    /**
     * Gets whether the dithering effect is enabled.
     */
    get ditheringEnabled(): boolean;
    /**
     * Sets whether the dithering effect is enabled.
     */
    set ditheringEnabled(value: boolean);
    private _fromLinearSpace;
    /**
     * Gets whether the input of the processing is in Gamma or Linear Space.
     */
    get fromLinearSpace(): boolean;
    /**
     * Sets whether the input of the processing is in Gamma or Linear Space.
     */
    set fromLinearSpace(value: boolean);
    /**
     * * Gets the width of the output texture used to store the result of the post process.
     */
    get outputTextureWidth(): number;
    /**
     * * Sets the width of the output texture used to store the result of the post process.
     */
    set outputTextureWidth(value: number);
    /**
     * * Gets the height of the output texture used to store the result of the post process.
     */
    get outputTextureHeight(): number;
    /**
     * * Sets the height of the output texture used to store the result of the post process.
     */
    set outputTextureHeight(value: number);
    /**
     * Gets/sets the aspect ratio used to override the default one.
     */
    overrideAspectRatio?: number;
    /**
     * Defines cache preventing GC.
     */
    private _defines;
    readonly options: Required<NonNullableFields<ThinImageProcessingPostProcessOptions>>;
    /**
     * Constructs a new image processing post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: ThinImageProcessingPostProcessOptions);
    /**
     * @internal
     */
    _updateParameters(): void;
    bind(noDefaultBindings?: boolean): void;
    dispose(): void;
}

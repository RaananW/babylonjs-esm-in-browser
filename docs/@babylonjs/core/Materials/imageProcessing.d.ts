import { type Nullable } from "../types.js";
import { type ImageProcessingConfiguration } from "./imageProcessingConfiguration.js";
import { type Observer } from "../Misc/observable.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.js";
import { type ColorCurves } from "../Materials/colorCurves.js";
type ImageProcessingMixinConstructor<T = {}> = new (...args: any[]) => T;
/**
 * Mixin to add Image processing defines to your material defines
 * @internal
 */
export declare function ImageProcessingMixin<Tbase extends ImageProcessingMixinConstructor>(base: Tbase): {
    new (...args: any[]): {
        /**
         * Default configuration related to image processing available in the standard Material.
         */
        _imageProcessingConfiguration: ImageProcessingConfiguration;
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
        _imageProcessingObserver: Nullable<Observer<ImageProcessingConfiguration>>;
        /**
         * Attaches a new image processing configuration to the Standard Material.
         * @param configuration
         */
        _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>): void;
        /**
         * Gets whether the color curves effect is enabled.
         */
        get cameraColorCurvesEnabled(): boolean;
        /**
         * Sets whether the color curves effect is enabled.
         */
        set cameraColorCurvesEnabled(value: boolean);
        /**
         * Gets whether the color grading effect is enabled.
         */
        get cameraColorGradingEnabled(): boolean;
        /**
         * Gets whether the color grading effect is enabled.
         */
        set cameraColorGradingEnabled(value: boolean);
        /**
         * Gets whether tonemapping is enabled or not.
         */
        get cameraToneMappingEnabled(): boolean;
        /**
         * Sets whether tonemapping is enabled or not
         */
        set cameraToneMappingEnabled(value: boolean);
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        get cameraExposure(): number;
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        set cameraExposure(value: number);
        /**
         * Gets The camera contrast used on this material.
         */
        get cameraContrast(): number;
        /**
         * Sets The camera contrast used on this material.
         */
        set cameraContrast(value: number);
        /**
         * Gets the Color Grading 2D Lookup Texture.
         */
        get cameraColorGradingTexture(): Nullable<BaseTexture>;
        /**
         * Sets the Color Grading 2D Lookup Texture.
         */
        set cameraColorGradingTexture(value: Nullable<BaseTexture>);
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        get cameraColorCurves(): Nullable<ColorCurves>;
        /**
         * The color grading curves provide additional color adjustment that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        set cameraColorCurves(value: Nullable<ColorCurves>);
    };
} & Tbase;
export {};

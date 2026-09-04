/* eslint-disable @typescript-eslint/naming-convention */
import { GetDirectStoreFromMetadata } from "../Misc/decorators.functions.js";
/**
 * Mixin to add Image processing defines to your material defines
 * @internal
 */
export function ImageProcessingMixin(base) {
    return class extends base {
        /**
         * Constructor for the ImageProcessingMixin.
         * @param args - arguments to pass to the base class constructor
         */
        constructor(...args) {
            super(...args);
            // Decorators don't work on this anonymous class
            // so manually register the serialization metadata.
            const ctor = new.target;
            if (!ctor[Symbol.metadata]) {
                const parentMeta = Object.getPrototypeOf(ctor)?.[Symbol.metadata];
                ctor[Symbol.metadata] = parentMeta ? Object.create(parentMeta) : {};
            }
            const store = GetDirectStoreFromMetadata(ctor[Symbol.metadata]);
            if (!store["_imageProcessingConfiguration"]) {
                store["_imageProcessingConfiguration"] = { type: 9 /* SerializedFieldType.IMAGE_PROCESSING */, sourceName: undefined };
            }
        }
        /**
         * Gets the image processing configuration used either in this material.
         */
        get imageProcessingConfiguration() {
            return this._imageProcessingConfiguration;
        }
        /**
         * Sets the Default image processing configuration used either in the this material.
         *
         * If sets to null, the scene one is in use.
         */
        set imageProcessingConfiguration(value) {
            this._attachImageProcessingConfiguration(value);
            // Ensure the effect will be rebuilt.
            if (this._markAllSubMeshesAsImageProcessingDirty) {
                this._markAllSubMeshesAsImageProcessingDirty();
            }
        }
        /**
         * Attaches a new image processing configuration to the Standard Material.
         * @param configuration
         */
        _attachImageProcessingConfiguration(configuration) {
            if (configuration === this._imageProcessingConfiguration) {
                return;
            }
            // Detaches observer
            if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
            }
            // Pick the scene configuration if needed
            if (!configuration && this.getScene) {
                this._imageProcessingConfiguration = this.getScene().imageProcessingConfiguration;
            }
            else if (configuration) {
                this._imageProcessingConfiguration = configuration;
            }
            // Attaches observer
            if (this._imageProcessingConfiguration) {
                this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(() => {
                    // Ensure the effect will be rebuilt.
                    if (this._markAllSubMeshesAsImageProcessingDirty) {
                        this._markAllSubMeshesAsImageProcessingDirty();
                    }
                });
            }
        }
        /**
         * Gets whether the color curves effect is enabled.
         */
        get cameraColorCurvesEnabled() {
            return this.imageProcessingConfiguration.colorCurvesEnabled;
        }
        /**
         * Sets whether the color curves effect is enabled.
         */
        set cameraColorCurvesEnabled(value) {
            this.imageProcessingConfiguration.colorCurvesEnabled = value;
        }
        /**
         * Gets whether the color grading effect is enabled.
         */
        get cameraColorGradingEnabled() {
            return this.imageProcessingConfiguration.colorGradingEnabled;
        }
        /**
         * Gets whether the color grading effect is enabled.
         */
        set cameraColorGradingEnabled(value) {
            this.imageProcessingConfiguration.colorGradingEnabled = value;
        }
        /**
         * Gets whether tonemapping is enabled or not.
         */
        get cameraToneMappingEnabled() {
            return this._imageProcessingConfiguration.toneMappingEnabled;
        }
        /**
         * Sets whether tonemapping is enabled or not
         */
        set cameraToneMappingEnabled(value) {
            this._imageProcessingConfiguration.toneMappingEnabled = value;
        }
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        get cameraExposure() {
            return this._imageProcessingConfiguration.exposure;
        }
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        set cameraExposure(value) {
            this._imageProcessingConfiguration.exposure = value;
        }
        /**
         * Gets The camera contrast used on this material.
         */
        get cameraContrast() {
            return this._imageProcessingConfiguration.contrast;
        }
        /**
         * Sets The camera contrast used on this material.
         */
        set cameraContrast(value) {
            this._imageProcessingConfiguration.contrast = value;
        }
        /**
         * Gets the Color Grading 2D Lookup Texture.
         */
        get cameraColorGradingTexture() {
            return this._imageProcessingConfiguration.colorGradingTexture;
        }
        /**
         * Sets the Color Grading 2D Lookup Texture.
         */
        set cameraColorGradingTexture(value) {
            this._imageProcessingConfiguration.colorGradingTexture = value;
        }
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        get cameraColorCurves() {
            return this._imageProcessingConfiguration.colorCurves;
        }
        /**
         * The color grading curves provide additional color adjustment that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        set cameraColorCurves(value) {
            this._imageProcessingConfiguration.colorCurves = value;
        }
    };
}
//# sourceMappingURL=imageProcessing.js.map
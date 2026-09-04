import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration.pure.js";
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
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _ApplyWhiteBalanceOptions(configuration, options) {
    if (!options || typeof options === "number") {
        return;
    }
    if (options.temperature === undefined && options.tint === undefined) {
        return;
    }
    if (options.temperature !== undefined) {
        configuration.temperature = options.temperature;
    }
    if (options.tint !== undefined) {
        configuration.tint = options.tint;
    }
    configuration.whiteBalanceEnabled = true;
}
/**
 * Post process used to apply image processing to a scene
 */
export class ThinImageProcessingPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/imageProcessing.fragment.js"));
        }
        else {
            list.push(import("../Shaders/imageProcessing.fragment.js"));
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
        // We are almost sure it is applied by post process as
        // We are in the post process :-)
        value.applyByPostProcess = true;
        this._attachImageProcessingConfiguration(value);
    }
    /**
     * Attaches a new image processing configuration to the PBR Material.
     * @param configuration
     * @param doNotBuild
     */
    _attachImageProcessingConfiguration(configuration, doNotBuild = false) {
        if (configuration === this._imageProcessingConfiguration) {
            return;
        }
        // Detaches observer.
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        // Pick the scene configuration if needed.
        if (!configuration) {
            let scene = this.options.scene;
            if (!scene) {
                const engine = this.options.engine;
                if (engine && engine.scenes) {
                    const scenes = engine.scenes;
                    scene = scenes[scenes.length - 1];
                }
                else {
                    scene = EngineStore.LastCreatedScene;
                }
            }
            if (scene) {
                this._imageProcessingConfiguration = scene.imageProcessingConfiguration;
            }
            else {
                this._imageProcessingConfiguration = new ImageProcessingConfiguration();
            }
        }
        else {
            this._imageProcessingConfiguration = configuration;
        }
        // Attaches observer.
        if (this._imageProcessingConfiguration) {
            this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(() => {
                this._updateParameters();
            });
        }
        // Ensure the effect will be rebuilt.
        if (!doNotBuild) {
            this._updateParameters();
        }
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
        return this._fromLinearSpace;
    }
    /**
     * Sets whether the input of the processing is in Gamma or Linear Space.
     */
    set fromLinearSpace(value) {
        if (this._fromLinearSpace === value) {
            return;
        }
        this._fromLinearSpace = value;
        this._updateParameters();
    }
    /**
     * * Gets the width of the output texture used to store the result of the post process.
     */
    get outputTextureWidth() {
        return this.imageProcessingConfiguration.outputTextureWidth;
    }
    /**
     * * Sets the width of the output texture used to store the result of the post process.
     */
    set outputTextureWidth(value) {
        this.imageProcessingConfiguration.outputTextureWidth = value;
    }
    /**
     * * Gets the height of the output texture used to store the result of the post process.
     */
    get outputTextureHeight() {
        return this.imageProcessingConfiguration.outputTextureHeight;
    }
    /**
     * * Sets the height of the output texture used to store the result of the post process.
     */
    set outputTextureHeight(value) {
        this.imageProcessingConfiguration.outputTextureHeight = value;
    }
    /**
     * Constructs a new image processing post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinImageProcessingPostProcess.FragmentUrl,
        });
        this._fromLinearSpace = true;
        /**
         * Defines cache preventing GC.
         */
        this._defines = {
            IMAGEPROCESSING: false,
            WHITEBALANCE: false,
            VIGNETTE: false,
            VIGNETTEBLENDMODEMULTIPLY: false,
            VIGNETTEBLENDMODEOPAQUE: false,
            TONEMAPPING: 0,
            CONTRAST: false,
            COLORCURVES: false,
            COLORGRADING: false,
            COLORGRADING3D: false,
            FROMLINEARSPACE: false,
            SAMPLER3DGREENDEPTH: false,
            SAMPLER3DBGRMAP: false,
            DITHER: false,
            IMAGEPROCESSINGPOSTPROCESS: false,
            EXPOSURE: false,
            SKIPFINALCOLORCLAMP: false,
        };
        const imageProcessingConfiguration = options?.imageProcessingConfiguration;
        // Setup the configuration as forced by the constructor. This would then not force the
        // scene materials output in linear space and let untouched the default forward pass.
        if (imageProcessingConfiguration) {
            imageProcessingConfiguration.applyByPostProcess = true;
            this._attachImageProcessingConfiguration(imageProcessingConfiguration, true);
            _ApplyWhiteBalanceOptions(this.imageProcessingConfiguration, options);
            // This will cause the shader to be compiled
            this._updateParameters();
        }
        // Setup the default processing configuration to the scene.
        else {
            this._attachImageProcessingConfiguration(null, true);
            _ApplyWhiteBalanceOptions(this.imageProcessingConfiguration, options);
            this.imageProcessingConfiguration.applyByPostProcess = true;
        }
    }
    /**
     * @internal
     */
    _updateParameters() {
        this._defines.FROMLINEARSPACE = this._fromLinearSpace;
        this.imageProcessingConfiguration.prepareDefines(this._defines, true);
        let defines = "";
        for (const prop in this._defines) {
            const value = this._defines[prop];
            const type = typeof value;
            switch (type) {
                case "number":
                case "string":
                    defines += `#define ${prop} ${value};\n`;
                    break;
                default:
                    if (value) {
                        defines += `#define ${prop};\n`;
                    }
                    break;
            }
        }
        const samplers = ["textureSampler"];
        const uniforms = ["scale"];
        if (ImageProcessingConfiguration) {
            ImageProcessingConfiguration.PrepareSamplers(samplers, this._defines);
            ImageProcessingConfiguration.PrepareUniforms(uniforms, this._defines);
        }
        this.updateEffect(defines, uniforms, samplers);
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this.imageProcessingConfiguration.bind(this.effect, this.overrideAspectRatio);
    }
    dispose() {
        super.dispose();
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        if (this._imageProcessingConfiguration) {
            this.imageProcessingConfiguration.applyByPostProcess = false;
        }
    }
}
/**
 * The fragment shader url
 */
ThinImageProcessingPostProcess.FragmentUrl = "imageProcessing";
//# sourceMappingURL=thinImageProcessingPostProcess.js.map
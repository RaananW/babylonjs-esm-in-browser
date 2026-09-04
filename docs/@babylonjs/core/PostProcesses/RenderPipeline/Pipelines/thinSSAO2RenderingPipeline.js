import { ThinSSAO2PostProcess } from "../../thinSSAO2PostProcess.js";
import { ThinSSAO2BlurPostProcess } from "../../thinSSAO2BlurPostProcess.js";
import { ThinSSAO2CombinePostProcess } from "../../thinSSAO2CombinePostProcess.js";
/**
 * The SSAO2 rendering pipeline is used to generate ambient occlusion effects.
 */
export class ThinSSAO2RenderingPipeline {
    /**
     * The camera to which the rendering pipeline will be applied.
     */
    get camera() {
        return this._ssaoPostProcess.camera;
    }
    set camera(camera) {
        this._ssaoPostProcess.camera = camera;
        this._ssaoCombinePostProcess.camera = camera;
    }
    /**
     * Number of samples used for the SSAO calculations. Default value is 8.
     */
    set samples(n) {
        this._ssaoPostProcess.samples = n;
    }
    get samples() {
        return this._ssaoPostProcess.samples;
    }
    /**
     * The output strength of the SSAO post-process. Default value is 1.0.
     */
    get totalStrength() {
        return this._ssaoPostProcess.totalStrength;
    }
    set totalStrength(value) {
        this._ssaoPostProcess.totalStrength = value;
    }
    /**
     * The radius around the analyzed pixel used by the SSAO post-process. Default value is 2.0
     */
    get radius() {
        return this._ssaoPostProcess.radius;
    }
    set radius(value) {
        this._ssaoPostProcess.radius = value;
    }
    /**
     * Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change.
     */
    get maxZ() {
        return this._ssaoPostProcess.maxZ;
    }
    set maxZ(value) {
        this._ssaoPostProcess.maxZ = value;
    }
    /**
     * In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much.
     */
    get minZAspect() {
        return this._ssaoPostProcess.minZAspect;
    }
    set minZAspect(value) {
        this._ssaoPostProcess.minZAspect = value;
    }
    /**
     * The base color of the SSAO post-process
     * The final result is "base + ssao" between [0, 1]
     */
    get base() {
        return this._ssaoPostProcess.base;
    }
    set base(value) {
        this._ssaoPostProcess.base = value;
    }
    /**
     * Used in SSAO calculations to compensate for accuracy issues with depth values. Default 0.02.
     *
     * Normally you do not need to change this value, but you can experiment with it if you get a lot of in false self-occlusion on flat surfaces when using fewer than 16 samples. Useful range is normally [0..0.1] but higher values is allowed.
     */
    get epsilon() {
        return this._ssaoPostProcess.epsilon;
    }
    set epsilon(n) {
        this._ssaoPostProcess.epsilon = n;
    }
    /**
     * Skips the denoising (blur) stage of the SSAO calculations.
     *
     * Useful to temporarily set while experimenting with the other SSAO2 settings.
     */
    set bypassBlur(b) {
        this._ssaoBlurXPostProcess.bypassBlur = b;
        this._ssaoBlurYPostProcess.bypassBlur = b;
    }
    get bypassBlur() {
        return this._ssaoBlurXPostProcess.bypassBlur;
    }
    /**
     * Enables the configurable bilateral denoising (blurring) filter. Default is true.
     * Set to false to instead use a legacy bilateral filter that can't be configured.
     *
     * The denoising filter runs after the SSAO calculations and is a very important step. Both options results in a so called bilateral being used, but the "expensive" one can be
     * configured in several ways to fit your scene.
     */
    set expensiveBlur(b) {
        this._ssaoBlurXPostProcess.expensiveBlur = b;
        this._ssaoBlurYPostProcess.expensiveBlur = b;
    }
    get expensiveBlur() {
        return this._ssaoBlurXPostProcess.expensiveBlur;
    }
    /**
     * The number of samples the bilateral filter uses in both dimensions when denoising the SSAO calculations. Default value is 16.
     *
     * A higher value should result in smoother shadows but will use more processing time in the shaders.
     *
     * A high value can cause the shadows to get to blurry or create visible artifacts (bands) near sharp details in the geometry. The artifacts can sometimes be mitigated by increasing the bilateralSoften setting.
     */
    get bilateralSamples() {
        return this._ssaoBlurXPostProcess.bilateralSamples;
    }
    set bilateralSamples(n) {
        this._ssaoBlurXPostProcess.bilateralSamples = n;
        this._ssaoBlurYPostProcess.bilateralSamples = n;
    }
    /**
     * Controls the shape of the denoising kernel used by the bilateral filter. Default value is 0.
     *
     * By default the bilateral filter acts like a box-filter, treating all samples on the same depth with equal weights. This is effective to maximize the denoising effect given a limited set of samples. However, it also often results in visible ghosting around sharp shadow regions and can spread out lines over large areas so they are no longer visible.
     *
     * Increasing this setting will make the filter pay less attention to samples further away from the center sample, reducing many artifacts but at the same time increasing noise.
     *
     * Useful value range is [0..1].
     */
    get bilateralSoften() {
        return this._ssaoBlurXPostProcess.bilateralSoften;
    }
    set bilateralSoften(n) {
        this._ssaoBlurXPostProcess.bilateralSoften = n;
        this._ssaoBlurYPostProcess.bilateralSoften = n;
    }
    /**
     * How forgiving the bilateral denoiser should be when rejecting samples. Default value is 0.
     *
     * A higher value results in the bilateral filter being more forgiving and thus doing a better job at denoising slanted and curved surfaces, but can lead to shadows spreading out around corners or between objects that are close to each other depth wise.
     *
     * Useful value range is normally [0..1], but higher values are allowed.
     */
    get bilateralTolerance() {
        return this._ssaoBlurXPostProcess.bilateralTolerance;
    }
    set bilateralTolerance(n) {
        this._ssaoBlurXPostProcess.bilateralTolerance = n;
        this._ssaoBlurYPostProcess.bilateralTolerance = n;
    }
    /**
     * Indicates that the combine stage should use the current camera viewport to render the SSAO result on only a portion of the output texture (default: true).
     */
    get useViewportInCombineStage() {
        return this._ssaoCombinePostProcess.useViewportInCombineStage;
    }
    set useViewportInCombineStage(b) {
        this._ssaoCombinePostProcess.useViewportInCombineStage = b;
    }
    /**
     * Checks if all the post processes in the pipeline are ready.
     * @returns true if all the post processes in the pipeline are ready
     */
    isReady() {
        return this._ssaoPostProcess.isReady() && this._ssaoBlurXPostProcess.isReady() && this._ssaoBlurYPostProcess.isReady() && this._ssaoCombinePostProcess.isReady();
    }
    /**
     * Constructor of the SSR rendering pipeline
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     */
    constructor(name, scene) {
        this.name = name;
        this._scene = scene;
        this._ssaoPostProcess = new ThinSSAO2PostProcess(this.name, this._scene);
        this._ssaoBlurXPostProcess = new ThinSSAO2BlurPostProcess(this.name + " BlurX", this._scene.getEngine(), true);
        this._ssaoBlurYPostProcess = new ThinSSAO2BlurPostProcess(this.name + " BlurY", this._scene.getEngine(), false);
        this._ssaoCombinePostProcess = new ThinSSAO2CombinePostProcess(this.name + " Combiner", this._scene.getEngine());
    }
    /**
     * Disposes of the pipeline
     */
    dispose() {
        this._ssaoPostProcess?.dispose();
        this._ssaoBlurXPostProcess?.dispose();
        this._ssaoBlurYPostProcess?.dispose();
        this._ssaoCombinePostProcess?.dispose();
    }
}
//# sourceMappingURL=thinSSAO2RenderingPipeline.js.map
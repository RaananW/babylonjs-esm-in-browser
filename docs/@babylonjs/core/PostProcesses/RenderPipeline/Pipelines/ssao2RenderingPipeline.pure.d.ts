/** This file must only contain pure code and pure imports */
import { type Camera } from "../../../Cameras/camera.pure.js";
import { PostProcessRenderPipeline } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipeline.js";
import { type Scene } from "../../../scene.pure.js";
import { GeometryBufferRenderer } from "../../../Rendering/geometryBufferRenderer.pure.js";
/**
 * Render pipeline to produce ssao effect
 */
export declare class SSAO2RenderingPipeline extends PostProcessRenderPipeline {
    /**
     * @ignore
     * The PassPostProcess id in the pipeline that contains the original scene color
     */
    SSAOOriginalSceneColorEffect: string;
    /**
     * @ignore
     * The SSAO PostProcess id in the pipeline
     */
    SSAORenderEffect: string;
    /**
     * @ignore
     * The horizontal blur PostProcess id in the pipeline
     */
    SSAOBlurHRenderEffect: string;
    /**
     * @ignore
     * The vertical blur PostProcess id in the pipeline
     */
    SSAOBlurVRenderEffect: string;
    /**
     * @ignore
     * The PostProcess id in the pipeline that combines the SSAO-Blur output with the original scene color (SSAOOriginalSceneColorEffect)
     */
    SSAOCombineRenderEffect: string;
    private _thinSSAORenderingPipeline;
    /**
     * The output strength of the SSAO post-process. Default value is 1.0.
     */
    get totalStrength(): number;
    set totalStrength(value: number);
    /**
     * Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change.
     */
    get maxZ(): number;
    set maxZ(value: number);
    /**
     * In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much.
     */
    get minZAspect(): number;
    set minZAspect(value: number);
    /**
     * Used in SSAO calculations to compensate for accuracy issues with depth values. Default 0.02.
     *
     * Normally you do not need to change this value, but you can experiment with it if you get a lot of in false self-occlusion on flat surfaces when using fewer than 16 samples. Useful range is normally [0..0.1] but higher values is allowed.
     */
    set epsilon(n: number);
    get epsilon(): number;
    /**
     * Number of samples used for the SSAO calculations. Default value is 8.
     */
    set samples(n: number);
    get samples(): number;
    private _textureSamples;
    /**
     * Number of samples to use for antialiasing.
     */
    set textureSamples(n: number);
    get textureSamples(): number;
    private _forcedGeometryBuffer;
    /**
     * Force rendering the geometry through geometry buffer.
     */
    private _forceGeometryBuffer;
    private get _geometryBufferRenderer();
    private get _prePassRenderer();
    /**
     * Ratio object used for SSAO ratio and blur ratio
     */
    private _ratio;
    private _textureType;
    /**
     * The radius around the analyzed pixel used by the SSAO post-process. Default value is 2.0
     */
    get radius(): number;
    set radius(value: number);
    /**
     * The base color of the SSAO post-process
     * The final result is "base + ssao" between [0, 1]
     */
    get base(): number;
    set base(value: number);
    /**
     * Skips the denoising (blur) stage of the SSAO calculations.
     *
     * Useful to temporarily set while experimenting with the other SSAO2 settings.
     */
    set bypassBlur(b: boolean);
    get bypassBlur(): boolean;
    /**
     * Enables the configurable bilateral denoising (blurring) filter. Default is true.
     * Set to false to instead use a legacy bilateral filter that can't be configured.
     *
     * The denoising filter runs after the SSAO calculations and is a very important step. Both options results in a so called bilateral being used, but the "expensive" one can be
     * configured in several ways to fit your scene.
     */
    set expensiveBlur(b: boolean);
    get expensiveBlur(): boolean;
    /**
     * The number of samples the bilateral filter uses in both dimensions when denoising the SSAO calculations. Default value is 16.
     *
     * A higher value should result in smoother shadows but will use more processing time in the shaders.
     *
     * A high value can cause the shadows to get to blurry or create visible artifacts (bands) near sharp details in the geometry. The artifacts can sometimes be mitigated by increasing the bilateralSoften setting.
     */
    get bilateralSamples(): number;
    set bilateralSamples(n: number);
    /**
     * Controls the shape of the denoising kernel used by the bilateral filter. Default value is 0.
     *
     * By default the bilateral filter acts like a box-filter, treating all samples on the same depth with equal weights. This is effective to maximize the denoising effect given a limited set of samples. However, it also often results in visible ghosting around sharp shadow regions and can spread out lines over large areas so they are no longer visible.
     *
     * Increasing this setting will make the filter pay less attention to samples further away from the center sample, reducing many artifacts but at the same time increasing noise.
     *
     * Useful value range is [0..1].
     */
    get bilateralSoften(): number;
    set bilateralSoften(n: number);
    /**
     * How forgiving the bilateral denoiser should be when rejecting samples. Default value is 0.
     *
     * A higher value results in the bilateral filter being more forgiving and thus doing a better job at denoising slanted and curved surfaces, but can lead to shadows spreading out around corners or between objects that are close to each other depth wise.
     *
     * Useful value range is normally [0..1], but higher values are allowed.
     */
    get bilateralTolerance(): number;
    set bilateralTolerance(n: number);
    /**
     *  Support test.
     */
    static get IsSupported(): boolean;
    /**
     * Indicates that the combine stage should use the current camera viewport to render the SSAO result on only a portion of the output texture (default: true).
     */
    get useViewportInCombineStage(): boolean;
    set useViewportInCombineStage(b: boolean);
    /**
     * Checks if all the post processes in the pipeline are ready.
     * @returns True if all the post processes in the pipeline are ready
     */
    isReady(): boolean;
    private _scene;
    private _originalColorPostProcess;
    private _ssaoPostProcess;
    private _blurHPostProcess;
    private _blurVPostProcess;
    private _ssaoCombinePostProcess;
    private _currentCameraMode;
    /**
     * Gets active scene
     */
    get scene(): Scene;
    /**
     * Creates the SSAO2 rendering pipeline.
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     * @param ratio The size of the postprocesses. Can be a number shared between passes or an object for more precision: { ssaoRatio: 0.5, blurRatio: 1.0 }
     * @param cameras The array of cameras that the rendering pipeline will be attached to
     * @param forceGeometryBuffer Set to true if you want to use the legacy geometry buffer renderer. You can also pass an existing instance of GeometryBufferRenderer if you want to use your own geometry buffer renderer.
     * @param textureType The texture type used by the different post processes created by SSAO (default: Constants.TEXTURETYPE_UNSIGNED_BYTE)
     */
    constructor(name: string, scene: Scene, ratio: any, cameras?: Camera[], forceGeometryBuffer?: boolean | GeometryBufferRenderer, textureType?: number);
    /**
     * Get the class name
     * @returns "SSAO2RenderingPipeline"
     */
    getClassName(): string;
    /**
     * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
     * @param disableGeometryBufferRenderer Set to true if you want to disable the Geometry Buffer renderer
     */
    dispose(disableGeometryBufferRenderer?: boolean): void;
    private _syncNormalsInWorldSpace;
    /** @internal */
    _rebuild(): void;
    private _createBlurPostProcess;
    private _createBlurFilter;
    private _getTextureSize;
    private _createSSAOPostProcess;
    private _createSSAOCombinePostProcess;
    /**
     * Serialize the rendering pipeline (Used when exporting)
     * @returns the serialized object
     */
    serialize(): any;
}
/**
 * Parse the serialized pipeline
 * @param source Source pipeline.
 * @param scene The scene to load the pipeline to.
 * @param rootUrl The URL of the serialized pipeline.
 * @returns An instantiated pipeline from the serialized object.
 */
export declare function SSAO2RenderingPipelineParse(source: any, scene: Scene, rootUrl: string): SSAO2RenderingPipeline;
/**
 * Register side effects for ssao2RenderingPipeline.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSsao2RenderingPipeline(): void;

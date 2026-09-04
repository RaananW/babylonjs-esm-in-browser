import { type Scene } from "../../../scene.js";
import { PostProcessRenderPipeline } from "../postProcessRenderPipeline.js";
/**
 * FidelityFX Super Resolution (FSR) 1 render pipeline.
 * This can be used to render the scene at a lower resolution and upscale it.
 */
export declare class FSR1RenderingPipeline extends PostProcessRenderPipeline {
    /**
     * AMD's recommended `scaleFactor` for an "Ultra Quality" preset (equal to 1.3)
     */
    static readonly SCALE_ULTRA_QUALITY = 1.3;
    /**
     * AMD's recommended `scaleFactor` for a "Quality" preset (equal to 1.5)
     */
    static readonly SCALE_QUALITY = 1.5;
    /**
     * AMD's recommended `scaleFactor` for a "Balanced" preset (equal to 1.7)
     */
    static readonly SCALE_BALANCED = 1.7;
    /**
     * AMD's recommended `scaleFactor` for a "Performance" preset (equal to 2)
     */
    static readonly SCALE_PERFORMANCE = 2;
    private readonly _scene;
    /**
     * Returns true if FSR is supported by the running hardware
     */
    get isSupported(): boolean;
    private _samples;
    /**
     * MSAA sample count (default: 4).
     * Disabling MSAA is not recommended since aliased edges will be exaggerated by the FSR pass.
     * Always have at least one AA solution enabled, whether that be MSAA with this setting or a post-process effect like FXAA or TAA.
     */
    get samples(): number;
    set samples(samples: number);
    private _scaleFactor;
    /**
     * How much smaller to render the scene at (default: 1.5).
     * For example, a value of 2 will render the scene at half resolution.
     */
    get scaleFactor(): number;
    set scaleFactor(factor: number);
    private _sharpnessStops;
    /**
     * The number of stops (halving) of the reduction of sharpness (default: 0.2).
     * A value of 0 indicates a maximum sharpness.
     */
    get sharpnessStops(): number;
    set sharpnessStops(stops: number);
    /**
     * The FSR upscale PostProcess ID in the pipeline
     */
    FSR1UpscaleEffect: string;
    private readonly _thinUpscalePostProcess;
    private _upscalePostProcess;
    /**
     * The FSR sharpen PostProcess ID in the pipeline
     */
    FSR1SharpenEffect: string;
    private readonly _thinSharpenPostProcess;
    private _sharpenPostProcess;
    /**
     * Creates a new FSR 1 rendering pipeline
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     * @param cameras The array of cameras that the rendering pipeline will be attached to (default: scene.cameras)
     */
    constructor(name: string, scene: Scene, cameras?: import("../../../index.js").Camera[]);
    private _buildPipeline;
    /**
     * Disposes of the pipeline
     */
    dispose(): void;
    private _createUpscalePostProcess;
    private _disposeUpscalePostProcess;
    private _createSharpenPostProcess;
    private _disposeSharpenPostProcess;
}

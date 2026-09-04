import { PostProcessRenderEffect } from "../postProcessRenderEffect.js";
import { PostProcessRenderPipeline } from "../postProcessRenderPipeline.js";
import { PostProcess } from "../../postProcess.pure.js";
import { ThinFSR1UpscalePostProcess } from "../../thinFSR1UpscalePostProcess.js";
import { ThinFSR1SharpenPostProcess } from "../../thinFSR1SharpenPostProcess.js";
/**
 * FidelityFX Super Resolution (FSR) 1 render pipeline.
 * This can be used to render the scene at a lower resolution and upscale it.
 */
export class FSR1RenderingPipeline extends PostProcessRenderPipeline {
    /**
     * Returns true if FSR is supported by the running hardware
     */
    get isSupported() {
        // FSR 1 needs integer texel fetch (texelFetch/textureSize) and bit-cast intrinsics.
        // These are available on WebGPU, WebGL2 and Babylon Native (all report version >= 2 or isWebGPU),
        // but not WebGL1. Note caps.texelFetch cannot be used here because Babylon Native reports it as
        // false even though the underlying backend supports the required operations.
        return this.engine.isWebGPU || this.engine.version >= 2;
    }
    /**
     * MSAA sample count (default: 4).
     * Disabling MSAA is not recommended since aliased edges will be exaggerated by the FSR pass.
     * Always have at least one AA solution enabled, whether that be MSAA with this setting or a post-process effect like FXAA or TAA.
     */
    get samples() {
        return this._samples;
    }
    set samples(samples) {
        if (this._samples === samples) {
            return;
        }
        this._samples = samples;
        if (this._upscalePostProcess) {
            this._upscalePostProcess.samples = this._samples;
        }
    }
    /**
     * How much smaller to render the scene at (default: 1.5).
     * For example, a value of 2 will render the scene at half resolution.
     */
    get scaleFactor() {
        return this._scaleFactor;
    }
    set scaleFactor(factor) {
        if (this._scaleFactor === factor) {
            return;
        }
        this._scaleFactor = factor;
        this._buildPipeline();
    }
    /**
     * The number of stops (halving) of the reduction of sharpness (default: 0.2).
     * A value of 0 indicates a maximum sharpness.
     */
    get sharpnessStops() {
        return this._sharpnessStops;
    }
    set sharpnessStops(stops) {
        if (this._sharpnessStops === stops) {
            return;
        }
        this._sharpnessStops = stops;
        // The value is applied to the effect every frame in the sharpen post-process onApply callback.
    }
    /**
     * Creates a new FSR 1 rendering pipeline
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     * @param cameras The array of cameras that the rendering pipeline will be attached to (default: scene.cameras)
     */
    constructor(name, scene, cameras = scene.cameras) {
        super(scene.getEngine(), name);
        this._samples = 4;
        this._scaleFactor = FSR1RenderingPipeline.SCALE_QUALITY;
        this._sharpnessStops = 0.2;
        /**
         * The FSR upscale PostProcess ID in the pipeline
         */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.FSR1UpscaleEffect = "FSR1UpscaleEffect";
        /**
         * The FSR sharpen PostProcess ID in the pipeline
         */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.FSR1SharpenEffect = "FSR1SharpenEffect";
        this._scene = scene;
        this._cameras = cameras.slice();
        this._thinUpscalePostProcess = new ThinFSR1UpscalePostProcess(name + "Upscale", this.engine);
        this._thinSharpenPostProcess = new ThinFSR1SharpenPostProcess(name + "Sharpen", this.engine);
        this._createSharpenPostProcess();
        if (this.isSupported) {
            scene.postProcessRenderPipelineManager.addPipeline(this);
            this._buildPipeline();
        }
    }
    _buildPipeline() {
        if (!this.isSupported) {
            return;
        }
        const cameras = this._cameras.slice();
        this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, cameras);
        this._reset();
        this._disposeUpscalePostProcess();
        this._createUpscalePostProcess();
        this.addEffect(new PostProcessRenderEffect(this.engine, this.FSR1UpscaleEffect, () => this._upscalePostProcess));
        this.addEffect(new PostProcessRenderEffect(this.engine, this.FSR1SharpenEffect, () => this._sharpenPostProcess));
        this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.name, cameras);
    }
    /**
     * Disposes of the pipeline
     */
    dispose() {
        this._disposeSharpenPostProcess();
        this._thinSharpenPostProcess.dispose();
        this._disposeUpscalePostProcess();
        this._thinUpscalePostProcess.dispose();
        super.dispose();
    }
    _createUpscalePostProcess() {
        const postProcess = new PostProcess(this._thinUpscalePostProcess.name, ThinFSR1UpscalePostProcess.FragmentUrl, {
            uniforms: ThinFSR1UpscalePostProcess.Uniforms,
            size: 1 / this._scaleFactor,
            engine: this.engine,
            effectWrapper: this._thinUpscalePostProcess,
        });
        postProcess.samples = this._samples;
        postProcess.onApplyObservable.add((effect) => {
            this._thinUpscalePostProcess.updateConstants(effect, postProcess.width, postProcess.height, postProcess.width, postProcess.height, this.engine.getRenderWidth(), this.engine.getRenderHeight());
        });
        this._upscalePostProcess = postProcess;
    }
    _disposeUpscalePostProcess() {
        for (const camera of this._cameras) {
            this._upscalePostProcess?.dispose(camera);
        }
        this._upscalePostProcess = null;
    }
    _createSharpenPostProcess() {
        this._sharpenPostProcess = new PostProcess(this._thinSharpenPostProcess.name, ThinFSR1SharpenPostProcess.FragmentUrl, {
            uniforms: ThinFSR1SharpenPostProcess.Uniforms,
            engine: this.engine,
            effectWrapper: this._thinSharpenPostProcess,
        });
        this._sharpenPostProcess.onApplyObservable.add((effect) => {
            this._thinSharpenPostProcess.updateConstants(effect, this._sharpnessStops);
        });
    }
    _disposeSharpenPostProcess() {
        for (const camera of this._cameras) {
            this._sharpenPostProcess.dispose(camera);
        }
    }
}
/**
 * AMD's recommended `scaleFactor` for an "Ultra Quality" preset (equal to 1.3)
 */
FSR1RenderingPipeline.SCALE_ULTRA_QUALITY = 1.3;
/**
 * AMD's recommended `scaleFactor` for a "Quality" preset (equal to 1.5)
 */
FSR1RenderingPipeline.SCALE_QUALITY = 1.5;
/**
 * AMD's recommended `scaleFactor` for a "Balanced" preset (equal to 1.7)
 */
FSR1RenderingPipeline.SCALE_BALANCED = 1.7;
/**
 * AMD's recommended `scaleFactor` for a "Performance" preset (equal to 2)
 */
FSR1RenderingPipeline.SCALE_PERFORMANCE = 2;
//# sourceMappingURL=fsr1RenderingPipeline.js.map
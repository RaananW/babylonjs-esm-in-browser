import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type Effect } from "../Materials/effect.js";
import { EffectWrapper, type EffectWrapperCreationOptions } from "../Materials/effectRenderer.pure.js";
import { type Nullable } from "../types.js";
/**
 * Edge Adaptive Spatial Upsampling (EASU) post-process used by FSR 1
 */
export declare class ThinFSR1UpscalePostProcess extends EffectWrapper {
    /**
     * The fragment shader URL
     */
    static readonly FragmentUrl = "fsr1Upscale";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    /**
     * Creates a new FSR 1 upscale post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    protected _gatherImports(useWebGPU: boolean | undefined, list: Promise<any>[]): void;
    /**
     * Sets the required constant values on the effect. Plain uniforms are used (rather than a uniform
     * buffer) so this works on every backend, including Babylon Native, which disables uniform buffers.
     * @param effect The effect to set the constants on (typically the one provided by onApplyObservable).
     * @param viewportWidth The rendered input width being upscaled
     * @param viewportHeight The rendered input height being upscaled
     * @param inputWidth The width of the texture containing the input viewport
     * @param inputHeight The height of the texture containing the input viewport
     * @param outputWidth The display width which the input image gets upscaled to
     * @param outputHeight The display height which the input image gets upscaled to
     */
    updateConstants(effect: Effect, viewportWidth: number, viewportHeight: number, inputWidth: number, inputHeight: number, outputWidth: number, outputHeight: number): void;
}

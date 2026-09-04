import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type Effect } from "../Materials/effect.js";
import { EffectWrapper, type EffectWrapperCreationOptions } from "../Materials/effectRenderer.pure.js";
import { type Nullable } from "../types.js";
/**
 * Robust Contrast Adaptive Sharpening (RCAS) post-process used by FSR 1
 */
export declare class ThinFSR1SharpenPostProcess extends EffectWrapper {
    /**
     * The fragment shader URL
     */
    static readonly FragmentUrl = "fsr1Sharpen";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    /**
     * Creates a new FSR 1 sharpen post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    protected _gatherImports(useWebGPU: boolean | undefined, list: Promise<any>[]): void;
    /**
     * Sets the required constant value on the effect. Plain uniforms are used (rather than a uniform
     * buffer) so this works on every backend, including Babylon Native, which disables uniform buffers.
     * @param effect The effect to set the constant on (typically the one provided by onApplyObservable).
     * @param sharpness The number of stops (halving) of the reduction of sharpness (0 = maximum sharpness)
     */
    updateConstants(effect: Effect, sharpness: number): void;
}

import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Postprocess used to generate anaglyphic rendering
 */
export declare class ThinAnaglyphPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "anaglyph";
    /**
     * The list of samplers used by the effect
     */
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new anaglyph post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
}

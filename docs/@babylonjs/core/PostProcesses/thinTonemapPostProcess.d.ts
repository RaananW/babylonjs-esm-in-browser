import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/** Defines operator used for tonemapping */
export declare enum TonemappingOperator {
    /** Hable */
    Hable = 0,
    /** Reinhard */
    Reinhard = 1,
    /** HejiDawson */
    HejiDawson = 2,
    /** Photographic */
    Photographic = 3
}
/**
 * Options used to create a ThinTonemapPostProcess.
 */
export interface ThinTonemapPostProcessOptions extends EffectWrapperCreationOptions {
    /** Defines the operator to use (default: Reinhard) */
    operator?: TonemappingOperator;
    /** Defines the required exposure adjustment (default: 1.0) */
    exposureAdjustment?: number;
}
/**
 * Post process used to apply a tone mapping operator
 */
export declare class ThinTonemapPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "tonemap";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new tone mapping post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: ThinTonemapPostProcessOptions);
    /**
     * Gets the operator to use (default: Reinhard)
     */
    readonly operator: TonemappingOperator;
    /**
     * Defines the required exposure adjustment (default: 1.0)
     */
    exposureAdjustment: number;
    bind(noDefaultBindings?: boolean): void;
}

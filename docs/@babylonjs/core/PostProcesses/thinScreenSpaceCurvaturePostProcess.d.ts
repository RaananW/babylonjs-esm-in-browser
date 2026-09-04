import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Post process used to apply a screen space curvature post process
 */
export declare class ThinScreenSpaceCurvaturePostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "screenSpaceCurvature";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    /**
     * The list of samplers used by the effect
     */
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new screen space curvature post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    /**
     * Defines how much ridge the curvature effect displays.
     */
    ridge: number;
    /**
     * Defines how much valley the curvature effect displays.
     */
    valley: number;
    bind(noDefaultBindings?: boolean): void;
}

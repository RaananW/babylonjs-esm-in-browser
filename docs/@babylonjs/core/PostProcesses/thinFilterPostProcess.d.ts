import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Matrix } from "../Maths/math.vector.pure.js";
/**
 * Post process used to apply a kernel filter
 */
export declare class ThinFilterPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "filter";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new filter post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    /**
     * The matrix to be applied to the image
     */
    kernelMatrix: Matrix;
    bind(noDefaultBindings?: boolean): void;
}

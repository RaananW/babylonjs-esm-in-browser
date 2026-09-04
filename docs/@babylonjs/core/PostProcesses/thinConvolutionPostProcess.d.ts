import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Post process used to apply a convolution effect
 */
export declare class ThinConvolutionPostProcess extends EffectWrapper {
    /**
     * Edge detection 0 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static EdgeDetect0Kernel: number[];
    /**
     * Edge detection 1 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static EdgeDetect1Kernel: number[];
    /**
     * Edge detection 2 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static EdgeDetect2Kernel: number[];
    /**
     * Kernel to sharpen an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static SharpenKernel: number[];
    /**
     * Kernel to emboss an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static EmbossKernel: number[];
    /**
     * Kernel to blur an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    static GaussianKernel: number[];
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "convolution";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new convolution post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
     * @param options Options to configure the effect
     */
    constructor(name: string, engine: Nullable<AbstractEngine> | undefined, kernel: number[], options?: EffectWrapperCreationOptions);
    /** Array of 9 values corresponding to the 3x3 kernel to be applied */
    kernel: number[];
    /**
     * The width of the source texture
     */
    textureWidth: number;
    /**
     * The height of the source texture
     */
    textureHeight: number;
    bind(noDefaultBindings?: boolean): void;
}

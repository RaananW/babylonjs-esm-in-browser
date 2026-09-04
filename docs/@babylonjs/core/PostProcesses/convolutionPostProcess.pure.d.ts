/** This file must only contain pure code and pure imports */
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type Nullable } from "../types.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Scene } from "../scene.pure.js";
import { ThinConvolutionPostProcess } from "./thinConvolutionPostProcess.js";
/**
 * The ConvolutionPostProcess applies a 3x3 kernel to every pixel of the
 * input texture to perform effects such as edge detection or sharpening
 * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
export declare class ConvolutionPostProcess extends PostProcess {
    /** Array of 9 values corresponding to the 3x3 kernel to be applied */
    get kernel(): number[];
    set kernel(value: number[]);
    /**
     * Gets a string identifying the name of the class
     * @returns "ConvolutionPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinConvolutionPostProcess;
    /**
     * Creates a new instance ConvolutionPostProcess
     * @param name The name of the effect.
     * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     */
    constructor(name: string, kernel: number[], options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<ConvolutionPostProcess>;
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
}
/**
 * Register side effects for convolutionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterConvolutionPostProcess(): void;

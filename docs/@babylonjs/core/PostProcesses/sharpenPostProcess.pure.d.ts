/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { PostProcess } from "./postProcess.pure.js";
import { type PostProcessOptions } from "./postProcess.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Scene } from "../scene.pure.js";
import { ThinSharpenPostProcess } from "./thinSharpenPostProcess.js";
/**
 * The SharpenPostProcess applies a sharpen kernel to every pixel
 * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
export declare class SharpenPostProcess extends PostProcess {
    /**
     * How much of the original color should be applied. Setting this to 0 will display edge detection. (default: 1)
     */
    get colorAmount(): number;
    set colorAmount(value: number);
    /**
     * How much sharpness should be applied (default: 0.3)
     */
    get edgeAmount(): number;
    set edgeAmount(value: number);
    /**
     * Gets a string identifying the name of the class
     * @returns "SharpenPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinSharpenPostProcess;
    /**
     * Creates a new instance ConvolutionPostProcess
     * @param name The name of the effect.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    constructor(name: string, options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, blockCompilation?: boolean);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): SharpenPostProcess;
}
/**
 * Register side effects for sharpenPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSharpenPostProcess(): void;

/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { type Matrix } from "../Maths/math.vector.pure.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Scene } from "../scene.pure.js";
import { ThinFilterPostProcess } from "./thinFilterPostProcess.js";
/**
 * Applies a kernel filter to the image
 */
export declare class FilterPostProcess extends PostProcess {
    /** The matrix to be applied to the image */
    get kernelMatrix(): Matrix;
    set kernelMatrix(value: Matrix);
    /**
     * Gets a string identifying the name of the class
     * @returns "FilterPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinFilterPostProcess;
    /**
     *
     * @param name The name of the effect.
     * @param kernelMatrix The matrix to be applied to the image
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     */
    constructor(name: string, kernelMatrix: Matrix, options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<FilterPostProcess>;
}
/**
 * Register side effects for filterPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFilterPostProcess(): void;

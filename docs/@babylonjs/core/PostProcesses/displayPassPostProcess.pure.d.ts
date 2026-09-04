/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Scene } from "../scene.pure.js";
/**
 * DisplayPassPostProcess which produces an output the same as it's input
 */
export declare class DisplayPassPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "DisplayPassPostProcess" string
     */
    getClassName(): string;
    /**
     * Creates the DisplayPassPostProcess
     * @param name The name of the effect.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     */
    constructor(name: string, options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean);
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<DisplayPassPostProcess>;
}
/**
 * Register side effects for displayPassPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDisplayPassPostProcess(): void;

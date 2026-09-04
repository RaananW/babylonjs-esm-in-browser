/** This file must only contain pure code and pure imports */
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
/**
 * Postprocess used to generate anaglyphic rendering
 */
export declare class AnaglyphPostProcess extends PostProcess {
    private _passedProcess;
    /**
     * Gets a string identifying the name of the class
     * @returns "AnaglyphPostProcess" string
     */
    getClassName(): string;
    /**
     * Creates a new AnaglyphPostProcess
     * @param name defines postprocess name
     * @param options defines creation options or target ratio scale
     * @param rigCameras defines cameras using this postprocess
     * @param samplingMode defines required sampling mode (BABYLON.Texture.NEAREST_SAMPLINGMODE by default)
     * @param engine defines hosting engine
     * @param reusable defines if the postprocess will be reused multiple times per frame
     */
    constructor(name: string, options: number | PostProcessOptions, rigCameras: Camera[], samplingMode?: number, engine?: AbstractEngine, reusable?: boolean);
}
/**
 * Register side effects for anaglyphPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnaglyphPostProcess(): void;

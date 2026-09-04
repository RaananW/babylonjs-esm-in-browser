/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Scene } from "../scene.pure.js";
/**
 * Sub surface scattering post process
 */
export declare class SubSurfaceScatteringPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "SubSurfaceScatteringPostProcess" string
     */
    getClassName(): string;
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, scene: Scene, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number);
}

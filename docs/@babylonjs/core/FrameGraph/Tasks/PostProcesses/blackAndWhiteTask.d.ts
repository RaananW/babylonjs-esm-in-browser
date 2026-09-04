import { type FrameGraph } from "../../frameGraph.js";
import { ThinBlackAndWhitePostProcess } from "../../../PostProcesses/thinBlackAndWhitePostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a black and white post process.
 */
export declare class FrameGraphBlackAndWhiteTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinBlackAndWhitePostProcess;
    /**
     * Constructs a new black and white task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the black and white effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinBlackAndWhitePostProcess);
    getClassName(): string;
}

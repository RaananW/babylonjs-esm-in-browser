import { type FrameGraph } from "../../frameGraph.js";
import { ThinTonemapPostProcess } from "../../../PostProcesses/thinTonemapPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a tonemap post process.
 */
export declare class FrameGraphTonemapTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinTonemapPostProcess;
    /**
     * Constructs a new tonemap task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the tonemap effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinTonemapPostProcess);
    getClassName(): string;
}

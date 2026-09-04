import { type FrameGraph } from "../../frameGraph.js";
import { ThinFilterPostProcess } from "../../../PostProcesses/thinFilterPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a kernel filter post process.
 */
export declare class FrameGraphFilterTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinFilterPostProcess;
    /**
     * Constructs a new filter task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the filter effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinFilterPostProcess);
    getClassName(): string;
}

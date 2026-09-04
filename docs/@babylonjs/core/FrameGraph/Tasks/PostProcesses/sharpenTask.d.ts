import { type FrameGraph, type FrameGraphRenderContext, type FrameGraphRenderPass } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSharpenPostProcess } from "../../../PostProcesses/thinSharpenPostProcess.js";
/**
 * Task which applies a sharpen post process.
 */
export declare class FrameGraphSharpenTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinSharpenPostProcess;
    /**
     * Constructs a new sharpen task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinSharpenPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

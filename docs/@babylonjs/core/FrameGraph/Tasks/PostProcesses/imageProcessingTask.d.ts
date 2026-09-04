import { type FrameGraph, type FrameGraphRenderPass, type FrameGraphRenderContext } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinImageProcessingPostProcess } from "../../../PostProcesses/thinImageProcessingPostProcess.js";
/**
 * Task which applies an image processing post process.
 */
export declare class FrameGraphImageProcessingTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinImageProcessingPostProcess;
    /**
     * Constructs a new image processing task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinImageProcessingPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

import { type FrameGraph, type FrameGraphRenderContext, type FrameGraphRenderPass } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinConvolutionPostProcess } from "../../../PostProcesses/thinConvolutionPostProcess.js";
/**
 * Task which applies a convolution post process.
 */
export declare class FrameGraphConvolutionTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinConvolutionPostProcess;
    /**
     * Constructs a new convolution task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinConvolutionPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

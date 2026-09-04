import { type FrameGraph, type FrameGraphRenderContext, type FrameGraphRenderPass } from "../../../index.js";
import { ThinBlurPostProcess } from "../../../PostProcesses/thinBlurPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a blur post process.
 */
export declare class FrameGraphBlurTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinBlurPostProcess;
    /**
     * Constructs a new blur task.
     * @param name Name of the task.
     * @param frameGraph Frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the blur effect.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinBlurPostProcess);
    getClassName(): string;
    /**
     * Records the blur task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @param additionalBindings defines an optional callback used to bind extra resources
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

import { type FrameGraph, type FrameGraphRenderContext, type FrameGraphRenderPass } from "../../../index.js";
import { ThinFXAAPostProcess } from "../../../PostProcesses/thinFXAAPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a FXAA post process.
 */
export declare class FrameGraphFXAATask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinFXAAPostProcess;
    /**
     * Constructs a new FXAA task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the FXAA effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinFXAAPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

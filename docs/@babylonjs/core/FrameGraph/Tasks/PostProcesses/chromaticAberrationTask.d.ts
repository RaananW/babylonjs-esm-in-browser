import { type FrameGraph, type FrameGraphRenderContext, type FrameGraphRenderPass } from "../../../index.js";
import { ThinChromaticAberrationPostProcess } from "../../../PostProcesses/thinChromaticAberrationPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a chromatic aberration post process.
 */
export declare class FrameGraphChromaticAberrationTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinChromaticAberrationPostProcess;
    /**
     * Constructs a new chromatic aberration task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the chromatic aberration effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinChromaticAberrationPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}

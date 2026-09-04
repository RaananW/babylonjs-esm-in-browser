import { type FrameGraph, type FrameGraphRenderPass, type FrameGraphTextureHandle } from "../../../index.js";
import { ThinAnaglyphPostProcess } from "../../../PostProcesses/thinAnaglyphPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies an anaglyph post process.
 */
export declare class FrameGraphAnaglyphTask extends FrameGraphPostProcessTask {
    /**
     * The texture to use as the left texture.
     */
    leftTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinAnaglyphPostProcess;
    /**
     * Constructs a new anaglyph task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the anaglyph effect. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinAnaglyphPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

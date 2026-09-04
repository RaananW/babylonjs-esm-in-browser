import { type FrameGraph, type FrameGraphTextureHandle, type FrameGraphRenderPass } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinScreenSpaceCurvaturePostProcess } from "../../../PostProcesses/thinScreenSpaceCurvaturePostProcess.js";
/**
 * Task which applies a screen space curvature post process.
 */
export declare class FrameGraphScreenSpaceCurvatureTask extends FrameGraphPostProcessTask {
    /**
     * The normal texture to use for the screen space curvature effect.
     * It must store normals in camera view space.
     */
    normalTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinScreenSpaceCurvaturePostProcess;
    /**
     * Constructs a new circle of confusion task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinScreenSpaceCurvaturePostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

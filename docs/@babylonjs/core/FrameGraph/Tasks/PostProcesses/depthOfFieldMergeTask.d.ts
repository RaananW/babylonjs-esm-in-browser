import { type FrameGraph, type FrameGraphTextureHandle, type FrameGraphRenderPass } from "../../../index.js";
import { ThinDepthOfFieldMergePostProcess } from "../../../PostProcesses/thinDepthOfFieldMergePostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * @internal
 */
export declare class FrameGraphDepthOfFieldMergeTask extends FrameGraphPostProcessTask {
    circleOfConfusionTexture: FrameGraphTextureHandle;
    blurSteps: FrameGraphTextureHandle[];
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinDepthOfFieldMergePostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

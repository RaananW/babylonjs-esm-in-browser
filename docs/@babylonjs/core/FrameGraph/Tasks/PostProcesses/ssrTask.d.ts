import { type FrameGraph, type FrameGraphRenderPass, type Camera, type FrameGraphTextureHandle } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSRPostProcess } from "../../../PostProcesses/thinSSRPostProcess.js";
/**
 * @internal
 */
export declare class FrameGraphSSRTask extends FrameGraphPostProcessTask {
    normalTexture: FrameGraphTextureHandle;
    depthTexture: FrameGraphTextureHandle;
    reflectivityTexture: FrameGraphTextureHandle;
    backDepthTexture?: FrameGraphTextureHandle;
    camera: Camera;
    readonly postProcess: ThinSSRPostProcess;
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinSSRPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

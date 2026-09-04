import { type FrameGraph, type FrameGraphRenderPass, type FrameGraphTextureHandle } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSAO2BlurPostProcess } from "../../../PostProcesses/thinSSAO2BlurPostProcess.js";
/**
 * @internal
 */
export declare class FrameGraphSSAO2BlurTask extends FrameGraphPostProcessTask {
    private _isHorizontal;
    readonly postProcess: ThinSSAO2BlurPostProcess;
    depthTexture: FrameGraphTextureHandle;
    constructor(name: string, frameGraph: FrameGraph, _isHorizontal: boolean, thinPostProcess?: ThinSSAO2BlurPostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

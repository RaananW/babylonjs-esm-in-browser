import { type FrameGraph, type FrameGraphRenderPass, type Camera, type FrameGraphTextureHandle } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSAO2PostProcess } from "../../../PostProcesses/thinSSAO2PostProcess.js";
/**
 * @internal
 */
export declare class FrameGraphSSAO2Task extends FrameGraphPostProcessTask {
    depthTexture: FrameGraphTextureHandle;
    normalTexture: FrameGraphTextureHandle;
    camera: Camera;
    readonly postProcess: ThinSSAO2PostProcess;
    private _currentCameraMode;
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinSSAO2PostProcess);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

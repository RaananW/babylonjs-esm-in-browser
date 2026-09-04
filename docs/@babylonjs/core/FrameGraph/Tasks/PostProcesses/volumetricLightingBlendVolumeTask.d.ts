import { type AbstractEngine, type Camera, type EffectWrapperCreationOptions, type FrameGraph, type FrameGraphRenderPass, type FrameGraphTextureHandle, type Nullable } from "../../../index.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { ThinPassPostProcess } from "../../../PostProcesses/thinPassPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * @internal
 */
declare class VolumetricLightingBlendVolumeThinPostProcess extends ThinPassPostProcess {
    camera: Camera;
    outputTextureWidth: number;
    outputTextureHeight: number;
    extinction: Vector3;
    enableExtinction: boolean;
    private _invProjection;
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, enableExtinction?: boolean, options?: EffectWrapperCreationOptions);
    bind(noDefaultBindings?: boolean): void;
}
/**
 * @internal
 */
export declare class FrameGraphVolumetricLightingBlendVolumeTask extends FrameGraphPostProcessTask {
    readonly postProcess: VolumetricLightingBlendVolumeThinPostProcess;
    depthTexture: FrameGraphTextureHandle;
    camera: Camera;
    constructor(name: string, frameGraph: FrameGraph, enableExtinction?: boolean);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}
export {};

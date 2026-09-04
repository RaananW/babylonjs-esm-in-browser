import { type DrawWrapper, type FrameGraph, type FrameGraphTextureHandle } from "../../../../index.js";
import { type FrameGraphIblShadowsVoxelizationTask } from "./iblShadowsVoxelizationTask.js";
import { Vector4 } from "../../../../Maths/math.vector.pure.js";
import { ThinCustomPostProcess } from "../../../../PostProcesses/thinCustomPostProcess.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to spatially blur IBL shadows.
 * @internal
 */
export declare class FrameGraphIblShadowsSpatialBlurTask extends FrameGraphTask {
    sourceTexture?: FrameGraphTextureHandle;
    depthTexture?: FrameGraphTextureHandle;
    normalTexture?: FrameGraphTextureHandle;
    /** Voxelization task providing the dynamic voxelGridSize used as worldScale. */
    voxelizationTask?: FrameGraphIblShadowsVoxelizationTask;
    readonly outputTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinCustomPostProcess;
    protected readonly _postProcessDrawWrapper: DrawWrapper;
    protected readonly _blurParameters: Vector4;
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    initAsync(): Promise<unknown>;
    isReady(): boolean;
    record(): void;
    dispose(): void;
}

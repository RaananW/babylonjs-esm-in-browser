import { type DrawWrapper, type FrameGraph, type FrameGraphTextureHandle } from "../../../../index.js";
import { type FrameGraphIblShadowsVoxelizationTask } from "./iblShadowsVoxelizationTask.js";
import { Vector4 } from "../../../../Maths/math.vector.pure.js";
import { ThinCustomPostProcess } from "../../../../PostProcesses/thinCustomPostProcess.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to temporally accumulate IBL shadows.
 * @internal
 */
export declare class FrameGraphIblShadowsAccumulationTask extends FrameGraphTask {
    sourceTexture?: FrameGraphTextureHandle;
    velocityTexture?: FrameGraphTextureHandle;
    positionTexture?: FrameGraphTextureHandle;
    private _remanence;
    get remanence(): number;
    set remanence(value: number);
    reset: boolean;
    isMoving: boolean;
    voxelGridSize: number;
    /** Voxelization task providing the runtime voxelGridSize used by the accumulation shader. */
    voxelizationTask?: FrameGraphIblShadowsVoxelizationTask;
    protected _previousAccumulationTexture?: FrameGraphTextureHandle;
    protected _previousPositionTexture?: FrameGraphTextureHandle;
    readonly outputTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinCustomPostProcess;
    protected readonly _postProcessDrawWrapper: DrawWrapper;
    protected readonly _accumulationParams: Vector4;
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    initAsync(): Promise<unknown>;
    isReady(): boolean;
    record(): void;
    dispose(): void;
}

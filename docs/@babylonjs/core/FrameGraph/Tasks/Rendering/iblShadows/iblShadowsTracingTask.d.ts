import { type Camera, type DrawWrapper, type FrameGraph, type FrameGraphTextureHandle } from "../../../../index.js";
import { type FrameGraphIblShadowsVoxelizationTask } from "./iblShadowsVoxelizationTask.js";
import { Matrix, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { ThinCustomPostProcess } from "../../../../PostProcesses/thinCustomPostProcess.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to trace IBL shadows from a voxel grid.
 * @internal
 */
export declare class FrameGraphIblShadowsTracingTask extends FrameGraphTask {
    camera?: Camera;
    voxelGridTexture?: FrameGraphTextureHandle;
    depthTexture?: FrameGraphTextureHandle;
    normalTexture?: FrameGraphTextureHandle;
    icdfTexture?: FrameGraphTextureHandle;
    environmentTexture?: FrameGraphTextureHandle;
    blueNoiseTexture?: FrameGraphTextureHandle;
    private _sampleDirections;
    get sampleDirections(): number;
    set sampleDirections(value: number);
    voxelShadowOpacity: number;
    ssShadowOpacity: number;
    private _ssShadowSampleCount;
    get ssShadowSampleCount(): number;
    set ssShadowSampleCount(value: number);
    private _ssShadowStride;
    get ssShadowStride(): number;
    set ssShadowStride(value: number);
    /** Scale factor applied to voxelGridSize / 2^resolutionExp to get the max SSS ray distance. */
    ssShadowDistanceScale: number;
    /** Scale factor applied to voxelGridSize to get the SSS surface thickness. */
    ssShadowThicknessScale: number;
    /** Voxelization task providing dynamic voxelGridSize and resolutionExp for SSS parameter derivation. */
    voxelizationTask?: FrameGraphIblShadowsVoxelizationTask;
    envRotation: number;
    voxelNormalBias: number;
    voxelDirectionBias: number;
    worldScaleMatrix: Matrix;
    readonly outputTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinCustomPostProcess;
    protected readonly _postProcessDrawWrapper: DrawWrapper;
    protected readonly _shadowParameters: Vector4;
    protected readonly _sssParameters: Vector4;
    protected readonly _opacityParameters: Vector4;
    protected readonly _voxelBiasParameters: Vector4;
    protected readonly _cameraInvView: Matrix;
    protected readonly _cameraInvProj: Matrix;
    protected readonly _cameraInvViewProjection: Matrix;
    protected _frameId: number;
    protected _coloredShadows: boolean;
    protected _currentDefines: string;
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    initAsync(): Promise<unknown>;
    get coloredShadows(): boolean;
    set coloredShadows(value: boolean);
    isReady(): boolean;
    record(): void;
    dispose(): void;
    protected _updateDefines(): void;
}

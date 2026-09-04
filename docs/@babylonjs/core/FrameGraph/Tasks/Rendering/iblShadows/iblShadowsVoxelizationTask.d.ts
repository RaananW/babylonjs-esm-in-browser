import { type FrameGraph, type FrameGraphObjectList, type FrameGraphTextureHandle } from "../../../../index.js";
import { Matrix } from "../../../../Maths/math.vector.pure.js";
import { Observable } from "../../../../Misc/observable.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to voxelize shadow casting objects for IBL shadows.
 * @internal
 */
export declare class FrameGraphIblShadowsVoxelizationTask extends FrameGraphTask {
    /**
     * Observable raised when voxelization completes.
     */
    readonly onVoxelizationCompleteObservable: Observable<void>;
    /**
     * Input object list containing the meshes to voxelize.
     */
    objectList: FrameGraphObjectList;
    /**
     * World-space voxel grid size.
     */
    voxelGridSize: number;
    /**
     * Voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
     */
    private _resolutionExp;
    /**
     * Sets voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
     */
    set resolutionExp(value: number);
    /**
     * Gets voxel grid resolution exponent. Actual resolution is 2^resolutionExp.
     */
    get resolutionExp(): number;
    /**
     * Enables tri-planar voxelization mode.
     */
    triPlanarVoxelization: boolean;
    /**
     * Indicates whether voxelization should be refreshed.
     */
    dirty: boolean;
    private _refreshRate;
    /**
     * Controls how often voxelization is refreshed.
     * - -1: manual only (requires setting `dirty = true`)
     * - 0: every frame
     * - 1: skip 1 frame between updates
     * - N: skip N frames between updates
     */
    get refreshRate(): number;
    set refreshRate(value: number);
    /**
     * World-to-voxel normalization matrix used by tracing.
     */
    readonly worldScaleMatrix: Matrix;
    /**
     * Output voxel grid texture handle.
     */
    readonly outputVoxelGridTexture: FrameGraphTextureHandle;
    private _voxelRenderer?;
    private _voxelRendererResolutionExp?;
    private _voxelRendererTriPlanar?;
    private _voxelizationCompleteObserver;
    private _voxelRTTextureHandle?;
    private _voxelGridTextureHandle?;
    private _frameCounter;
    /**
     * Creates a new voxelization task.
     * @param name The task name.
     * @param frameGraph The frame graph this task belongs to.
     */
    constructor(name: string, frameGraph: FrameGraph);
    /**
     * Gets the class name.
     * @returns The class name.
     */
    getClassName(): string;
    /**
     * Checks whether the task has all required inputs.
     * @returns True when ready.
     */
    isReady(): boolean;
    /**
     * Requests a voxelization update on the next eligible frame.
     */
    requestVoxelizationUpdate(): void;
    /**
     * Recomputes voxel world bounds from the current object list and updates worldScaleMatrix.
     */
    updateSceneBounds(): void;
    /**
     * Records the voxelization passes.
     */
    record(): void;
    /**
     * Disposes internal resources.
     */
    dispose(): void;
    private _ensureVoxelRenderer;
    private _attachVoxelizationObserver;
    private _detachVoxelizationObserver;
    private _updateWorldScaleMatrix;
    private _updateOutputTextureHandlesFromRenderer;
}

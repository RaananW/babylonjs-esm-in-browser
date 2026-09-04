/** This file must only contain pure code and pure imports */
import { type Camera, type FrameGraph, type FrameGraphObjectList, type FrameGraphTextureHandle, type InternalTexture, type Mesh } from "../../../index.js";
import { type Material } from "../../../Materials/material.pure.js";
import { Observable } from "../../../Misc/observable.pure.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Composite task that owns the individual IBL shadows frame graph tasks.
 * The frame graph remains flat internally, but this task groups the pipeline
 * and owns the child task implementation details.
 */
export declare class FrameGraphIblShadowsRendererTask extends FrameGraphTask {
    /** Final frame-graph texture handle produced by the task. */
    readonly outputTexture: FrameGraphTextureHandle;
    private readonly _voxelizationTask;
    private readonly _tracingTask;
    private readonly _spatialBlurTask;
    private readonly _accumulationTask;
    private _dependenciesResolved;
    private _shadowOpacity;
    private readonly _materialsWithRenderPlugin;
    private readonly _outputTextureReadyObservable;
    private _lastNotifiedOutputTexture;
    private _observedEnvironmentTexture;
    private _observedEnvironmentTextureUnsubscribe;
    private _lastImportedIcdfTexture;
    private _lastImportedEnvironmentTexture;
    private _lastImportedBlueNoiseTexture;
    private readonly _blueNoiseTexture;
    private _cameraViewChangedObserver;
    private _cdfTextureChangedObserver;
    private _cdfGeneratedObserver;
    private _environmentTextureChangedObserver;
    private _beforeRenderDependencyObserver;
    private _beforeRenderOutputReadyObserver;
    private _blueNoiseLoadObserver;
    private _texturesAllocatedObserver;
    private _voxelizationCompleteObserver;
    /**
     * Gets the class name.
     * @returns The class name.
     */
    getClassName(): string;
    get name(): string;
    set name(value: string);
    /**
     * Whether the task is disabled.
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Camera used by the tracing stage. */
    get camera(): Camera;
    /** Camera used by the tracing stage. */
    set camera(value: Camera);
    /** Object list used by voxelization. */
    get objectList(): FrameGraphObjectList;
    /** Object list used by voxelization. */
    set objectList(value: FrameGraphObjectList);
    /**
     * Depth texture handle used by tracing and blur.
     * This should be the screen-space depth of all objects in the scene
     * that will receive shadows.
     * It is important that this texture stores 32-bit depth values to avoid artifacts.
     */
    depthTexture: FrameGraphTextureHandle;
    /**
     * World-space normal texture handle used by tracing and blur.
     * This should store the world-space normals of all objects in the scene
     * that will receive shadows. Each component should be normalized to [0, 1] rather than [-1, 1].
     * Recommended to be 16-bit floating point though 8-bit unsigned byte can be used with minimal
     * loss in quality.
     */
    normalTexture: FrameGraphTextureHandle;
    /**
     * Position texture handle used by accumulation.
     * This should store the world-space position of all objects in the scene
     * that will receive shadows.
     * Should be stored as 16-bit floating point.
     */
    positionTexture: FrameGraphTextureHandle;
    /**
     * Velocity texture handle used by accumulation.
     * This should store the linear velocity per pixel of all objects in the scene
     * that will receive shadows.
     * Should be stored as 16-bit floating point.
     */
    velocityTexture: FrameGraphTextureHandle;
    /** Number of tracing sample directions. */
    get sampleDirections(): number;
    /** Number of tracing sample directions. */
    set sampleDirections(value: number);
    /** Whether traced shadows preserve environment color. */
    get coloredShadows(): boolean;
    /** Whether traced shadows preserve environment color. */
    set coloredShadows(value: boolean);
    /** Opacity of voxel-traced shadows. */
    get voxelShadowOpacity(): number;
    /** Opacity of voxel-traced shadows. */
    set voxelShadowOpacity(value: number);
    /** Opacity of screen-space shadows. */
    get ssShadowOpacity(): number;
    /** Opacity of screen-space shadows. */
    set ssShadowOpacity(value: number);
    /** Number of screen-space shadow samples. */
    get ssShadowSampleCount(): number;
    /** Number of screen-space shadow samples. */
    set ssShadowSampleCount(value: number);
    /** Stride used by screen-space shadow sampling. */
    get ssShadowStride(): number;
    /** Stride used by screen-space shadow sampling. */
    set ssShadowStride(value: number);
    /** Distance scale used by screen-space shadow tracing. */
    get ssShadowDistanceScale(): number;
    /** Distance scale used by screen-space shadow tracing. */
    set ssShadowDistanceScale(value: number);
    /** Thickness scale used by screen-space shadow tracing. */
    get ssShadowThicknessScale(): number;
    /** Thickness scale used by screen-space shadow tracing. */
    set ssShadowThicknessScale(value: number);
    /** Voxel tracing normal bias. */
    get voxelNormalBias(): number;
    /** Voxel tracing normal bias. */
    set voxelNormalBias(value: number);
    /** Voxel tracing direction bias. */
    get voxelDirectionBias(): number;
    /** Voxel tracing direction bias. */
    set voxelDirectionBias(value: number);
    /** Environment rotation in radians. */
    get envRotation(): number;
    /** Environment rotation in radians. */
    set envRotation(value: number);
    /** Temporal shadow remanence while moving. */
    get shadowRemanence(): number;
    /** Temporal shadow remanence while moving. */
    set shadowRemanence(value: number);
    /** Final material shadow opacity. */
    get shadowOpacity(): number;
    /** Final material shadow opacity. */
    set shadowOpacity(value: number);
    /** Voxelization resolution exponent. */
    get resolutionExp(): number;
    /** Voxelization resolution exponent. */
    set resolutionExp(value: number);
    /** Voxelization refresh rate. */
    get refreshRate(): number;
    /** Voxelization refresh rate. */
    set refreshRate(value: number);
    /** Whether tri-planar voxelization is used. */
    get triPlanarVoxelization(): boolean;
    /** Whether tri-planar voxelization is used. */
    set triPlanarVoxelization(value: boolean);
    /** Current world-space voxel grid size. */
    get voxelGridSize(): number;
    /** True when the accumulated output texture is ready. */
    get outputTextureReady(): boolean;
    /** Notifies when the accumulated output texture becomes ready. */
    get onOutputTextureReadyObservable(): Observable<InternalTexture>;
    /** Triggers a voxelization refresh on the next eligible frame. */
    updateVoxelization(): void;
    /** Recomputes the voxelization scene bounds from the current object list. */
    updateSceneBounds(): void;
    /** Resets temporal accumulation. */
    resetAccumulation(): void;
    /**
     * Adds one or more materials that should receive IBL shadows.
     * @param material The material or materials to register. If omitted, all scene materials are added.
     */
    addShadowReceivingMaterial(material?: Material | Material[]): void;
    /**
     * Removes one or more materials from IBL shadow reception.
     * @param material The material or materials to unregister.
     */
    removeShadowReceivingMaterial(material: Material | Material[]): void;
    /** Clears all registered shadow-receiving materials. */
    clearShadowReceivingMaterials(): void;
    /**
     * Adds one or more meshes to the voxelization object list.
     * @param mesh The mesh or meshes to add.
     */
    addShadowCastingMesh(mesh: Mesh | Mesh[]): void;
    /**
     * Removes one or more meshes from the voxelization object list.
     * @param mesh The mesh or meshes to remove.
     */
    removeShadowCastingMesh(mesh: Mesh | Mesh[]): void;
    /** Clears all shadow-casting meshes from the voxelization object list. */
    clearShadowCastingMeshes(): void;
    initAsync(): Promise<unknown>;
    isReady(): boolean;
    /**
     * Records the parent task.
     * Child tasks record the actual passes.
     */
    record(): void;
    /**
     * Disposes the task and owned resources.
     */
    dispose(): void;
    /**
     * Creates a new IBL shadows composite task.
     * @param name The task name.
     * @param frameGraph The owning frame graph.
     */
    constructor(name: string, frameGraph: FrameGraph);
    private _disposeDependencyObservers;
    private _disposeObservers;
    private _setCamera;
    private _observeEnvironmentTexture;
    private _getEnvironmentTextureInternal;
    private _getAccumulationOutputTexture;
    private _notifyIfOutputTextureReady;
    private _applyMaterialPluginParameters;
    private _addShadowReceivingMaterialInternal;
    private readonly _onEnvironmentTextureLoaded;
    private _tryEnableShadowsTasks;
    private _initialize;
}

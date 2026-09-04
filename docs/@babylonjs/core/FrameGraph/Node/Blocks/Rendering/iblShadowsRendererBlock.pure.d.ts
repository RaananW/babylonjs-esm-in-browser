/** This file must only contain pure code and pure imports */
import { type FrameGraph, type NodeRenderGraphBuildState, type NodeRenderGraphConnectionPoint, type Scene } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphIblShadowsRendererTask } from "../../../Tasks/Rendering/iblShadowsRendererTask.pure.js";
/**
 * Block that implements IBL (image-based lighting) shadows using voxel tracing.
 */
export declare class NodeRenderGraphIblShadowsRendererBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphIblShadowsRendererTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphIblShadowsRendererTask;
    /**
     * Create a new NodeRenderGraphIblShadowsRendererBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** Number of tracing sample directions */
    get sampleDirections(): number;
    set sampleDirections(value: number);
    /** Whether traced shadows preserve environment color */
    get coloredShadows(): boolean;
    set coloredShadows(value: boolean);
    /** Opacity of voxel-traced shadows */
    get voxelShadowOpacity(): number;
    set voxelShadowOpacity(value: number);
    /** Opacity of screen-space shadows */
    get ssShadowOpacity(): number;
    set ssShadowOpacity(value: number);
    /** Number of screen-space shadow samples */
    get ssShadowSampleCount(): number;
    set ssShadowSampleCount(value: number);
    /** Stride used by screen-space shadow sampling */
    get ssShadowStride(): number;
    set ssShadowStride(value: number);
    /** Distance scale used by screen-space shadow tracing */
    get ssShadowDistanceScale(): number;
    set ssShadowDistanceScale(value: number);
    /** Thickness scale used by screen-space shadow tracing */
    get ssShadowThicknessScale(): number;
    set ssShadowThicknessScale(value: number);
    /** Voxel tracing normal bias */
    get voxelNormalBias(): number;
    set voxelNormalBias(value: number);
    /** Voxel tracing direction bias */
    get voxelDirectionBias(): number;
    set voxelDirectionBias(value: number);
    /** Environment rotation in radians */
    get envRotation(): number;
    set envRotation(value: number);
    /** Temporal shadow remanence while moving */
    get shadowRemanence(): number;
    set shadowRemanence(value: number);
    /** Final material shadow opacity */
    get shadowOpacity(): number;
    set shadowOpacity(value: number);
    /** Voxelization resolution exponent (actual resolution is 2^value) */
    get resolutionExp(): number;
    set resolutionExp(value: number);
    /** Voxelization refresh rate (-1: manual, 0: every frame, N: skip N frames) */
    get refreshRate(): number;
    set refreshRate(value: number);
    /** Whether tri-planar voxelization is used */
    get triPlanarVoxelization(): boolean;
    set triPlanarVoxelization(value: boolean);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the depth texture input component
     */
    get depth(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the normal texture input component
     */
    get normal(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the position texture input component
     */
    get position(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the velocity texture input component
     */
    get velocity(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the camera input component
     */
    get camera(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the objects input component
     */
    get objects(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for iblShadowsRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterIblShadowsRendererBlock(): void;

/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type NodeRenderGraphBuildState, type FrameGraph } from "../../../../index.js";
import { FrameGraphTAATask } from "../../../Tasks/PostProcesses/taaTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the TAA post process
 */
export declare class NodeRenderGraphTAAPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphTAATask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphTAATask;
    /**
     * Create a new NodeRenderGraphTAAPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** Number of accumulated samples */
    get samples(): number;
    set samples(value: number);
    /** The factor used to blend the history frame with current frame */
    get factor(): number;
    set factor(value: number);
    /** Enables reprojecting the history texture with a per-pixel velocity */
    get reprojectHistory(): boolean;
    set reprojectHistory(value: boolean);
    /** Clamps the history pixel to the min and max of the 3x3 pixels surrounding the target pixel */
    get clampHistory(): boolean;
    set clampHistory(value: boolean);
    /** Indicates if depth testing must be enabled or disabled */
    get disableOnCameraMove(): boolean;
    set disableOnCameraMove(value: boolean);
    /** Indicates if TAA must be enabled or disabled */
    get disableTAA(): boolean;
    set disableTAA(value: boolean);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the object renderer input component
     */
    get objectRenderer(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the geometry velocity input component
     */
    get geomVelocity(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for taaPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTaaPostProcessBlock(): void;

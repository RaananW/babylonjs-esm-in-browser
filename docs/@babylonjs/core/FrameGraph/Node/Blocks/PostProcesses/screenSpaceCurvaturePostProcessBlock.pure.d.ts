/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type NodeRenderGraphBuildState, type FrameGraph } from "../../../../index.js";
import { FrameGraphScreenSpaceCurvatureTask } from "../../../Tasks/PostProcesses/screenSpaceCurvatureTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the screen space curvature post process
 */
export declare class NodeRenderGraphScreenSpaceCurvaturePostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphScreenSpaceCurvatureTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphScreenSpaceCurvatureTask;
    /**
     * Create a new NodeRenderGraphScreenSpaceCurvaturePostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** Defines how much ridge the curvature effect displays. */
    get ridge(): number;
    set ridge(value: number);
    /** Defines how much valley the curvature effect displays. */
    get valley(): number;
    set valley(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry view normal input component
     */
    get geomViewNormal(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for screenSpaceCurvaturePostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterScreenSpaceCurvaturePostProcessBlock(): void;

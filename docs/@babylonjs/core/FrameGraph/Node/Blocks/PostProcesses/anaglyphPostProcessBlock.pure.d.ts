/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type NodeRenderGraphBuildState, type FrameGraph } from "../../../../index.js";
import { FrameGraphAnaglyphTask } from "../../../Tasks/PostProcesses/anaglyphTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the anaglyph post process
 */
export declare class NodeRenderGraphAnaglyphPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphAnaglyphTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphAnaglyphTask;
    /**
     * Create a new NodeRenderAnaglyphPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left texture input component
     */
    get leftTexture(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
}
/**
 * Register side effects for anaglyphPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnaglyphPostProcessBlock(): void;

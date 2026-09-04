/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphPassCubeTask, FrameGraphPassTask } from "../../../Tasks/PostProcesses/passTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "././baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the pass post process
 */
export declare class NodeRenderGraphPassPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphPassTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphPassTask;
    /**
     * Create a new NodeRenderGraphPassPostProcessBlock
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
}
/**
 * Block that implements the pass cube post process
 */
export declare class NodeRenderGraphPassCubePostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphPassCubeTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphPassCubeTask;
    /**
     * Create a new NodeRenderGraphPassCubePostProcessBlock
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
}
/**
 * Register side effects for passPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPassPostProcessBlock(): void;

/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type FrameGraph, type FrameGraphContext } from "../../../index.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
import { FrameGraphExecuteTask } from "../../Tasks/Misc/executeTask.js";
/**
 * Block used to execute a custom function in the frame graph
 */
export declare class NodeRenderGraphExecuteBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphExecuteTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphExecuteTask;
    /**
     * Creates a new NodeRenderGraphExecuteBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /**
     * Gets or sets the execute function
     */
    get func(): (context: FrameGraphContext) => void;
    set func(func: (context: FrameGraphContext) => void);
    /**
     * Gets or sets the execute when task disabled function
     */
    get funcDisabled(): ((context: FrameGraphContext) => void) | undefined;
    set funcDisabled(func: ((context: FrameGraphContext) => void) | undefined);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
}
/**
 * Register side effects for executeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterExecuteBlock(): void;

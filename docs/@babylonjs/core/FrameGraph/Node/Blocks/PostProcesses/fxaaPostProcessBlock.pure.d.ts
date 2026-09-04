/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphFXAATask } from "../../../Tasks/PostProcesses/fxaaTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the FXAA post process
 */
export declare class NodeRenderGraphFXAAPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphFXAATask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphFXAATask;
    /**
     * Create a new FXAA post-process block
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
 * Register side effects for fxaaPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFxaaPostProcessBlock(): void;

/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphColorCorrectionTask } from "../../../Tasks/PostProcesses/colorCorrectionTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the color correction post process
 */
export declare class NodeRenderGraphColorCorrectionPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphColorCorrectionTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphColorCorrectionTask;
    /**
     * Create a new NodeRenderGraphColorCorrectionPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param colorTableUrl defines the URL of the color table
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, colorTableUrl?: string);
    private _createTask;
    /** The color table URL */
    get colorTableUrl(): string;
    set colorTableUrl(value: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for colorCorrectionPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterColorCorrectionPostProcessBlock(): void;

/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphSharpenTask } from "../../../Tasks/PostProcesses/sharpenTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the sharpen post process
 */
export declare class NodeRenderGraphSharpenPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphSharpenTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphSharpenTask;
    /**
     * Create a new sharpen post process block
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** How much of the original color should be applied. Setting this to 0 will display edge detection. */
    get colorAmount(): number;
    set colorAmount(value: number);
    /** How much sharpness should be applied. */
    get edgeAmount(): number;
    set edgeAmount(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for sharpenPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSharpenPostProcessBlock(): void;

/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphExtractHighlightsTask } from "../../../Tasks/PostProcesses/extractHighlightsTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the extract highlights post process
 */
export declare class NodeRenderGraphExtractHighlightsPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphExtractHighlightsTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphExtractHighlightsTask;
    /**
     * Create a new ExtractHighlightsPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** The luminance threshold, pixels below this value will be set to black. */
    get threshold(): number;
    set threshold(value: number);
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
 * Register side effects for extractHighlightsPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterExtractHighlightsPostProcessBlock(): void;

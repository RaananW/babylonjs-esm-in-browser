/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphConvolutionTask } from "../../../Tasks/PostProcesses/convolutionTask.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the convolution post process
 */
export declare class NodeRenderGraphConvolutionPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphConvolutionTask;
    _additionalConstructionParameters: [number[]];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphConvolutionTask;
    /**
     * Create a new NodeRenderGraphConvolutionPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, kernel?: number[]);
    private _createTask;
    /** The quality of the blur effect */
    get kernel(): number;
    set kernel(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for convolutionPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterConvolutionPostProcessBlock(): void;

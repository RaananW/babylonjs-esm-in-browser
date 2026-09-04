/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphFilterTask } from "../../../Tasks/PostProcesses/filterTask.js";
import { Matrix } from "../../../../Maths/math.vector.pure.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the kernel filter post process
 */
export declare class NodeRenderGraphFilterPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphFilterTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphFilterTask;
    /**
     * Create a new NodeRenderGraphFilterPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** The matrix to be applied to the image */
    get kernelMatrix(): Matrix;
    set kernelMatrix(value: Matrix);
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
 * Register side effects for filterPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFilterPostProcessBlock(): void;

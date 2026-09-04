/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { FrameGraphTonemapTask } from "../../../Tasks/PostProcesses/tonemapTask.js";
import { TonemappingOperator } from "../../../../PostProcesses/thinTonemapPostProcess.js";
import { NodeRenderGraphBaseWithPropertiesPostProcessBlock } from "./baseWithPropertiesPostProcessBlock.js";
/**
 * Block that implements the tonemap post process
 */
export declare class NodeRenderGraphTonemapPostProcessBlock extends NodeRenderGraphBaseWithPropertiesPostProcessBlock {
    protected _frameGraphTask: FrameGraphTonemapTask;
    _additionalConstructionParameters: [TonemappingOperator];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphTonemapTask;
    /**
     * Create a new NodeRenderGraphTonemapPostProcessBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param operator defines the operator to use (default: Reinhard)
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, operator?: TonemappingOperator);
    private _createTask;
    get operator(): TonemappingOperator;
    set operator(value: TonemappingOperator);
    /** Defines the required exposure adjustment */
    get exposureAdjustment(): number;
    set exposureAdjustment(value: number);
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
 * Register side effects for tonemapPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTonemapPostProcessBlock(): void;

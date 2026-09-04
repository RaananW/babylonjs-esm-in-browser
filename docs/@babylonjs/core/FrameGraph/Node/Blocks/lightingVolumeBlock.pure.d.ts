/** This file must only contain pure code and pure imports */
import { type FrameGraph, type NodeRenderGraphBuildState, type NodeRenderGraphConnectionPoint, type Scene } from "../../../index.js";
import { FrameGraphLightingVolumeTask } from "../../Tasks/Misc/lightingVolumeTask.js";
import { NodeRenderGraphBlock } from "../nodeRenderGraphBlock.js";
/**
 * Block that implements the lighting volume
 */
export declare class NodeRenderGraphLightingVolumeBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphLightingVolumeTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphLightingVolumeTask;
    /**
     * Create a new NodeRenderGraphLightingVolumeBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    /** Gets or sets the tesselation parameter */
    get tesselation(): number;
    set tesselation(value: number);
    /** Gets or sets the refresh frequency parameter */
    get frequency(): number;
    set frequency(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the shadow generator input component
     */
    get shadowGenerator(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for lightingVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLightingVolumeBlock(): void;

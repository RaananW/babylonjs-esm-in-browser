/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type FrameGraph, type NodeRenderGraphBuildState } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphUtilityLayerRendererTask } from "../../../Tasks/Rendering/utilityLayerRendererTask.js";
/**
 * Block used to render an utility layer in the frame graph
 */
export declare class NodeRenderGraphUtilityLayerRendererBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphUtilityLayerRendererTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphUtilityLayerRendererTask;
    /**
     * Creates a new NodeRenderGraphUtilityLayerRendererBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param handleEvents If the utility layer should handle events.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, handleEvents?: boolean);
    private _createTask;
    /** If the utility layer should handle events */
    get handleEvents(): boolean;
    set handleEvents(value: boolean);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the target input component
     */
    get target(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the camera input component
     */
    get camera(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
}
/**
 * Register side effects for utilityLayerRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterUtilityLayerRendererBlock(): void;

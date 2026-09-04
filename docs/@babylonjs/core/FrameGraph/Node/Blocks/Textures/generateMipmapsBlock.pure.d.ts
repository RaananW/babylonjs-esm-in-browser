/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type FrameGraph, type NodeRenderGraphBuildState } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphGenerateMipMapsTask } from "../../../Tasks/Texture/generateMipMapsTask.js";
/**
 * Block used to generate mipmaps for a texture
 */
export declare class NodeRenderGraphGenerateMipmapsBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphGenerateMipMapsTask;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphGenerateMipMapsTask;
    /**
     * Create a new NodeRenderGraphGenerateMipmapsBlock
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
    /**
     * Gets the target input component
     */
    get target(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeRenderGraphConnectionPoint;
    protected _buildBlock(state: NodeRenderGraphBuildState): void;
}
/**
 * Register side effects for generateMipmapsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGenerateMipmapsBlock(): void;

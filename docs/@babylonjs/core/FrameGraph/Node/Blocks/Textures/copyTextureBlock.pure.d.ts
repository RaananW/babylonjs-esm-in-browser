/** This file must only contain pure code and pure imports */
import { type NodeRenderGraphConnectionPoint, type Scene, type FrameGraph, type NodeRenderGraphBuildState, type IViewportLike } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphCopyToTextureTask } from "../../../Tasks/Texture/copyToTextureTask.js";
/**
 * Block used to copy a texture
 */
export declare class NodeRenderGraphCopyTextureBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphCopyToTextureTask;
    protected _useCurrentViewport: boolean;
    protected _useFullScreenViewport: boolean;
    protected _viewport: IViewportLike;
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphCopyToTextureTask;
    /**
     * Create a new NodeRenderGraphCopyTextureBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene);
    private _setViewport;
    /** If true, the current viewport will be left unchanged. */
    get useCurrentViewport(): boolean;
    set useCurrentViewport(value: boolean);
    /** If true, a full screen viewport will be used. */
    get useFullScreenViewport(): boolean;
    set useFullScreenViewport(value: boolean);
    /** The viewport to use. */
    get viewport(): IViewportLike;
    set viewport(value: IViewportLike);
    /** The LOD level to copy from the source texture (default: 0). */
    get lodLevel(): number;
    set lodLevel(value: number);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the source input component
     */
    get source(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the target input component
     */
    get target(): NodeRenderGraphConnectionPoint;
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
 * Register side effects for copyTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCopyTextureBlock(): void;

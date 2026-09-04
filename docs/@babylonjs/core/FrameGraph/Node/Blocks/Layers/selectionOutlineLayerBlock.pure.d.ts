/** This file must only contain pure code and pure imports */
import { type Scene, type NodeRenderGraphBuildState, type FrameGraph, type NodeRenderGraphConnectionPoint } from "../../../../index.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { FrameGraphSelectionOutlineLayerTask } from "../../../Tasks/Layers/selectionOutlineTask.js";
import { Color3 } from "../../../../Maths/math.color.pure.js";
/**
 * Block that implements the selection outline layer
 */
export declare class NodeRenderGraphSelectionOutlineLayerBlock extends NodeRenderGraphBlock {
    protected _frameGraphTask: FrameGraphSelectionOutlineLayerTask;
    _additionalConstructionParameters: [number, number | undefined, number];
    /**
     * Gets the frame graph task associated with this block
     */
    get task(): FrameGraphSelectionOutlineLayerTask;
    /**
     * Create a new NodeRenderGraphSelectionOutlineLayerBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param layerTextureRatio multiplication factor applied to the main texture size to compute the size of the layer render target texture (default: 1.0)
     * @param layerTextureFixedSize defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided (default: undefined)
     * @param layerTextureType defines the type of the layer texture (default: Constants.TEXTURETYPE_HALF_FLOAT)
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, layerTextureRatio?: number, layerTextureFixedSize?: number, layerTextureType?: number);
    private _createTask;
    /** Multiplication factor applied to the main texture size to compute the size of the layer render target texture */
    get layerTextureRatio(): number;
    set layerTextureRatio(value: number);
    /** Defines the fixed size of the layer render target texture. Takes precedence over layerTextureRatio if provided */
    get layerTextureFixedSize(): number;
    set layerTextureFixedSize(value: number);
    /** Defines the type of the layer texture */
    get layerTextureType(): number;
    set layerTextureType(value: number);
    /** The outline color */
    get outlineColor(): Color3;
    set outlineColor(value: Color3);
    /** The thickness of the edges */
    get outlineThickness(): number;
    set outlineThickness(value: number);
    /** The strength of the occlusion effect */
    get occlusionStrength(): number;
    set occlusionStrength(value: number);
    /** The occlusion threshold */
    get occlusionThreshold(): number;
    set occlusionThreshold(value: number);
    /** Whether to use depth when drawing selection outlines */
    get useDepthOcclusion(): boolean;
    set useDepthOcclusion(value: boolean);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the target texture input component
     */
    get target(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the layer texture input component
     */
    get layer(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the objectRenderer input component
     */
    get objectRenderer(): NodeRenderGraphConnectionPoint;
    /**
     * Gets the depth input component
     */
    get depth(): NodeRenderGraphConnectionPoint;
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
 * Register side effects for selectionOutlineLayerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSelectionOutlineLayerBlock(): void;

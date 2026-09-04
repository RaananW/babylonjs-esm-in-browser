/** This file must only contain pure code and pure imports */
import { type Scene, type FrameGraph } from "../../../../index.js";
import { NodeRenderGraphBaseShadowGeneratorBlock } from "./baseShadowGeneratorBlock.js";
/**
 * Block that generate shadows through a shadow generator
 */
export declare class NodeRenderGraphShadowGeneratorBlock extends NodeRenderGraphBaseShadowGeneratorBlock {
    /**
     * Create a new NodeRenderGraphShadowGeneratorBlock
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
}
/**
 * Register side effects for shadowGeneratorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterShadowGeneratorBlock(): void;

/** This file must only contain pure code and pure imports */
import { NodeRenderGraphBaseObjectRendererBlock } from "./baseObjectRendererBlock.js";
/**
 * Block that render objects to a render target
 */
export declare class NodeRenderGraphObjectRendererBlock extends NodeRenderGraphBaseObjectRendererBlock {
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for objectRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterObjectRendererBlock(): void;

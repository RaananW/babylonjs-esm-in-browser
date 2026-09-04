/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Block used to get a translation matrix
 */
export declare class TranslationBlock extends NodeGeometryBlock {
    /**
     * Create a new TranslationBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the translation input component
     */
    get translation(): NodeGeometryConnectionPoint;
    /**
     * Gets the matrix output component
     */
    get matrix(): NodeGeometryConnectionPoint;
    /** @internal */
    autoConfigure(): void;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for translationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTranslationBlock(): void;

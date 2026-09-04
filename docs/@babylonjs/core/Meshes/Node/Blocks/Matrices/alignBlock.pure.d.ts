/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Block used to get a align matrix
 */
export declare class AlignBlock extends NodeGeometryBlock {
    /**
     * Create a new AlignBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the source input component
     */
    get source(): NodeGeometryConnectionPoint;
    /**
     * Gets the target input component
     */
    get target(): NodeGeometryConnectionPoint;
    /**
     * Gets the matrix output component
     */
    get matrix(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for alignBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAlignBlock(): void;

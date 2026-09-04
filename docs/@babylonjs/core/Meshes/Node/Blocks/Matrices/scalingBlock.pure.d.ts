/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Block used to get a scaling matrix
 */
export declare class ScalingBlock extends NodeGeometryBlock {
    /**
     * Create a new ScalingBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the scale input component
     */
    get scale(): NodeGeometryConnectionPoint;
    /**
     * Gets the matrix output component
     */
    get matrix(): NodeGeometryConnectionPoint;
    /** @internal */
    autoConfigure(): void;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for scalingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterScalingBlock(): void;

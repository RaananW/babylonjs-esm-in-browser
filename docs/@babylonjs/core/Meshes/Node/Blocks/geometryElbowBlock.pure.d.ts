/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
/**
 * Block used as a pass through
 */
export declare class GeometryElbowBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryElbowBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the time spent to build this block (in ms)
     */
    get buildExecutionTime(): number;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for geometryElbowBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryElbowBlock(): void;

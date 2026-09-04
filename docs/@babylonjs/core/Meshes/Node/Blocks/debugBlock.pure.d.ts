/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
/**
 * Defines a block used to debug values going through it
 */
export declare class DebugBlock extends NodeGeometryBlock {
    /**
     * Gets the log entries
     */
    log: string[][];
    /**
     * Create a new DebugBlock
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
 * Register side effects for meshesNodeBlocksDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMeshesNodeBlocksDebugBlock(): void;

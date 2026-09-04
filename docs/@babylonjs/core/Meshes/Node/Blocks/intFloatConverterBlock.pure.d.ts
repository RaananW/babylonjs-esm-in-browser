/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Defines a block used to convert from int to float
 */
export declare class IntFloatConverterBlock extends NodeGeometryBlock {
    /**
     * Create a new IntFloatConverterBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the float input component
     */
    get floatIn(): NodeGeometryConnectionPoint;
    /**
     * Gets the int input component
     */
    get intIn(): NodeGeometryConnectionPoint;
    /**
     * Gets the float output component
     */
    get floatOut(): NodeGeometryConnectionPoint;
    /**
     * Gets the int output component
     */
    get intOut(): NodeGeometryConnectionPoint;
    protected _inputRename(name: string): string;
    protected _buildBlock(): void;
}
/**
 * Register side effects for intFloatConverterBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterIntFloatConverterBlock(): void;

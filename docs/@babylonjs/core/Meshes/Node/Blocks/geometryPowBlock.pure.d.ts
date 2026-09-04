/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to get the value of the first parameter raised to the power of the second
 */
export declare class GeometryPowBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryPowBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value operand input component
     */
    get value(): NodeGeometryConnectionPoint;
    /**
     * Gets the power operand input component
     */
    get power(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryPowBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryPowBlock(): void;

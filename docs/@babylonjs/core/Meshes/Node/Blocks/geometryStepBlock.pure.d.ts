/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to step a value
 */
export declare class GeometryStepBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryStepBlock
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
     * Gets the edge operand input component
     */
    get edge(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryStepBlock(): void;

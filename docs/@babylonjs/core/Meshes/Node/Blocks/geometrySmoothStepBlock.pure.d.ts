/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to smooth step a value
 */
export declare class GeometrySmoothStepBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometrySmoothStepBlock
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
     * Gets the first edge operand input component
     */
    get edge0(): NodeGeometryConnectionPoint;
    /**
     * Gets the second edge operand input component
     */
    get edge1(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometrySmoothStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometrySmoothStepBlock(): void;

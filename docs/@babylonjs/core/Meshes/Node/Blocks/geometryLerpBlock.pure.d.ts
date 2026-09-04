/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to lerp between 2 values
 */
export declare class GeometryLerpBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryLerpBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left operand input component
     */
    get left(): NodeGeometryConnectionPoint;
    /**
     * Gets the right operand input component
     */
    get right(): NodeGeometryConnectionPoint;
    /**
     * Gets the gradient operand input component
     */
    get gradient(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryLerpBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryLerpBlock(): void;

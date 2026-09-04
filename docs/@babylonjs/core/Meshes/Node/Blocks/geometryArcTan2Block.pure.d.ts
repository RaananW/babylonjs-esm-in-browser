/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to compute arc tangent of 2 values
 */
export declare class GeometryArcTan2Block extends NodeGeometryBlock {
    /**
     * Creates a new GeometryArcTan2Block
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the x operand input component
     */
    get x(): NodeGeometryConnectionPoint;
    /**
     * Gets the y operand input component
     */
    get y(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): void;
}
/**
 * Register side effects for geometryArcTan2Block.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryArcTan2Block(): void;

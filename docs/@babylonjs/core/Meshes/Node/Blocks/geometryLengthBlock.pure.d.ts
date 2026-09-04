/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to get the length of a vector
 */
export declare class GeometryLengthBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryLengthBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value input component
     */
    get value(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryLengthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryLengthBlock(): void;

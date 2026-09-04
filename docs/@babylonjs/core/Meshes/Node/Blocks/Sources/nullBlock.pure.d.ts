/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
/**
 * Defines a block used to generate a null geometry data
 */
export declare class NullBlock extends NodeGeometryBlock {
    /**
     * Create a new NullBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry output component
     */
    get geometry(): NodeGeometryConnectionPoint;
    /**
     * Gets the vector output component
     */
    get vector(): NodeGeometryConnectionPoint;
    protected _buildBlock(): void;
}
/**
 * Register side effects for nullBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterNullBlock(): void;

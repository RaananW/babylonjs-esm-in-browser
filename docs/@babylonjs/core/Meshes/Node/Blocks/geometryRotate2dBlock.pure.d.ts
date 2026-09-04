/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to rotate a 2d vector by a given angle
 */
export declare class GeometryRotate2dBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryRotate2dBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input vector
     */
    get input(): NodeGeometryConnectionPoint;
    /**
     * Gets the input angle
     */
    get angle(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryRotate2dBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryRotate2dBlock(): void;

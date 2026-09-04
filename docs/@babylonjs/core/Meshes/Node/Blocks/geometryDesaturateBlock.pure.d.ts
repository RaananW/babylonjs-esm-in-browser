/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to desaturate a color
 */
export declare class GeometryDesaturateBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryDesaturateBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the color operand input component
     */
    get color(): NodeGeometryConnectionPoint;
    /**
     * Gets the level operand input component
     */
    get level(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryDesaturateBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryDesaturateBlock(): void;

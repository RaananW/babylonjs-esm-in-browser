/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to posterize a value
 * @see https://en.wikipedia.org/wiki/Posterization
 */
export declare class GeometryPosterizeBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryPosterizeBlock
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
     * Gets the steps input component
     */
    get steps(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
}
/**
 * Register side effects for geometryPosterizeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryPosterizeBlock(): void;

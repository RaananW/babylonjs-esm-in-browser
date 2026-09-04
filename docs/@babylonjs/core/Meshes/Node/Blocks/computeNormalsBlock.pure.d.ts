/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to recompute normals for a geometry
 */
export declare class ComputeNormalsBlock extends NodeGeometryBlock {
    /**
     * Creates a new ComputeNormalsBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry component
     */
    get geometry(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): void;
}
/**
 * Register side effects for computeNormalsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterComputeNormalsBlock(): void;

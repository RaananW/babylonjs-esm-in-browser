/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Block used to get a rotation matrix on Z Axis
 */
export declare class RotationZBlock extends NodeGeometryBlock {
    /**
     * Create a new RotationZBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the angle input component
     */
    get angle(): NodeGeometryConnectionPoint;
    /**
     * Gets the matrix output component
     */
    get matrix(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for rotationZBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRotationZBlock(): void;

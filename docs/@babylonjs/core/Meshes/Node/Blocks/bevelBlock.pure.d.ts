/** This file must only contain pure code and pure imports */
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to bevel sharp edges in a geometry.
 */
export declare class BevelBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context.
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change.
     */
    evaluateContext: boolean;
    /**
     * Creates a new BevelBlock.
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry input component.
     */
    get geometry(): NodeGeometryConnectionPoint;
    /**
     * Gets the bevel amount input component.
     */
    get amount(): NodeGeometryConnectionPoint;
    /**
     * Gets the bevel segment count input component.
     */
    get segments(): NodeGeometryConnectionPoint;
    /**
     * Gets the angle threshold input component in degrees.
     */
    get angle(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry output component.
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes this block in a JSON representation.
     * @returns the serialized block object
     */
    serialize(): any;
    /** @internal */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for bevelBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBevelBlock(): void;

/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
/**
 * Defines a block used to generate a geometry data from a list of points
 */
export declare class PointListBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a list of points used to generate the geometry
     */
    points: Vector3[];
    /**
     * Create a new PointListBlock
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
    protected _buildBlock(_state: NodeGeometryBuildState): void;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize(): any;
    /** @internal */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for pointListBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPointListBlock(): void;

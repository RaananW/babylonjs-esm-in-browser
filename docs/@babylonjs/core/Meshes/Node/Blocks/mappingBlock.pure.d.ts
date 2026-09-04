/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Type of mappings supported by the mapping block
 */
export declare enum MappingTypes {
    /** Spherical */
    Spherical = 0,
    /** Cylindrical */
    Cylindrical = 1,
    /** Cubic */
    Cubic = 2
}
/**
 * Block used to generate UV coordinates
 */
export declare class MappingBlock extends NodeGeometryBlock {
    /**
     * Gets or sets the mapping type used by the block
     */
    mapping: MappingTypes;
    /**
     * Create a new MappingBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the position input component
     */
    get position(): NodeGeometryConnectionPoint;
    /**
     * Gets the normal input component
     */
    get normal(): NodeGeometryConnectionPoint;
    /**
     * Gets the center input component
     */
    get center(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get uv(): NodeGeometryConnectionPoint;
    protected _buildBlock(): void;
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
 * Register side effects for mappingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMappingBlock(): void;

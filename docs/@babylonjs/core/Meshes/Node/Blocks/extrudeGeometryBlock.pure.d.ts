/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
/**
 * Cap mode for the extrusion
 */
export declare enum ExtrudeGeometryCap {
    /** No caps — only the extruded side walls are generated */
    NoCap = 0,
    /** Cap the bottom face (the original input geometry face) */
    CapStart = 1,
    /** Cap the top face (the offset/extruded geometry face) */
    CapEnd = 2,
    /** Cap both the bottom and top faces (default). Creates a solid */
    CapAll = 3
}
/**
 * Block used to extrude a geometry along its face normals
 */
export declare class ExtrudeGeometryBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    evaluateContext: boolean;
    /**
     * Gets or sets the cap mode for the extrusion
     */
    cap: ExtrudeGeometryCap;
    /**
     * Create a new ExtrudeGeometryBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry input component
     */
    get geometry(): NodeGeometryConnectionPoint;
    /**
     * Gets the depth input component
     */
    get depth(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
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
 * Register side effects for extrudeGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterExtrudeGeometryBlock(): void;

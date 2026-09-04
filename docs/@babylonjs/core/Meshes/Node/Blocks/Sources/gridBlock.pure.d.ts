/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Defines a block used to generate grid geometry data
 */
export declare class GridBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    evaluateContext: boolean;
    /**
     * Create a new GridBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the width input component
     */
    get width(): NodeGeometryConnectionPoint;
    /**
     * Gets the height input component
     */
    get height(): NodeGeometryConnectionPoint;
    /**
     * Gets the subdivisions input component
     */
    get subdivisions(): NodeGeometryConnectionPoint;
    /**
     * Gets the subdivisionsX input component
     */
    get subdivisionsX(): NodeGeometryConnectionPoint;
    /**
     * Gets the subdivisionsY input component
     */
    get subdivisionsY(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get geometry(): NodeGeometryConnectionPoint;
    /** @internal */
    autoConfigure(): void;
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
 * Register side effects for gridBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGridBlock(): void;

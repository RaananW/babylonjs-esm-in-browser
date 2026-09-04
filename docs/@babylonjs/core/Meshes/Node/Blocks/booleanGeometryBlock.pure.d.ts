/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
import { type Nullable } from "../../../types.js";
/**
 * Operations supported by the boolean block
 */
export declare enum BooleanGeometryOperations {
    /** Intersect */
    Intersect = 0,
    /** Subtract */
    Subtract = 1,
    /** Union */
    Union = 2
}
/**
 * Block used to apply a boolean operation between 2 geometries
 */
export declare class BooleanGeometryBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    evaluateContext: boolean;
    /**
     * Gets or sets the operation applied by the block
     */
    operation: BooleanGeometryOperations;
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    useOldCSGEngine: boolean;
    private _csg2LoadingPromise;
    /**
     * @internal
     */
    get _isReadyState(): Nullable<Promise<void>>;
    /**
     * Create a new BooleanGeometryBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry0 input component
     */
    get geometry0(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry1 input component
     */
    get geometry1(): NodeGeometryConnectionPoint;
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
 * Register side effects for booleanGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBooleanGeometryBlock(): void;

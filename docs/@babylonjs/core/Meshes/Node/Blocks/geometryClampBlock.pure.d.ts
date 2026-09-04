/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Block used to clamp a float
 */
export declare class GeometryClampBlock extends NodeGeometryBlock {
    /** Gets or sets the minimum range */
    get minimum(): number;
    set minimum(value: number);
    /** Gets or sets the maximum range */
    get maximum(): number;
    set maximum(value: number);
    /**
     * Creates a new GeometryClampBlock
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
     * Gets the min input component
     */
    get min(): NodeGeometryConnectionPoint;
    /**
     * Gets the max input component
     */
    get max(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(): this | undefined;
    /** @internal */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for geometryClampBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryClampBlock(): void;

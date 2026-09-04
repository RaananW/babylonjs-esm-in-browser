/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Defines a block used to generate sphere geometry data
 */
export declare class SphereBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    evaluateContext: boolean;
    /**
     * Create a new SphereBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the segments input component
     */
    get segments(): NodeGeometryConnectionPoint;
    /**
     * Gets the diameter input component
     */
    get diameter(): NodeGeometryConnectionPoint;
    /**
     * Gets the diameterX input component
     */
    get diameterX(): NodeGeometryConnectionPoint;
    /**
     * Gets the diameterY input component
     */
    get diameterY(): NodeGeometryConnectionPoint;
    /**
     * Gets the diameterZ input component
     */
    get diameterZ(): NodeGeometryConnectionPoint;
    /**
     * Gets the arc input component
     */
    get arc(): NodeGeometryConnectionPoint;
    /**
     * Gets the slice input component
     */
    get slice(): NodeGeometryConnectionPoint;
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
 * Register side effects for sphereBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSphereBlock(): void;

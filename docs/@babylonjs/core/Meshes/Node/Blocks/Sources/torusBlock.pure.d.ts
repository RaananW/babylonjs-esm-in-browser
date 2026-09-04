/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Defines a block used to generate torus geometry data
 */
export declare class TorusBlock extends NodeGeometryBlock {
    /**
     * Gets or sets a boolean indicating that this block can evaluate context
     * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
     */
    evaluateContext: boolean;
    /**
     * Create a new TorusBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the diameter input component
     */
    get diameter(): NodeGeometryConnectionPoint;
    /**
     * Gets the thickness input component
     */
    get thickness(): NodeGeometryConnectionPoint;
    /**
     * Gets the tessellation input component
     */
    get tessellation(): NodeGeometryConnectionPoint;
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
 * Register side effects for torusBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTorusBlock(): void;

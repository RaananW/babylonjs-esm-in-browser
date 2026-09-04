/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
/**
 * Locks supported by the random block
 */
export declare enum RandomBlockLocks {
    /** None */
    None = 0,
    /** LoopID */
    LoopID = 1,
    /** InstanceID */
    InstanceID = 2,
    /** Once */
    Once = 3
}
/**
 * Block used to get a random number
 */
export declare class RandomBlock extends NodeGeometryBlock {
    private _currentLockId;
    /**
     * Gets or sets a value indicating if that block will lock its value for a specific duration
     */
    lockMode: RandomBlockLocks;
    /**
     * Create a new RandomBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the min input component
     */
    get min(): NodeGeometryConnectionPoint;
    /**
     * Gets the max input component
     */
    get max(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get output(): NodeGeometryConnectionPoint;
    /** @internal */
    autoConfigure(): void;
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
 * Register side effects for randomBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRandomBlock(): void;

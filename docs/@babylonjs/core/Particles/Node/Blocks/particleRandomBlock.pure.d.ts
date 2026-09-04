/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
/**
 * Locks supported by the random block
 */
export declare enum ParticleRandomBlockLocks {
    /** None */
    None = 0,
    /** PerParticle */
    PerParticle = 1,
    /** PerSystem */
    PerSystem = 2,
    /** OncePerParticle */
    OncePerParticle = 3
}
/**
 * Block used to get a random number
 */
export declare class ParticleRandomBlock extends NodeParticleBlock {
    private _currentLockId;
    private _oncePerParticleMap;
    /**
     * Gets or sets a value indicating if that block will lock its value for a specific event
     */
    lockMode: ParticleRandomBlockLocks;
    /**
     * Create a new ParticleRandomBlock
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
    get min(): NodeParticleConnectionPoint;
    /**
     * Gets the max input component
     */
    get max(): NodeParticleConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(): void;
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for particleRandomBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleRandomBlock(): void;

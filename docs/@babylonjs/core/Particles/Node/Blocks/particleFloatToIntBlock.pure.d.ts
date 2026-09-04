/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
/**
 * Operations supported by the FloatToInt block
 */
export declare enum ParticleFloatToIntBlockOperations {
    /** Round */
    Round = 0,
    /** Ceil */
    Ceil = 1,
    /** Floor */
    Floor = 2,
    /** Truncate */
    Truncate = 3
}
/**
 * Block used to transform a float to an int
 */
export declare class ParticleFloatToIntBlock extends NodeParticleBlock {
    /**
     * Gets or sets the operation applied by the block
     */
    operation: ParticleFloatToIntBlockOperations;
    /**
     * Creates a new ParticleFloatToIntBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(state: NodeParticleBuildState): void;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for particleFloatToIntBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleFloatToIntBlock(): void;

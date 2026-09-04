/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
/**
 * Operations supported by the Vector Math block
 */
export declare enum ParticleVectorMathBlockOperations {
    /** Dot product */
    Dot = 0,
    /** Distance between two vectors */
    Distance = 1
}
/**
 * Block used to apply math operations that only apply to vectors
 */
export declare class ParticleVectorMathBlock extends NodeParticleBlock {
    /**
     * Gets or sets the operation applied by the block
     */
    operation: ParticleVectorMathBlockOperations;
    /**
     * Create a new ParticleVectorMathBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left input component
     */
    get left(): NodeParticleConnectionPoint;
    /**
     * Gets the right input component
     */
    get right(): NodeParticleConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(state: NodeParticleBuildState): void;
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize(): any;
    /**
     * Deserializes the block from a JSON object
     * @param serializationObject the JSON object to deserialize from
     */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for particleVectorMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleVectorMathBlock(): void;

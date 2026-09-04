/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
/**
 * Operations supported by the Math block
 */
export declare enum ParticleMathBlockOperations {
    /** Add */
    Add = 0,
    /** Subtract */
    Subtract = 1,
    /** Multiply */
    Multiply = 2,
    /** Divide */
    Divide = 3,
    /** Max */
    Max = 4,
    /** Min */
    Min = 5
}
/**
 * Block used to apply math functions
 */
export declare class ParticleMathBlock extends NodeParticleBlock {
    /**
     * Gets or sets the operation applied by the block
     */
    operation: ParticleMathBlockOperations;
    private readonly _connectionObservers;
    /**
     * Create a new ParticleMathBlock
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
    private _updateInputOutputTypes;
    /**
     * Release resources
     */
    dispose(): void;
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
 * Register side effects for particleMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleMathBlock(): void;

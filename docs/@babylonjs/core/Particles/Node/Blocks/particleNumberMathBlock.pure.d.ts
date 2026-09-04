/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
/**
 * Operations supported by the Number Math block
 */
export declare enum ParticleNumberMathBlockOperations {
    /** Modulo */
    Modulo = 0,
    /** Power */
    Pow = 1
}
/**
 * Block used to apply math operations that only appply to numbers (int/float)
 */
export declare class ParticleNumberMathBlock extends NodeParticleBlock {
    /**
     * Gets or sets the operation applied by the block
     */
    operation: ParticleNumberMathBlockOperations;
    private readonly _connectionObservers;
    /**
     * Create a new ParticleNumberMathBlock
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
 * Register side effects for particleNumberMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleNumberMathBlock(): void;

/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
export declare enum ParticleLocalVariableBlockScope {
    Particle = 0,
    Loop = 1
}
/**
 * Defines a block used to store local values
 * #A1OS53#5
 */
export declare class ParticleLocalVariableBlock extends NodeParticleBlock {
    /**
     * Gets or sets the scope used by the block
     */
    scope: ParticleLocalVariableBlockScope;
    private _storage;
    /**
     * Create a new ParticleLocalVariableBlock
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
    dispose(): void;
}
/**
 * Register side effects for particleLocalVariableBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleLocalVariableBlock(): void;

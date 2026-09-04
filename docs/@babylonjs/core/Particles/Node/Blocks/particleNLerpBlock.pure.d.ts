/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
/**
 * Block used to normalize lerp between 2 values
 */
export declare class ParticleNLerpBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleNLerpBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left operand input component
     */
    get left(): NodeParticleConnectionPoint;
    /**
     * Gets the right operand input component
     */
    get right(): NodeParticleConnectionPoint;
    /**
     * Gets the gradient operand input component
     */
    get gradient(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(_state: NodeParticleBuildState): this | undefined;
}
/**
 * Register side effects for particleNLerpBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleNLerpBlock(): void;

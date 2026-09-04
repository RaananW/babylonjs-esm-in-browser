/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
/**
 * Block used as a pass through
 */
export declare class ParticleElbowBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleElbowBlock
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
}
/**
 * Register side effects for particleElbowBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleElbowBlock(): void;

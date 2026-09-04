/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to update the size of a particle
 */
export declare class UpdateSizeBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateSizeBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the particle component
     */
    get particle(): NodeParticleConnectionPoint;
    /**
     * Gets the size input component
     */
    get size(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state: NodeParticleBuildState): void;
}
/**
 * Register side effects for updateSizeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterUpdateSizeBlock(): void;

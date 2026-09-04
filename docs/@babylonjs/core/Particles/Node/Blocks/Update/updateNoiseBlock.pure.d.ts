/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to update particle position based on a noise texture
 */
export declare class UpdateNoiseBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateNoiseBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the particle component
     */
    get particle(): NodeParticleConnectionPoint;
    /**
     * Gets the noiseTexture input component
     */
    get noiseTexture(): NodeParticleConnectionPoint;
    /**
     * Gets the strength input component
     */
    get strength(): NodeParticleConnectionPoint;
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
 * Register side effects for updateNoiseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterUpdateNoiseBlock(): void;

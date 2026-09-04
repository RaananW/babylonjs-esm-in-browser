/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
/**
 * Block used to align the angle of a particle to its direction
 * We assume the sprite is facing +Y
 * NPE: #W5054F
 * PG: #H5RP91
 */
export declare class AlignAngleBlock extends NodeParticleBlock {
    /**
     * Gets or sets the strenght of the flow map effect
     */
    alignment: number;
    /**
     * Create a new AlignAngleBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the particle component
     */
    get particle(): NodeParticleConnectionPoint;
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
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for alignAngleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAlignAngleBlock(): void;

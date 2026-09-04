/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { type IShapeBlock } from "./IShapeBlock.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to provide a flow of particles emitted from a point.
 */
export declare class PointShapeBlock extends NodeParticleBlock implements IShapeBlock {
    /**
     * Create a new PointShapeBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the particle component
     */
    get particle(): NodeParticleConnectionPoint;
    /**
     * Gets the direction1 input component
     */
    get direction1(): NodeParticleConnectionPoint;
    /**
     * Gets the direction2 input component
     */
    get direction2(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    /**
     * Builds the block
     * @param state defines the build state
     */
    _build(state: NodeParticleBuildState): void;
}
/**
 * Register side effects for pointShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPointShapeBlock(): void;

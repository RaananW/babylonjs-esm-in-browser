/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { type IShapeBlock } from "./IShapeBlock.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to provide a flow of particles emitted from a box shape.
 */
export declare class BoxShapeBlock extends NodeParticleBlock implements IShapeBlock {
    /**
     * Create a new BoxShapeBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the particle input component
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
     * Gets the minEmitBox input component
     */
    get minEmitBox(): NodeParticleConnectionPoint;
    /**
     * Gets the maxEmitBox input component
     */
    get maxEmitBox(): NodeParticleConnectionPoint;
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
 * Register side effects for boxShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBoxShapeBlock(): void;

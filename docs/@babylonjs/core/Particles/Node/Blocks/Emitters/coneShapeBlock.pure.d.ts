/** This file must only contain pure code and pure imports */
import { type IShapeBlock } from "./IShapeBlock.js";
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to provide a flow of particles emitted from a cone shape.
 */
export declare class ConeShapeBlock extends NodeParticleBlock implements IShapeBlock {
    /**
     * Gets or sets a boolean indicating if the system should emit only from the spawn point
     * DirectionRandomizer will be used for the particles initial direction unless both direction1 and direction2 are connected.
     */
    emitFromSpawnPointOnly: boolean;
    /**
     * Create a new ConeShapeBlock
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
     * Gets the radius input component
     */
    get radius(): NodeParticleConnectionPoint;
    /**
     * Gets the angle input component
     */
    get angle(): NodeParticleConnectionPoint;
    /**
     * Gets the radiusRange input component
     */
    get radiusRange(): NodeParticleConnectionPoint;
    /**
     * Gets the heightRange input component
     */
    get heightRange(): NodeParticleConnectionPoint;
    /**
     * Gets the directionRandomizer input component
     */
    get directionRandomizer(): NodeParticleConnectionPoint;
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
    private _calculateHeight;
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for coneShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterConeShapeBlock(): void;

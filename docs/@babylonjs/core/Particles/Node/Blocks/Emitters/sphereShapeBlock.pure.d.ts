/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { type IShapeBlock } from "./IShapeBlock.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used to provide a flow of particles emitted from a sphere shape.
 * DirectionRandomizer will be used for the particles initial direction unless both direction1 and direction2 are connected.
 */
export declare class SphereShapeBlock extends NodeParticleBlock implements IShapeBlock {
    /**
     * Gets or sets a boolean indicating whether to emit in a hemispheric mode (top half of the sphere) or not
     */
    isHemispheric: boolean;
    /**
     * Create a new SphereShapeBlock
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
     * Gets the radius input component
     */
    get radius(): NodeParticleConnectionPoint;
    /**
     * Gets the radiusRange input component
     */
    get radiusRange(): NodeParticleConnectionPoint;
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
    serialize(): any;
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for sphereShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSphereShapeBlock(): void;

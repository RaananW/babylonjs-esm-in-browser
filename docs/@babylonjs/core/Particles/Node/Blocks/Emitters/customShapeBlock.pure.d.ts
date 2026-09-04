/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../../../types.js";
import { type Particle } from "../../../particle.js";
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
import { type IShapeBlock } from "./IShapeBlock.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/** Function that generates particle position/direction data */
type ParticleGeneratorFunction = (index: number, particle: Nullable<Particle>, outPosition: Vector3) => void;
/**
 * Block used to provide a flow of particles emitted from a custom position.
 */
export declare class CustomShapeBlock extends NodeParticleBlock implements IShapeBlock {
    /** The particle position generator function */
    particlePositionGenerator: ParticleGeneratorFunction;
    /** The particle destination generator function */
    particleDestinationGenerator: ParticleGeneratorFunction;
    /** The particle direction generator function */
    particleDirectionGenerator: ParticleGeneratorFunction;
    /**
     * Create a new CustomShapeBlock
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
 * Register side effects for customShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCustomShapeBlock(): void;
export {};

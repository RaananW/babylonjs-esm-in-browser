/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
/**
 * @internal
 */
export declare class CreateParticleBlock extends NodeParticleBlock {
    /**
     * Create a new CreateParticleBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the emitPower input component
     */
    get emitPower(): NodeParticleConnectionPoint;
    /**
     * Gets the lifeTime input component
     */
    get lifeTime(): NodeParticleConnectionPoint;
    /**
     * Gets the color input component
     */
    get color(): NodeParticleConnectionPoint;
    /**
     * Gets the color dead input component
     */
    get colorDead(): NodeParticleConnectionPoint;
    /**
     * Gets the scale input component
     */
    get scale(): NodeParticleConnectionPoint;
    /**
     * Gets the angle input component
     */
    get angle(): NodeParticleConnectionPoint;
    /**
     * Gets the size component
     */
    get size(): NodeParticleConnectionPoint;
    /**
     * Gets the particle output component
     */
    get particle(): NodeParticleConnectionPoint;
    /**
     * @internal
     */
    _build(state: NodeParticleBuildState): void;
}
/**
 * Register side effects for createParticleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCreateParticleBlock(): void;

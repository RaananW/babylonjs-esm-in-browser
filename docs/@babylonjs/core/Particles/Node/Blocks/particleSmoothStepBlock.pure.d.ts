/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
/**
 * Block used to smooth step a value
 */
export declare class ParticleSmoothStepBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleSmoothStepBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value operand input component
     */
    get value(): NodeParticleConnectionPoint;
    /**
     * Gets the first edge operand input component
     */
    get edge0(): NodeParticleConnectionPoint;
    /**
     * Gets the second edge operand input component
     */
    get edge1(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(): this | undefined;
}
/**
 * Register side effects for particleSmoothStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleSmoothStepBlock(): void;

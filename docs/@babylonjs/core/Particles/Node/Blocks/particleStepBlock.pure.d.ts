/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
/**
 * Block used to step a value
 */
export declare class ParticleStepBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleStepBlock
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
     * Gets the edge operand input component
     */
    get edge(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(): this | undefined;
}
/**
 * Register side effects for particleStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleStepBlock(): void;

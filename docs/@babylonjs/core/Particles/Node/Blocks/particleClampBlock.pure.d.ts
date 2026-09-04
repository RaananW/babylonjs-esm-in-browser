/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
/**
 * Block used to clamp a float
 */
export declare class ParticleClampBlock extends NodeParticleBlock {
    /** Gets or sets the minimum range */
    get minimum(): number;
    set minimum(value: number);
    /** Gets or sets the maximum range */
    get maximum(): number;
    set maximum(value: number);
    /**
     * Creates a new ParticleClampBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value input component
     */
    get value(): NodeParticleConnectionPoint;
    /**
     * Gets the min input component
     */
    get min(): NodeParticleConnectionPoint;
    /**
     * Gets the max input component
     */
    get max(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(state: NodeParticleBuildState): this | undefined;
}
/**
 * Register side effects for particleClampBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleClampBlock(): void;

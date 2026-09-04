/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../../nodeParticleBuildState.js";
/**
 * Block used to trigger a particle system based on a condition.
 */
export declare class ParticleTriggerBlock extends NodeParticleBlock {
    private _triggerCount;
    /**
     * Gets or sets the emit rate
     */
    limit: number;
    /**
     * Gets or sets the emit rate
     */
    delay: number;
    /**
     * Create a new ParticleTriggerBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeParticleConnectionPoint;
    /**
     * Gets the condition input component
     */
    get condition(): NodeParticleConnectionPoint;
    /**
     * Gets the target system input component
     */
    get system(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    private _previousOne;
    _build(state: NodeParticleBuildState): void;
    serialize(): any;
    _deserialize(serializationObject: any): void;
    dispose(): void;
}
/**
 * Register side effects for particleTriggerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleTriggerBlock(): void;

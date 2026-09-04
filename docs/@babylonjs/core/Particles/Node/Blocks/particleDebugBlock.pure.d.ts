/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { Observable } from "../../../Misc/observable.pure.js";
/**
 * Defines a block used to debug values going through it
 */
export declare class ParticleDebugBlock extends NodeParticleBlock {
    /**
     * Gets the log entries
     */
    log: string[][];
    /**
     * Gets or sets the number of logs to keep
     */
    stackSize: number;
    /**
     * Create a new ParticleDebugBlock
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
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    /**
     * Observable raised when data is collected
     */
    onDataCollectedObservable: Observable<ParticleDebugBlock>;
    _build(state: NodeParticleBuildState): void;
    serialize(): any;
    _deserialize(serializationObject: any): void;
    dispose(): void;
}
/**
 * Register side effects for particleDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleDebugBlock(): void;

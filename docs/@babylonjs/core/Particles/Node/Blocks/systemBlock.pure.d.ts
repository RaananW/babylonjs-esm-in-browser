/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../../types.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type ParticleSystem } from "../../particleSystem.pure.js";
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
type CustomShader = {
    shaderPath: {
        fragmentElement: string;
    };
    shaderOptions: {
        uniforms: string[];
        samplers: string[];
        defines: string[];
    };
};
/**
 * Block used to get a system of particles
 */
export declare class SystemBlock extends NodeParticleBlock {
    private static _IdCounter;
    /**
     * Gets or sets the blend mode for the particle system
     */
    blendMode: number;
    /**
     * Gets or sets the epsilon value used for comparison
     */
    capacity: number;
    /**
     * Gets or sets the manual emit count
     */
    manualEmitCount: number;
    /**
     * Gets or sets the target stop duration for the particle system
     */
    startDelay: number;
    /**
     * Gets or sets the target stop duration for the particle system
     */
    updateSpeed: number;
    /**
     * Gets or sets the number of pre-warm cycles before rendering the particle system
     */
    preWarmCycles: number;
    /**
     * Gets or sets the time step multiplier used for pre-warm
     */
    preWarmStepOffset: number;
    /**
     * Gets or sets a boolean indicating if the system is billboard based
     */
    isBillboardBased: boolean;
    /**
     * Gets or sets the billboard mode for the particle system
     */
    billBoardMode: number;
    /**
     * Gets or sets a boolean indicating if the system coordinate space is local or global
     */
    isLocal: boolean;
    /**
     * Gets or sets a boolean indicating if the system should be disposed when stopped
     */
    disposeOnStop: boolean;
    /**
     * Gets or sets a boolean indicating if the system should not start automatically
     */
    doNoStart: boolean;
    /**
     * Gets or sets the rendering group id for the particle system (0 by default)
     */
    renderingGroupId: number;
    /** @internal */
    _internalId: number;
    /**
     * Gets or sets the custom shader configuration used to render the particles.
     * This can be used to set your own shader to render the particle system.
     */
    customShader: Nullable<CustomShader>;
    /**
     * Gets or sets the emitter for the particle system.
     */
    emitter: Nullable<AbstractMesh | Vector3>;
    /**
     * Create a new SystemBlock
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
     * Gets the emitRate input component
     */
    get emitRate(): NodeParticleConnectionPoint;
    /**
     * Gets the texture input component
     */
    get texture(): NodeParticleConnectionPoint;
    /**
     * Gets the translationPivot input component
     */
    get translationPivot(): NodeParticleConnectionPoint;
    /**
     * Gets the textureMask input component
     */
    get textureMask(): NodeParticleConnectionPoint;
    /**
     * Gets the targetStopDuration input component
     */
    get targetStopDuration(): NodeParticleConnectionPoint;
    /**
     * Gets the onStart input component
     */
    get onStart(): NodeParticleConnectionPoint;
    /**
     * Gets the onEnd input component
     */
    get onEnd(): NodeParticleConnectionPoint;
    /**
     * Gets the system output component
     */
    get system(): NodeParticleConnectionPoint;
    /**
     * Builds the block and return a functional particle system
     * @param state defines the building state
     * @returns the built particle system
     */
    createSystem(state: NodeParticleBuildState): ParticleSystem;
    /**
     * Serializes the system block
     * @returns The serialized object
     */
    serialize(): any;
    /**
     * Deserializes the system block
     * @param serializationObject The serialized system
     */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for systemBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSystemBlock(): void;
export {};

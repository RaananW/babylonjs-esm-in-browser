import { type Scene } from "../../scene.js";
import { type Nullable } from "../../types.js";
import { type Particle } from "../particle.js";
import { type ThinParticleSystem } from "../thinParticleSystem.js";
import { type NodeParticleConnectionPoint } from "./nodeParticleBlockConnectionPoint.js";
import { Color4 } from "../../Maths/math.color.pure.js";
import { Vector2, Vector3 } from "../../Maths/math.vector.pure.js";
import { NodeParticleBlockConnectionPointTypes } from "./Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleContextualSources } from "./Enums/nodeParticleContextualSources.js";
import { NodeParticleSystemSources } from "./Enums/nodeParticleSystemSources.js";
/**
 * Class used to store node based geometry build state
 */
export declare class NodeParticleBuildState {
    private _buildPromises;
    /**
     * Gets the capactity of the particle system to build
     */
    capacity: number;
    /**
     * Gets the scene where the particle system is built
     */
    scene: Scene;
    /** Gets or sets the build identifier */
    buildId: number;
    /** Gets or sets the list of non connected mandatory inputs */
    notConnectedNonOptionalInputs: NodeParticleConnectionPoint[];
    /** Gets or sets a boolean indicating that verbose mode is on */
    verbose: boolean;
    /**
     * Gets or sets the particle context for contextual data
     */
    particleContext: Nullable<Particle>;
    /**
     * Gets or sets the system context for contextual data
     */
    systemContext: Nullable<ThinParticleSystem>;
    /**
     * Gets or sets the index of the gradient to use
     */
    gradientIndex: number;
    /**
     * Gets or sets next gradient in line
     */
    nextGradientIndex: number;
    /**
     * Gets or sets the next gradient value
     */
    nextGradientValue: any;
    /**
     * Emits errors if any
     */
    emitErrors(): void;
    /**
     * Registers an asynchronous operation that must complete before the node particle system is ready.
     * @param promise defines the promise to wait for
     */
    registerBuildPromise(promise: Promise<void>): void;
    /**
     * Waits for all asynchronous build operations to complete.
     * @returns a promise that resolves when all registered build operations are complete
     */
    waitForBuildPromisesAsync(): Promise<void>;
    /**
     * Adapt a value to a target type
     * @param source defines the value to adapt
     * @param targetType defines the target type
     * @returns the adapted value
     */
    adapt(source: NodeParticleConnectionPoint, targetType: NodeParticleBlockConnectionPointTypes): any;
    /**
     * Gets the value associated with a contextual source
     * @param source Source of the contextual value
     * @returns the value associated with the source
     */
    getContextualValue(source: NodeParticleContextualSources): number | Color4 | Vector2 | Nullable<Vector3>;
    /**
     * Gets the emitter world matrix
     */
    get emitterWorldMatrix(): import("../../Maths/math.vector.pure.js").Matrix | null;
    /**
     * Gets the emitter inverse world matrix
     */
    get emitterInverseWorldMatrix(): import("../../Maths/math.vector.pure.js").Matrix | null;
    /**
     * Gets the emitter position
     */
    get emitterPosition(): Nullable<Vector3>;
    /**
     * Gets the value associated with a system source
     * @param source Source of the system value
     * @returns the value associated with the source
     */
    getSystemValue(source: NodeParticleSystemSources): number | Nullable<Vector3>;
}

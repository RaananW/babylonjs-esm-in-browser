import { type Nullable } from "../types.js";
import { Vector2, Vector3, Vector4 } from "../Maths/math.vector.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { type SubEmitter } from "./subEmitter.js";
import { type ColorGradient, type FactorGradient } from "../Misc/gradients.js";
import { type ThinParticleSystem } from "./thinParticleSystem.js";
/**
 * @internal
 * Holds all internal properties of a Particle, grouped into a single sub-object
 * to keep the Particle's own property count low (V8 in-object property limit).
 */
declare class ParticleInternalProperties {
    /** @internal */
    randomCellOffset?: number;
    /** @internal */
    initialDirection: Nullable<Vector3>;
    /** @internal */
    attachedSubEmitters: Nullable<Array<SubEmitter>>;
    /** @internal */
    initialStartSpriteCellId: number;
    /** @internal */
    initialEndSpriteCellId: number;
    /** @internal */
    initialSpriteCellLoop: boolean;
    /** @internal */
    currentColorGradient: Nullable<ColorGradient>;
    /** @internal */
    currentColor1: Color4;
    /** @internal */
    currentColor2: Color4;
    /** @internal */
    currentSizeGradient: Nullable<FactorGradient>;
    /** @internal */
    currentSize1: number;
    /** @internal */
    currentSize2: number;
    /** @internal */
    currentAngularSpeedGradient: Nullable<FactorGradient>;
    /** @internal */
    currentAngularSpeed1: number;
    /** @internal */
    currentAngularSpeed2: number;
    /** @internal */
    currentVelocityGradient: Nullable<FactorGradient>;
    /** @internal */
    currentVelocity1: number;
    /** @internal */
    currentVelocity2: number;
    /** @internal */
    directionScale: number;
    /** @internal */
    scaledDirection: Vector3;
    /** @internal */
    currentLimitVelocityGradient: Nullable<FactorGradient>;
    /** @internal */
    currentLimitVelocity1: number;
    /** @internal */
    currentLimitVelocity2: number;
    /** @internal */
    currentDragGradient: Nullable<FactorGradient>;
    /** @internal */
    currentDrag1: number;
    /** @internal */
    currentDrag2: number;
    /** @internal */
    randomNoiseCoordinates1: Nullable<Vector3>;
    /** @internal */
    randomNoiseCoordinates2: Nullable<Vector3>;
    /** @internal */
    localPosition?: Vector3;
    /**
     * Callback triggered when the particle is reset
     */
    onReset: Nullable<() => void>;
    /** @internal */
    reset(): void;
}
/**
 * A particle represents one of the element emitted by a particle system.
 * This is mainly define by its coordinates, direction, velocity and age.
 */
export declare class Particle {
    /**
     * The particle system the particle belongs to.
     */
    particleSystem: ThinParticleSystem;
    private static _Count;
    /**
     * Unique ID of the particle
     */
    id: number;
    /**
     * The world position of the particle in the scene.
     */
    position: Vector3;
    /**
     * The world direction of the particle in the scene.
     */
    direction: Vector3;
    /**
     * The color of the particle.
     */
    color: Color4;
    /**
     * The color change of the particle per step.
     */
    colorStep: Color4;
    /**
     * The creation color of the particle.
     */
    initialColor: Color4;
    /**
     * The color used when the end of life of the particle.
     */
    colorDead: Color4;
    /**
     * Defines how long will the life of the particle be.
     */
    lifeTime: number;
    /**
     * The current age of the particle.
     */
    age: number;
    /**
     * The current size of the particle.
     */
    size: number;
    /**
     * The current scale of the particle.
     */
    scale: Vector2;
    /**
     * The current angle of the particle.
     */
    angle: number;
    /**
     * Defines how fast is the angle changing.
     */
    angularSpeed: number;
    /**
     * Defines the cell index used by the particle to be rendered from a sprite.
     */
    cellIndex: number;
    /**
     * The information required to support color remapping
     */
    remapData: Vector4;
    /**
     * Gets or sets an object used to store user defined information for the particle
     */
    metadata: any;
    /** @internal */
    _properties: ParticleInternalProperties;
    /**
     * Creates a new instance Particle
     * @param particleSystem the particle system the particle belongs to
     */
    constructor(
    /**
     * The particle system the particle belongs to.
     */
    particleSystem: ThinParticleSystem);
    private _updateCellInfoFromSystem;
    /**
     * Defines how the sprite cell index is updated for the particle
     */
    updateCellIndex(): void;
    /**
     * @internal
     */
    _inheritParticleInfoToSubEmitter(subEmitter: SubEmitter): void;
    /** @internal */
    _inheritParticleInfoToSubEmitters(): void;
    /** @internal */
    _reset(): void;
    /**
     * Copy the properties of particle to another one.
     * @param other the particle to copy the information to.
     */
    copyTo(other: Particle): void;
}
export {};

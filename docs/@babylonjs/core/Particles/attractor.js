import { Vector3 } from "../Maths/math.vector.pure.js";
const ToAttractor = Vector3.Zero();
const Force = Vector3.Zero();
const ScaledForce = Vector3.Zero();
/**
 * Class representing an attractor in a particle system.
 * #DEZ79M#40
 */
export class Attractor {
    constructor() {
        /**
         * Gets or sets the strength of the attractor.
         * A positive value attracts particles, while a negative value repels them.
         */
        this.strength = 0.0;
        /**
         * Gets or sets the position of the attractor in 3D space.
         */
        this.position = Vector3.Zero();
    }
    /** @internal */
    _processParticle(particle, system) {
        this.position.subtractToRef(particle.position, ToAttractor);
        const distanceSquared = ToAttractor.lengthSquared() + 1; // Avoid going under 1.0
        ToAttractor.normalize().scaleToRef(this.strength / distanceSquared, Force);
        Force.scaleToRef(system._tempScaledUpdateSpeed, ScaledForce);
        particle.direction.addInPlace(ScaledForce); // Update particle velocity
    }
    /**
     * Serializes the attractor to a JSON object.
     * @returns The serialized JSON object.
     */
    serialize() {
        return {
            position: this.position.asArray(),
            strength: this.strength,
        };
    }
}
//# sourceMappingURL=attractor.js.map
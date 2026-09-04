/** This file must only contain pure code and pure imports */
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { _CreateLocalPositionData } from "./emitters.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide a flow of particles emitted from a cylinder shape.
 * DirectionRandomizer will be used for the particles initial direction unless both direction1 and direction2 are connected.
 */
export class CylinderShapeBlock extends NodeParticleBlock {
    /**
     * Create a new CylinderShapeBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._tempVector = Vector3.Zero();
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("radius", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerInput("height", NodeParticleBlockConnectionPointTypes.Float, true, 1, 0);
        this.registerInput("radiusRange", NodeParticleBlockConnectionPointTypes.Float, true, 1, 0, 1);
        this.registerInput("directionRandomizer", NodeParticleBlockConnectionPointTypes.Float, true, 0, 0, 1);
        this.registerInput("direction1", NodeParticleBlockConnectionPointTypes.Vector3, true);
        this.registerInput("direction2", NodeParticleBlockConnectionPointTypes.Vector3, true);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "CylinderShapeBlock";
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the radius input component
     */
    get radius() {
        return this._inputs[1];
    }
    /**
     * Gets the height input component
     */
    get height() {
        return this._inputs[2];
    }
    /**
     * Gets the radiusRange input component
     */
    get radiusRange() {
        return this._inputs[3];
    }
    /**
     * Gets the directionRandomizer input component
     */
    get directionRandomizer() {
        return this._inputs[4];
    }
    /**
     * Gets the direction1 input component
     */
    get direction1() {
        return this._inputs[5];
    }
    /**
     * Gets the direction2 input component
     */
    get direction2() {
        return this._inputs[6];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Builds the block
     * @param state defines the build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        system._directionCreation.process = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            // We always use directionRandomizer unless both directions are connected
            if (this.direction1.isConnected === false || this.direction2.isConnected === false) {
                const directionRandomizer = this.directionRandomizer.getConnectedValue(state);
                particle.position.subtractToRef(state.emitterPosition, this._tempVector);
                this._tempVector.normalize();
                if (state.emitterInverseWorldMatrix) {
                    Vector3.TransformNormalToRef(this._tempVector, state.emitterInverseWorldMatrix, this._tempVector);
                }
                const randY = RandomRange(-directionRandomizer / 2, directionRandomizer / 2);
                let angle = Math.atan2(this._tempVector.x, this._tempVector.z);
                angle += RandomRange(-Math.PI / 2, Math.PI / 2) * directionRandomizer;
                this._tempVector.y = randY; // set direction y to rand y to mirror normal of cylinder surface
                this._tempVector.x = Math.sin(angle);
                this._tempVector.z = Math.cos(angle);
                this._tempVector.normalize();
                if (system.isLocal) {
                    particle.direction.copyFrom(this._tempVector);
                }
                else {
                    Vector3.TransformNormalFromFloatsToRef(this._tempVector.x, this._tempVector.y, this._tempVector.z, state.emitterWorldMatrix, particle.direction);
                }
            }
            else {
                const direction1 = this.direction1.getConnectedValue(state);
                const direction2 = this.direction2.getConnectedValue(state);
                const randX = RandomRange(direction1.x, direction2.x);
                const randY = RandomRange(direction1.y, direction2.y);
                const randZ = RandomRange(direction1.z, direction2.z);
                if (system.isLocal) {
                    particle.direction.copyFromFloats(randX, randY, randZ);
                }
                else {
                    Vector3.TransformNormalFromFloatsToRef(randX, randY, randZ, state.emitterWorldMatrix, particle.direction);
                }
            }
            particle._properties.initialDirection = particle.direction.clone();
        };
        system._positionCreation.process = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            const height = this.height.getConnectedValue(state);
            const radiusRange = this.radiusRange.getConnectedValue(state);
            const radius = this.radius.getConnectedValue(state);
            const yPos = RandomRange(-height / 2, height / 2);
            const angle = RandomRange(0, 2 * Math.PI);
            // Pick a properly distributed point within the circle https://programming.guide/random-point-within-circle.html
            const radiusDistribution = RandomRange((1 - radiusRange) * (1 - radiusRange), 1);
            const positionRadius = Math.sqrt(radiusDistribution) * radius;
            const xPos = positionRadius * Math.cos(angle);
            const zPos = positionRadius * Math.sin(angle);
            if (system.isLocal) {
                particle.position.copyFromFloats(xPos, yPos, zPos);
            }
            else {
                Vector3.TransformCoordinatesFromFloatsToRef(xPos, yPos, zPos, state.emitterWorldMatrix, particle.position);
            }
            _CreateLocalPositionData(particle);
        };
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for cylinderShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCylinderShapeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CylinderShapeBlock", CylinderShapeBlock);
}
//# sourceMappingURL=cylinderShapeBlock.pure.js.map
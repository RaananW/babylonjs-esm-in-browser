/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { _CreateLocalPositionData } from "./emitters.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide a flow of particles emitted from a point.
 */
export class PointShapeBlock extends NodeParticleBlock {
    /**
     * Create a new PointShapeBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("direction1", NodeParticleBlockConnectionPointTypes.Vector3, true, new Vector3(0, 1.0, 0));
        this.registerInput("direction2", NodeParticleBlockConnectionPointTypes.Vector3, true, new Vector3(0, 1.0, 0));
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "PointShapeBlock";
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the direction1 input component
     */
    get direction1() {
        return this._inputs[1];
    }
    /**
     * Gets the direction2 input component
     */
    get direction2() {
        return this._inputs[2];
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
            particle._properties.initialDirection = particle.direction.clone();
        };
        system._positionCreation.process = (particle) => {
            state.systemContext = system;
            if (system.isLocal) {
                particle.position.copyFromFloats(0, 0, 0);
            }
            else {
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, 0, state.emitterWorldMatrix, particle.position);
            }
            _CreateLocalPositionData(particle);
        };
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for pointShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPointShapeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.PointShapeBlock", PointShapeBlock);
}
//# sourceMappingURL=pointShapeBlock.pure.js.map
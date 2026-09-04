/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { ParticleSystem } from "../../../particleSystem.pure.js";
import { Color4 } from "../../../../Maths/math.color.pure.js";
import { Vector2 } from "../../../../Maths/math.vector.pure.js";
import { PointParticleEmitter } from "../../../EmitterTypes/pointParticleEmitter.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
const ColorDiff = /*#__PURE__*/ new Color4();
/**
 * @internal
 */
export class CreateParticleBlock extends NodeParticleBlock {
    /**
     * Create a new CreateParticleBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("emitPower", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerInput("lifeTime", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerInput("color", NodeParticleBlockConnectionPointTypes.Color4, true, new Color4(1, 1, 1, 1));
        this.registerInput("colorDead", NodeParticleBlockConnectionPointTypes.Color4, true, new Color4(0, 0, 0, 0));
        this.registerInput("scale", NodeParticleBlockConnectionPointTypes.Vector2, true, new Vector2(1, 1));
        this.registerInput("angle", NodeParticleBlockConnectionPointTypes.Float, true, 0);
        this.registerInput("size", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerOutput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.scale.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "CreateParticleBlock";
    }
    /**
     * Gets the emitPower input component
     */
    get emitPower() {
        return this._inputs[0];
    }
    /**
     * Gets the lifeTime input component
     */
    get lifeTime() {
        return this._inputs[1];
    }
    /**
     * Gets the color input component
     */
    get color() {
        return this._inputs[2];
    }
    /**
     * Gets the color dead input component
     */
    get colorDead() {
        return this._inputs[3];
    }
    /**
     * Gets the scale input component
     */
    get scale() {
        return this._inputs[4];
    }
    /**
     * Gets the angle input component
     */
    get angle() {
        return this._inputs[5];
    }
    /**
     * Gets the size component
     */
    get size() {
        return this._inputs[6];
    }
    /**
     * Gets the particle output component
     */
    get particle() {
        return this._outputs[0];
    }
    /**
     * @internal
     */
    _build(state) {
        const system = new ParticleSystem(this.name, state.capacity, state.scene, null, false, undefined, true);
        system.particleEmitterType = new PointParticleEmitter();
        // Creation
        system._lifeTimeCreation.process = (particle, system) => {
            state.particleContext = particle;
            particle.lifeTime = this.lifeTime.getConnectedValue(state);
            system._emitPower = this.emitPower.getConnectedValue(state);
        };
        system._colorCreation.process = (particle) => {
            state.particleContext = particle;
            const color = this.color.getConnectedValue(state);
            if (color !== undefined) {
                particle.color.copyFrom(color);
            }
        };
        system._colorDeadCreation.process = (particle) => {
            state.particleContext = particle;
            particle.colorDead.copyFrom(this.colorDead.getConnectedValue(state));
            particle.initialColor.copyFrom(particle.color);
            particle.colorDead.subtractToRef(particle.initialColor, ColorDiff);
            ColorDiff.scaleToRef(1.0 / particle.lifeTime, particle.colorStep);
        };
        system._sizeCreation.process = (particle) => {
            state.particleContext = particle;
            const size = this.size.getConnectedValue(state);
            if (size !== undefined) {
                particle.size = size;
            }
            else {
                particle.size = 1.0;
            }
            const scale = this.scale.getConnectedValue(state);
            if (scale.x !== undefined) {
                particle.scale.x = scale.x;
                particle.scale.y = scale.y;
            }
            else {
                particle.scale.x = scale;
                particle.scale.y = scale;
            }
        };
        system._angleCreation.process = (particle) => {
            state.particleContext = particle;
            particle.angle = this.angle.getConnectedValue(state);
        };
        this.particle._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for createParticleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCreateParticleBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CreateParticleBlock", CreateParticleBlock);
}
//# sourceMappingURL=createParticleBlock.pure.js.map
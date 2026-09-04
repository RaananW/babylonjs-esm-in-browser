/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update the scale of a particle
 */
export class UpdateScaleBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateScaleBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("scale", NodeParticleBlockConnectionPointTypes.Vector2);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the scale input component
     */
    get scale() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "UpdateScaleBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.scale.isConnected) {
            return;
        }
        const processScale = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.scale.copyFrom(this.scale.getConnectedValue(state));
        };
        const scaleProcessing = {
            process: processScale,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(scaleProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = scaleProcessing;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for updateScaleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateScaleBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateScaleBlock", UpdateScaleBlock);
}
//# sourceMappingURL=updateScaleBlock.pure.js.map
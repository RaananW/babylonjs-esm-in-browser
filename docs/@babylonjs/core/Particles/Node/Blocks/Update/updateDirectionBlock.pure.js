/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update the direction of a particle
 */
export class UpdateDirectionBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateDirectionBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("direction", NodeParticleBlockConnectionPointTypes.Vector3);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the direction input component
     */
    get direction() {
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
        return "UpdateDirectionBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.direction.isConnected) {
            return;
        }
        const processDirection = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.direction.copyFrom(this.direction.getConnectedValue(state));
        };
        const directionProcessing = {
            process: processDirection,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(directionProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = directionProcessing;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for updateDirectionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateDirectionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateDirectionBlock", UpdateDirectionBlock);
}
//# sourceMappingURL=updateDirectionBlock.pure.js.map
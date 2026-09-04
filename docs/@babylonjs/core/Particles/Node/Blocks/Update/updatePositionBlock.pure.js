/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update the position of a particle
 */
export class UpdatePositionBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateDirectionBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("position", NodeParticleBlockConnectionPointTypes.Vector3);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the position input component
     */
    get position() {
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
        return "UpdatePositionBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.position.isConnected) {
            return;
        }
        const processPosition = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.position.copyFrom(this.position.getConnectedValue(state));
        };
        const positionProcessing = {
            process: processPosition,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(positionProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = positionProcessing;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for updatePositionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdatePositionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdatePositionBlock", UpdatePositionBlock);
}
//# sourceMappingURL=updatePositionBlock.pure.js.map
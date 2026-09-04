/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update the size of a particle
 */
export class UpdateSizeBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateSizeBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("size", NodeParticleBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the size input component
     */
    get size() {
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
        return "UpdateSizeBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.size.isConnected) {
            return;
        }
        const processSize = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.size = this.size.getConnectedValue(state);
        };
        const sizeProcessing = {
            process: processSize,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(sizeProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = sizeProcessing;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for updateSizeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateSizeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateSizeBlock", UpdateSizeBlock);
}
//# sourceMappingURL=updateSizeBlock.pure.js.map
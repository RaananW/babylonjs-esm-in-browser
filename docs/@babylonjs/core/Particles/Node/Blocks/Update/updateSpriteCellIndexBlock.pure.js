/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update the sprite cell index of a particle
 */
export class UpdateSpriteCellIndexBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateSpriteCellIndexBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("cellIndex", NodeParticleBlockConnectionPointTypes.Int);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
        this.cellIndex.acceptedConnectionPointTypes = [NodeParticleBlockConnectionPointTypes.Float];
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the cellIndex input component
     */
    get cellIndex() {
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
        return "UpdateSpriteCellIndexBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.cellIndex.isConnected) {
            return;
        }
        const processSpriteCellIndex = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.cellIndex = Math.floor(this.cellIndex.getConnectedValue(state));
        };
        const spriteCellIndexProcessing = {
            process: processSpriteCellIndex,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(spriteCellIndexProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = spriteCellIndexProcessing;
        }
    }
}
let _Registered = false;
/**
 * Register side effects for updateSpriteCellIndexBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateSpriteCellIndexBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateSpriteCellIndexBlock", UpdateSpriteCellIndexBlock);
}
//# sourceMappingURL=updateSpriteCellIndexBlock.pure.js.map
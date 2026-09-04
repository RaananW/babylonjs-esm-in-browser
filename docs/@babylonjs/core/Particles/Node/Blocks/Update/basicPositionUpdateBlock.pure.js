/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide the basic update functionality for particles.
 */
export class BasicPositionUpdateBlock extends NodeParticleBlock {
    /**
     * Create a new BasicPositionUpdateBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
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
        return "BasicPositionUpdateBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const processPosition = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.direction.scaleToRef(particle._properties.directionScale, particle._properties.scaledDirection);
            particle.position.addInPlace(particle._properties.scaledDirection);
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
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for basicPositionUpdateBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBasicPositionUpdateBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.BasicPositionUpdateBlock", BasicPositionUpdateBlock);
}
//# sourceMappingURL=basicPositionUpdateBlock.pure.js.map
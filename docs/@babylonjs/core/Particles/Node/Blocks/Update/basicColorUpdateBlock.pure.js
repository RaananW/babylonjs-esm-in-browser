/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide the basic update functionality for particle colors.
 */
export class BasicColorUpdateBlock extends NodeParticleBlock {
    /**
     * Create a new BasicColorUpdateBlock
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
        return "BasicColorUpdateBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const processColor = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.colorStep.scaleToRef(system._scaledUpdateSpeed, system._scaledColorStep);
            particle.color.addInPlace(system._scaledColorStep);
            if (particle.color.a < 0) {
                particle.color.a = 0;
            }
        };
        const colorProcessing = {
            process: processColor,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(colorProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = colorProcessing;
        }
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for basicColorUpdateBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBasicColorUpdateBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.BasicColorUpdateBlock", BasicColorUpdateBlock);
}
//# sourceMappingURL=basicColorUpdateBlock.pure.js.map
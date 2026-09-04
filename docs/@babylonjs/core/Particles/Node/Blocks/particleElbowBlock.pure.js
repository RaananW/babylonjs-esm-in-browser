/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used as a pass through
 */
export class ParticleElbowBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleElbowBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleElbowBlock";
    }
    /**
     * Gets the input component
     */
    get input() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build(state) {
        super._build(state);
        const output = this._outputs[0];
        const input = this._inputs[0];
        output._storedFunction = (state) => {
            return input.getConnectedValue(state);
        };
    }
}
let _Registered = false;
/**
 * Register side effects for particleElbowBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleElbowBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleElbowBlock", ParticleElbowBlock);
}
//# sourceMappingURL=particleElbowBlock.pure.js.map
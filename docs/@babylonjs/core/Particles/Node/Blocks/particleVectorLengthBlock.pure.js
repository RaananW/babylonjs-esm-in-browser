/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to compute vector length
 */
export class ParticleVectorLengthBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleVectorLengthBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Float);
        this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Vector2 | NodeParticleBlockConnectionPointTypes.Vector3);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleVectorLengthBlock";
    }
    /**
     * Gets the input operand input component
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
    _build() {
        if (!this.input.isConnected) {
            this.output._storedFunction = null;
            this.output._storedValue = null;
            return;
        }
        this.output._storedFunction = (state) => {
            const input = this.input.getConnectedValue(state);
            return input.length();
        };
    }
}
let _Registered = false;
/**
 * Register side effects for particleVectorLengthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleVectorLengthBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleVectorLengthBlock", ParticleVectorLengthBlock);
}
//# sourceMappingURL=particleVectorLengthBlock.pure.js.map
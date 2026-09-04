/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to step a value
 */
export class StepBlock extends NodeMaterialBlock {
    /**
     * Creates a new StepBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("value", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerInput("edge", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "StepBlock";
    }
    /**
     * Gets the value operand input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the edge operand input component
     */
    get edge() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += state._declareOutput(output) + ` = step(${this.edge.associatedVariableName}, ${this.value.associatedVariableName});\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for stepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStepBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.StepBlock", StepBlock);
}
//# sourceMappingURL=stepBlock.pure.js.map
/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to get the opposite (1 - x) of a value
 */
export class OneMinusBlock extends NodeMaterialBlock {
    /**
     * Creates a new OneMinusBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._outputs[0].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "OneMinusBlock";
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
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += state._declareOutput(output) + ` = 1. - ${this.input.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for oneMinusBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterOneMinusBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.OneMinusBlock", OneMinusBlock);
    RegisterClass("BABYLON.OppositeBlock", OneMinusBlock);
}
//# sourceMappingURL=oneMinusBlock.pure.js.map
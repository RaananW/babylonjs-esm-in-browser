/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to scale a vector by a float
 */
export class ScaleBlock extends NodeMaterialBlock {
    /**
     * Creates a new ScaleBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("factor", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ScaleBlock";
    }
    /**
     * Gets the input component
     */
    get input() {
        return this._inputs[0];
    }
    /**
     * Gets the factor input component
     */
    get factor() {
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
        state.compilationString += state._declareOutput(output) + ` = ${this.input.associatedVariableName} * ${this.factor.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for scaleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterScaleBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ScaleBlock", ScaleBlock);
}
//# sourceMappingURL=scaleBlock.pure.js.map
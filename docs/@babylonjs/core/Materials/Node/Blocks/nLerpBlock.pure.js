/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to normalize lerp between 2 values
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class NLerpBlock extends NodeMaterialBlock {
    /**
     * Creates a new NLerpBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("left", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("right", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("gradient", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._linkConnectionTypes(0, 1);
        this._linkConnectionTypes(1, 2, true);
        this._inputs[2].acceptedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NLerpBlock";
    }
    /**
     * Gets the left operand input component
     */
    get left() {
        return this._inputs[0];
    }
    /**
     * Gets the right operand input component
     */
    get right() {
        return this._inputs[1];
    }
    /**
     * Gets the gradient operand input component
     */
    get gradient() {
        return this._inputs[2];
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
        state.compilationString +=
            state._declareOutput(output) +
                ` = normalize(mix(${this.left.associatedVariableName} , ${this.right.associatedVariableName}, ${this.gradient.associatedVariableName}));\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for nLerpBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterNLerpBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NLerpBlock", NLerpBlock);
}
//# sourceMappingURL=nLerpBlock.pure.js.map
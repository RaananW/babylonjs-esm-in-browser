/** This file must only contain pure code and pure imports */
import { BaseMathBlock } from "./baseMathBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to divide 2 vectors
 */
export class DivideBlock extends BaseMathBlock {
    /**
     * Creates a new DivideBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "DivideBlock";
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += state._declareOutput(output) + ` = ${this.left.associatedVariableName} / ${this.right.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for divideBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDivideBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.DivideBlock", DivideBlock);
}
//# sourceMappingURL=divideBlock.pure.js.map
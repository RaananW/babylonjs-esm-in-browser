/** This file must only contain pure code and pure imports */
import { BaseMathBlock } from "./baseMathBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to subtract 2 vectors
 */
export class SubtractBlock extends BaseMathBlock {
    /**
     * Creates a new SubtractBlock
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
        return "SubtractBlock";
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += state._declareOutput(output) + ` = ${this.left.associatedVariableName} - ${this.right.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for subtractBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSubtractBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SubtractBlock", SubtractBlock);
}
//# sourceMappingURL=subtractBlock.pure.js.map
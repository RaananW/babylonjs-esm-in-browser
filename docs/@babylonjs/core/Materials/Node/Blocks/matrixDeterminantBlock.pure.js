/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to compute the determinant of a matrix
 */
export class MatrixDeterminantBlock extends NodeMaterialBlock {
    /**
     * Creates a new MatrixDeterminantBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("input", NodeMaterialBlockConnectionPointTypes.Matrix);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "MatrixDeterminantBlock";
    }
    /**
     * Gets the input matrix
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
        const output = this.output;
        const input = this.input;
        state.compilationString += state._declareOutput(output) + ` = determinant(${input.associatedVariableName});\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for matrixDeterminantBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMatrixDeterminantBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MatrixDeterminantBlock", MatrixDeterminantBlock);
}
//# sourceMappingURL=matrixDeterminantBlock.pure.js.map
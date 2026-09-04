/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to compose two matrices
 */
export class MatrixComposeBlock extends NodeGeometryBlock {
    /**
     * Create a new MatrixComposeBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("matrix0", NodeGeometryBlockConnectionPointTypes.Matrix);
        this.registerInput("matrix1", NodeGeometryBlockConnectionPointTypes.Matrix);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "MatrixComposeBlock";
    }
    /**
     * Gets the matrix0 input component
     */
    get matrix0() {
        return this._inputs[0];
    }
    /**
     * Gets the matrix1 input component
     */
    get matrix1() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock() {
        this.output._storedFunction = (state) => {
            if (!this.matrix0.isConnected || !this.matrix1.isConnected) {
                return null;
            }
            const matrix0 = this.matrix0.getConnectedValue(state);
            const matrix1 = this.matrix1.getConnectedValue(state);
            if (!matrix0 || !matrix1) {
                return null;
            }
            return matrix0.multiply(matrix1);
        };
    }
}
let _Registered = false;
/**
 * Register side effects for matrixComposeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMatrixComposeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MatrixComposeBlock", MatrixComposeBlock);
}
//# sourceMappingURL=matrixComposeBlock.pure.js.map
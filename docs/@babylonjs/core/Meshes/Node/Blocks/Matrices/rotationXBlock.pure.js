/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { Matrix } from "../../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to get a rotation matrix on X Axis
 */
export class RotationXBlock extends NodeGeometryBlock {
    /**
     * Create a new RotationXBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("angle", NodeGeometryBlockConnectionPointTypes.Float, true, 0);
        this.registerOutput("matrix", NodeGeometryBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "RotationXBlock";
    }
    /**
     * Gets the angle input component
     */
    get angle() {
        return this._inputs[0];
    }
    /**
     * Gets the matrix output component
     */
    get matrix() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        this.matrix._storedFunction = (state) => {
            return Matrix.RotationX(this.angle.getConnectedValue(state));
        };
    }
}
let _Registered = false;
/**
 * Register side effects for rotationXBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRotationXBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RotationXBlock", RotationXBlock);
}
//# sourceMappingURL=rotationXBlock.pure.js.map
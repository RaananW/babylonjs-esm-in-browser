/** This file must only contain pure code and pure imports */
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { GeometryInputBlock } from "../geometryInputBlock.pure.js";
import { Matrix, Vector3 } from "../../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to get a scaling matrix
 */
export class ScalingBlock extends NodeGeometryBlock {
    /**
     * Create a new ScalingBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("scale", NodeGeometryBlockConnectionPointTypes.Vector3, false, Vector3.One());
        this.registerOutput("matrix", NodeGeometryBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ScalingBlock";
    }
    /**
     * Gets the scale input component
     */
    get scale() {
        return this._inputs[0];
    }
    /**
     * Gets the matrix output component
     */
    get matrix() {
        return this._outputs[0];
    }
    /** @internal */
    autoConfigure() {
        if (!this.scale.isConnected) {
            const scaleInput = new GeometryInputBlock("Scale");
            scaleInput.value = new Vector3(1, 1, 1);
            scaleInput.output.connectTo(this.scale);
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        this.matrix._storedFunction = (state) => {
            const value = this.scale.getConnectedValue(state);
            return Matrix.Scaling(value.x, value.y, value.z);
        };
    }
}
let _Registered = false;
/**
 * Register side effects for scalingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterScalingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ScalingBlock", ScalingBlock);
}
//# sourceMappingURL=scalingBlock.pure.js.map
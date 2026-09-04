/** This file must only contain pure code and pure imports */
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to get the length of a vector
 */
export class GeometryLengthBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryLengthBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("value", NodeGeometryBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Float);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Int);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Float);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GeometryLengthBlock";
    }
    /**
     * Gets the value input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock() {
        if (!this.value.isConnected) {
            this.output._storedFunction = null;
            this.output._storedValue = null;
            return;
        }
        this.output._storedFunction = (state) => {
            const value = this.value.getConnectedValue(state);
            return value.length();
        };
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for geometryLengthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryLengthBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryLengthBlock", GeometryLengthBlock);
}
//# sourceMappingURL=geometryLengthBlock.pure.js.map
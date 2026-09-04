/** This file must only contain pure code and pure imports */
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to normalize vectors
 */
export class NormalizeVectorBlock extends NodeGeometryBlock {
    /**
     * Creates a new NormalizeVectorBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("input", NodeGeometryBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Float);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Matrix);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Geometry);
        this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NormalizeVectorBlock";
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
        this.output._storedFunction = null;
        if (!this.input.isConnected) {
            this.output._storedValue = null;
            return;
        }
        this.output._storedFunction = (state) => this.input.getConnectedValue(state).normalize();
    }
}
let _Registered = false;
/**
 * Register side effects for normalizeVectorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterNormalizeVectorBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NormalizeVectorBlock", NormalizeVectorBlock);
}
//# sourceMappingURL=normalizeVectorBlock.pure.js.map
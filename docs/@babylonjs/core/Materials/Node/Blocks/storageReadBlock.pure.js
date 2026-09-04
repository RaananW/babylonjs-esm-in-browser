/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { LoopBlock } from "./loopBlock.pure.js";
import { NodeMaterialConnectionPointCustomObject } from "../nodeMaterialConnectionPointCustomObject.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to read from a variable within a loop
 */
export class StorageReadBlock extends NodeMaterialBlock {
    /**
     * Creates a new StorageReadBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("loopID", NodeMaterialBlockConnectionPointTypes.Object, false, undefined, new NodeMaterialConnectionPointCustomObject("loopID", this, 0 /* NodeMaterialConnectionPointDirection.Input */, LoopBlock, "LoopBlock"));
        this.registerOutput("value", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this._outputs[0]._linkedConnectionSource = this._inputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "StorageReadBlock";
    }
    /**
     * Gets the loop link component
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get loopID() {
        return this._inputs[0];
    }
    /**
     * Gets the value component
     */
    get value() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const value = this.value;
        if (!this.loopID.isConnected) {
            return this;
        }
        const loopBlock = this.loopID.connectedPoint.ownerBlock;
        state.compilationString += state._declareOutput(value) + ` = ${loopBlock.output.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for storageReadBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStorageReadBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.StorageReadBlock", StorageReadBlock);
}
//# sourceMappingURL=storageReadBlock.pure.js.map
/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { LoopBlock } from "./loopBlock.pure.js";
import { NodeMaterialConnectionPointCustomObject } from "../nodeMaterialConnectionPointCustomObject.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to write to a variable within a loop
 */
export class StorageWriteBlock extends NodeMaterialBlock {
    /**
     * Creates a new StorageWriteBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("loopID", NodeMaterialBlockConnectionPointTypes.Object, false, undefined, new NodeMaterialConnectionPointCustomObject("loopID", this, 0 /* NodeMaterialConnectionPointDirection.Input */, LoopBlock, "LoopBlock"));
        this.registerInput("value", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this._linkConnectionTypes(0, 1);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "StorageWriteBlock";
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
        return this._inputs[1];
    }
    /** Gets a boolean indicating that this connection will be used in the fragment shader
     * @returns true if connected in fragment shader
     */
    isConnectedInFragmentShader() {
        if (!this.loopID.isConnected) {
            return false;
        }
        const loopBlock = this.loopID.connectedPoint.ownerBlock;
        return loopBlock.output.isConnectedInFragmentShader;
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const value = this.value;
        if (!this.loopID.isConnected) {
            return this;
        }
        const loopBlock = this.loopID.connectedPoint.ownerBlock;
        state.compilationString += `${loopBlock.output.associatedVariableName} = ${value.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for storageWriteBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStorageWriteBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.StorageWriteBlock", StorageWriteBlock);
}
//# sourceMappingURL=storageWriteBlock.pure.js.map
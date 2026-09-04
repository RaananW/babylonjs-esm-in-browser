/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to get a random number
 */
export class RandomNumberBlock extends NodeMaterialBlock {
    /**
     * Creates a new RandomNumberBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("seed", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Float);
        this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Vector2 |
            NodeMaterialBlockConnectionPointTypes.Vector3 |
            NodeMaterialBlockConnectionPointTypes.Vector4 |
            NodeMaterialBlockConnectionPointTypes.Color3 |
            NodeMaterialBlockConnectionPointTypes.Color4);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "RandomNumberBlock";
    }
    /**
     * Gets the seed input component
     */
    get seed() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync(state.shaderLanguage);
    }
    async _initShaderSourceAsync(shaderLanguage) {
        this._codeIsReady = false;
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            await import("../../../ShadersWGSL/ShadersInclude/helperFunctions.js");
        }
        else {
            await import("../../../Shaders/ShadersInclude/helperFunctions.js");
        }
        this._codeIsReady = true;
        this.onCodeIsReadyObservable.notifyObservers(this);
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("helperFunctions", comments);
        state.compilationString += state._declareOutput(output) + ` = getRand(${this.seed.associatedVariableName}.xy);\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for randomNumberBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRandomNumberBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RandomNumberBlock", RandomNumberBlock);
}
//# sourceMappingURL=randomNumberBlock.pure.js.map
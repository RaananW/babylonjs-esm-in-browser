/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { ImageSourceBlock } from "./Dual/imageSourceBlock.pure.js";
import { NodeMaterialConnectionPointCustomObject } from "../nodeMaterialConnectionPointCustomObject.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Custom block created from user-defined json
 */
export class CustomBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the options for this custom block
     */
    get options() {
        return this._options;
    }
    set options(options) {
        this._deserializeOptions(options);
    }
    /**
     * Creates a new CustomBlock
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
        return "CustomBlock";
    }
    _buildBlock(state) {
        super._buildBlock(state);
        let code = this._code;
        let functionName = this._options.functionName;
        // Replace the TYPE_XXX placeholders (if any)
        for (const input of this._inputs) {
            const rexp = new RegExp("\\{TYPE_" + input.name + "\\}", "gm");
            const type = state._getGLType(input.type);
            code = code.replace(rexp, type);
            functionName = functionName.replace(rexp, type);
        }
        for (const output of this._outputs) {
            const rexp = new RegExp("\\{TYPE_" + output.name + "\\}", "gm");
            const type = state._getGLType(output.type);
            code = code.replace(rexp, type);
            functionName = functionName.replace(rexp, type);
        }
        state._emitFunction(functionName, code, "");
        // Declare the output variables
        for (const output of this._outputs) {
            state.compilationString += state._declareOutput(output) + ";\n";
        }
        // Generate the function call
        state.compilationString += functionName + "(";
        let hasInput = false;
        for (let i = 0; i < this._inputs.length; i++) {
            const input = this._inputs[i];
            if (i > 0) {
                state.compilationString += ", ";
            }
            if (this._inputSamplers && this._inputSamplers.indexOf(input.name) !== -1) {
                state.compilationString += input.connectedPoint?.ownerBlock?.samplerName ?? input.associatedVariableName;
            }
            else {
                state.compilationString += input.associatedVariableName;
            }
            hasInput = true;
        }
        for (let i = 0; i < this._outputs.length; i++) {
            const output = this._outputs[i];
            if (i > 0 || hasInput) {
                state.compilationString += ", ";
            }
            state.compilationString += output.associatedVariableName;
        }
        state.compilationString += ");\n";
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.options = ${JSON.stringify(this._options)};\n`;
        return codeString;
    }
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.options = this._options;
        return serializationObject;
    }
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject, scene, rootUrl) {
        this._deserializeOptions(serializationObject.options);
        super._deserialize(serializationObject, scene, rootUrl);
    }
    _deserializeOptions(options) {
        this._options = options;
        this._code = options.code.join("\n") + "\n";
        this.name = this.name || options.name;
        this.target = NodeMaterialBlockTargets[options.target];
        if (options.inParameters) {
            for (let i = 0; i < options.inParameters.length; i++) {
                const input = options.inParameters[i];
                const type = NodeMaterialBlockConnectionPointTypes[input.type];
                if (input.type === "sampler2D" || input.type === "samplerCube" || input.type === "sampler2DArray") {
                    this._inputSamplers = this._inputSamplers || [];
                    this._inputSamplers.push(input.name);
                    this.registerInput(input.name, NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject(input.name, this, 0 /* NodeMaterialConnectionPointDirection.Input */, ImageSourceBlock, "ImageSourceBlock"));
                }
                else {
                    this.registerInput(input.name, type);
                }
                Object.defineProperty(this, input.name, {
                    get: function () {
                        return this._inputs[i];
                    },
                    enumerable: true,
                    configurable: true,
                });
            }
        }
        if (options.outParameters) {
            for (let i = 0; i < options.outParameters.length; i++) {
                const output = options.outParameters[i];
                this.registerOutput(output.name, NodeMaterialBlockConnectionPointTypes[output.type]);
                Object.defineProperty(this, output.name, {
                    get: function () {
                        return this._outputs[i];
                    },
                    enumerable: true,
                    configurable: true,
                });
                if (output.type === "BasedOnInput") {
                    this._outputs[i]._typeConnectionSource = this._findInputByName(output.typeFromInput)[0];
                }
            }
        }
        if (options.inLinkedConnectionTypes) {
            for (const connection of options.inLinkedConnectionTypes) {
                this._linkConnectionTypes(this._findInputByName(connection.input1)[1], this._findInputByName(connection.input2)[1]);
            }
        }
    }
    _findInputByName(name) {
        if (!name) {
            return null;
        }
        for (let i = 0; i < this._inputs.length; i++) {
            if (this._inputs[i].name === name) {
                return [this._inputs[i], i];
            }
        }
        return null;
    }
}
let _Registered = false;
/**
 * Register side effects for customBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCustomBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CustomBlock", CustomBlock);
}
//# sourceMappingURL=customBlock.pure.js.map
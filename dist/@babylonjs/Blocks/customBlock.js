import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Custom block created from user-defined json
 */
export class CustomBlock extends NodeMaterialBlock {
    /**
     * Creates a new CustomBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
    }
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
        this._inputs.forEach((input) => {
            const rexp = new RegExp("\\{TYPE_" + input.name + "\\}", "gm");
            const type = state._getGLType(input.type);
            code = code.replace(rexp, type);
            functionName = functionName.replace(rexp, type);
        });
        this._outputs.forEach((output) => {
            const rexp = new RegExp("\\{TYPE_" + output.name + "\\}", "gm");
            const type = state._getGLType(output.type);
            code = code.replace(rexp, type);
            functionName = functionName.replace(rexp, type);
        });
        state._emitFunction(functionName, code, "");
        // Declare the output variables
        this._outputs.forEach((output) => {
            state.compilationString += this._declareOutput(output, state) + ";\r\n";
        });
        // Generate the function call
        state.compilationString += functionName + "(";
        let hasInput = false;
        this._inputs.forEach((input, index) => {
            if (index > 0) {
                state.compilationString += ", ";
            }
            state.compilationString += input.associatedVariableName;
            hasInput = true;
        });
        this._outputs.forEach((output, index) => {
            if (index > 0 || hasInput) {
                state.compilationString += ", ";
            }
            state.compilationString += output.associatedVariableName;
        });
        state.compilationString += ");\r\n";
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.options = ${JSON.stringify(this._options)};\r\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.options = this._options;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        this._deserializeOptions(serializationObject.options);
        super._deserialize(serializationObject, scene, rootUrl);
    }
    _deserializeOptions(options) {
        var _a, _b, _c;
        this._options = options;
        this._code = options.code.join("\r\n") + "\r\n";
        this.name = this.name || options.name;
        this.target = NodeMaterialBlockTargets[options.target];
        (_a = options.inParameters) === null || _a === void 0 ? void 0 : _a.forEach((input, index) => {
            const type = NodeMaterialBlockConnectionPointTypes[input.type];
            this.registerInput(input.name, type);
            Object.defineProperty(this, input.name, {
                get: function () {
                    return this._inputs[index];
                },
                enumerable: true,
                configurable: true,
            });
        });
        (_b = options.outParameters) === null || _b === void 0 ? void 0 : _b.forEach((output, index) => {
            this.registerOutput(output.name, NodeMaterialBlockConnectionPointTypes[output.type]);
            Object.defineProperty(this, output.name, {
                get: function () {
                    return this._outputs[index];
                },
                enumerable: true,
                configurable: true,
            });
            if (output.type === "BasedOnInput") {
                this._outputs[index]._typeConnectionSource = this._findInputByName(output.typeFromInput)[0];
            }
        });
        (_c = options.inLinkedConnectionTypes) === null || _c === void 0 ? void 0 : _c.forEach((connection) => {
            this._linkConnectionTypes(this._findInputByName(connection.input1)[1], this._findInputByName(connection.input2)[1]);
        });
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
RegisterClass("BABYLON.CustomBlock", CustomBlock);
//# sourceMappingURL=customBlock.js.map
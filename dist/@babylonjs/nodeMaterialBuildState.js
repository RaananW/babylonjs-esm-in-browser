import { NodeMaterialBlockConnectionPointTypes } from "./Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "./Enums/nodeMaterialBlockTargets.js";
import { Effect } from "../effect.js";
/**
 * Class used to store node based material build state
 */
export class NodeMaterialBuildState {
    constructor() {
        /** Gets or sets a boolean indicating if the current state can emit uniform buffers */
        this.supportUniformBuffers = false;
        /**
         * Gets the list of emitted attributes
         */
        this.attributes = new Array();
        /**
         * Gets the list of emitted uniforms
         */
        this.uniforms = new Array();
        /**
         * Gets the list of emitted constants
         */
        this.constants = new Array();
        /**
         * Gets the list of emitted samplers
         */
        this.samplers = new Array();
        /**
         * Gets the list of emitted functions
         */
        this.functions = {};
        /**
         * Gets the list of emitted extensions
         */
        this.extensions = {};
        /**
         * Gets the list of emitted counters
         */
        this.counters = {};
        /** @internal */
        this._attributeDeclaration = "";
        /** @internal */
        this._uniformDeclaration = "";
        /** @internal */
        this._constantDeclaration = "";
        /** @internal */
        this._samplerDeclaration = "";
        /** @internal */
        this._varyingTransfer = "";
        /** @internal */
        this._injectAtEnd = "";
        this._repeatableContentAnchorIndex = 0;
        /** @internal */
        this._builtCompilationString = "";
        /**
         * Gets the emitted compilation strings
         */
        this.compilationString = "";
    }
    /**
     * Finalize the compilation strings
     * @param state defines the current compilation state
     */
    finalize(state) {
        const emitComments = state.sharedData.emitComments;
        const isFragmentMode = this.target === NodeMaterialBlockTargets.Fragment;
        this.compilationString = `\r\n${emitComments ? "//Entry point\r\n" : ""}void main(void) {\r\n${this.compilationString}`;
        if (this._constantDeclaration) {
            this.compilationString = `\r\n${emitComments ? "//Constants\r\n" : ""}${this._constantDeclaration}\r\n${this.compilationString}`;
        }
        let functionCode = "";
        for (const functionName in this.functions) {
            functionCode += this.functions[functionName] + `\r\n`;
        }
        this.compilationString = `\r\n${functionCode}\r\n${this.compilationString}`;
        if (!isFragmentMode && this._varyingTransfer) {
            this.compilationString = `${this.compilationString}\r\n${this._varyingTransfer}`;
        }
        if (this._injectAtEnd) {
            this.compilationString = `${this.compilationString}\r\n${this._injectAtEnd}`;
        }
        this.compilationString = `${this.compilationString}\r\n}`;
        if (this.sharedData.varyingDeclaration) {
            this.compilationString = `\r\n${emitComments ? "//Varyings\r\n" : ""}${this.sharedData.varyingDeclaration}\r\n${this.compilationString}`;
        }
        if (this._samplerDeclaration) {
            this.compilationString = `\r\n${emitComments ? "//Samplers\r\n" : ""}${this._samplerDeclaration}\r\n${this.compilationString}`;
        }
        if (this._uniformDeclaration) {
            this.compilationString = `\r\n${emitComments ? "//Uniforms\r\n" : ""}${this._uniformDeclaration}\r\n${this.compilationString}`;
        }
        if (this._attributeDeclaration && !isFragmentMode) {
            this.compilationString = `\r\n${emitComments ? "//Attributes\r\n" : ""}${this._attributeDeclaration}\r\n${this.compilationString}`;
        }
        this.compilationString = "precision highp float;\r\n" + this.compilationString;
        for (const extensionName in this.extensions) {
            const extension = this.extensions[extensionName];
            this.compilationString = `\r\n${extension}\r\n${this.compilationString}`;
        }
        this._builtCompilationString = this.compilationString;
    }
    /** @internal */
    get _repeatableContentAnchor() {
        return `###___ANCHOR${this._repeatableContentAnchorIndex++}___###`;
    }
    /**
     * @internal
     */
    _getFreeVariableName(prefix) {
        prefix = prefix.replace(/[^a-zA-Z_]+/g, "");
        if (this.sharedData.variableNames[prefix] === undefined) {
            this.sharedData.variableNames[prefix] = 0;
            // Check reserved words
            if (prefix === "output" || prefix === "texture") {
                return prefix + this.sharedData.variableNames[prefix];
            }
            return prefix;
        }
        else {
            this.sharedData.variableNames[prefix]++;
        }
        return prefix + this.sharedData.variableNames[prefix];
    }
    /**
     * @internal
     */
    _getFreeDefineName(prefix) {
        if (this.sharedData.defineNames[prefix] === undefined) {
            this.sharedData.defineNames[prefix] = 0;
        }
        else {
            this.sharedData.defineNames[prefix]++;
        }
        return prefix + this.sharedData.defineNames[prefix];
    }
    /**
     * @internal
     */
    _excludeVariableName(name) {
        this.sharedData.variableNames[name] = 0;
    }
    /**
     * @internal
     */
    _emit2DSampler(name) {
        if (this.samplers.indexOf(name) < 0) {
            this._samplerDeclaration += `uniform sampler2D ${name};\r\n`;
            this.samplers.push(name);
        }
    }
    /**
     * @internal
     */
    _getGLType(type) {
        switch (type) {
            case NodeMaterialBlockConnectionPointTypes.Float:
                return "float";
            case NodeMaterialBlockConnectionPointTypes.Int:
                return "int";
            case NodeMaterialBlockConnectionPointTypes.Vector2:
                return "vec2";
            case NodeMaterialBlockConnectionPointTypes.Color3:
            case NodeMaterialBlockConnectionPointTypes.Vector3:
                return "vec3";
            case NodeMaterialBlockConnectionPointTypes.Color4:
            case NodeMaterialBlockConnectionPointTypes.Vector4:
                return "vec4";
            case NodeMaterialBlockConnectionPointTypes.Matrix:
                return "mat4";
        }
        return "";
    }
    /**
     * @internal
     */
    _emitExtension(name, extension, define = "") {
        if (this.extensions[name]) {
            return;
        }
        if (define) {
            extension = `#if ${define}\r\n${extension}\r\n#endif`;
        }
        this.extensions[name] = extension;
    }
    /**
     * @internal
     */
    _emitFunction(name, code, comments) {
        if (this.functions[name]) {
            return;
        }
        if (this.sharedData.emitComments) {
            code = comments + `\r\n` + code;
        }
        this.functions[name] = code;
    }
    /**
     * @internal
     */
    _emitCodeFromInclude(includeName, comments, options) {
        if (options && options.repeatKey) {
            return `#include<${includeName}>${options.substitutionVars ? "(" + options.substitutionVars + ")" : ""}[0..${options.repeatKey}]\r\n`;
        }
        let code = Effect.IncludesShadersStore[includeName] + "\r\n";
        if (this.sharedData.emitComments) {
            code = comments + `\r\n` + code;
        }
        if (!options) {
            return code;
        }
        if (options.replaceStrings) {
            for (let index = 0; index < options.replaceStrings.length; index++) {
                const replaceString = options.replaceStrings[index];
                code = code.replace(replaceString.search, replaceString.replace);
            }
        }
        return code;
    }
    /**
     * @internal
     */
    _emitFunctionFromInclude(includeName, comments, options, storeKey = "") {
        const key = includeName + storeKey;
        if (this.functions[key]) {
            return;
        }
        if (!options || (!options.removeAttributes && !options.removeUniforms && !options.removeVaryings && !options.removeIfDef && !options.replaceStrings)) {
            if (options && options.repeatKey) {
                this.functions[key] = `#include<${includeName}>${options.substitutionVars ? "(" + options.substitutionVars + ")" : ""}[0..${options.repeatKey}]\r\n`;
            }
            else {
                this.functions[key] = `#include<${includeName}>${(options === null || options === void 0 ? void 0 : options.substitutionVars) ? "(" + (options === null || options === void 0 ? void 0 : options.substitutionVars) + ")" : ""}\r\n`;
            }
            if (this.sharedData.emitComments) {
                this.functions[key] = comments + `\r\n` + this.functions[key];
            }
            return;
        }
        this.functions[key] = Effect.IncludesShadersStore[includeName];
        if (this.sharedData.emitComments) {
            this.functions[key] = comments + `\r\n` + this.functions[key];
        }
        if (options.removeIfDef) {
            this.functions[key] = this.functions[key].replace(/^\s*?#ifdef.+$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#endif.*$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#else.*$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#elif.*$/gm, "");
        }
        if (options.removeAttributes) {
            this.functions[key] = this.functions[key].replace(/^\s*?attribute.+$/gm, "");
        }
        if (options.removeUniforms) {
            this.functions[key] = this.functions[key].replace(/^\s*?uniform.+$/gm, "");
        }
        if (options.removeVaryings) {
            this.functions[key] = this.functions[key].replace(/^\s*?varying.+$/gm, "");
        }
        if (options.replaceStrings) {
            for (let index = 0; index < options.replaceStrings.length; index++) {
                const replaceString = options.replaceStrings[index];
                this.functions[key] = this.functions[key].replace(replaceString.search, replaceString.replace);
            }
        }
    }
    /**
     * @internal
     */
    _registerTempVariable(name) {
        if (this.sharedData.temps.indexOf(name) !== -1) {
            return false;
        }
        this.sharedData.temps.push(name);
        return true;
    }
    /**
     * @internal
     */
    _emitVaryingFromString(name, type, define = "", notDefine = false) {
        if (this.sharedData.varyings.indexOf(name) !== -1) {
            return false;
        }
        this.sharedData.varyings.push(name);
        if (define) {
            if (define.startsWith("defined(")) {
                this.sharedData.varyingDeclaration += `#if ${define}\r\n`;
            }
            else {
                this.sharedData.varyingDeclaration += `${notDefine ? "#ifndef" : "#ifdef"} ${define}\r\n`;
            }
        }
        this.sharedData.varyingDeclaration += `varying ${type} ${name};\r\n`;
        if (define) {
            this.sharedData.varyingDeclaration += `#endif\r\n`;
        }
        return true;
    }
    /**
     * @internal
     */
    _emitUniformFromString(name, type, define = "", notDefine = false) {
        if (this.uniforms.indexOf(name) !== -1) {
            return;
        }
        this.uniforms.push(name);
        if (define) {
            if (define.startsWith("defined(")) {
                this._uniformDeclaration += `#if ${define}\r\n`;
            }
            else {
                this._uniformDeclaration += `${notDefine ? "#ifndef" : "#ifdef"} ${define}\r\n`;
            }
        }
        this._uniformDeclaration += `uniform ${type} ${name};\r\n`;
        if (define) {
            this._uniformDeclaration += `#endif\r\n`;
        }
    }
    /**
     * @internal
     */
    _emitFloat(value) {
        if (value.toString() === value.toFixed(0)) {
            return `${value}.0`;
        }
        return value.toString();
    }
}
//# sourceMappingURL=nodeMaterialBuildState.js.map
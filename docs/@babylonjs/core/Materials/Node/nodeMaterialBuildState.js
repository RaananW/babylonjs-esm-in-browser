import { NodeMaterialBlockConnectionPointTypes } from "./Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "./Enums/nodeMaterialBlockTargets.js";
import { ShaderStore as EngineShaderStore } from "../../Engines/shaderStore.js";

import { Process } from "../../Engines/Processors/shaderProcessor.js";
import { WebGLShaderProcessor } from "../../Engines/WebGL/webGLShaderProcessors.js";
import { Logger } from "../../Misc/logger.js";
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
        this.attributes = [];
        /**
         * Gets the list of emitted uniforms
         */
        this.uniforms = [];
        /**
         * Gets the list of emitted constants
         */
        this.constants = [];
        /**
         * Gets the list of emitted samplers
         */
        this.samplers = [];
        /**
         * Gets the list of emitted functions
         */
        this.functions = {};
        /**
         * Gets the list of emitted extensions
         */
        this.extensions = {};
        /**
         * Gets the list of emitted prePass outputs - if using the prepass
         */
        this.prePassOutput = {};
        /**
         * Gets the list of emitted counters
         */
        this.counters = {};
        /** @internal */
        this._terminalBlocks = new Set();
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
        /** @internal */
        this._injectAtTop = "";
        /** @internal */
        this._customEntryHeader = "";
        /** @internal */
        this._repeatableContentAnchorIndex = 0;
        /** @internal */
        this._builtCompilationString = "";
        /**
         * Gets the emitted compilation strings
         */
        this.compilationString = "";
    }
    /**
     * Gets the current shader language to use
     */
    get shaderLanguage() {
        return this.sharedData.nodeMaterial.shaderLanguage;
    }
    /** Gets suffix to add behind type casting */
    get fSuffix() {
        return this.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "f" : "";
    }
    /**
     * Returns the processed, compiled shader code
     * @param defines defines to use for the shader processing
     * @returns the raw shader code used by the engine
     */
    async getProcessedShaderAsync(defines) {
        if (!this._builtCompilationString) {
            Logger.Error("getProcessedShaderAsync: Shader not built yet.");
            return "";
        }
        const engine = this.sharedData.nodeMaterial.getScene().getEngine();
        const options = {
            defines: defines.split("\n"),
            indexParameters: undefined,
            isFragment: this.target === NodeMaterialBlockTargets.Fragment,
            shouldUseHighPrecisionShader: engine._shouldUseHighPrecisionShader,
            processor: engine._getShaderProcessor(this.shaderLanguage),
            supportsUniformBuffers: engine.supportsUniformBuffers,
            shadersRepository: EngineShaderStore.GetShadersRepository(this.shaderLanguage),
            includesShadersStore: EngineShaderStore.GetIncludesShadersStore(this.shaderLanguage),
            version: (engine.version * 100).toString(),
            platformName: engine.shaderPlatformName,
            processingContext: null,
            isNDCHalfZRange: engine.isNDCHalfZRange,
            useReverseDepthBuffer: engine.useReverseDepthBuffer,
        };
        // Export WebGL2 shaders with WebGL1 syntax for max compatibility
        if (!engine.isWebGPU && engine.version > 1.0) {
            options.processor = new WebGLShaderProcessor();
        }
        return await new Promise((resolve) => {
            Process(this._builtCompilationString, options, (migratedCode, _) => {
                resolve(migratedCode);
            }, engine);
        });
    }
    /**
     * Finalize the compilation strings
     * @param state defines the current compilation state
     */
    finalize(state) {
        const emitComments = state.sharedData.emitComments;
        const isFragmentMode = this.target === NodeMaterialBlockTargets.Fragment;
        let entryPointString = `\n${emitComments ? "//Entry point\n" : ""}`;
        if (this._customEntryHeader) {
            entryPointString += this._customEntryHeader;
        }
        else if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            if (isFragmentMode) {
                entryPointString += `@fragment\nfn main(input: FragmentInputs) -> FragmentOutputs {\n${this.sharedData.varyingInitializationsFragment}`;
            }
            else {
                entryPointString += `@vertex\nfn main(input: VertexInputs) -> FragmentInputs{\n`;
            }
        }
        else {
            entryPointString += `void main(void) {\n`;
        }
        this.compilationString = entryPointString + this.compilationString;
        if (this._constantDeclaration) {
            this.compilationString = `\n${emitComments ? "//Constants\n" : ""}${this._constantDeclaration}\n${this.compilationString}`;
        }
        let functionCode = "";
        for (const functionName in this.functions) {
            functionCode += this.functions[functionName] + `\n`;
        }
        this.compilationString = `\n${functionCode}\n${this.compilationString}`;
        if (!isFragmentMode && this._varyingTransfer) {
            this.compilationString = `${this.compilationString}\n${this._varyingTransfer}`;
        }
        if (this._injectAtEnd) {
            this.compilationString = `${this.compilationString}\n${this._injectAtEnd}`;
        }
        this.compilationString = `${this.compilationString}\n}`;
        if (this.sharedData.varyingDeclaration) {
            this.compilationString = `\n${emitComments ? "//Varyings\n" : ""}${isFragmentMode ? this.sharedData.varyingDeclarationFragment : this.sharedData.varyingDeclaration}\n${this.compilationString}`;
        }
        if (this._samplerDeclaration) {
            this.compilationString = `\n${emitComments ? "//Samplers\n" : ""}${this._samplerDeclaration}\n${this.compilationString}`;
        }
        if (this._uniformDeclaration) {
            this.compilationString = `\n${emitComments ? "//Uniforms\n" : ""}${this._uniformDeclaration}\n${this.compilationString}`;
        }
        if (this._attributeDeclaration && !isFragmentMode) {
            this.compilationString = `\n${emitComments ? "//Attributes\n" : ""}${this._attributeDeclaration}\n${this.compilationString}`;
        }
        if (this.shaderLanguage !== 1 /* ShaderLanguage.WGSL */) {
            this.compilationString = "precision highp float;\n" + this.compilationString;
            this.compilationString = "#if defined(WEBGL2) || defined(WEBGPU)\nprecision highp sampler2DArray;\n#endif\n" + this.compilationString;
            if (isFragmentMode) {
                this.compilationString =
                    "#if defined(PREPASS)\r\n#extension GL_EXT_draw_buffers : require\r\nlayout(location = 0) out highp vec4 glFragData[SCENE_MRT_COUNT];\r\nhighp vec4 gl_FragColor;\r\n#endif\r\n" +
                        this.compilationString;
            }
            for (const extensionName in this.extensions) {
                const extension = this.extensions[extensionName];
                this.compilationString = `\n${extension}\n${this.compilationString}`;
            }
        }
        if (this._injectAtTop) {
            this.compilationString = `${this._injectAtTop}\n${this.compilationString}`;
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
        prefix = this.sharedData.formatConfig.formatVariablename(prefix);
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
    _emit2DSampler(name, define = "", force = false, annotation, unsignedSampler, precision) {
        if (this.samplers.indexOf(name) < 0 || force) {
            if (define) {
                this._samplerDeclaration += `#if ${define}\n`;
            }
            if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                const unsignedSamplerPrefix = unsignedSampler ? "u" : "f";
                this._samplerDeclaration += `var ${name + `Sampler`}: sampler;\n`;
                this._samplerDeclaration += `var ${name}: texture_2d<${unsignedSamplerPrefix}32>;\n`;
            }
            else {
                const unsignedSamplerPrefix = unsignedSampler ? "u" : "";
                const precisionDecl = precision ?? "";
                this._samplerDeclaration += `uniform ${precisionDecl} ${unsignedSamplerPrefix}sampler2D ${name}; ${annotation ? annotation : ""}\n`;
            }
            if (define) {
                this._samplerDeclaration += `#endif\n`;
            }
            if (!force) {
                this.samplers.push(name);
            }
        }
    }
    /**
     * @internal
     */
    _emitCubeSampler(name, define = "", force = false) {
        if (this.samplers.indexOf(name) < 0 || force) {
            if (define) {
                this._samplerDeclaration += `#if ${define}\n`;
            }
            if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                this._samplerDeclaration += `var ${name + `Sampler`}: sampler;\n`;
                this._samplerDeclaration += `var ${name}: texture_cube<f32>;\n`;
            }
            else {
                this._samplerDeclaration += `uniform samplerCube ${name};\n`;
            }
            if (define) {
                this._samplerDeclaration += `#endif\n`;
            }
            if (!force) {
                this.samplers.push(name);
            }
        }
    }
    /**
     * @internal
     */
    _emit2DArraySampler(name) {
        if (this.samplers.indexOf(name) < 0) {
            if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                this._samplerDeclaration += `var ${name + `Sampler`}: sampler;\n`;
                this._samplerDeclaration += `var ${name}: texture_2d_array<f32>;\n`;
            }
            else {
                this._samplerDeclaration += `uniform sampler2DArray ${name};\n`;
            }
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
    _getShaderType(type) {
        const isWGSL = this.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
        switch (type) {
            case NodeMaterialBlockConnectionPointTypes.Float:
                return isWGSL ? "f32" : "float";
            case NodeMaterialBlockConnectionPointTypes.Int:
                return isWGSL ? "i32" : "int";
            case NodeMaterialBlockConnectionPointTypes.Vector2:
                return isWGSL ? "vec2f" : "vec2";
            case NodeMaterialBlockConnectionPointTypes.Color3:
            case NodeMaterialBlockConnectionPointTypes.Vector3:
                return isWGSL ? "vec3f" : "vec3";
            case NodeMaterialBlockConnectionPointTypes.Color4:
            case NodeMaterialBlockConnectionPointTypes.Vector4:
                return isWGSL ? "vec4f" : "vec4";
            case NodeMaterialBlockConnectionPointTypes.Matrix:
                return isWGSL ? "mat4x4f" : "mat4";
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
            extension = `#if ${define}\n${extension}\n#endif`;
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
            code = comments + `\n` + code;
        }
        this.functions[name] = code;
    }
    /**
     * @internal
     */
    _emitCodeFromInclude(includeName, comments, options) {
        const store = EngineShaderStore.GetIncludesShadersStore(this.shaderLanguage);
        if (options && options.repeatKey) {
            return `#include<${includeName}>${options.substitutionVars ? "(" + options.substitutionVars + ")" : ""}[0..${options.repeatKey}]\n`;
        }
        let code = store[includeName] + "\n";
        if (this.sharedData.emitComments) {
            code = comments + `\n` + code;
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
        const store = EngineShaderStore.GetIncludesShadersStore(this.shaderLanguage);
        if (!options || (!options.removeAttributes && !options.removeUniforms && !options.removeVaryings && !options.removeIfDef && !options.replaceStrings)) {
            if (options && options.repeatKey) {
                this.functions[key] = `#include<${includeName}>${options.substitutionVars ? "(" + options.substitutionVars + ")" : ""}[0..${options.repeatKey}]\n`;
            }
            else {
                this.functions[key] = `#include<${includeName}>${options?.substitutionVars ? "(" + options?.substitutionVars + ")" : ""}\n`;
            }
            if (this.sharedData.emitComments) {
                this.functions[key] = comments + `\n` + this.functions[key];
            }
            return;
        }
        this.functions[key] = store[includeName];
        if (this.sharedData.emitComments) {
            this.functions[key] = comments + `\n` + this.functions[key];
        }
        if (options.removeIfDef) {
            this.functions[key] = this.functions[key].replace(/^\s*?#ifdef.+$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#endif.*$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#else.*$/gm, "");
            this.functions[key] = this.functions[key].replace(/^\s*?#elif.*$/gm, "");
        }
        if (options.removeAttributes) {
            this.functions[key] = this.functions[key].replace(/\s*?attribute .+?;/g, "\n");
        }
        if (options.removeUniforms) {
            this.functions[key] = this.functions[key].replace(/\s*?uniform .*?;/g, "\n");
        }
        if (options.removeVaryings) {
            this.functions[key] = this.functions[key].replace(/\s*?(varying|in) .+?;/g, "\n");
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
    _emitDefineStart(define, notDefine = false) {
        let code = "";
        if (define) {
            if (define.startsWith("defined(")) {
                code = `#if ${define}\n`;
            }
            else {
                code = `${notDefine ? "#ifndef" : "#ifdef"} ${define}\n`;
            }
        }
        return code;
    }
    _emitDefineEnd(define) {
        return define ? `#endif\n` : "";
    }
    /**
     * @internal
     */
    _emitVaryingFromString(name, type, define = "", notDefine = false) {
        if (this.sharedData.varyings.indexOf(name) !== -1) {
            return false;
        }
        this.sharedData.varyings.push(name);
        const shaderType = this._getShaderType(type);
        const emitCode = (forFragment = false) => {
            let code = this._emitDefineStart(define, notDefine);
            if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                switch (shaderType) {
                    case "i32":
                    case "f32":
                    case "vec2f":
                    case "vec3f":
                    case "vec4f":
                        code += `varying ${name}: ${shaderType};\n`;
                        if (forFragment) {
                            code += `var<private> ${name}: ${shaderType};\n`;
                            this.sharedData.varyingInitializationsFragment +=
                                this._emitDefineStart(define, notDefine) + `${name} = fragmentInputs.${name};\n` + this._emitDefineEnd(define);
                        }
                        break;
                    case "mat4x4f":
                        // We can't pass a matrix as a varying in WGSL, so we need to split it into 4 vectors
                        code += `varying ${name}_r0: vec4f;\n`;
                        code += `varying ${name}_r1: vec4f;\n`;
                        code += `varying ${name}_r2: vec4f;\n`;
                        code += `varying ${name}_r3: vec4f;\n`;
                        if (forFragment) {
                            code += `var<private> ${name}: mat4x4f;\n`;
                            this.sharedData.varyingInitializationsFragment +=
                                this._emitDefineStart(define, notDefine) +
                                    `${name} = mat4x4f(fragmentInputs.${name}_r0, fragmentInputs.${name}_r1, fragmentInputs.${name}_r2, fragmentInputs.${name}_r3);\n` +
                                    this._emitDefineEnd(define);
                        }
                        break;
                    default:
                        code += `varying ${name}: ${shaderType};\n`;
                        break;
                }
            }
            else {
                code += `varying ${shaderType} ${name};\n`;
            }
            code += this._emitDefineEnd(define);
            return code;
        };
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            this.sharedData.varyingDeclaration += emitCode(false);
            this.sharedData.varyingDeclarationFragment += emitCode(true);
        }
        else {
            const code = emitCode();
            this.sharedData.varyingDeclaration += code;
            this.sharedData.varyingDeclarationFragment += code;
        }
        return true;
    }
    /**
     * @internal
     */
    _getVaryingName(name) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return (this.target !== NodeMaterialBlockTargets.Fragment ? "vertexOutputs." : "fragmentInputs.") + name;
        }
        return name;
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
                this._uniformDeclaration += `#if ${define}\n`;
            }
            else {
                this._uniformDeclaration += `${notDefine ? "#ifndef" : "#ifdef"} ${define}\n`;
            }
        }
        if (this.sharedData.formatConfig.getUniformAnnotation) {
            this._uniformDeclaration += this.sharedData.formatConfig.getUniformAnnotation(name);
        }
        const shaderType = this._getShaderType(type);
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            this._uniformDeclaration += `uniform ${name}: ${shaderType};\n`;
        }
        else {
            this._uniformDeclaration += `uniform ${shaderType} ${name};\n`;
        }
        if (define) {
            this._uniformDeclaration += `#endif\n`;
        }
    }
    /**
     * @internal
     */
    _generateTernary(trueStatement, falseStatement, condition) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `select(${falseStatement}, ${trueStatement}, ${condition})`;
        }
        return `(${condition}) ? ${trueStatement} : ${falseStatement}`;
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
    /**
     * @internal
     */
    _declareOutput(output, isConst) {
        return this._declareLocalVar(output.associatedVariableName, output.type, isConst);
    }
    /**
     * @internal
     */
    _declareLocalVar(name, type, isConst, isVarPrivate) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `${isConst ? "const" : "var" + (isVarPrivate ? "<private>" : "")} ${name}: ${this._getShaderType(type)}`;
        }
        else {
            return `${isConst ? "const " : ""}${this._getShaderType(type)} ${name}`;
        }
    }
    /**
     * @internal
     */
    _samplerCubeFunc() {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return "textureSample";
        }
        return "textureCube";
    }
    /**
     * @internal
     */
    _samplerFunc() {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return "textureSample";
        }
        return "texture2D";
    }
    /**
     * @internal
     */
    _samplerLODFunc() {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return "textureSampleLevel";
        }
        return "texture2DLodEXT";
    }
    _toLinearSpace(output) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            if (output.type === NodeMaterialBlockConnectionPointTypes.Color3 || output.type === NodeMaterialBlockConnectionPointTypes.Vector3) {
                return `toLinearSpaceVec3(${output.associatedVariableName})`;
            }
            return `toLinearSpace(${output.associatedVariableName})`;
        }
        return `toLinearSpace(${output.associatedVariableName})`;
    }
    /**
     * @internal
     */
    _generateTextureSample(uv, samplerName) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `${this._samplerFunc()}(${samplerName},${samplerName + `Sampler`}, ${uv})`;
        }
        return `${this._samplerFunc()}(${samplerName}, ${uv})`;
    }
    /**
     * @internal
     */
    _generateTextureSampleLOD(uv, samplerName, lod) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `${this._samplerLODFunc()}(${samplerName},${samplerName + `Sampler`}, ${uv}, ${lod})`;
        }
        return `${this._samplerLODFunc()}(${samplerName}, ${uv}, ${lod})`;
    }
    /**
     * @internal
     */
    _generateTextureSampleCube(uv, samplerName) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `${this._samplerCubeFunc()}(${samplerName},${samplerName + `Sampler`}, ${uv})`;
        }
        return `${this._samplerCubeFunc()}(${samplerName}, ${uv})`;
    }
    /**
     * @internal
     */
    _generateTextureSampleCubeLOD(uv, samplerName, lod) {
        if (this.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return `${this._samplerCubeFunc()}(${samplerName},${samplerName + `Sampler`}, ${uv}, ${lod})`;
        }
        return `${this._samplerCubeFunc()}(${samplerName}, ${uv}, ${lod})`;
    }
    _convertVariableDeclarationToWGSL(type, dest, source) {
        return source.replace(new RegExp(`(${type})\\s+(\\w+)`, "g"), `var $2: ${dest}`);
    }
    _convertVariableConstructorsToWGSL(type, dest, source) {
        return source.replace(new RegExp(`(${type})\\(`, "g"), ` ${dest}(`);
    }
    _convertOutParametersToWGSL(source) {
        return source.replace(new RegExp(`out\\s+var\\s+(\\w+)\\s*:\\s*(\\w+)`, "g"), `$1: ptr<function, $2>`);
    }
    _convertTernaryOperandsToWGSL(source) {
        return source.replace(new RegExp(`\\[(.*?)\\?(.*?):(.*)\\]`, "g"), (match, condition, trueCase, falseCase) => `select(${falseCase}, ${trueCase}, ${condition})`);
    }
    _convertModOperatorsToWGSL(source) {
        return source.replace(new RegExp(`mod\\((.+?),\\s*(.+?)\\)`, "g"), (match, left, right) => `((${left})%(${right}))`);
    }
    _convertConstToWGSL(source) {
        return source.replace(new RegExp(`const var`, "g"), `const`);
    }
    _convertInnerFunctionsToWGSL(source) {
        return source.replace(new RegExp(`inversesqrt`, "g"), `inverseSqrt`);
    }
    _convertFunctionsToWGSL(source) {
        const regex = /var\s+(\w+)\s*:\s*(\w+)\((.*)\)/g;
        let match;
        while ((match = regex.exec(source)) !== null) {
            const funcName = match[1];
            const funcType = match[2];
            const params = match[3]; // All parameters as a single string
            // Processing the parameters to match 'name: type' format
            const formattedParams = params.replace(/var\s/g, "");
            // Constructing the final output string
            source = source.replace(match[0], `fn ${funcName}(${formattedParams}) -> ${funcType}`);
        }
        return source;
    }
    _babylonSLtoWGSL(code) {
        // variable declarations
        code = this._convertVariableDeclarationToWGSL("void", "voidnull", code);
        code = this._convertVariableDeclarationToWGSL("bool", "bool", code);
        code = this._convertVariableDeclarationToWGSL("int", "i32", code);
        code = this._convertVariableDeclarationToWGSL("uint", "u32", code);
        code = this._convertVariableDeclarationToWGSL("float", "f32", code);
        code = this._convertVariableDeclarationToWGSL("vec2", "vec2f", code);
        code = this._convertVariableDeclarationToWGSL("vec3", "vec3f", code);
        code = this._convertVariableDeclarationToWGSL("vec4", "vec4f", code);
        code = this._convertVariableDeclarationToWGSL("mat2", "mat2x2f", code);
        code = this._convertVariableDeclarationToWGSL("mat3", "mat3x3f", code);
        code = this._convertVariableDeclarationToWGSL("mat4", "mat4x4f", code);
        // Type constructors
        code = this._convertVariableConstructorsToWGSL("float", "f32", code);
        code = this._convertVariableConstructorsToWGSL("vec2", "vec2f", code);
        code = this._convertVariableConstructorsToWGSL("vec3", "vec3f", code);
        code = this._convertVariableConstructorsToWGSL("vec4", "vec4f", code);
        code = this._convertVariableConstructorsToWGSL("mat2", "mat2x2f", code);
        code = this._convertVariableConstructorsToWGSL("mat3", "mat3x3f", code);
        code = this._convertVariableConstructorsToWGSL("mat4", "mat4x4f", code);
        // Ternary operands
        code = this._convertTernaryOperandsToWGSL(code);
        // Mod operators
        code = this._convertModOperatorsToWGSL(code);
        // Const
        code = this._convertConstToWGSL(code);
        // Inner functions
        code = this._convertInnerFunctionsToWGSL(code);
        // Out paramters
        code = this._convertOutParametersToWGSL(code);
        code = code.replace(/\[\*\]/g, "*");
        // Functions
        code = this._convertFunctionsToWGSL(code);
        // Remove voidnull
        code = code.replace(/\s->\svoidnull/g, "");
        // Derivatives
        code = code.replace(/dFdx/g, "dpdx");
        code = code.replace(/dFdy/g, "dpdy");
        return code;
    }
    _convertTernaryOperandsToGLSL(source) {
        return source.replace(new RegExp(`\\[(.+?)\\?(.+?):(.+)\\]`, "g"), (match, condition, trueCase, falseCase) => `${condition} ? ${trueCase} : ${falseCase}`);
    }
    _babylonSLtoGLSL(code) {
        /** Remove BSL specifics */
        code = code.replace(/\[\*\]/g, "");
        code = this._convertTernaryOperandsToGLSL(code);
        return code;
    }
}
//# sourceMappingURL=nodeMaterialBuildState.js.map
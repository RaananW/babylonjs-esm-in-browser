import { Observable } from "../Misc/observable.js";

import { GetDOMTextContent, IsWindowObjectExist } from "../Misc/domManagement.js";
import { Logger } from "../Misc/logger.js";
import { ShaderProcessor } from "../Engines/Processors/shaderProcessor.js";
import { ShaderStore as EngineShaderStore } from "../Engines/shaderStore.js";
import { ShaderLanguage } from "./shaderLanguage.js";
/**
 * Effect containing vertex and fragment shader that can be executed on an object.
 */
export class Effect {
    /**
     * Instantiates an effect.
     * An effect can be used to create/manage/execute vertex and fragment shaders.
     * @param baseName Name of the effect.
     * @param attributesNamesOrOptions List of attribute names that will be passed to the shader or set of all options to create the effect.
     * @param uniformsNamesOrEngine List of uniform variable names that will be passed to the shader or the engine that will be used to render effect.
     * @param samplers List of sampler variables that will be passed to the shader.
     * @param engine Engine to be used to render the effect
     * @param defines Define statements to be added to the shader.
     * @param fallbacks Possible fallbacks for this effect to improve performance when needed.
     * @param onCompiled Callback that will be called when the shader is compiled.
     * @param onError Callback that will be called if an error occurs during shader compilation.
     * @param indexParameters Parameters to be used with Babylons include syntax to iterate over an array (eg. {lights: 10})
     * @param key Effect Key identifying uniquely compiled shader variants
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     */
    constructor(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers = null, engine, defines = null, fallbacks = null, onCompiled = null, onError = null, indexParameters, key = "", shaderLanguage = ShaderLanguage.GLSL) {
        var _a, _b, _c;
        /**
         * Name of the effect.
         */
        this.name = null;
        /**
         * String container all the define statements that should be set on the shader.
         */
        this.defines = "";
        /**
         * Callback that will be called when the shader is compiled.
         */
        this.onCompiled = null;
        /**
         * Callback that will be called if an error occurs during shader compilation.
         */
        this.onError = null;
        /**
         * Callback that will be called when effect is bound.
         */
        this.onBind = null;
        /**
         * Unique ID of the effect.
         */
        this.uniqueId = 0;
        /**
         * Observable that will be called when the shader is compiled.
         * It is recommended to use executeWhenCompile() or to make sure that scene.isReady() is called to get this observable raised.
         */
        this.onCompileObservable = new Observable();
        /**
         * Observable that will be called if an error occurs during shader compilation.
         */
        this.onErrorObservable = new Observable();
        /** @internal */
        this._onBindObservable = null;
        /**
         * @internal
         * Specifies if the effect was previously ready
         */
        this._wasPreviouslyReady = false;
        /**
         * @internal
         * Specifies if the effect was previously using instances
         */
        this._wasPreviouslyUsingInstances = null;
        this._isDisposed = false;
        /** @internal */
        this._bonesComputationForcedToCPU = false;
        /** @internal */
        this._uniformBuffersNames = {};
        /** @internal */
        this._multiTarget = false;
        this._samplers = {};
        this._isReady = false;
        this._compilationError = "";
        this._allFallbacksProcessed = false;
        this._uniforms = {};
        /**
         * Key for the effect.
         * @internal
         */
        this._key = "";
        this._fallbacks = null;
        this._vertexSourceCodeOverride = "";
        this._fragmentSourceCodeOverride = "";
        this._transformFeedbackVaryings = null;
        /**
         * Compiled shader to webGL program.
         * @internal
         */
        this._pipelineContext = null;
        /** @internal */
        this._vertexSourceCode = "";
        /** @internal */
        this._fragmentSourceCode = "";
        /** @internal */
        this._vertexSourceCodeBeforeMigration = "";
        /** @internal */
        this._fragmentSourceCodeBeforeMigration = "";
        /** @internal */
        this._rawVertexSourceCode = "";
        /** @internal */
        this._rawFragmentSourceCode = "";
        this.name = baseName;
        this._key = key;
        let processCodeAfterIncludes = undefined;
        let processFinalCode = null;
        if (attributesNamesOrOptions.attributes) {
            const options = attributesNamesOrOptions;
            this._engine = uniformsNamesOrEngine;
            this._attributesNames = options.attributes;
            this._uniformsNames = options.uniformsNames.concat(options.samplers);
            this._samplerList = options.samplers.slice();
            this.defines = options.defines;
            this.onError = options.onError;
            this.onCompiled = options.onCompiled;
            this._fallbacks = options.fallbacks;
            this._indexParameters = options.indexParameters;
            this._transformFeedbackVaryings = options.transformFeedbackVaryings || null;
            this._multiTarget = !!options.multiTarget;
            this._shaderLanguage = (_a = options.shaderLanguage) !== null && _a !== void 0 ? _a : ShaderLanguage.GLSL;
            if (options.uniformBuffersNames) {
                this._uniformBuffersNamesList = options.uniformBuffersNames.slice();
                for (let i = 0; i < options.uniformBuffersNames.length; i++) {
                    this._uniformBuffersNames[options.uniformBuffersNames[i]] = i;
                }
            }
            processFinalCode = (_b = options.processFinalCode) !== null && _b !== void 0 ? _b : null;
            processCodeAfterIncludes = (_c = options.processCodeAfterIncludes) !== null && _c !== void 0 ? _c : undefined;
        }
        else {
            this._engine = engine;
            this.defines = defines == null ? "" : defines;
            this._uniformsNames = uniformsNamesOrEngine.concat(samplers);
            this._samplerList = samplers ? samplers.slice() : [];
            this._attributesNames = attributesNamesOrOptions;
            this._uniformBuffersNamesList = [];
            this._shaderLanguage = shaderLanguage;
            this.onError = onError;
            this.onCompiled = onCompiled;
            this._indexParameters = indexParameters;
            this._fallbacks = fallbacks;
        }
        this._attributeLocationByName = {};
        this.uniqueId = Effect._UniqueIdSeed++;
        let vertexSource;
        let fragmentSource;
        const hostDocument = IsWindowObjectExist() ? this._engine.getHostDocument() : null;
        if (baseName.vertexSource) {
            vertexSource = "source:" + baseName.vertexSource;
        }
        else if (baseName.vertexElement) {
            vertexSource = hostDocument ? hostDocument.getElementById(baseName.vertexElement) : null;
            if (!vertexSource) {
                vertexSource = baseName.vertexElement;
            }
        }
        else {
            vertexSource = baseName.vertex || baseName;
        }
        if (baseName.fragmentSource) {
            fragmentSource = "source:" + baseName.fragmentSource;
        }
        else if (baseName.fragmentElement) {
            fragmentSource = hostDocument ? hostDocument.getElementById(baseName.fragmentElement) : null;
            if (!fragmentSource) {
                fragmentSource = baseName.fragmentElement;
            }
        }
        else {
            fragmentSource = baseName.fragment || baseName;
        }
        this._processingContext = this._engine._getShaderProcessingContext(this._shaderLanguage);
        const processorOptions = {
            defines: this.defines.split("\n"),
            indexParameters: this._indexParameters,
            isFragment: false,
            shouldUseHighPrecisionShader: this._engine._shouldUseHighPrecisionShader,
            processor: this._engine._getShaderProcessor(this._shaderLanguage),
            supportsUniformBuffers: this._engine.supportsUniformBuffers,
            shadersRepository: EngineShaderStore.GetShadersRepository(this._shaderLanguage),
            includesShadersStore: EngineShaderStore.GetIncludesShadersStore(this._shaderLanguage),
            version: (this._engine.version * 100).toString(),
            platformName: this._engine.shaderPlatformName,
            processingContext: this._processingContext,
            isNDCHalfZRange: this._engine.isNDCHalfZRange,
            useReverseDepthBuffer: this._engine.useReverseDepthBuffer,
            processCodeAfterIncludes,
        };
        const shaderCodes = [undefined, undefined];
        const shadersLoaded = () => {
            if (shaderCodes[0] && shaderCodes[1]) {
                processorOptions.isFragment = true;
                const [migratedVertexCode, fragmentCode] = shaderCodes;
                ShaderProcessor.Process(fragmentCode, processorOptions, (migratedFragmentCode, codeBeforeMigration) => {
                    this._fragmentSourceCodeBeforeMigration = codeBeforeMigration;
                    if (processFinalCode) {
                        migratedFragmentCode = processFinalCode("fragment", migratedFragmentCode);
                    }
                    const finalShaders = ShaderProcessor.Finalize(migratedVertexCode, migratedFragmentCode, processorOptions);
                    this._useFinalCode(finalShaders.vertexCode, finalShaders.fragmentCode, baseName);
                }, this._engine);
            }
        };
        this._loadShader(vertexSource, "Vertex", "", (vertexCode) => {
            ShaderProcessor.Initialize(processorOptions);
            ShaderProcessor.Process(vertexCode, processorOptions, (migratedVertexCode, codeBeforeMigration) => {
                this._rawVertexSourceCode = vertexCode;
                this._vertexSourceCodeBeforeMigration = codeBeforeMigration;
                if (processFinalCode) {
                    migratedVertexCode = processFinalCode("vertex", migratedVertexCode);
                }
                shaderCodes[0] = migratedVertexCode;
                shadersLoaded();
            }, this._engine);
        });
        this._loadShader(fragmentSource, "Fragment", "Pixel", (fragmentCode) => {
            this._rawFragmentSourceCode = fragmentCode;
            shaderCodes[1] = fragmentCode;
            shadersLoaded();
        });
        const proxyFunction = function (functionName) {
            // check if the function exists in the pipelineContext
            return function () {
                if (this._pipelineContext) {
                    const func = this._pipelineContext[functionName];
                    func.apply(this._pipelineContext, arguments);
                }
                return this;
            };
        };
        ["Int?", "IntArray?", "Array?", "Color?", "Vector?", "Float?", "Matrices", "Matrix", "Matrix3x3", "Matrix2x2", "Quaternion", "DirectColor4"].forEach((functionName) => {
            const name = `set${functionName}`;
            if (name.endsWith("?")) {
                ["", 2, 3, 4].forEach((n) => {
                    this[(name.slice(0, -1) + n)] = this[(name.slice(0, -1) + n)] || proxyFunction(name.slice(0, -1) + n).bind(this);
                });
            }
            else {
                this[name] = this[name] || proxyFunction(name).bind(this);
            }
        });
    }
    /**
     * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
     */
    static get ShadersRepository() {
        return EngineShaderStore.ShadersRepository;
    }
    static set ShadersRepository(repo) {
        EngineShaderStore.ShadersRepository = repo;
    }
    /**
     * Observable that will be called when effect is bound.
     */
    get onBindObservable() {
        if (!this._onBindObservable) {
            this._onBindObservable = new Observable();
        }
        return this._onBindObservable;
    }
    _useFinalCode(migratedVertexCode, migratedFragmentCode, baseName) {
        if (baseName) {
            const vertex = baseName.vertexElement || baseName.vertex || baseName.spectorName || baseName;
            const fragment = baseName.fragmentElement || baseName.fragment || baseName.spectorName || baseName;
            this._vertexSourceCode = (this._shaderLanguage === ShaderLanguage.WGSL ? "//" : "") + "#define SHADER_NAME vertex:" + vertex + "\n" + migratedVertexCode;
            this._fragmentSourceCode = (this._shaderLanguage === ShaderLanguage.WGSL ? "//" : "") + "#define SHADER_NAME fragment:" + fragment + "\n" + migratedFragmentCode;
        }
        else {
            this._vertexSourceCode = migratedVertexCode;
            this._fragmentSourceCode = migratedFragmentCode;
        }
        this._prepareEffect();
    }
    /**
     * Unique key for this effect
     */
    get key() {
        return this._key;
    }
    /**
     * If the effect has been compiled and prepared.
     * @returns if the effect is compiled and prepared.
     */
    isReady() {
        try {
            return this._isReadyInternal();
        }
        catch (_a) {
            return false;
        }
    }
    _isReadyInternal() {
        if (this._isReady) {
            return true;
        }
        if (this._pipelineContext) {
            return this._pipelineContext.isReady;
        }
        return false;
    }
    /**
     * The engine the effect was initialized with.
     * @returns the engine.
     */
    getEngine() {
        return this._engine;
    }
    /**
     * The pipeline context for this effect
     * @returns the associated pipeline context
     */
    getPipelineContext() {
        return this._pipelineContext;
    }
    /**
     * The set of names of attribute variables for the shader.
     * @returns An array of attribute names.
     */
    getAttributesNames() {
        return this._attributesNames;
    }
    /**
     * Returns the attribute at the given index.
     * @param index The index of the attribute.
     * @returns The location of the attribute.
     */
    getAttributeLocation(index) {
        return this._attributes[index];
    }
    /**
     * Returns the attribute based on the name of the variable.
     * @param name of the attribute to look up.
     * @returns the attribute location.
     */
    getAttributeLocationByName(name) {
        return this._attributeLocationByName[name];
    }
    /**
     * The number of attributes.
     * @returns the number of attributes.
     */
    getAttributesCount() {
        return this._attributes.length;
    }
    /**
     * Gets the index of a uniform variable.
     * @param uniformName of the uniform to look up.
     * @returns the index.
     */
    getUniformIndex(uniformName) {
        return this._uniformsNames.indexOf(uniformName);
    }
    /**
     * Returns the attribute based on the name of the variable.
     * @param uniformName of the uniform to look up.
     * @returns the location of the uniform.
     */
    getUniform(uniformName) {
        return this._uniforms[uniformName];
    }
    /**
     * Returns an array of sampler variable names
     * @returns The array of sampler variable names.
     */
    getSamplers() {
        return this._samplerList;
    }
    /**
     * Returns an array of uniform variable names
     * @returns The array of uniform variable names.
     */
    getUniformNames() {
        return this._uniformsNames;
    }
    /**
     * Returns an array of uniform buffer variable names
     * @returns The array of uniform buffer variable names.
     */
    getUniformBuffersNames() {
        return this._uniformBuffersNamesList;
    }
    /**
     * Returns the index parameters used to create the effect
     * @returns The index parameters object
     */
    getIndexParameters() {
        return this._indexParameters;
    }
    /**
     * The error from the last compilation.
     * @returns the error string.
     */
    getCompilationError() {
        return this._compilationError;
    }
    /**
     * Gets a boolean indicating that all fallbacks were used during compilation
     * @returns true if all fallbacks were used
     */
    allFallbacksProcessed() {
        return this._allFallbacksProcessed;
    }
    /**
     * Adds a callback to the onCompiled observable and call the callback immediately if already ready.
     * @param func The callback to be used.
     */
    executeWhenCompiled(func) {
        if (this.isReady()) {
            func(this);
            return;
        }
        this.onCompileObservable.add((effect) => {
            func(effect);
        });
        if (!this._pipelineContext || this._pipelineContext.isAsync) {
            setTimeout(() => {
                this._checkIsReady(null);
            }, 16);
        }
    }
    _checkIsReady(previousPipelineContext) {
        try {
            if (this._isReadyInternal()) {
                return;
            }
        }
        catch (e) {
            this._processCompilationErrors(e, previousPipelineContext);
            return;
        }
        if (this._isDisposed) {
            return;
        }
        setTimeout(() => {
            this._checkIsReady(previousPipelineContext);
        }, 16);
    }
    _loadShader(shader, key, optionalKey, callback) {
        if (typeof HTMLElement !== "undefined") {
            // DOM element ?
            if (shader instanceof HTMLElement) {
                const shaderCode = GetDOMTextContent(shader);
                callback(shaderCode);
                return;
            }
        }
        // Direct source ?
        if (shader.substr(0, 7) === "source:") {
            callback(shader.substr(7));
            return;
        }
        // Base64 encoded ?
        if (shader.substr(0, 7) === "base64:") {
            const shaderBinary = window.atob(shader.substr(7));
            callback(shaderBinary);
            return;
        }
        const shaderStore = EngineShaderStore.GetShadersStore(this._shaderLanguage);
        // Is in local store ?
        if (shaderStore[shader + key + "Shader"]) {
            callback(shaderStore[shader + key + "Shader"]);
            return;
        }
        if (optionalKey && shaderStore[shader + optionalKey + "Shader"]) {
            callback(shaderStore[shader + optionalKey + "Shader"]);
            return;
        }
        let shaderUrl;
        if (shader[0] === "." || shader[0] === "/" || shader.indexOf("http") > -1) {
            shaderUrl = shader;
        }
        else {
            shaderUrl = EngineShaderStore.GetShadersRepository(this._shaderLanguage) + shader;
        }
        // Vertex shader
        this._engine._loadFile(shaderUrl + "." + key.toLowerCase() + ".fx", callback);
    }
    /**
     * Gets the vertex shader source code of this effect
     * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
     */
    get vertexSourceCode() {
        var _a, _b;
        return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride
            ? this._vertexSourceCodeOverride
            : (_b = (_a = this._pipelineContext) === null || _a === void 0 ? void 0 : _a._getVertexShaderCode()) !== null && _b !== void 0 ? _b : this._vertexSourceCode;
    }
    /**
     * Gets the fragment shader source code of this effect
     * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
     */
    get fragmentSourceCode() {
        var _a, _b;
        return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride
            ? this._fragmentSourceCodeOverride
            : (_b = (_a = this._pipelineContext) === null || _a === void 0 ? void 0 : _a._getFragmentShaderCode()) !== null && _b !== void 0 ? _b : this._fragmentSourceCode;
    }
    /**
     * Gets the vertex shader source code before migration.
     * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
     * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
     */
    get vertexSourceCodeBeforeMigration() {
        return this._vertexSourceCodeBeforeMigration;
    }
    /**
     * Gets the fragment shader source code before migration.
     * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
     * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
     */
    get fragmentSourceCodeBeforeMigration() {
        return this._fragmentSourceCodeBeforeMigration;
    }
    /**
     * Gets the vertex shader source code before it has been modified by any processing
     */
    get rawVertexSourceCode() {
        return this._rawVertexSourceCode;
    }
    /**
     * Gets the fragment shader source code before it has been modified by any processing
     */
    get rawFragmentSourceCode() {
        return this._rawFragmentSourceCode;
    }
    /**
     * Recompiles the webGL program
     * @param vertexSourceCode The source code for the vertex shader.
     * @param fragmentSourceCode The source code for the fragment shader.
     * @param onCompiled Callback called when completed.
     * @param onError Callback called on error.
     * @internal
     */
    _rebuildProgram(vertexSourceCode, fragmentSourceCode, onCompiled, onError) {
        this._isReady = false;
        this._vertexSourceCodeOverride = vertexSourceCode;
        this._fragmentSourceCodeOverride = fragmentSourceCode;
        this.onError = (effect, error) => {
            if (onError) {
                onError(error);
            }
        };
        this.onCompiled = () => {
            const scenes = this.getEngine().scenes;
            if (scenes) {
                for (let i = 0; i < scenes.length; i++) {
                    scenes[i].markAllMaterialsAsDirty(63);
                }
            }
            this._pipelineContext._handlesSpectorRebuildCallback(onCompiled);
        };
        this._fallbacks = null;
        this._prepareEffect();
    }
    /**
     * Prepares the effect
     * @internal
     */
    _prepareEffect() {
        const attributesNames = this._attributesNames;
        const defines = this.defines;
        const previousPipelineContext = this._pipelineContext;
        this._isReady = false;
        try {
            const engine = this._engine;
            this._pipelineContext = engine.createPipelineContext(this._processingContext);
            this._pipelineContext._name = this._key;
            const rebuildRebind = this._rebuildProgram.bind(this);
            if (this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride) {
                engine._preparePipelineContext(this._pipelineContext, this._vertexSourceCodeOverride, this._fragmentSourceCodeOverride, true, this._rawVertexSourceCode, this._rawFragmentSourceCode, rebuildRebind, null, this._transformFeedbackVaryings, this._key);
            }
            else {
                engine._preparePipelineContext(this._pipelineContext, this._vertexSourceCode, this._fragmentSourceCode, false, this._rawVertexSourceCode, this._rawFragmentSourceCode, rebuildRebind, defines, this._transformFeedbackVaryings, this._key);
            }
            engine._executeWhenRenderingStateIsCompiled(this._pipelineContext, () => {
                this._attributes = [];
                this._pipelineContext._fillEffectInformation(this, this._uniformBuffersNames, this._uniformsNames, this._uniforms, this._samplerList, this._samplers, attributesNames, this._attributes);
                // Caches attribute locations.
                if (attributesNames) {
                    for (let i = 0; i < attributesNames.length; i++) {
                        const name = attributesNames[i];
                        this._attributeLocationByName[name] = this._attributes[i];
                    }
                }
                engine.bindSamplers(this);
                this._compilationError = "";
                this._isReady = true;
                if (this.onCompiled) {
                    this.onCompiled(this);
                }
                this.onCompileObservable.notifyObservers(this);
                this.onCompileObservable.clear();
                // Unbind mesh reference in fallbacks
                if (this._fallbacks) {
                    this._fallbacks.unBindMesh();
                }
                if (previousPipelineContext) {
                    this.getEngine()._deletePipelineContext(previousPipelineContext);
                }
            });
            if (this._pipelineContext.isAsync) {
                this._checkIsReady(previousPipelineContext);
            }
        }
        catch (e) {
            this._processCompilationErrors(e, previousPipelineContext);
        }
    }
    _getShaderCodeAndErrorLine(code, error, isFragment) {
        const regexp = isFragment ? /FRAGMENT SHADER ERROR: 0:(\d+?):/ : /VERTEX SHADER ERROR: 0:(\d+?):/;
        let errorLine = null;
        if (error && code) {
            const res = error.match(regexp);
            if (res && res.length === 2) {
                const lineNumber = parseInt(res[1]);
                const lines = code.split("\n", -1);
                if (lines.length >= lineNumber) {
                    errorLine = `Offending line [${lineNumber}] in ${isFragment ? "fragment" : "vertex"} code: ${lines[lineNumber - 1]}`;
                }
            }
        }
        return [code, errorLine];
    }
    _processCompilationErrors(e, previousPipelineContext = null) {
        var _a, _b, _c;
        this._compilationError = e.message;
        const attributesNames = this._attributesNames;
        const fallbacks = this._fallbacks;
        // Let's go through fallbacks then
        Logger.Error("Unable to compile effect:");
        Logger.Error("Uniforms: " +
            this._uniformsNames.map(function (uniform) {
                return " " + uniform;
            }));
        Logger.Error("Attributes: " +
            attributesNames.map(function (attribute) {
                return " " + attribute;
            }));
        Logger.Error("Defines:\r\n" + this.defines);
        if (Effect.LogShaderCodeOnCompilationError) {
            let lineErrorVertex = null, lineErrorFragment = null, code = null;
            if ((_a = this._pipelineContext) === null || _a === void 0 ? void 0 : _a._getVertexShaderCode()) {
                [code, lineErrorVertex] = this._getShaderCodeAndErrorLine(this._pipelineContext._getVertexShaderCode(), this._compilationError, false);
                if (code) {
                    Logger.Error("Vertex code:");
                    Logger.Error(code);
                }
            }
            if ((_b = this._pipelineContext) === null || _b === void 0 ? void 0 : _b._getFragmentShaderCode()) {
                [code, lineErrorFragment] = this._getShaderCodeAndErrorLine((_c = this._pipelineContext) === null || _c === void 0 ? void 0 : _c._getFragmentShaderCode(), this._compilationError, true);
                if (code) {
                    Logger.Error("Fragment code:");
                    Logger.Error(code);
                }
            }
            if (lineErrorVertex) {
                Logger.Error(lineErrorVertex);
            }
            if (lineErrorFragment) {
                Logger.Error(lineErrorFragment);
            }
        }
        Logger.Error("Error: " + this._compilationError);
        const notifyErrors = () => {
            if (this.onError) {
                this.onError(this, this._compilationError);
            }
            this.onErrorObservable.notifyObservers(this);
        };
        // In case a previous compilation was successful, we need to restore the previous pipeline context
        if (previousPipelineContext) {
            this._pipelineContext = previousPipelineContext;
            this._isReady = true;
            notifyErrors();
        }
        // Lets try to compile fallbacks as long as we have some.
        if (fallbacks) {
            this._pipelineContext = null;
            if (fallbacks.hasMoreFallbacks) {
                this._allFallbacksProcessed = false;
                Logger.Error("Trying next fallback.");
                this.defines = fallbacks.reduce(this.defines, this);
                this._prepareEffect();
            }
            else {
                // Sorry we did everything we can
                this._allFallbacksProcessed = true;
                notifyErrors();
                this.onErrorObservable.clear();
                // Unbind mesh reference in fallbacks
                if (this._fallbacks) {
                    this._fallbacks.unBindMesh();
                }
            }
        }
        else {
            this._allFallbacksProcessed = true;
            // In case of error, without any prior successful compilation, let s notify observers
            if (!previousPipelineContext) {
                notifyErrors();
            }
        }
    }
    /**
     * Checks if the effect is supported. (Must be called after compilation)
     */
    get isSupported() {
        return this._compilationError === "";
    }
    /**
     * Binds a texture to the engine to be used as output of the shader.
     * @param channel Name of the output variable.
     * @param texture Texture to bind.
     * @internal
     */
    _bindTexture(channel, texture) {
        this._engine._bindTexture(this._samplers[channel], texture, channel);
    }
    /**
     * Sets a texture on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    setTexture(channel, texture) {
        this._engine.setTexture(this._samplers[channel], this._uniforms[channel], texture, channel);
    }
    /**
     * Sets a depth stencil texture from a render target on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    setDepthStencilTexture(channel, texture) {
        this._engine.setDepthStencilTexture(this._samplers[channel], this._uniforms[channel], texture, channel);
    }
    /**
     * Sets an array of textures on the engine to be used in the shader.
     * @param channel Name of the variable.
     * @param textures Textures to set.
     */
    setTextureArray(channel, textures) {
        const exName = channel + "Ex";
        if (this._samplerList.indexOf(exName + "0") === -1) {
            const initialPos = this._samplerList.indexOf(channel);
            for (let index = 1; index < textures.length; index++) {
                const currentExName = exName + (index - 1).toString();
                this._samplerList.splice(initialPos + index, 0, currentExName);
            }
            // Reset every channels
            let channelIndex = 0;
            for (const key of this._samplerList) {
                this._samplers[key] = channelIndex;
                channelIndex += 1;
            }
        }
        this._engine.setTextureArray(this._samplers[channel], this._uniforms[channel], textures, channel);
    }
    /**
     * Sets a texture to be the input of the specified post process. (To use the output, pass in the next post process in the pipeline)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the input texture from.
     */
    setTextureFromPostProcess(channel, postProcess) {
        this._engine.setTextureFromPostProcess(this._samplers[channel], postProcess, channel);
    }
    /**
     * (Warning! setTextureFromPostProcessOutput may be desired instead)
     * Sets the input texture of the passed in post process to be input of this effect. (To use the output of the passed in post process use setTextureFromPostProcessOutput)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the output texture from.
     */
    setTextureFromPostProcessOutput(channel, postProcess) {
        this._engine.setTextureFromPostProcessOutput(this._samplers[channel], postProcess, channel);
    }
    /**
     * Binds a buffer to a uniform.
     * @param buffer Buffer to bind.
     * @param name Name of the uniform variable to bind to.
     */
    bindUniformBuffer(buffer, name) {
        const bufferName = this._uniformBuffersNames[name];
        if (bufferName === undefined || (Effect._BaseCache[bufferName] === buffer && this._engine._features.useUBOBindingCache)) {
            return;
        }
        Effect._BaseCache[bufferName] = buffer;
        this._engine.bindUniformBufferBase(buffer, bufferName, name);
    }
    /**
     * Binds block to a uniform.
     * @param blockName Name of the block to bind.
     * @param index Index to bind.
     */
    bindUniformBlock(blockName, index) {
        this._engine.bindUniformBlock(this._pipelineContext, blockName, index);
    }
    /**
     * Sets an float array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray(uniformName, array) {
        this._pipelineContext.setArray(uniformName, array);
        return this;
    }
    /**
     * Sets an float array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray2(uniformName, array) {
        this._pipelineContext.setArray2(uniformName, array);
        return this;
    }
    /**
     * Sets an float array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray3(uniformName, array) {
        this._pipelineContext.setArray3(uniformName, array);
        return this;
    }
    /**
     * Sets an float array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray4(uniformName, array) {
        this._pipelineContext.setArray4(uniformName, array);
        return this;
    }
    /**
     * Sets a boolean on a uniform variable.
     * @param uniformName Name of the variable.
     * @param bool value to be set.
     * @returns this effect.
     */
    setBool(uniformName, bool) {
        this._pipelineContext.setInt(uniformName, bool ? 1 : 0);
        return this;
    }
    /**
     * Release all associated resources.
     **/
    dispose() {
        var _a;
        (_a = this._pipelineContext) === null || _a === void 0 ? void 0 : _a.dispose();
        this._engine._releaseEffect(this);
        this._isDisposed = true;
    }
    /**
     * This function will add a new shader to the shader store
     * @param name the name of the shader
     * @param pixelShader optional pixel shader content
     * @param vertexShader optional vertex shader content
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     */
    static RegisterShader(name, pixelShader, vertexShader, shaderLanguage = ShaderLanguage.GLSL) {
        if (pixelShader) {
            EngineShaderStore.GetShadersStore(shaderLanguage)[`${name}PixelShader`] = pixelShader;
        }
        if (vertexShader) {
            EngineShaderStore.GetShadersStore(shaderLanguage)[`${name}VertexShader`] = vertexShader;
        }
    }
    /**
     * Resets the cache of effects.
     */
    static ResetCache() {
        Effect._BaseCache = {};
    }
}
/**
 * Enable logging of the shader code when a compilation error occurs
 */
Effect.LogShaderCodeOnCompilationError = true;
Effect._UniqueIdSeed = 0;
Effect._BaseCache = {};
/**
 * Store of each shader (The can be looked up using effect.key)
 */
Effect.ShadersStore = EngineShaderStore.ShadersStore;
/**
 * Store of each included file for a shader (The can be looked up using effect.key)
 */
Effect.IncludesShadersStore = EngineShaderStore.IncludesShadersStore;
//# sourceMappingURL=effect.js.map
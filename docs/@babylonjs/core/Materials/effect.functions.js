import { GetDOMTextContent, IsWindowObjectExist } from "../Misc/domManagement.js";
import { getStateObject } from "../Engines/thinEngine.functions.js";
import { ShaderStore } from "../Engines/shaderStore.js";
import { Logger } from "../Misc/logger.js";
import { Finalize, Initialize, Process } from "../Engines/Processors/shaderProcessor.js";
import { _LoadFile } from "../Engines/abstractEngine.functions.js";
/**
 * Get a cached pipeline context
 * @param name the pipeline name
 * @param context the context to be used when creating the pipeline
 * @returns the cached pipeline context if it exists
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getCachedPipeline(name, context) {
    const stateObject = getStateObject(context);
    return stateObject.cachedPipelines[name];
}
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function resetCachedPipeline(pipeline) {
    const name = pipeline._name;
    const context = pipeline.context;
    if (name && context) {
        const stateObject = getStateObject(context);
        const cachedPipeline = stateObject.cachedPipelines[name];
        cachedPipeline?.dispose();
        delete stateObject.cachedPipelines[name];
    }
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _ProcessShaderCode(processorOptions, baseName, processFinalCode, onFinalCodeReady, shaderLanguage, engine, effectContext) {
    let vertexSource;
    let fragmentSource;
    // const baseName = this.name;
    const hostDocument = IsWindowObjectExist() ? engine?.getHostDocument() : null;
    if (typeof baseName === "string") {
        vertexSource = baseName;
    }
    else if (typeof baseName.vertexSource === "string") {
        vertexSource = "source:" + baseName.vertexSource;
    }
    else if (typeof baseName.vertexElement === "string") {
        vertexSource = hostDocument?.getElementById(baseName.vertexElement) || baseName.vertexElement;
    }
    else {
        vertexSource = baseName.vertex || baseName;
    }
    if (typeof baseName === "string") {
        fragmentSource = baseName;
    }
    else if (typeof baseName.fragmentSource === "string") {
        fragmentSource = "source:" + baseName.fragmentSource;
    }
    else if (typeof baseName.fragmentElement === "string") {
        fragmentSource = hostDocument?.getElementById(baseName.fragmentElement) || baseName.fragmentElement;
    }
    else {
        fragmentSource = baseName.fragment || baseName;
    }
    // Important:
    //   The vertex shader must be compiled before the fragment shader, as processing the fragment shader may require information from the vertex shader.
    //   Also, they should be processed in the same JS tick because the shader processor is a singleton and stores information about the current processing in its internal state.
    //   Processing the vertex and fragment shaders in different ticks may cause issues as the internal state may be overridden by another shader being processed in between.
    // This means that the shaders must be processed in sequence and synchronously, but the loading of the shader code can be done in parallel
    // as long as we wait for both shaders to be loaded before starting the processing.
    const shaderCodes = [undefined, undefined];
    const shadersLoaded = () => {
        if (shaderCodes[0] && shaderCodes[1]) {
            const [vertexCode, fragmentCode] = shaderCodes;
            Initialize(processorOptions);
            Process(vertexCode, processorOptions, (migratedVertexCode, codeBeforeMigration) => {
                if (effectContext) {
                    effectContext._vertexSourceCodeBeforeMigration = codeBeforeMigration;
                }
                if (processFinalCode) {
                    migratedVertexCode = processFinalCode("vertex", migratedVertexCode);
                }
                processorOptions.isFragment = true;
                Process(fragmentCode, processorOptions, (migratedFragmentCode, codeBeforeMigration) => {
                    if (effectContext) {
                        effectContext._fragmentSourceCodeBeforeMigration = codeBeforeMigration;
                    }
                    if (processFinalCode) {
                        migratedFragmentCode = processFinalCode("fragment", migratedFragmentCode);
                    }
                    const finalShaders = Finalize(migratedVertexCode, migratedFragmentCode, processorOptions);
                    processorOptions = null;
                    const finalCode = UseFinalCode(finalShaders.vertexCode, finalShaders.fragmentCode, baseName, shaderLanguage);
                    onFinalCodeReady?.(finalCode.vertexSourceCode, finalCode.fragmentSourceCode);
                }, engine);
            }, engine);
        }
    };
    LoadShader(vertexSource, "Vertex", "", (vertexCode) => {
        if (effectContext) {
            effectContext._rawVertexSourceCode = vertexCode;
        }
        shaderCodes[0] = vertexCode;
        shadersLoaded();
    }, shaderLanguage);
    LoadShader(fragmentSource, "Fragment", "Pixel", (fragmentCode) => {
        if (effectContext) {
            effectContext._rawFragmentSourceCode = fragmentCode;
        }
        shaderCodes[1] = fragmentCode;
        shadersLoaded();
    }, shaderLanguage);
}
function LoadShader(shader, key, optionalKey, callback, shaderLanguage, _loadFileInjection) {
    if (typeof HTMLElement !== "undefined") {
        // DOM element ?
        if (shader instanceof HTMLElement) {
            const shaderCode = GetDOMTextContent(shader);
            callback(shaderCode);
            return;
        }
    }
    // Direct source ?
    if (shader.substring(0, 7) === "source:") {
        callback(shader.substring(7));
        return;
    }
    // Base64 encoded ?
    if (shader.substring(0, 7) === "base64:") {
        const shaderBinary = window.atob(shader.substring(7));
        callback(shaderBinary);
        return;
    }
    const shaderStore = ShaderStore.GetShadersStore(shaderLanguage);
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
        shaderUrl = ShaderStore.GetShadersRepository(shaderLanguage) + shader;
    }
    _loadFileInjection = _loadFileInjection || _LoadFile;
    if (!_loadFileInjection) {
        // we got to this point and loadFile was not injected - throw an error
        throw new Error("loadFileInjection is not defined");
    }
    // Vertex shader
    _loadFileInjection(shaderUrl + "." + key.toLowerCase() + ".fx", callback);
}
function UseFinalCode(migratedVertexCode, migratedFragmentCode, baseName, shaderLanguage) {
    if (baseName) {
        const vertex = baseName.vertexElement || baseName.vertex || baseName.spectorName || baseName;
        const fragment = baseName.fragmentElement || baseName.fragment || baseName.spectorName || baseName;
        return {
            vertexSourceCode: (shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "//" : "") + "#define SHADER_NAME vertex:" + vertex + "\n" + migratedVertexCode,
            fragmentSourceCode: (shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "//" : "") + "#define SHADER_NAME fragment:" + fragment + "\n" + migratedFragmentCode,
        };
    }
    else {
        return {
            vertexSourceCode: migratedVertexCode,
            fragmentSourceCode: migratedFragmentCode,
        };
    }
}
/**
 * Creates and prepares a pipeline context
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const createAndPreparePipelineContext = (options, createPipelineContext, _preparePipelineContext, _executeWhenRenderingStateIsCompiled) => {
    try {
        const stateObject = options.context ? getStateObject(options.context) : null;
        if (stateObject) {
            // will not remove the reference to parallelShaderPrecompile, but will prevent it from being used in the next shader compilation
            stateObject.disableParallelShaderCompile = options.disableParallelCompilation;
        }
        const pipelineContext = options.existingPipelineContext || createPipelineContext(options.shaderProcessingContext);
        pipelineContext._name = options.name;
        if (options.name && stateObject) {
            stateObject.cachedPipelines[options.name] = pipelineContext;
        }
        // Flagged as async as we may need to delay load some processing tools
        // This does not break anything as the execution is waiting for _executeWhenRenderingStateIsCompiled
        _preparePipelineContext(pipelineContext, options.vertex, options.fragment, !!options.createAsRaw, "", "", options.rebuildRebind, options.defines, options.transformFeedbackVaryings, "", () => {
            _executeWhenRenderingStateIsCompiled(pipelineContext, () => {
                options.onRenderingStateCompiled?.(pipelineContext);
            });
        });
        return pipelineContext;
    }
    catch (e) {
        Logger.Error("Error compiling effect");
        throw e;
    }
};
//# sourceMappingURL=effect.functions.js.map
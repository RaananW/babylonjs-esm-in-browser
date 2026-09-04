import { ShaderLanguage } from "../Materials/shaderLanguage.js";
type ShaderImportFunction = () => readonly Promise<unknown>[];
/**
 * Caches dynamic shader imports per shader language.
 * @internal
 */
export declare class _ShaderImportLoader {
    private readonly _webGL;
    private readonly _webGPU;
    /**
     * Creates a shader import loader.
     * @param loadWebGL Imports the GLSL shader modules.
     * @param loadWebGPU Imports the WGSL shader modules.
     */
    constructor(loadWebGL: ShaderImportFunction, loadWebGPU: ShaderImportFunction);
    /**
     * Gets the initialization callback needed to load shaders for the requested language.
     * @param shaderLanguage The shader language to load.
     * @returns The shared loading callback, or `undefined` when the shaders are already loaded.
     */
    getLoadCallback(shaderLanguage: ShaderLanguage): (() => Promise<void>) | undefined;
    private _loadAsync;
    private _completeLoad;
}
export {};

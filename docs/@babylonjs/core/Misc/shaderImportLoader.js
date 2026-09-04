/**
 * Caches dynamic shader imports per shader language.
 * @internal
 */
export class _ShaderImportLoader {
    /**
     * Creates a shader import loader.
     * @param loadWebGL Imports the GLSL shader modules.
     * @param loadWebGPU Imports the WGSL shader modules.
     */
    constructor(loadWebGL, loadWebGPU) {
        this._webGL = { load: loadWebGL, loaded: false, loadPromise: null };
        this._webGPU = { load: loadWebGPU, loaded: false, loadPromise: null };
    }
    /**
     * Gets the initialization callback needed to load shaders for the requested language.
     * @param shaderLanguage The shader language to load.
     * @returns The shared loading callback, or `undefined` when the shaders are already loaded.
     */
    getLoadCallback(shaderLanguage) {
        const state = shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? this._webGPU : this._webGL;
        return state.loaded
            ? undefined
            : async () => {
                await this._loadAsync(state);
            };
    }
    async _loadAsync(state) {
        if (state.loaded) {
            return;
        }
        let loadPromise = state.loadPromise;
        const ownsLoad = loadPromise === null;
        if (ownsLoad) {
            loadPromise = Promise.all(state.load());
            state.loadPromise = loadPromise;
        }
        let loaded = false;
        try {
            await loadPromise;
            loaded = true;
        }
        finally {
            if (ownsLoad) {
                this._completeLoad(state, loaded);
            }
        }
    }
    _completeLoad(state, loaded) {
        state.loaded = loaded;
        state.loadPromise = null;
    }
}
//# sourceMappingURL=shaderImportLoader.js.map
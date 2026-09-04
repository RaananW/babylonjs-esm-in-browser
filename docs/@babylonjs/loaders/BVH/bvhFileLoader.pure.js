import { RegisterSceneLoaderPlugin, } from "@babylonjs/core/Loading/sceneLoader.js";
import { AssetContainer } from "@babylonjs/core/assetContainer.js";
import { Animation } from "@babylonjs/core/Animations/animation.pure.js";
import { BVHFileLoaderMetadata } from "./bvhFileLoader.metadata.js";
import { ReadBvh } from "./bvhLoader.js";
/**
 * @experimental
 * BVH file type loader.
 * This is a babylon scene loader plugin.
 */
export class BVHFileLoader {
    /**
     * Creates loader for bvh motion files
     * @param loadingOptions - Options for the bvh loader
     */
    constructor(loadingOptions) {
        /**
         * Name of the loader ("bvh")
         */
        this.name = BVHFileLoaderMetadata.name;
        /** @internal */
        this.extensions = BVHFileLoaderMetadata.extensions;
        this._loadingOptions = { ...BVHFileLoader._DefaultLoadingOptions, ...(loadingOptions ?? {}) };
    }
    static get _DefaultLoadingOptions() {
        return {
            loopMode: Animation.ANIMATIONLOOPMODE_CYCLE,
        };
    }
    /** @internal */
    createPlugin(options) {
        return new BVHFileLoader(options[BVHFileLoaderMetadata.name]);
    }
    /**
     * If the data string can be loaded directly.
     * @param data - direct load data
     * @returns if the data can be loaded directly
     */
    canDirectLoad(data) {
        return this.isBvhHeader(data);
    }
    /**
     * Returns whether the provided text starts with a BVH HIERARCHY header.
     * @param text - the text to inspect
     * @returns true if the text is a BVH header
     */
    isBvhHeader(text) {
        return text.split("\n")[0] == "HIERARCHY";
    }
    /**
     * Returns whether the provided text does not start with a BVH HIERARCHY header.
     * @param text - the text to inspect
     * @returns true if the text is not a BVH header
     */
    isNotBvhHeader(text) {
        return !this.isBvhHeader(text);
    }
    /**
     * Imports  from the loaded gaussian splatting data and adds them to the scene
     * @param _meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the bvh data to load
     * @returns a promise containing the loaded skeletons and animations
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    importMeshAsync(_meshesNames, scene, data) {
        if (typeof data !== "string") {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects string data.");
        }
        if (this.isNotBvhHeader(data)) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects HIERARCHY header.");
        }
        try {
            const skeleton = ReadBvh(data, scene, null, this._loadingOptions);
            return Promise.resolve({
                meshes: [],
                particleSystems: [],
                skeletons: [skeleton],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
                spriteManagers: [],
            });
        }
        catch (e) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(e);
        }
    }
    /**
     * Imports all objects from the loaded bvh data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the bvh data to load
     * @returns a promise which completes when objects have been loaded to the scene
     */
    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/promise-function-async
    loadAsync(scene, data) {
        if (typeof data !== "string") {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects string data.");
        }
        if (this.isNotBvhHeader(data)) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects HIERARCHY header.");
        }
        // eslint-disable-next-line github/no-then
        return this.importMeshAsync(null, scene, data).then(() => {
            // return void
        });
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @returns The loaded asset container
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    loadAssetContainerAsync(scene, data) {
        if (typeof data !== "string") {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects string data.");
        }
        if (this.isNotBvhHeader(data)) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject("BVH loader expects HIERARCHY header.");
        }
        const assetContainer = new AssetContainer(scene);
        try {
            const skeleton = ReadBvh(data, scene, assetContainer, this._loadingOptions);
            assetContainer.skeletons.push(skeleton);
            return Promise.resolve(assetContainer);
        }
        catch (e) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(e);
        }
    }
}
let _Registered = false;
/**
 * Registers the BVHFileLoader scene loader plugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBVHFileLoader() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterSceneLoaderPlugin(new BVHFileLoader());
}
//# sourceMappingURL=bvhFileLoader.pure.js.map
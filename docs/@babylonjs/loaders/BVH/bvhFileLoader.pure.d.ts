import { type ISceneLoaderPluginAsync, type ISceneLoaderPluginFactory, type ISceneLoaderAsyncResult, type SceneLoaderPluginOptions } from "@babylonjs/core/Loading/sceneLoader.js";
import { AssetContainer } from "@babylonjs/core/assetContainer.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type BVHLoadingOptions } from "./bvhLoadingOptions.js";
/**
 * @experimental
 * BVH file type loader.
 * This is a babylon scene loader plugin.
 */
export declare class BVHFileLoader implements ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
    /**
     * Name of the loader ("bvh")
     */
    readonly name: "bvh";
    /** @internal */
    readonly extensions: {
        readonly ".bvh": {
            readonly isBinary: false;
        };
    };
    private readonly _loadingOptions;
    /**
     * Creates loader for bvh motion files
     * @param loadingOptions - Options for the bvh loader
     */
    constructor(loadingOptions?: Partial<Readonly<BVHLoadingOptions>>);
    private static get _DefaultLoadingOptions();
    /** @internal */
    createPlugin(options: SceneLoaderPluginOptions): ISceneLoaderPluginAsync;
    /**
     * If the data string can be loaded directly.
     * @param data - direct load data
     * @returns if the data can be loaded directly
     */
    canDirectLoad(data: string): boolean;
    /**
     * Returns whether the provided text starts with a BVH HIERARCHY header.
     * @param text - the text to inspect
     * @returns true if the text is a BVH header
     */
    isBvhHeader(text: string): boolean;
    /**
     * Returns whether the provided text does not start with a BVH HIERARCHY header.
     * @param text - the text to inspect
     * @returns true if the text is not a BVH header
     */
    isNotBvhHeader(text: string): boolean;
    /**
     * Imports  from the loaded gaussian splatting data and adds them to the scene
     * @param _meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the bvh data to load
     * @returns a promise containing the loaded skeletons and animations
     */
    importMeshAsync(_meshesNames: string | readonly string[] | null | undefined, scene: Scene, data: unknown): Promise<ISceneLoaderAsyncResult>;
    /**
     * Imports all objects from the loaded bvh data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the bvh data to load
     * @returns a promise which completes when objects have been loaded to the scene
     */
    loadAsync(scene: Scene, data: unknown): Promise<void>;
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene: Scene, data: unknown): Promise<AssetContainer>;
}
/**
 * Registers the BVHFileLoader scene loader plugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBVHFileLoader(): void;

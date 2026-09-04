import { type ISceneLoaderPluginAsync, type ISceneLoaderPluginFactory, type ISceneLoaderAsyncResult, type ISceneLoaderProgressEvent, type SceneLoaderPluginOptions } from "@babylonjs/core/Loading/sceneLoader.js";
import { AssetContainer } from "@babylonjs/core/assetContainer.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type SPLATLoadingOptions } from "./splatLoadingOptions.js";
/**
 * @experimental
 * SPLAT file type loader.
 * This is a babylon scene loader plugin.
 */
export declare class SPLATFileLoader implements ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
    /**
     * Defines the name of the plugin.
     */
    readonly name: "splat";
    private _assetContainer;
    private readonly _loadingOptions;
    /**
     * Defines the extensions the splat loader is able to load.
     * force data to come in as an ArrayBuffer
     */
    readonly extensions: {
        readonly ".splat": {
            readonly isBinary: true;
        };
        readonly ".ply": {
            readonly isBinary: true;
        };
        readonly ".spz": {
            readonly isBinary: true;
        };
        readonly ".json": {
            readonly isBinary: false;
        };
        readonly ".sog": {
            readonly isBinary: true;
        };
    };
    /**
     * Creates loader for gaussian splatting files
     * @param loadingOptions options for loading and parsing splat and PLY files.
     */
    constructor(loadingOptions?: Partial<Readonly<SPLATLoadingOptions>>);
    private static readonly _DefaultLoadingOptions;
    /** @internal */
    createPlugin(options: SceneLoaderPluginOptions): ISceneLoaderPluginAsync;
    /**
     * Imports  from the loaded gaussian splatting data and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the gaussian splatting data to load
     * @param rootUrl root url to load from
     * @param _onProgress callback called while file is loading
     * @param _fileName Defines the name of the file to load
     * @returns a promise containing the loaded meshes, particles, skeletons and animations
     */
    importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, _onProgress?: (event: ISceneLoaderProgressEvent) => void, _fileName?: string): Promise<ISceneLoaderAsyncResult>;
    /**
     * Detects a PlayCanvas-style `lod-meta.json` payload and, if found, creates a streaming mesh for it.
     * @param scene hosting scene
     * @param data loaded file data
     * @param rootUrl root url the metadata's relative paths resolve against
     * @returns the streaming mesh, or null when the data is not SOG LOD metadata
     */
    private _tryCreateLODStream;
    private static _BuildPointCloud;
    private static _BuildMesh;
    private _unzipWithFFlateAsync;
    private _parseAsync;
    /**
     * Extracts the safe-orbit camera limits from parsed splat metadata, or null when the file
     * carries none. Exposed on the loaded mesh (GaussianSplattingMeshBase.safeOrbitCameraLimits)
     * so consumers can apply/track them regardless of the active camera type.
     * @param meta parsed splat meta data
     * @returns the parsed safe-orbit limits, or null
     */
    private static _ExtractSafeOrbitLimits;
    /**
     * Applies safe-orbit camera limits parsed from the file metadata to the scene's active
     * ArcRotateCamera. No-op when no limits are present, `disableAutoCameraLimits` is set, or the
     * active camera is not an ArcRotateCamera — in which case consumers can still read the limits
     * from the loaded mesh's `safeOrbitCameraLimits` and apply them themselves.
     * @param limits parsed safe-orbit limits (see _ExtractSafeOrbitLimits)
     * @param scene
     */
    private applyAutoCameraLimits;
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene: Scene, data: string, rootUrl: string): Promise<AssetContainer>;
    /**
     * Imports all objects from the loaded OBJ data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise which completes when objects have been loaded to the scene
     */
    loadAsync(scene: Scene, data: string, rootUrl: string): Promise<void>;
    /**
     * Code from https://github.com/dylanebert/gsplat.js/blob/main/src/loaders/PLYLoader.ts Under MIT license
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer
     */
    private static _ConvertPLYToSplat;
}
/**
 * Registers the SPLATFileLoader scene loader plugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSPLATFileLoader(): void;

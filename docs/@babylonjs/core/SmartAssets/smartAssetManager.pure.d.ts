import { type Scene } from "../scene.js";
import { type AssetContainer } from "../assetContainer.js";
import { type Node } from "../node.js";
import { type Material } from "../Materials/material.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.js";
import { type AnimationGroup } from "../Animations/animationGroup.js";
import { Observable, type Observer } from "../Misc/observable.js";
import { type ISerializedSmartAssetEntry, type ISerializedSmartAssetMap } from "./smartAssetSerializer.js";
/**
 * Stateful handle for a scene's smart asset registry.
 *
 * Smart asset behavior is exposed through module-level functions rather than
 * class methods so callers can import only the operations they need.
 */
export type SmartAssetManager = {
    /**
     * The scene this manager is attached to.
     */
    readonly scene: Scene;
    /**
     * Fires when the smart asset registry or loaded asset state changes.
     */
    readonly onChangedObservable: Observable<void>;
    /**
     * Optional callback invoked when an asset cannot be found at its registered URL.
     * Return a new URL or File to retry loading, or null to skip the asset.
     */
    onAssetNotFound: ((key: string, expectedUrl: string) => Promise<string | File | null>) | null;
};
/**
 * Optional registration data that helps select the correct loader when the URL
 * does not contain a usable file extension, such as blob-backed local files.
 */
type SmartAssetRegistrationOptions = Pick<ISerializedSmartAssetEntry, "type" | "extension" | "metadata">;
/**
 * Optional load-time configuration. Includes the persistable {@link SmartAssetRegistrationOptions}
 * fields (type, extension, metadata) plus a transient `reloadSource` callback used by
 * {@link ReloadSmartAssetAsync} to fetch fresh bytes from disk for blob-backed assets.
 */
export type SmartAssetLoadOptions = SmartAssetRegistrationOptions & {
    /**
     * Optional callback invoked by {@link ReloadSmartAssetAsync} to obtain a fresh File
     * for the asset. Use this when the registered URL is a `blob:` URL backed by a
     * `FileSystemFileHandle` so Reload can re-read the underlying file from disk.
     */
    readonly reloadSource?: () => Promise<File>;
};
/**
 * Returns the SmartAssetManager attached to the given scene, creating and
 * attaching one if none exists.
 * @param scene - The scene to look up or attach a manager to.
 * @returns The existing or newly created SmartAssetManager.
 */
export declare function GetSmartAssetManager(scene: Scene): SmartAssetManager;
/**
 * Adds an observer that is notified whenever a SmartAssetManager is created.
 * @param callback - The callback to invoke with each newly created manager.
 * @returns The observer registration.
 */
export declare function AddSmartAssetManagerCreatedObserver(callback: (manager: SmartAssetManager) => void): Observer<SmartAssetManager>;
/**
 * Registers a smart asset entry mapping a key to a URL.
 * @param scene - The scene whose smart asset registry to update.
 * @param key - Unique string identifier for this asset.
 * @param url - URL or path to the asset file.
 * @param options - Optional loader hints and metadata for this asset.
 */
export declare function RegisterSmartAsset(scene: Scene, key: string, url: string, options?: SmartAssetRegistrationOptions): void;
/**
 * Removes a key from the registry. If the asset is loaded, it is unloaded first.
 * @param scene - The scene that owns the smart asset.
 * @param key - The key to remove.
 * @returns A promise that resolves when the asset has been unloaded and removed.
 */
export declare function RemoveSmartAssetAsync(scene: Scene, key: string): Promise<void>;
/**
 * Returns all registered key-to-URL mappings.
 * @param scene - The scene whose smart asset registry to read.
 * @returns A read-only map of keys to URLs.
 */
export declare function GetAllSmartAssets(scene: Scene): ReadonlyMap<string, string>;
/**
 * Loads a scene-file asset by key.
 * @param scene - The scene to load the asset into.
 * @param key - The key to load.
 * @param url - Optional URL. If provided, the key is registered first.
 * @param options - Optional loader hints and metadata for this asset.
 * @returns A promise resolving to the loaded AssetContainer.
 */
export declare function LoadSmartAssetAsync(scene: Scene, key: string, url?: string, options?: SmartAssetLoadOptions): Promise<AssetContainer>;
/**
 * Loads all registered assets concurrently.
 * @param scene - The scene whose registered assets to load.
 * @returns A promise resolving to loaded scene-file containers.
 */
export declare function LoadAllSmartAssetsAsync(scene: Scene): Promise<AssetContainer[]>;
/**
 * Loads a standalone texture by key.
 * @param scene - The scene to load the texture into.
 * @param key - The key to load.
 * @param url - Optional URL. If provided, the key is registered first.
 * @param options - Optional loader hints and metadata for this asset.
 * @returns A promise resolving to the loaded texture.
 */
export declare function LoadSmartAssetTextureAsync(scene: Scene, key: string, url?: string, options?: SmartAssetLoadOptions): Promise<BaseTexture>;
/**
 * Unloads a loaded asset while keeping the key registered.
 * @param scene - The scene whose smart asset to unload.
 * @param key - The key to unload.
 * @returns A promise that resolves once the asset has been unloaded.
 */
export declare function UnloadSmartAssetAsync(scene: Scene, key: string): Promise<void>;
/**
 * Unloads and re-loads an asset.
 * @param scene - The scene whose smart asset to reload.
 * @param key - The key to reload.
 * @returns A promise resolving to the newly loaded AssetContainer or BaseTexture.
 */
export declare function ReloadSmartAssetAsync(scene: Scene, key: string): Promise<AssetContainer | BaseTexture>;
/**
 * Finds which smart asset key owns a scene object.
 * @param scene - The scene whose registry to search.
 * @param object - A scene object.
 * @returns The key, or undefined if the object is not tracked.
 */
export declare function FindSmartAssetKeyForObject(scene: Scene, object: Node | Material | BaseTexture | AnimationGroup): string | undefined;
/**
 * Serializes the registry to a JSON-compatible document.
 * If a baseUrl is provided, asset URLs are stored relative to it for portability.
 * @param scene - The scene whose registry to serialize.
 * @param baseUrl - Optional base URL for making asset paths relative.
 * @returns A serialized asset map document.
 */
export declare function SerializeSmartAssetManagerMap(scene: Scene, baseUrl?: string): ISerializedSmartAssetMap;
/**
 * Loads an asset map from a URL, File, or pre-parsed JSON object.
 * @param scene - The scene to load assets into.
 * @param source - A URL string, File object, or pre-parsed ISerializedSmartAssetMap.
 * @param rootUrl - Optional root URL for resolving relative asset paths.
 * @returns A promise that resolves after the map has been loaded and all registered assets have been attempted.
 */
export declare function LoadSmartAssetMapAsync(scene: Scene, source: string | File | ISerializedSmartAssetMap, rootUrl?: string): Promise<void>;
/**
 * Disposes the manager, unloading all assets and detaching it from its scene.
 * Safe to call multiple times; subsequent calls are no-ops. Automatically invoked when the
 * owning scene is disposed.
 * @param manager - The smart asset manager state.
 */
export declare function DisposeSmartAssetManager(manager: SmartAssetManager): void;
/**
 * Returns the set of file extensions (including the leading dot) that {@link LoadAllSmartAssetsAsync}
 * treats as standalone textures.
 * @returns A read-only set of texture file extensions.
 */
export declare function GetSmartAssetTextureExtensions(): ReadonlySet<string>;
export {};

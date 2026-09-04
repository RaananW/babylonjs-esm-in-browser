/**
 * A serialized smart asset entry in the asset map JSON document.
 */
export interface ISerializedSmartAssetEntry {
    /** URL or path to the asset file. */
    readonly url: string;
    /** Optional loader type hint (e.g., "gltf", "texture"). */
    readonly type?: string;
    /** Optional file extension hint (e.g., ".glb", ".png"). */
    readonly extension?: string;
    /** Optional user-defined metadata. */
    readonly metadata?: Record<string, unknown>;
}
/**
 * A versioned JSON document describing a smart asset map.
 * This is the on-disk format for persisting the asset table.
 *
 * Runtime object ownership is intentionally not persisted — it is rebuilt from
 * each loaded `AssetContainer` after load. Persisting it would risk staleness.
 */
export interface ISerializedSmartAssetMap {
    /** Schema version. Must be 1 for the current version. */
    readonly version: 1;
    /** Map of asset keys to their serialized entries. */
    readonly assets: Record<string, ISerializedSmartAssetEntry>;
}
/**
 * Validates and parses a serialized smart asset map document.
 * @param data - The raw data to validate (typically parsed JSON).
 * @returns The validated document.
 * @throws If the data does not conform to the expected schema.
 */
export declare function DeserializeSmartAssetMap(data: unknown): ISerializedSmartAssetMap;
/**
 * Returns true for `data:`, `blob:`, or any URL with an absolute protocol.
 * @param url - The URL to inspect.
 * @returns Whether the URL is absolute or a data/blob URI.
 */
export declare function IsAbsoluteOrSpecialUrl(url: string): boolean;
/**
 * Resolves an asset URL relative to a base URL.
 * Absolute URLs (http://, https://) and data URIs are returned as-is.
 * @param assetUrl - The asset URL to resolve.
 * @param baseUrl - The base URL to resolve against (typically the folder containing the asset map file).
 * @returns The resolved URL.
 */
export declare function ResolveAssetUrl(assetUrl: string, baseUrl: string): string;
/**
 * Makes a URL relative to a base URL by stripping the common folder prefix.
 * If the URL doesn't share a prefix with baseUrl, returns it unchanged.
 * @param url - The URL to relativize.
 * @param baseUrl - The base URL whose folder is the relativization root.
 * @returns The relativized URL, or the original if no common prefix exists.
 */
export declare function MakeRelative(url: string, baseUrl: string): string;
/**
 * Reads a JSON source from a string URL, File object, or pre-parsed object.
 * @param source - The source to read.
 * @returns A promise resolving to the parsed JSON data.
 */
export declare function ReadJsonSourceAsync(source: string | File | object): Promise<unknown>;

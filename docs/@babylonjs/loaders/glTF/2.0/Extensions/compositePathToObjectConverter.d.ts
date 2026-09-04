import { type IObjectInfo, type IPathToObjectConverter } from "@babylonjs/core/ObjectModel/objectModelInterfaces.js";
/**
 * Entry in the composite converter's prefix table. The first entry whose
 * `prefix` matches the start of the path wins.
 */
export interface IPathConverterPrefixEntry<T> {
    /** Path prefix to match, e.g. `"/extensions/BABYLON_scene_objects/"`. */
    prefix: string;
    /** Converter to delegate to when the path starts with `prefix`. */
    converter: IPathToObjectConverter<T>;
}
/**
 * Composite path-to-object converter that dispatches by path prefix.
 *
 * The KHR_interactivity object model lives at the top of the JSON tree
 * (`/nodes/...`, `/materials/...`, `/extensions/...`) and is resolved by
 * `GLTFPathToObjectConverter` (see `gltfPathToObjectConverter`).
 *
 * Babylon-specific extensions can register additional namespaces here
 * (for example `/extensions/BABYLON_scene_objects/...` for refs that point
 * at scene objects not described by the source glTF) without forcing every
 * caller to know about them — `FlowGraphJsonPointerParserBlock` and the
 * existing template substitution machinery treat any path uniformly.
 *
 * Prefix entries are tried in order; if none matches, the fallback converter
 * is used. The fallback is typically the glTF converter, since standard
 * KHR_interactivity pointer paths sit at the JSON root and have no shared
 * prefix that would distinguish them from a missing namespace.
 */
export declare class CompositePathToObjectConverter<T> implements IPathToObjectConverter<T> {
    private _prefixes;
    private _fallback;
    /**
     * @param _prefixes prefix-keyed converter table, tried in order
     * @param _fallback converter used when no prefix entry matches
     */
    constructor(_prefixes: IPathConverterPrefixEntry<T>[], _fallback: IPathToObjectConverter<T>);
    /**
     * Adds a new prefix entry at the front of the lookup list so it is tried
     * before any entries registered earlier. Useful for late-registered
     * loader extensions that want to override or augment a previously
     * registered namespace.
     * @param entry the entry to add
     */
    addPrefix(entry: IPathConverterPrefixEntry<T>): void;
    /**
     * @param path the JSON Pointer path to resolve
     * @returns an object accessor for the resolved property
     */
    convert(path: string): IObjectInfo<T>;
}

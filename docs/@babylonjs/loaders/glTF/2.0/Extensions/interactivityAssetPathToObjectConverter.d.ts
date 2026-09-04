import { type IObjectInfo, type IPathToObjectConverter } from "@babylonjs/core/ObjectModel/objectModelInterfaces.js";
import { type IObjectAccessor } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
import { type IGLTF } from "../glTFLoaderInterfaces.js";
/**
 * Path prefix of the KHR_interactivity asset-capability pointers (spec §4.1 Asset Capabilities).
 */
export declare const InteractivityAssetCapabilitiesPrefix = "/extensions/KHR_interactivity/asset/";
/**
 * Path prefix of the KHR_interactivity runtime-limit pointers (spec §4.2 Implementation-Specific Runtime Limits).
 */
export declare const InteractivityLimitsPrefix = "/extensions/KHR_interactivity/limits/";
/**
 * Path-to-object converter that resolves the virtual KHR_interactivity pointers describing the capabilities of the
 * asset and of the implementation running it:
 *
 *  - `/extensions/KHR_interactivity/asset/majorVersion` and `.../minorVersion` — the glTF version the asset is
 *    presented with.
 *  - `/extensions/KHR_interactivity/asset/extensions/<EXTENSION_NAME>/enabled` — whether the extension is both
 *    listed in `extensionsUsed` and supported by this loader. Reading an extension that is not used or not
 *    supported resolves successfully and yields `false`, so a behavior graph can branch on extension support.
 *  - `/extensions/KHR_interactivity/limits/<LIMIT_NAME>` — the implementation-specific runtime limits.
 *
 * All of these are read-only.
 */
export declare class InteractivityAssetPathToObjectConverter implements IPathToObjectConverter<IObjectAccessor> {
    private _gltf;
    private _isExtensionEnabled;
    /**
     * @param _gltf the loaded glTF, used to read the asset version
     * @param _isExtensionEnabled predicate telling whether a glTF extension is both used by the asset and supported
     * by this loader
     */
    constructor(_gltf: IGLTF, _isExtensionEnabled: (name: string) => boolean);
    /**
     * @param path the JSON Pointer to resolve
     * @returns an object accessor for the addressed capability
     * @throws if the path does not address a known capability, which `pointer/get` surfaces as `isValid = false`
     */
    convert(path: string): IObjectInfo<IObjectAccessor>;
    private _createAccessor;
}

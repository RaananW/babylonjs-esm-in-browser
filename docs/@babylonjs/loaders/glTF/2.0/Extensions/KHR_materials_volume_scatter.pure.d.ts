import { type Nullable } from "@babylonjs/core/types.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type IMaterial } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * TODO: In-progress specification
 * [Specification](https://github.com/KhronosGroup/glTF/blob/7ea427ed55d44427e83c0a6d1c87068b1a4151c5/extensions/2.0/Khronos/KHR_materials_volume_scatter/README.md)
 * @experimental
 * @since 9.0.0
 */
export declare class KHR_materials_volume_scatter implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_materials_volume_scatter";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    /**
     * Defines a number that determines the order the extensions are applied.
     */
    order: number;
    private _loader;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    /** @internal */
    dispose(): void;
    /**
     * @internal
     */
    loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    private _loadVolumePropertiesAsync;
}
/**
 * Registers the KHR_materials_volume_scatter glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_materials_volume_scatter(): void;

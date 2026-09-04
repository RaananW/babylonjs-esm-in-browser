import { type Nullable } from "@babylonjs/core/types.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type IMaterial } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy)
 */
export declare class KHR_materials_anisotropy implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_materials_anisotropy";
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
    private _loadAnisotropyPropertiesAsync;
}
/**
 * Registers the KHR_materials_anisotropy glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_materials_anisotropy(): void;

import { type Nullable } from "@babylonjs/core/types.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type IMaterial } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/6cb2cb84b504c245c49cf2e9a8ae16d26f72ac97/extensions/2.0/Khronos/KHR_materials_coat/README.md)
 * @experimental
 */
export declare class KHR_materials_coat implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_materials_coat";
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
     * Defines whether the KHR_materials_openpbr extension is used, indicating that
     * the material should be interpreted as OpenPBR (for coat, this might be necessary
     * to interpret anisotropy correctly).
     */
    private useOpenPBR;
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
    private _loadCoatPropertiesAsync;
}
/**
 * Registers the KHR_materials_coat glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_materials_coat(): void;

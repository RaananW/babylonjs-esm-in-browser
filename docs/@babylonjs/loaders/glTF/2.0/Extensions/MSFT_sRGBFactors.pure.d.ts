import { type Nullable } from "@babylonjs/core/types.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type IMaterial } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/** @internal */
export declare class MSFT_sRGBFactors implements IGLTFLoaderExtension {
    /** @internal */
    readonly name = "MSFT_sRGBFactors";
    /** @internal */
    enabled: boolean;
    private _loader;
    /** @internal */
    constructor(loader: GLTFLoader);
    /** @internal */
    dispose(): void;
    /** @internal*/
    loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
}
/**
 * Registers the MSFT_sRGBFactors glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMSFT_sRGBFactors(): void;

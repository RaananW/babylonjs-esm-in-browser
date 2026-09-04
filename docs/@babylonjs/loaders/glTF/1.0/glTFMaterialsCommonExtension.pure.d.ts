import { GLTFLoaderExtension } from "./glTFLoader.pure.js";
import { type IGLTFRuntime } from "./glTFLoaderInterfaces.js";
import { Material } from "@babylonjs/core/Materials/material.pure.js";
/**
 * @internal
 * @deprecated
 */
export declare class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
    constructor();
    loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime): boolean;
    loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): boolean;
    private _loadTexture;
}
/**
 * Registers the KHR_materials_common extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGLTFMaterialsCommonExtension(): void;

import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type ITexture } from "../glTFLoaderInterfaces.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type Nullable } from "@babylonjs/core/types.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_basisu/README.md)
 */
export declare class KHR_texture_basisu implements IGLTFLoaderExtension {
    /** The name of this extension. */
    readonly name = "KHR_texture_basisu";
    /** Defines whether this extension is enabled. */
    enabled: boolean;
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
    _loadTextureAsync(context: string, texture: ITexture, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
}
/**
 * Registers the KHR_texture_basisu glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_texture_basisu(): void;

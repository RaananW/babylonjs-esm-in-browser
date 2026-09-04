import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type ITexture } from "../glTFLoaderInterfaces.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type Nullable } from "@babylonjs/core/types.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_texture_webp/README.md)
 */
export declare class EXT_texture_webp implements IGLTFLoaderExtension {
    /** The name of this extension. */
    readonly name = "EXT_texture_webp";
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
 * Registers the EXT_texture_webp glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEXT_texture_webp(): void;

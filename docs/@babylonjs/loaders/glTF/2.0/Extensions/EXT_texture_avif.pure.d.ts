import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type ITexture } from "../glTFLoaderInterfaces.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type Nullable } from "@babylonjs/core/types.js";
/**
 * [glTF PR](https://github.com/KhronosGroup/glTF/pull/2235)
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_texture_avif/README.md)
 */
export declare class EXT_texture_avif implements IGLTFLoaderExtension {
    /** The name of this extension. */
    readonly name = "EXT_texture_avif";
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
 * Registers the EXT_texture_avif glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEXT_texture_avif(): void;

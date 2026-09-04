import { type Nullable } from "@babylonjs/core/types.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type IBufferView } from "../glTFLoaderInterfaces.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)
 *
 * This extension uses a WebAssembly decoder module from https://github.com/zeux/meshoptimizer/tree/master/js
 * @since 5.0.0
 */
export declare class EXT_meshopt_compression implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "EXT_meshopt_compression";
    /**
     * Defines whether this extension is enabled.
     */
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
    loadBufferViewAsync(context: string, bufferView: IBufferView): Nullable<Promise<ArrayBufferView>>;
}
/**
 * Registers the EXT_meshopt_compression glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEXT_meshopt_compression(): void;

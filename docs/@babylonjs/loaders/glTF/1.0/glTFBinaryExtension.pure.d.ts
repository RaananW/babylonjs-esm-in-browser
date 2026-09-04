import { GLTFLoaderExtension } from "./glTFLoader.pure.js";
import { type Scene } from "@babylonjs/core/scene.pure.js";
import { type IGLTFLoaderData } from "../glTFFileLoader.pure.js";
import { type IGLTFRuntime } from "./glTFLoaderInterfaces.js";
/**
 * @internal
 * @deprecated
 */
export declare class GLTFBinaryExtension extends GLTFLoaderExtension {
    private _bin;
    constructor();
    loadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess: (gltfRuntime: IGLTFRuntime) => void): boolean;
    loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
    loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void): boolean;
    loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void): boolean;
}
/**
 * Registers the KHR_binary_glTF extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGLTFBinaryExtension(): void;

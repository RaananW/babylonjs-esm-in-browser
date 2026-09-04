import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { type INode } from "../glTFLoaderInterfaces.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)
 * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
 */
export declare class EXT_mesh_gpu_instancing implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "EXT_mesh_gpu_instancing";
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
    loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
}
/**
 * Registers the EXT_mesh_gpu_instancing glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEXT_mesh_gpu_instancing(): void;

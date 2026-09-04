import { type Nullable } from "@babylonjs/core/types.js";
import { type AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.pure.js";
import { type IMeshPrimitive, type INode, type IMesh } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_gaussian_splatting/README.md)
 * Loads a mesh primitive tagged with KHR_gaussian_splatting as a {@link GaussianSplattingMesh}.
 */
export declare class KHR_gaussian_splatting implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_gaussian_splatting";
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
    _loadMeshPrimitiveAsync(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Nullable<Promise<AbstractMesh>>;
}
/**
 * Registers the KHR_gaussian_splatting glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_gaussian_splatting(): void;

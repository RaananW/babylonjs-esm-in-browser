import { type Nullable } from "@babylonjs/core/types.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { type AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.js";
import { type INode, type IMeshPrimitive, type IMesh } from "../glTFLoaderInterfaces.js";
import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
export type MaterialVariantsController = {
    /**
     * The list of available variant names for this asset.
     */
    readonly variants: readonly string[];
    /**
     * Gets or sets the selected variant.
     */
    selectedVariant: string;
};
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_variants/README.md)
 */
export declare class KHR_materials_variants implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_materials_variants";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _loader;
    private _variants?;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    /** @internal */
    dispose(): void;
    /**
     * Gets the list of available variant names for this asset.
     * @param rootNode The glTF root node
     * @returns the list of all the variant names for this model
     */
    static GetAvailableVariants(rootNode: TransformNode): string[];
    /**
     * Gets the list of available variant names for this asset.
     * @param rootNode The glTF root node
     * @returns the list of all the variant names for this model
     */
    getAvailableVariants(rootNode: TransformNode): string[];
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootNode The glTF root node
     * @param variantName The variant name(s) to select.
     */
    static SelectVariant(rootNode: TransformNode, variantName: string | string[]): void;
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootNode The glTF root node
     * @param variantName The variant name(s) to select.
     */
    selectVariant(rootNode: TransformNode, variantName: string | string[]): void;
    /**
     * Reset back to the original before selecting a variant.
     * @param rootNode The glTF root node
     */
    static Reset(rootNode: TransformNode): void;
    /**
     * Reset back to the original before selecting a variant.
     * @param rootNode The glTF root node
     */
    reset(rootNode: TransformNode): void;
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootNode The glTF root node
     * @returns The selected variant name(s).
     */
    static GetLastSelectedVariant(rootNode: TransformNode): Nullable<string | string[]>;
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootNode The glTF root node
     * @returns The selected variant name(s).
     */
    getLastSelectedVariant(rootNode: TransformNode): Nullable<string | string[]>;
    private static _GetExtensionMetadata;
    /** @internal */
    onLoading(): void;
    /** @internal */
    onReady(): void;
    /**
     * @internal
     */
    _loadMeshPrimitiveAsync(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Nullable<Promise<AbstractMesh>>;
}
/**
 * Registers the KHR_materials_variants glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_materials_variants(): void;

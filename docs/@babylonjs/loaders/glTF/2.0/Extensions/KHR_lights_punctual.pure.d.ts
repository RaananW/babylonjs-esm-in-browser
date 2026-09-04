import { type Nullable } from "@babylonjs/core/types.js";
import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
import { type INode } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_lights_punctual/README.md)
 */
export declare class KHR_lights implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_lights_punctual";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    /** hidden */
    private _loader;
    private _lights?;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    /** @internal */
    dispose(): void;
    /** @internal */
    onLoading(): void;
    /**
     * @internal
     */
    loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
}
/**
 * Registers the KHR_lights glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_lights(): void;

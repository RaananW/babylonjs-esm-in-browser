import { type Nullable } from "@babylonjs/core/types.js";
import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
import { type Camera } from "@babylonjs/core/Cameras/camera.pure.js";
import { type AnimationGroup } from "@babylonjs/core/Animations/animationGroup.pure.js";
import { type INode, type ICamera, type IMaterial, type IAnimation } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { type GLTFLoader } from "../glTFLoader.pure.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
/**
 * Store glTF extras (if present) in BJS objects' metadata
 */
export declare class ExtrasAsMetadata implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "ExtrasAsMetadata";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _loader;
    private _assignExtras;
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
    /**
     * @internal
     */
    loadCameraAsync(context: string, camera: ICamera, assign: (babylonCamera: Camera) => void): Nullable<Promise<Camera>>;
    /**
     * @internal
     */
    createMaterial(context: string, material: IMaterial, babylonDrawMode: number): Nullable<Material>;
    /**
     * @internal
     */
    loadAnimationAsync(context: string, animation: IAnimation): Nullable<Promise<AnimationGroup>>;
}
/**
 * Registers the ExtrasAsMetadata glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterExtrasAsMetadata(): void;

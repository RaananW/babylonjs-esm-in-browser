import { Skeleton } from "@babylonjs/core/Bones/skeleton.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { type BVHLoadingOptions } from "./bvhLoadingOptions.js";
import { type AssetContainer } from "@babylonjs/core/assetContainer.js";
/**
 * Reads a BVH file, returns a skeleton
 * @param text - The BVH file content
 * @param scene - The scene to add the skeleton to
 * @param assetContainer - The asset container to add the skeleton to
 * @param loadingOptions - The loading options
 * @returns The skeleton
 */
export declare function ReadBvh(text: string, scene: Scene, assetContainer: Nullable<AssetContainer>, loadingOptions: BVHLoadingOptions): Skeleton;

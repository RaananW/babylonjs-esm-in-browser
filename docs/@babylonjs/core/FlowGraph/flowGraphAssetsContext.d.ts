import { type AnimationGroup } from "../Animations/animationGroup.js";
import { type Animation } from "../Animations/animation.js";
import { type Nullable } from "../types.js";
import { type Mesh } from "../Meshes/mesh.js";
import { type Material } from "../Materials/material.js";
import { type Camera } from "../Cameras/camera.js";
import { type Light } from "../Lights/light.js";
import { type IAssetContainer } from "../IAssetContainer.js";
/**
 * The type of the assets that flow graph supports
 */
export declare enum FlowGraphAssetType {
    Animation = "Animation",
    AnimationGroup = "AnimationGroup",
    Mesh = "Mesh",
    Material = "Material",
    Camera = "Camera",
    Light = "Light"
}
export type AssetType<T extends FlowGraphAssetType> = T extends FlowGraphAssetType.Animation ? Animation : T extends FlowGraphAssetType.AnimationGroup ? AnimationGroup : T extends FlowGraphAssetType.Mesh ? Mesh : T extends FlowGraphAssetType.Material ? Material : T extends FlowGraphAssetType.Camera ? Camera : T extends FlowGraphAssetType.Light ? Light : never;
/**
 * Returns the asset with the given index and type from the assets context.
 * @param assetsContext The assets context to get the asset from
 * @param type The type of the asset
 * @param index The index of the asset
 * @param useIndexAsUniqueId If set to true, instead of the index in the array it will search for the unique id of the asset.
 * @returns The asset or null if not found
 */
export declare function GetFlowGraphAssetWithType<T extends FlowGraphAssetType>(assetsContext: IAssetContainer, type: T, index: number, useIndexAsUniqueId?: boolean): Nullable<AssetType<T>>;

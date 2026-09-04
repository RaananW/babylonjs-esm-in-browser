/** This file must only contain pure code and pure imports */
import { Material } from "../../Materials/material.pure.js";
import { AssetContainer } from "../../assetContainer.js";
import { Skeleton } from "../../Bones/skeleton.js";
import { MorphTargetManager } from "../../Morph/morphTargetManager.js";
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
/** @internal */
export declare var _BabylonLoaderRegistered: boolean;
/**
 * Helps setting up some configuration for the babylon file loader.
 */
export declare class BabylonFileLoaderConfiguration {
    /**
     * The loader does not allow injecting custom physics engine into the plugins.
     * Unfortunately in ES6, we need to manually inject them into the plugin.
     * So you could set this variable to your engine import to make it work.
     */
    static LoaderInjectedPhysicsEngine: any;
}
export declare let TempMaterialIndexContainer: {
    [key: string]: Material;
};
export declare let TempMorphTargetManagerIndexContainer: {
    [key: string]: MorphTargetManager;
};
export declare let TempSkeletonIndexContainer: {
    [key: number]: Skeleton;
};
export declare const logOperation: (operation: string, producer: {
    file: string;
    name: string;
    version: string;
    exporter_version: string;
}) => string;
export declare const LoadDetailLevels: (scene: Scene, mesh: AbstractMesh) => void;
export declare const FindMaterial: (materialId: any, scene: Scene) => Nullable<Material>;
/**
 * @experimental
 * Loads an AssetContainer from a serialized Babylon scene.
 * @param scene The scene to load the asset container into.
 * @param serializedScene The serialized scene data. This can be either a JSON string, or an object (e.g. from a call to JSON.parse).
 * @param rootUrl The root URL for loading assets.
 * @returns The loaded AssetContainer.
 */
export declare function LoadAssetContainerFromSerializedScene(scene: Scene, serializedScene: string | object, rootUrl: string): AssetContainer;
export declare const LoadAssetContainer: (scene: Scene, data: string | object, rootUrl: string, onError?: (message: string, exception?: any) => void, addToScene?: boolean) => AssetContainer;
/**
 * Register side effects for babylonFileLoader.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBabylonFileLoader(): void;

import { type IndicesArray, type Nullable } from "@babylonjs/core/types.js";
import { Camera } from "@babylonjs/core/Cameras/camera.pure.js";
import { type Animation } from "@babylonjs/core/Animations/animation.js";
import { type IAnimatable } from "@babylonjs/core/Animations/animatable.interface.js";
import { type AnimationGroup } from "@babylonjs/core/Animations/animationGroup.pure.js";
import { Material } from "@babylonjs/core/Materials/material.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.pure.js";
import { Buffer, VertexBuffer } from "@babylonjs/core/Buffers/buffer.pure.js";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.pure.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure.js";
import { type ISceneLoaderAsyncResult, type ISceneLoaderProgressEvent } from "@babylonjs/core/Loading/sceneLoader.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type IProperty } from "babylonjs-gltf2interface";
import { type IGLTF, type ISampler, type INode, type IScene, type IMesh, type IAccessor, type ICamera, type IAnimation, type IBuffer, type IBufferView, type IMaterial, type ITextureInfo, type ITexture, type IImage, type IMeshPrimitive, type IArrayItem, type IAnimationChannel } from "./glTFLoaderInterfaces.js";
import { type IGLTFLoader, type IGLTFLoaderData, GLTFFileLoader } from "../glTFFileLoader.pure.js";
import { type IDataBuffer } from "@babylonjs/core/Misc/dataReader.js";
import { type Light } from "@babylonjs/core/Lights/light.js";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo.js";
import { type AssetContainer } from "@babylonjs/core/assetContainer.js";
import { type AnimationPropertyInfo } from "./glTFLoaderAnimation.pure.js";
import { type IObjectInfo } from "@babylonjs/core/ObjectModel/objectModelInterfaces.js";
import { type GLTFExtensionFactory } from "./glTFLoaderExtensionRegistry.js";
import { type IInterpolationPropertyInfo } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
import { type IMaterialLoadingAdapter } from "./materialLoadingAdapter.js";
export { GLTFFileLoader };
interface IWithMetadata {
    metadata: any;
    _internalMetadata: any;
}
/**
 * Helper class for working with arrays when loading the glTF asset
 */
export declare class ArrayItem {
    /**
     * Gets an item from the given array.
     * @param context The context when loading the asset
     * @param array The array to get the item from
     * @param index The index to the array
     * @returns The array item
     */
    static Get<T>(context: string, array: ArrayLike<T> | undefined, index: number | undefined): T;
    /**
     * Gets an item from the given array or returns null if not available.
     * @param array The array to get the item from
     * @param index The index to the array
     * @returns The array item or null
     */
    static TryGet<T>(array: ArrayLike<T> | undefined, index: number | undefined): Nullable<T>;
    /**
     * Assign an `index` field to each item of the given array.
     * @param array The array of items
     */
    static Assign(array?: IArrayItem[]): void;
}
/** @internal */
export interface IAnimationTargetInfo {
    /** @internal */
    target: unknown;
    /** @internal */
    properties: Array<AnimationPropertyInfo>;
}
/** @internal */
export declare function LoadBoundingInfoFromPositionAccessor(accessor: IAccessor): Nullable<BoundingInfo>;
type PBRMaterialImplementation = {
    materialClass: typeof Material;
    adapterClass: new (material: Material) => IMaterialLoadingAdapter;
};
/**
 * The glTF 2.0 loader
 */
export declare class GLTFLoader implements IGLTFLoader {
    /** @internal */
    readonly _completePromises: Promise<unknown>[];
    /** @internal */
    _assetContainer: Nullable<AssetContainer>;
    /** Storage */
    _babylonLights: Light[];
    /** @internal */
    _disableInstancedMesh: number;
    /** @internal */
    _allMaterialsDirtyRequired: boolean;
    /** @internal */
    _skipStartAnimationStep: boolean;
    private readonly _parent;
    private readonly _extensions;
    /** @internal */
    _disposed: boolean;
    private _rootUrl;
    private _fileName;
    private _uniqueRootUrl;
    private _gltf;
    private _bin;
    private _babylonScene;
    private _rootBabylonMesh;
    private _defaultBabylonMaterialData;
    private readonly _postSceneLoadActions;
    private readonly _materialAdapterCache;
    private readonly _materialAdapters;
    /**
     * Loaded PBR material implementations, keyed by their identifier (e.g. "pbr", "openpbr").
     * Only populated after the load has started and only for the types actually needed by the asset.
     * Empty when PBR materials are disabled (skipMaterials).
     * @internal
     */
    readonly _pbrMaterialImpls: Map<string, Readonly<PBRMaterialImplementation>>;
    /**
     * Test if the given material is an instance of any PBR material type known to this loader.
     * @param material The material to test
     * @returns true if the material matches one of the loaded PBR implementations
     */
    isMatchingMaterialType(material: Nullable<Material>): boolean;
    /**
     * The default glTF sampler.
     */
    static readonly DefaultSampler: ISampler;
    /**
     * Registers a loader extension.
     * @param name The name of the loader extension.
     * @param factory The factory function that creates the loader extension.
     * @deprecated Please use registerGLTFExtension instead.
     */
    static RegisterExtension(name: string, factory: GLTFExtensionFactory): void;
    /**
     * Unregisters a loader extension.
     * @param name The name of the loader extension.
     * @returns A boolean indicating whether the extension has been unregistered
     * @deprecated Please use unregisterGLTFExtension instead.
     */
    static UnregisterExtension(name: string): boolean;
    /**
     * The object that represents the glTF JSON.
     */
    get gltf(): IGLTF;
    /**
     * The BIN chunk of a binary glTF.
     */
    get bin(): Nullable<IDataBuffer>;
    /**
     * The parent file loader.
     */
    get parent(): GLTFFileLoader;
    /**
     * The Babylon scene when loading the asset.
     */
    get babylonScene(): Scene;
    /**
     * The root Babylon node when loading the asset.
     */
    get rootBabylonMesh(): Nullable<TransformNode>;
    /**
     * The root url when loading the asset.
     */
    get rootUrl(): Nullable<string>;
    /**
     * @internal
     */
    constructor(parent: GLTFFileLoader);
    /**
     * Creates or gets a cached material loading adapter with dynamic imports
     * @param material The material to adapt
     * @returns Promise that resolves to the appropriate adapter
     * @internal
     */
    _getOrCreateMaterialAdapter(material: Material): IMaterialLoadingAdapter;
    /** @internal */
    dispose(): void;
    /**
     * @internal
     */
    importMeshAsync(meshesNames: string | readonly string[] | null | undefined, scene: Scene, container: Nullable<AssetContainer>, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<ISceneLoaderAsyncResult>;
    /**
     * @internal
     */
    loadAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
    private _loadAsync;
    private _loadData;
    private _setupData;
    private _loadExtensionsAsync;
    private _createRootNode;
    /**
     * Loads a glTF scene.
     * @param context The context when loading the asset
     * @param scene The glTF scene property
     * @returns A promise that resolves when the load is complete
     */
    loadSceneAsync(context: string, scene: IScene): Promise<void>;
    private _forEachPrimitive;
    private _getGeometries;
    private _getMeshes;
    private _getTransformNodes;
    private _getSkeletons;
    private _getAnimationGroups;
    private _startAnimations;
    /**
     * Loads a glTF node.
     * @param context The context when loading the asset
     * @param node The glTF node property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
     */
    loadNodeAsync(context: string, node: INode, assign?: (babylonTransformNode: TransformNode) => void): Promise<TransformNode>;
    private _loadMeshAsync;
    /**
     * @internal Define this method to modify the default behavior when loading data for mesh primitives.
     * @param context The context when loading the asset
     * @param name The mesh name when loading the asset
     * @param node The glTF node when loading the asset
     * @param mesh The glTF mesh when loading the asset
     * @param primitive The glTF mesh primitive property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
     */
    _loadMeshPrimitiveAsync(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Promise<AbstractMesh>;
    private _loadVertexDataAsync;
    private _createMorphTargets;
    private _loadMorphTargetsAsync;
    private _loadMorphTargetVertexDataAsync;
    private static _LoadTransform;
    private _loadSkinAsync;
    private _loadBones;
    private _findSkeletonRootNode;
    private _loadBone;
    private _loadSkinInverseBindMatricesDataAsync;
    private _updateBoneMatrices;
    private _getNodeMatrix;
    /**
     * Loads a glTF camera.
     * @param context The context when loading the asset
     * @param camera The glTF camera property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon camera when the load is complete
     */
    loadCameraAsync(context: string, camera: ICamera, assign?: (babylonCamera: Camera) => void): Promise<Camera>;
    private _loadAnimationsAsync;
    /**
     * Loads a glTF animation.
     * @param context The context when loading the asset
     * @param animation The glTF animation property
     * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
     */
    loadAnimationAsync(context: string, animation: IAnimation): Promise<AnimationGroup>;
    /**
     * @hidden
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete
     */
    _loadAnimationChannelAsync(context: string, animationContext: string, animation: IAnimation, channel: IAnimationChannel, onLoad: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): Promise<void>;
    /**
     * @hidden
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param targetInfo The glTF target and properties
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete
     */
    _loadAnimationChannelFromTargetInfoAsync(context: string, animationContext: string, animation: IAnimation, channel: IAnimationChannel, targetInfo: IObjectInfo<IInterpolationPropertyInfo[]>, onLoad: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): Promise<void>;
    private _loadAnimationSamplerAsync;
    /**
     * Loads a glTF buffer.
     * @param context The context when loading the asset
     * @param buffer The glTF buffer property
     * @param byteOffset The byte offset to use
     * @param byteLength The byte length to use
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadBufferAsync(context: string, buffer: IBuffer, byteOffset: number, byteLength: number): Promise<ArrayBufferView>;
    /**
     * Loads a glTF buffer view.
     * @param context The context when loading the asset
     * @param bufferView The glTF buffer view property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadBufferViewAsync(context: string, bufferView: IBufferView): Promise<ArrayBufferView>;
    private _loadAccessorAsync;
    /**
     * @internal
     */
    _loadFloatAccessorAsync(context: string, accessor: IAccessor): Promise<Float32Array>;
    /**
     * @internal
     */
    _loadIndicesAccessorAsync(context: string, accessor: IAccessor): Promise<IndicesArray>;
    /**
     * @internal
     */
    _loadVertexBufferViewAsync(bufferView: IBufferView): Promise<Buffer>;
    /**
     * @internal
     */
    _loadVertexAccessorAsync(context: string, accessor: IAccessor, kind: string): Promise<VertexBuffer>;
    private _loadMaterialMetallicRoughnessPropertiesAsync;
    /**
     * @internal
     */
    _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: Nullable<Mesh>, babylonDrawMode: number, assign?: (babylonMaterial: Material) => void): Promise<Material>;
    /**
     * Selects the appropriate PBR material implementation for a given glTF material.
     * Uses OpenPBR when the material carries a "KHR_materials_openpbr" extension or when
     * the loader-level `useOpenPBR` flag is set; falls back to standard PBR otherwise.
     * @param material The glTF material
     * @returns The matching loaded implementation
     */
    private _selectImplForGltfMaterial;
    /**
     * Returns the default PBR material implementation used when there is no per-material
     * selection context (e.g. when creating the built-in default material for primitives
     * that have no glTF material assigned).  Prefers OpenPBR when `useOpenPBR` is set.
     * @returns The default loaded implementation
     */
    private _getDefaultImpl;
    private _createDefaultMaterial;
    /**
     * Creates a Babylon material from a glTF material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonDrawMode The draw mode for the Babylon material
     * @returns The Babylon material
     */
    createMaterial(context: string, material: IMaterial, babylonDrawMode: number): Material;
    /**
     * Loads properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
    /**
     * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    loadMaterialBasePropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
    /**
     * Loads the alpha properties from a glTF material into a Babylon material.
     * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     */
    loadMaterialAlphaProperties(context: string, material: IMaterial, babylonMaterial: Material): void;
    /**
     * Loads a glTF texture info.
     * @param context The context when loading the asset
     * @param textureInfo The glTF texture info property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon texture when the load is complete
     */
    loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign?: (babylonTexture: BaseTexture) => void): Promise<BaseTexture>;
    /**
     * @internal
     */
    _loadTextureAsync(context: string, texture: ITexture, assign?: (babylonTexture: BaseTexture) => void): Promise<BaseTexture>;
    /**
     * @internal
     */
    _createTextureAsync(context: string, sampler: ISampler, image: IImage, assign?: (babylonTexture: BaseTexture) => void, textureLoaderOptions?: unknown, useSRGBBuffer?: boolean): Promise<BaseTexture>;
    private _loadSampler;
    /**
     * Loads a glTF image.
     * @param context The context when loading the asset
     * @param image The glTF image property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadImageAsync(context: string, image: IImage): Promise<ArrayBufferView>;
    /**
     * Loads a glTF uri.
     * @param context The context when loading the asset
     * @param property The glTF property associated with the uri
     * @param uri The base64 or relative uri
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    loadUriAsync(context: string, property: IProperty, uri: string): Promise<ArrayBufferView>;
    /**
     * Adds a JSON pointer to the _internalMetadata of the Babylon object at `<object>._internalMetadata.gltf.pointers`.
     * @param babylonObject the Babylon object with _internalMetadata
     * @param pointer the JSON pointer
     */
    static AddPointerMetadata(babylonObject: IWithMetadata, pointer: string): void;
    private static _GetTextureWrapMode;
    private static _GetTextureSamplingMode;
    private static _GetTypedArrayConstructor;
    private static _GetTypedArray;
    private static _GetNumComponents;
    private static _ValidateUri;
    /**
     * @internal
     */
    static _GetDrawMode(context: string, mode: number | undefined): number;
    private _compileMaterialsAsync;
    private _compileShadowGeneratorsAsync;
    private _forEachExtensions;
    private _applyExtensions;
    private _extensionsOnLoading;
    private _extensionsOnReady;
    private _extensionsLoadSceneAsync;
    private _extensionsLoadNodeAsync;
    private _extensionsLoadCameraAsync;
    private _extensionsLoadVertexDataAsync;
    private _extensionsLoadMeshPrimitiveAsync;
    private _extensionsLoadMaterialAsync;
    private _extensionsCreateMaterial;
    private _extensionsLoadMaterialPropertiesAsync;
    private _extensionsLoadTextureInfoAsync;
    private _extensionsLoadTextureAsync;
    private _extensionsLoadAnimationAsync;
    private _extensionsLoadAnimationChannelAsync;
    private _extensionsLoadSkinAsync;
    private _extensionsLoadUriAsync;
    private _extensionsLoadBufferViewAsync;
    private _extensionsLoadBufferAsync;
    /**
     * Helper method called by a loader extension to load an glTF extension.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extension from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extension does not exist
     */
    static LoadExtensionAsync<TExtension = unknown, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extensionContext: string, extension: TExtension) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
    /**
     * Helper method called by a loader extension to load a glTF extra.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extra from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extra does not exist
     */
    static LoadExtraAsync<TExtra = unknown, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extraContext: string, extra: TExtra) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
    /**
     * Checks for presence of an extension.
     * @param name The name of the extension to check
     * @returns A boolean indicating the presence of the given extension name in `extensionsUsed`
     */
    isExtensionUsed(name: string): boolean;
    /**
     * Increments the indentation level and logs a message.
     * @param message The message to log
     */
    logOpen(message: string): void;
    /**
     * Decrements the indentation level.
     */
    logClose(): void;
    /**
     * Logs a message
     * @param message The message to log
     */
    log(message: string): void;
    /**
     * Starts a performance counter.
     * @param counterName The name of the performance counter
     */
    startPerformanceCounter(counterName: string): void;
    /**
     * Ends a performance counter.
     * @param counterName The name of the performance counter
     */
    endPerformanceCounter(counterName: string): void;
}
/**
 * Registers the GLTF 2.0 loader factory on the GLTFFileLoader. Idempotent.
 * @internal
 */
export declare function RegisterGLTF2Loader(): void;

import { type ISceneLoaderPluginAsync, type ISceneLoaderPluginFactory, type ISceneLoaderAsyncResult, type ISceneLoaderProgressEvent, type SceneLoaderPluginOptions } from "@babylonjs/core/Loading/sceneLoader.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { AssetContainer } from "@babylonjs/core/assetContainer.js";
/**
 * Source convention for tangent-space normal maps loaded from FBX normal-map slots.
 */
export type FBXNormalMapCoordinateSystem = "y-up" | "y-down";
/**
 * Defines options for the FBX loader.
 */
export interface FBXFileLoaderOptions {
    /**
     * Source convention for tangent-space normal maps connected through FBX normal-map slots.
     * FBX does not standardize this convention, so the loader defaults to the glTF/USD-style Y-up convention.
     * Set to "y-down" for assets authored with inverted green/Y normal maps.
     */
    normalMapCoordinateSystem?: FBXNormalMapCoordinateSystem;
}
/**
 * FBX file loader plugin for Babylon.js.
 * Pure TypeScript implementation — no Autodesk FBX SDK dependency.
 */
export declare class FBXFileLoader implements ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
    /**
     * Defines the name of the plugin.
     */
    readonly name: "fbx";
    /**
     * Defines the extension the plugin is able to load.
     */
    readonly extensions: {
        readonly ".fbx": {
            readonly isBinary: true;
        };
    };
    private readonly _options;
    private readonly _bindRestBones;
    private readonly _sourceBonesBySkeleton;
    private readonly _scaleCompensationHelpersBySkeleton;
    /**
     * Creates a new FBX loader.
     * @param options - Options controlling FBX loading behavior
     */
    constructor(options?: FBXFileLoaderOptions);
    /**
     * Creates an FBX loader plugin instance with options from SceneLoader.
     * @param options - Scene loader plugin options
     * @returns The configured FBX loader
     */
    createPlugin(options: SceneLoaderPluginOptions): ISceneLoaderPluginAsync;
    /**
     * Imports meshes from an FBX file and adds them to the scene.
     * @param meshesNames - A string or array of mesh names to import, or null/undefined to import all meshes
     * @param scene - The scene to add imported meshes to
     * @param data - The FBX data to load
     * @param rootUrl - Root URL used to resolve external resources
     * @param _onProgress - Callback called while the file is loading
     * @param _fileName - Name of the file being loaded
     * @returns A promise containing the loaded meshes, particle systems, skeletons, animation groups, transform nodes, geometries, and lights
     */
    importMeshAsync(meshesNames: string | readonly string[] | null | undefined, scene: Scene, data: unknown, rootUrl: string, _onProgress?: (event: ISceneLoaderProgressEvent) => void, _fileName?: string): Promise<ISceneLoaderAsyncResult>;
    /**
     * Loads all FBX content into the scene.
     * @param scene - The scene to load the FBX content into
     * @param data - The FBX data to load
     * @param rootUrl - Root URL used to resolve external resources
     * @param _onProgress - Callback called while the file is loading
     * @param _fileName - Name of the file being loaded
     * @returns A promise that resolves when loading is complete
     */
    loadAsync(scene: Scene, data: unknown, rootUrl: string, _onProgress?: (event: ISceneLoaderProgressEvent) => void, _fileName?: string): Promise<void>;
    /**
     * Loads all FBX content into an asset container.
     * @param scene - The scene used to create the asset container
     * @param data - The FBX data to load
     * @param rootUrl - Root URL used to resolve external resources
     * @param _onProgress - Callback called while the file is loading
     * @param _fileName - Name of the file being loaded
     * @returns A promise containing the loaded asset container
     */
    loadAssetContainerAsync(scene: Scene, data: unknown, rootUrl: string, _onProgress?: (event: ISceneLoaderProgressEvent) => void, _fileName?: string): Promise<AssetContainer>;
    private _parse;
    private _parseFromArrayBuffer;
    private _buildScene;
    private _addMaterialToContainer;
    private _addTextureToContainer;
    private _setAssetContainer;
    private static _computeFBXAxisConversionMatrix;
    private _buildModel;
    private _linkSkeletonsToTransformNodes;
    private static _modelSubtreeMatchesNameFilter;
    private static _applyModelMetadata;
    private _createMesh;
    /**
     * Apply multi-material to a mesh by creating sub-meshes grouped by material index.
     * Reorders the index buffer so that triangles sharing the same material are contiguous.
     */
    private _applyMultiMaterial;
    private static _collectCullingConflictMaterialIds;
    private static _getModelMaterial;
    private _applyMaterialUVSetCoordinates;
    private _applyStandardMaterialUVSetCoordinates;
    /**
     * Babylon multiplies vertex colors by material diffuse color. Use per-mesh
     * material clones so vertex-colored geometry can render unmodulated without
     * changing shared materials used by non-vertex-colored meshes.
     */
    private _useUnmodulatedVertexColorMaterials;
    /**
     * Build per-polygon-vertex bone indices and weights from the control-point-based skin data.
     * The geometry expands control points to per-polygon-vertex, so we need to look up
     * each polygon-vertex's control point index.
     */
    private _buildSkinningData;
    private _createMaterial;
    private _configureNormalTexture;
    private _getNormalMapTangentHandednessScale;
    private static _isSupportedMaterialTextureSlot;
    private static _isNormalMapTextureSlot;
    private static _createTexture;
    private static _createExternalTexture;
    private static _buildTextureFallbackUrls;
    private static _getTextureCreationOptions;
    private static _getExternalTextureUrls;
    private static _getTextureSourceName;
    private static _getTextureSourceNameFromPath;
    private static _isSafeRelativeTexturePath;
    private static _getForcedExtension;
    private static _getMimeType;
    /**
     * Apply blend shape (morph target) deformers to meshes.
     * FBX Shape vertices are stored as absolute positions for sparse control points.
     * We compute deltas relative to the base mesh positions.
     */
    private _applyBlendShapes;
    private _createCamera;
    private _createLight;
    private _createSkeleton;
    private _getSourceBone;
    private _getScaleCompensationHelper;
    private static _computeFBXAbsoluteMatrices;
    private static _computeFBXRuntimeLocalMatrix;
    private static _applyParentScaleCompensation;
    private static _splitParentScaleCompensatedLocalMatrix;
    private static _safeInverseScale;
    private static _getInverseScaleVector;
    private static _shouldUseBindMatricesAsRest;
    private static _getMaxScaleRatio;
    private static _getScaleRatio;
    private static _computeFBXGeometricMatrix;
    private static _computeFBXGeometricDeltaMatrix;
    private static _computeFBXGeometricNormalMatrix;
    /**
     * Compute the full FBX local transform matrix:
     * M = T * Roff * Rp * Rpre * R * Rpost^-1 * Rp^-1 * Soff * Sp * S * Sp^-1
     *
     * In row-vector convention: v' = v * M
     */
    private static _computeFBXLocalMatrix;
    /**
     * Apply the FBX transform chain to a Babylon TransformNode or Mesh.
     * Decomposes the full local matrix into position/rotation/scale.
     */
    private static _applyFBXTransform;
    private static _computeFBXModelLocalMatrix;
    private static _getBoneReferenceWorldMatrix;
    private static _applyMatrixToTransform;
    private _createAnimationGroup;
    private _buildInheritedRigBoneAnimations;
    private static _pushMatrixKeys;
    /**
     * Build animations for a non-bone node, correctly handling pivots.
     * Computes the full FBX transform matrix at each keyframe and decomposes into TRS.
     */
    private _buildNodeAnimations;
    private _isVector3KeysConstant;
    private _sampleModelLocalMatrix;
    private _sampleModelScale;
    /**
     * Build matrix-baked bone animation from full FBX local transforms.
     * The bind matrix carries the skinning offset, so animation curves drive
     * the same FBX local transform chain as the source skeleton.
     */
    private _buildBoneAnimations;
    private _buildNameFilter;
}
/**
 * Registers the FBXFileLoader scene loader plugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFBXFileLoader(): void;

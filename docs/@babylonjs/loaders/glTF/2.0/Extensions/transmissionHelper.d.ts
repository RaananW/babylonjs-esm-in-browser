import { type Nullable } from "@babylonjs/core/types.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { Observable } from "@babylonjs/core/Misc/observable.js";
import { type Color4 } from "@babylonjs/core/Maths/math.color.js";
import { type IMaterialLoadingAdapter } from "../materialLoadingAdapter.js";
import { type GLTFLoader } from "../glTFLoader.js";
/**
 * Describes a material class and its corresponding loading adapter.
 * Passed to TransmissionHelper so it can classify and interact with materials
 * independently of any specific loader instance.
 */
export interface ITransmissionHelperMaterialImpl {
    /** The material class constructor */
    materialClass: typeof Material;
    /** The adapter class constructor */
    adapterClass: new (material: Material) => IMaterialLoadingAdapter;
}
/**
 * @internal
 */
export interface ITransmissionHelperHolder {
    /** The transmission helper instance, if created on the scene */
    _transmissionHelper: TransmissionHelper | undefined;
}
/**
 * Options for the TransmissionHelper.
 */
export interface ITransmissionHelperOptions {
    /**
     * The size of the render buffers (default: 1024)
     */
    renderSize: number;
    /**
     * The number of samples to use when generating the render target texture for opaque meshes (default: 4)
     */
    samples: number;
    /**
     * Scale to apply when selecting the LOD level to sample the refraction texture (default: 1)
     */
    lodGenerationScale: number;
    /**
     * Offset to apply when selecting the LOD level to sample the refraction texture (default: -4)
     */
    lodGenerationOffset: number;
    /**
     * Type of the refraction render target texture (default: TEXTURETYPE_HALF_FLOAT)
     */
    renderTargetTextureType: number;
    /**
     * Defines if the mipmaps for the refraction render target texture must be generated (default: true)
     */
    generateMipmaps: boolean;
    /**
     * Clear color of the opaque texture. If not provided, use the scene clear color (which will be converted to linear space).
     * If provided, should be in linear space
     */
    clearColor?: Color4;
}
/**
 * A class to handle setting up the rendering of opaque objects to be shown through transmissive objects.
 * @internal
 */
export declare class TransmissionHelper {
    /**
     * Creates the default options for the helper.
     * @returns the default options
     */
    private static _GetDefaultOptions;
    private readonly _scene;
    private _options;
    private _opaqueRenderTarget;
    private _opaqueMeshesCache;
    private _transparentMeshesCache;
    private _materialObservers;
    private _newMeshObserver;
    private _removedMeshObserver;
    private _disposed;
    private readonly _materialImpls;
    private readonly _adapterCache;
    /**
     * This observable will be notified with any error during the creation of the environment,
     * mainly texture creation errors.
     */
    onErrorObservable: Observable<{
        message?: string;
        exception?: any;
    }>;
    private _translucentMaterialIndices;
    private _opaqueOnlySubMeshes;
    private _savedSubMeshes;
    /**
     * constructor
     * @param options Defines the options we want to customize the helper
     * @param scene The scene to add the material to
     */
    constructor(options: Partial<ITransmissionHelperOptions>, scene: Scene);
    /**
     * Registers a material implementation with the helper so it can classify and create
     * adapters for materials of that type. Safe to call multiple times with the same
     * implementation — duplicates are ignored.
     * @param impl The material implementation to register
     */
    addMaterialImpl(impl: ITransmissionHelperMaterialImpl): void;
    /**
     * Updates the helper options.
     * @param options the options to update
     */
    updateOptions(options: Partial<ITransmissionHelperOptions>): void;
    /**
     * @returns the opaque render target texture or null if not available.
     */
    getOpaqueTarget(): Nullable<Texture>;
    private _getOrCreateAdapter;
    /**
     * Classify a mesh's materials as transparent, opaque, or mixed.
     * Sets the refraction background texture on any translucent materials found.
     * For mixed MultiMaterial meshes, populates _translucentMaterialIndices so
     * their translucent submeshes can be excluded from the opaque render target.
     * @param mesh - The mesh to classify
     * @returns 'transparent' if all materials are translucent, 'opaque' if none are, 'mixed' if both
     */
    private _classifyMeshMaterials;
    /**
     * Rebuild the cached opaque-only submesh array for a mixed mesh.
     * Called when classification changes so the per-frame swap is allocation-free.
     * @param mesh - The mesh to rebuild for
     * @param translucentIndices - Set of materialIndex values that are translucent
     */
    private _rebuildOpaqueOnlySubMeshes;
    private _addMesh;
    private _removeMesh;
    private _parseScene;
    private _onMeshMaterialChanged;
    /**
     * @internal
     * Check if the opaque render target has not been disposed and can still be used.
     * @returns
     */
    _isRenderTargetValid(): boolean;
    /**
     * @internal
     * Setup the render targets according to the specified options.
     */
    _setupRenderTargets(): void;
    /**
     * Dispose all the elements created by the Helper.
     */
    dispose(): void;
}
/**
 * Ensures a TransmissionHelper exists on the scene and has all of the loader's material
 * implementations registered with it. Creates the helper if one does not yet exist on the
 * scene, and recreates its render target if it has been disposed. Does nothing when the
 * loader's parent has `dontUseTransmissionHelper` set.
 * @param loader The glTF loader whose material implementations should be registered
 * @param babylonMaterial A material belonging to the scene where the helper should live
 */
export declare function ensureTransmissionHelper(loader: GLTFLoader, babylonMaterial: Material): void;

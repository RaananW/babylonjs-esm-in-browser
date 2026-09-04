import { ShaderLanguage } from "../Materials/shaderLanguage.js";
import { ShaderMaterial } from "../Materials/shaderMaterial.pure.js";
import { type IVector2Like } from "../Maths/math.like.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
import { type Nullable } from "../types.js";
/**
 * Class used to store the result of a GPU picking operation
 */
export interface IGPUPickingInfo {
    /**
     * Picked mesh
     */
    mesh: AbstractMesh;
    /**
     * Picked thin instance index
     */
    thinInstanceIndex?: number;
    /**
     * Picked point in world space.
     *
     * Only available when enableDepthPicking is true and a valid depth value can be read.
     * Custom picking materials or special material plugins that do not write the depth attachment may return undefined.
     */
    pickedPoint?: Vector3;
    /**
     * Reconstructed normal in world space.
     *
     * Only available when enableDepthPicking is true and enough valid depth neighbors can be read.
     * Custom picking materials or special material plugins that do not write the depth attachment may return undefined.
     */
    normal?: Vector3;
}
/**
 * Stores the result of a multi GPU picking operation
 */
export interface IGPUMultiPickingInfo {
    /**
     * Picked mesh
     */
    meshes: Nullable<AbstractMesh>[];
    /**
     * Picked thin instance index
     */
    thinInstanceIndexes?: number[];
    /**
     * Picked points in world space.
     *
     * Only available when enableDepthPicking is true and a valid depth value can be read.
     * Custom picking materials or special material plugins that do not write the depth attachment may return null.
     */
    pickedPoints?: Nullable<Vector3>[];
    /**
     * Reconstructed normals in world space.
     *
     * Only available when enableDepthPicking is true and enough valid depth neighbors can be read.
     * Custom picking materials or special material plugins that do not write the depth attachment may return null.
     */
    normals?: Nullable<Vector3>[];
}
/**
 * Defines how multi pick texture readbacks should be performed.
 */
export declare enum GPUMultiPickReadbackStrategy {
    /**
     * Chooses between a single rectangle readback and small per-point readbacks using the thresholds in IGPUMultiPickOptions.
     */
    Auto = 0,
    /**
     * Always reads the full bounding rectangle of the picked points. This minimizes readback calls and is best for dense point sets.
     */
    Rectangle = 1,
    /**
     * Always reads each picked point independently. This minimizes transferred pixels for sparse point sets but can be slower when many points are picked.
     */
    Individual = 2
}
/**
 * Options used to tune multi GPU picking.
 */
export interface IGPUMultiPickOptions {
    /**
     * Defines how multi pick texture readbacks should be performed.
     *
     * Defaults to GPUMultiPickReadbackStrategy.Auto.
     */
    readbackStrategy?: GPUMultiPickReadbackStrategy;
    /**
     * Maximum number of in-bounds points allowed for the automatic individual readback path.
     * This value is ignored when readbackStrategy is set to GPUMultiPickReadbackStrategy.Rectangle or GPUMultiPickReadbackStrategy.Individual.
     *
     * Defaults to 32.
     */
    maxIndividualReadbackCount?: number;
    /**
     * Minimum rectangle-area / individual-area ratio required before the automatic path uses individual readbacks.
     * This value is ignored when readbackStrategy is set to GPUMultiPickReadbackStrategy.Rectangle or GPUMultiPickReadbackStrategy.Individual.
     *
     * Defaults to 16.
     */
    individualReadbackAreaRatio?: number;
}
/**
 * Class used to perform a picking operation using GPU
 * GPUPicker can pick meshes, instances and thin instances
 */
export declare class GPUPicker {
    private static readonly _AttributeName;
    private static readonly _MaxPickingId;
    private static readonly _DepthPixelRadius;
    private static readonly _MaxMultiPickIndividualReadbackCount;
    private static readonly _MultiPickIndividualReadbackAreaRatio;
    private static readonly _DepthNeighborOffsets;
    private _pickingTexture;
    private readonly _idMap;
    private readonly _thinIdMap;
    private readonly _meshUniqueIdToPickerId;
    private _idWarningIssued;
    private _cachedScene;
    private _engine;
    private readonly _pickingMaterialCache;
    private _pickableMeshes;
    private readonly _meshMaterialMap;
    private _readbuffer;
    private _depthReadbuffer;
    private _depthTextureType;
    private _isDepthTexturePacked;
    private _useDepthPicking;
    private _isUsingDepthPickingRenderTarget;
    private _meshRenderingCount;
    private _renderWarningIssued;
    private _renderPickingTexture;
    private _sceneBeforeRenderObserver;
    private _pickingTextureClearObserver;
    private _pickingTextureAfterRenderObserver;
    private _nextFreeId;
    private readonly _gsPickingMaterials;
    private readonly _gsCompoundRenderMeshes;
    /** Shader language used by the generator */
    protected _shaderLanguage: ShaderLanguage;
    /**
     * Gets the shader language used in this generator.
     */
    get shaderLanguage(): ShaderLanguage;
    private _pickingInProgress;
    /**
     * Gets a boolean indicating if the picking is in progress
     */
    get pickingInProgress(): boolean;
    /**
     * Gets the default render materials used by the picker.
     *
     * index is Material filling mode
     */
    get defaultRenderMaterials(): readonly Nullable<ShaderMaterial>[];
    /**
     * Gets or sets a boolean indicating if depth-based pickedPoint and normal reconstruction should be enabled.
     *
     * When disabled, GPUPicker uses the original single-color render target and shader path. When enabled, GPUPicker
     * switches to a MultiRenderTarget and compiles the default picking shader with GPUPICKER_DEPTH to output both the
     * picking id and the depth required to reconstruct the picked point and normal.
     *
     * Custom picking materials and special picking material plugins should also write the depth attachment. If they do
     * not, GPUPicker will still try to reconstruct pickedPoint and normal from the depth target, but the returned values
     * may be missing or incorrect.
     */
    get enableDepthPicking(): boolean;
    set enableDepthPicking(value: boolean);
    private _getColorIdFromReadBuffer;
    private _getReadBufferOffset;
    private _createColorPickingRenderTarget;
    private _createRenderTarget;
    private _clearPickingMaterials;
    private _getPickingMaterial;
    private _materialBindCallback;
    /**
     * Set the list of meshes to pick from
     * Set that value to null to clear the list (and avoid leaks)
     * The module will read and delete from the array provided by reference. Disposing the module or setting the value to null will clear the array.
     * @param list defines the list of meshes to pick from
     */
    setPickingList(list: Nullable<Array<AbstractMesh | {
        mesh: AbstractMesh;
        material: ShaderMaterial;
    }>>): void;
    /**
     * Clear the current picking list and free resources
     */
    clearPickingList(): void;
    /**
     * Add array of meshes to the current picking list
     * @param list defines the array of meshes to add to the current picking list
     */
    addPickingList(list: Array<AbstractMesh | {
        mesh: AbstractMesh;
        material: ShaderMaterial;
    }>): void;
    /**
     * Execute a picking operation
     * @param x defines the X coordinates where to run the pick
     * @param y defines the Y coordinates where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @returns A promise with the picking results
     */
    pickAsync(x: number, y: number, disposeWhenDone?: boolean): Promise<Nullable<IGPUPickingInfo>>;
    /**
     * Execute a picking operation on multiple coordinates
     * @param xy defines the X,Y coordinates where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @param options defines options used to tune the multi pick readback strategy
     * @returns A promise with the picking results. Always returns an array with the same length as the number of coordinates. The mesh or null at the index where no mesh was picked.
     */
    multiPickAsync(xy: IVector2Like[], disposeWhenDone?: boolean, options?: IGPUMultiPickOptions): Promise<Nullable<IGPUMultiPickingInfo>>;
    /**
     * Execute a picking operation on box defined by two screen coordinates
     * @param x1 defines the X coordinate of the first corner of the box where to run the pick
     * @param y1 defines the Y coordinate of the first corner of the box where to run the pick
     * @param x2 defines the X coordinate of the opposite corner of the box where to run the pick
     * @param y2 defines the Y coordinate of the opposite corner of the box where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @returns A promise with the picking results. Contains one entry for each picked pixel in the box.
     */
    boxPickAsync(x1: number, y1: number, x2: number, y2: number, disposeWhenDone?: boolean): Promise<Nullable<IGPUMultiPickingInfo>>;
    private _getRenderInfo;
    private _prepareForPicking;
    private _getPickingRenderRegion;
    private _shouldUseIndividualMultiPickReadback;
    private _isPartProxyActiveForPicking;
    private _preparePickingBuffer;
    private _addPickingTextureToRenderTargets;
    private _removePickingTextureFromRenderTargets;
    private _executePickingAsync;
    private _executeMultiPickingAsync;
    private _executeBoxPickingAsync;
    private _enableScissor;
    private _disableScissor;
    /**
     * @returns true if rendering if the picking texture has finished, otherwise false
     */
    private _checkRenderStatus;
    /**
     * Polls the picking material variant for every mesh in the render list until every
     * variant is ready. Picking materials use parallel shader compilation, and a single
     * ShaderMaterial may produce different effect variants per mesh (instances, thin
     * instances, vertex colors, ...). If we render the picking texture before all variants
     * are compiled, the renderer silently skips meshes whose effect is not yet ready, which
     * can leave the click pixel cleared (0,0,0,0) and cause pickAsync to incorrectly return
     * null. Once compiled, effects are cached by define string in the engine, so this
     * polling only blocks on the very first pick (or whenever the render list changes to
     * include meshes with new define combinations).
     */
    private _waitForPickingMaterialsReadyAsync;
    private _getMeshFromMultiplePoints;
    private _getMeshFromReadBuffer;
    /**
     * Updates the render list with the current pickable meshes.
     */
    private _updateRenderList;
    /**
     * Creates a GaussianSplattingMaterial configured for GPU picking by attaching
     * a GaussianSplattingGpuPickingMaterialPlugin. The plugin injects picking ID
     * encoding into the existing Gaussian Splatting shaders via material plugin hooks.
     * @param scene The scene
     * @param gsMesh The Gaussian Splatting mesh (used to set the source mesh on the material)
     * @returns A GaussianSplattingMaterial with the picking plugin attached
     */
    private _createGaussianSplattingPickingMaterial;
    private _readTexturePixelsAsync;
    private _readDepthTexturePixelsAsync;
    private _getDepthPickingInfoAsync;
    private _getDepthPickingInfoFromBuffer;
    private _getDepthPointFromBufferToRef;
    private _getDepthFromBuffer;
    /** Release the resources */
    dispose(): void;
}

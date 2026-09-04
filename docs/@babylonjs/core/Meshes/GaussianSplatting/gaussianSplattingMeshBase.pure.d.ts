/** This file must only contain pure code and pure imports */
import { type Scene } from "../../scene.pure.js";
import { type DeepImmutable, type Nullable } from "../../types.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { SubMesh } from "../subMesh.pure.js";
import { type AbstractMesh } from "../abstractMesh.pure.js";
import { Mesh } from "../mesh.pure.js";
import { Matrix, Vector2, Vector3 } from "../../Maths/math.vector.pure.js";
import { Observable } from "../../Misc/observable.js";
import { MultiRenderTarget } from "../../Materials/Textures/multiRenderTarget.pure.js";
import { type InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { type Material } from "../../Materials/material.pure.js";
import { type Effect } from "../../Materials/effect.pure.js";
import { type Camera } from "../../Cameras/camera.pure.js";
/** Internal mirror of ISogTexturePack (defined in loaders) — avoids a circular import. */
interface ISogPackInternal {
    version: 1 | 2;
    splatCount: number;
    shDegree: number;
    meansTextureL: BaseTexture;
    meansTextureU: BaseTexture;
    scalesTexture: BaseTexture;
    quatsTexture: BaseTexture;
    sh0Texture: BaseTexture;
    shCentroidsTexture?: BaseTexture;
    shLabelsTexture?: BaseTexture;
    codebookTexture?: BaseTexture;
    meansMin: [number, number, number];
    meansMax: [number, number, number];
    scalesMin?: [number, number, number];
    scalesMax?: [number, number, number];
    sh0Min?: [number, number, number, number];
    sh0Max?: [number, number, number, number];
    shnMin?: number;
    shnMax?: number;
    shCoeffCount: number;
    positions: Float32Array;
}
/**
 * Safe-orbit camera limits embedded in a Gaussian Splatting file's metadata (Adobe safe-orbit
 * extension). Exposed on the loaded mesh via {@link GaussianSplattingMeshBase.safeOrbitCameraLimits}
 * so consumers can read/apply the limits independently of the scene's active camera — the loader's
 * automatic application only affects an active ArcRotateCamera at load time.
 */
export interface ISafeOrbitCameraLimits {
    /** Minimum safe orbit radius (distance from the camera to its target), if the file specifies one. */
    radiusMin?: number;
    /** Safe elevation range as `[minElevation, maxElevation]` in radians, if the file specifies one. */
    elevationMinMax?: [number, number];
}
interface IUpdateOptions {
    flipY?: boolean;
    /** @internal When set, skips reprocessing splats [0, previousVertexCount) and copies from cached arrays instead. */
    previousVertexCount?: number;
}
/**
 * Defines a contiguous source-splat range to render from a GaussianSplattingMesh.
 */
export interface IGaussianSplattingSplatRange {
    /**
     * First source splat index to render.
     */
    offset: number;
    /**
     * Number of source splats to render.
     */
    count: number;
}
interface ITextureDataUpdateCapableEngine {
    updateTextureData(texture: InternalTexture, imageData: ArrayBufferView, xOffset: number, yOffset: number, width: number, height: number, faceIndex?: number, lod?: number, generateMipMaps?: boolean): void;
    updateRawTexture(texture: Nullable<InternalTexture>, data: Nullable<ArrayBufferView>, format: number, invertY: boolean, compression?: Nullable<string>, type?: number, useSRGBBuffer?: boolean): void;
    _gl?: unknown;
    isWebGPU?: boolean;
}
/**
 * Representation of the types
 */
declare enum PLYType {
    FLOAT = 0,
    INT = 1,
    UINT = 2,
    DOUBLE = 3,
    UCHAR = 4,
    USHORT = 5,
    UNDEFINED = 6
}
/**
 * Usage types of the PLY values
 */
declare enum PLYValue {
    MIN_X = 0,
    MIN_Y = 1,
    MIN_Z = 2,
    MAX_X = 3,
    MAX_Y = 4,
    MAX_Z = 5,
    MIN_SCALE_X = 6,
    MIN_SCALE_Y = 7,
    MIN_SCALE_Z = 8,
    MAX_SCALE_X = 9,
    MAX_SCALE_Y = 10,
    MAX_SCALE_Z = 11,
    PACKED_POSITION = 12,
    PACKED_ROTATION = 13,
    PACKED_SCALE = 14,
    PACKED_COLOR = 15,
    X = 16,
    Y = 17,
    Z = 18,
    SCALE_0 = 19,
    SCALE_1 = 20,
    SCALE_2 = 21,
    DIFFUSE_RED = 22,
    DIFFUSE_GREEN = 23,
    DIFFUSE_BLUE = 24,
    OPACITY = 25,
    F_DC_0 = 26,
    F_DC_1 = 27,
    F_DC_2 = 28,
    F_DC_3 = 29,
    ROT_0 = 30,
    ROT_1 = 31,
    ROT_2 = 32,
    ROT_3 = 33,
    MIN_COLOR_R = 34,
    MIN_COLOR_G = 35,
    MIN_COLOR_B = 36,
    MAX_COLOR_R = 37,
    MAX_COLOR_G = 38,
    MAX_COLOR_B = 39,
    SH_0 = 40,
    SH_1 = 41,
    SH_2 = 42,
    SH_3 = 43,
    SH_4 = 44,
    SH_5 = 45,
    SH_6 = 46,
    SH_7 = 47,
    SH_8 = 48,
    SH_9 = 49,
    SH_10 = 50,
    SH_11 = 51,
    SH_12 = 52,
    SH_13 = 53,
    SH_14 = 54,
    SH_15 = 55,
    SH_16 = 56,
    SH_17 = 57,
    SH_18 = 58,
    SH_19 = 59,
    SH_20 = 60,
    SH_21 = 61,
    SH_22 = 62,
    SH_23 = 63,
    SH_24 = 64,
    SH_25 = 65,
    SH_26 = 66,
    SH_27 = 67,
    SH_28 = 68,
    SH_29 = 69,
    SH_30 = 70,
    SH_31 = 71,
    SH_32 = 72,
    SH_33 = 73,
    SH_34 = 74,
    SH_35 = 75,
    SH_36 = 76,
    SH_37 = 77,
    SH_38 = 78,
    SH_39 = 79,
    SH_40 = 80,
    SH_41 = 81,
    SH_42 = 82,
    SH_43 = 83,
    SH_44 = 84,
    SH_45 = 85,
    SH_46 = 86,
    SH_47 = 87,
    SH_48 = 88,
    SH_49 = 89,
    SH_50 = 90,
    SH_51 = 91,
    SH_52 = 92,
    SH_53 = 93,
    SH_54 = 94,
    SH_55 = 95,
    SH_56 = 96,
    SH_57 = 97,
    SH_58 = 98,
    SH_59 = 99,
    SH_60 = 100,
    SH_61 = 101,
    SH_62 = 102,
    SH_63 = 103,
    SH_64 = 104,
    SH_65 = 105,
    SH_66 = 106,
    SH_67 = 107,
    SH_68 = 108,
    SH_69 = 109,
    SH_70 = 110,
    SH_71 = 111,
    UNDEFINED = 112
}
/**
 * Property field found in PLY header
 */
export type PlyProperty = {
    /**
     * Value usage
     */
    value: PLYValue;
    /**
     * Value type
     */
    type: PLYType;
    /**
     * offset in byte from te beginning of the splat
     */
    offset: number;
};
/**
 * meta info on Splat file
 */
export interface PLYHeader {
    /**
     * number of splats
     */
    vertexCount: number;
    /**
     * number of spatial chunks for compressed ply
     */
    chunkCount: number;
    /**
     * length in bytes of the vertex info
     */
    rowVertexLength: number;
    /**
     * length in bytes of the chunk
     */
    rowChunkLength: number;
    /**
     * array listing properties per vertex
     */
    vertexProperties: PlyProperty[];
    /**
     * array listing properties per chunk
     */
    chunkProperties: PlyProperty[];
    /**
     * data view for parsing chunks and vertices
     */
    dataView: DataView;
    /**
     * buffer for the data view
     */
    buffer: ArrayBuffer;
    /**
     * degree of SH coefficients
     */
    shDegree: number;
    /**
     * number of coefficient per splat
     */
    shCoefficientCount: number;
    /**
     * buffer for SH coefficients
     */
    shBuffer: ArrayBuffer | null;
}
/**
 * Base class for Gaussian Splatting meshes. Contains all single-cloud rendering logic.
 * @internal Use GaussianSplattingMesh instead; this class is an internal implementation detail.
 */
export declare class GaussianSplattingMeshBase extends Mesh {
    /**
     * When true (default), the depth-sort worker uses the fast O(n) counting (radix) sort. Set to false to
     * fall back to the legacy comparison sort (useful for A/B comparison or as a safety fallback). The change
     * takes effect on the next sort.
     */
    static UseCountingSort: boolean;
    /**
     * When true, the depth-sort worker logs each sort's duration (ms) and active splat count to the console.
     * Off by default; intended for performance investigation only.
     */
    static LogSortPerformance: boolean;
    /**
     * Safe-orbit camera limits parsed from the source file's metadata, or `null` when the file
     * carries none. The loader also auto-applies these to an active ArcRotateCamera at load time
     * (unless `disableAutoCameraLimits` is set); this field exposes the raw values so they can be
     * applied or tracked regardless of the active camera type. See {@link ISafeOrbitCameraLimits}.
     */
    safeOrbitCameraLimits: Nullable<ISafeOrbitCameraLimits>;
    /** @internal */
    _vertexCount: number;
    protected _worker: Nullable<Worker>;
    private _modelViewProjectionMatrix;
    private _depthMix;
    protected _canPostToWorker: boolean;
    private _readyToDisplay;
    private _sortRequestId;
    private _activeRangeVersion;
    private _hasRenderedOnce;
    protected _covariancesATexture: Nullable<BaseTexture>;
    protected _covariancesBTexture: Nullable<BaseTexture>;
    protected _centersTexture: Nullable<BaseTexture>;
    protected _colorsTexture: Nullable<BaseTexture>;
    protected _mrtAtlas: Nullable<MultiRenderTarget>;
    protected _useMrtAtlas: boolean;
    protected _shMrtAtlas: Nullable<MultiRenderTarget[]>;
    protected _useShMrtAtlas: boolean;
    protected _shMrtAtlasTextureCount: number;
    protected _rotationsATexture: Nullable<BaseTexture>;
    protected _rotationsBTexture: Nullable<BaseTexture>;
    protected _rotationScaleTexture: Nullable<BaseTexture>;
    protected _rotMrtAtlas: Nullable<MultiRenderTarget>;
    protected _useRotMrtAtlas: boolean;
    private _rotationDataA;
    private _rotationDataB;
    private _rotationScaleData;
    protected _needsRotationScaleTextures: boolean;
    protected _splatPositions: Nullable<Float32Array>;
    private _splatIndex;
    protected _shTextures: Nullable<BaseTexture[]>;
    /** @internal */
    _splatsData: Nullable<ArrayBuffer>;
    /** @internal */
    _shData: Nullable<Uint8Array[]>;
    private _textureSize;
    protected readonly _keepInRam: boolean;
    protected _alwaysRetainSplatsData: boolean;
    protected _flipY: boolean;
    private _delayedTextureUpdate;
    protected _useRGBACovariants: boolean;
    protected _useSog: boolean;
    protected _sogParams: Nullable<ISogPackInternal>;
    private _material;
    private _tmpCovariances;
    private _splatSizeMin;
    private _splatSizeMax;
    private _sortIsDirty;
    private _activeSplatRanges;
    private _activeSplatRangeKey;
    private _activeSplatRenderCount;
    protected _cachedBoundingMin: Nullable<Vector3>;
    protected _cachedBoundingMax: Nullable<Vector3>;
    private static _RowOutputLength;
    private static _SH_C0;
    private static _SplatBatchSize;
    private static _PlyConversionBatchSize;
    /** @internal */
    _shDegree: number;
    protected _maxShDegree: number;
    private static readonly _BatchSize;
    private _cameraViewInfos;
    protected static readonly _DefaultViewUpdateThreshold = 0.0001;
    /** Fired after parts are added or the mesh is rebuilt following a removal. Payload is the new part count. */
    readonly onPartCountChangedObservable: Observable<number>;
    /** Fired after part-removal validation passes but before the mesh is rebuilt.
     *  Payload is the original (pre-removal) part index. */
    readonly onPartRemovedObservable: Observable<number>;
    /**
     * Fired just before an existing MRT-backed atlas is recreated to grow it (e.g. adding a part while a streaming
     * part exists). Payload is the OLD atlas. Streaming parts subscribe to back up their GPU-only region before it
     * is disposed. Only fires when growing an existing MRT atlas (not on first creation).
     * @internal
     */
    readonly _onBeforeAtlasRebuildObservable: Observable<MultiRenderTarget>;
    /**
     * Fired after the new (grown) MRT-backed atlas has been created and its CPU data uploaded. Payload is the NEW
     * atlas. Streaming parts subscribe to rebind to it and restore their backed-up region.
     * @internal
     */
    readonly _onAfterAtlasRebuildObservable: Observable<MultiRenderTarget>;
    /**
     * Returns a byte-accurate view for retained splat data, preserving any non-zero byte offset.
     * @param data The retained splat source bytes.
     * @returns A Uint8Array covering the exact source byte range.
     * @internal
     */
    protected static _GetSplatDataBytes(data: ArrayBuffer | ArrayBufferView): Uint8Array;
    /**
     * Returns a Float32 reinterpretation for retained splat data, copying only when alignment requires it.
     * @param data The retained splat source bytes.
     * @returns A Float32Array over the exact source byte range.
     * @internal
     */
    protected static _GetSplatDataFloats(data: ArrayBuffer | ArrayBufferView): Float32Array;
    private static _BuildSplatRangeData;
    /**
     * Cosine value of the angle threshold to update view dependent splat sorting. Default is 0.0001.
     */
    viewUpdateThreshold: number;
    protected _disableDepthSort: boolean;
    /**
     * If true, disables depth sorting of the splats (default: false)
     */
    get disableDepthSort(): boolean;
    set disableDepthSort(value: boolean);
    /**
     * View direction factor used to compute the SH view direction in the shader.
     * @deprecated Not used anymore for SH rendering
     */
    get viewDirectionFactor(): import("../../types.js").DeepImmutableObject<Vector3>;
    /**
     * SH degree. 0 = no sh (default). 1 = 3 parameters. 2 = 8 parameters. 3 = 15 parameters.
     * Value is clamped between 0 and the maximum degree available from loaded data.
     */
    get shDegree(): number;
    set shDegree(value: number);
    /**
     * Maximum SH degree available from the loaded data.
     */
    get maxShDegree(): number;
    /**
     * Number of splats in the mesh
     */
    get splatCount(): number | undefined;
    /**
     * Number of source splats currently selected for rendering.
     * When no range filter is active, this is the mesh's full source splat count.
     */
    get renderedSplatCount(): number;
    /**
     * Restricts rendering to the provided source splat ranges.
     * Passing `null` clears the range filter and renders the full source splat set.
     * @param ranges contiguous source ranges to render, or null to render all splats
     */
    setSplatIndexRanges(ranges: Nullable<readonly IGaussianSplattingSplatRange[]>): void;
    private _setSplatIndexRanges;
    /**
     * Whether the depth sort is settled: a sort computed for the current active ranges and camera has been
     * applied to the rendered index buffer, and no further sort is pending or in flight. For a static camera
     * and a fixed active set this becomes true once the final sort completes. Used by streaming subclasses to
     * detect when rendering is fully up to date (e.g. for deterministic screenshots) and by IBL shadows to
     * avoid voxelizing against an index buffer the worker has not finished (re)building yet.
     * @internal
     */
    get _isDepthSortSettled(): boolean;
    private _ensureDepthMixSize;
    /**
     * Sends the active source-splat intervals to the sort worker. When no range filter is active,
     * a single interval covering all source splats is sent so the worker never assumes the full set.
     */
    private _postIntervalsToWorker;
    /**
     * Initializes this mesh to render from an externally-provided, GPU-decoded work buffer, bypassing the
     * CPU `updateData` path. The four textures must hold the standard decoded GS layout addressed by linear
     * splat index over a square texture: centers (x,y,z,1), covariance A (Sigma00,01,02,11) and B
     * (Sigma12,22,*,*) as full covariance (so `center.w` is 1), and RGBA color. `splatPositions` are the
     * stride-4 CPU centers consumed by the depth-sort worker.
     * @param centers centers texture
     * @param covariancesA covariance A texture
     * @param covariancesB covariance B texture
     * @param colors color texture
     * @param splatPositions stride-4 CPU centers for depth sorting (length vertexCount*4)
     * @param vertexCount number of splats addressable in the work buffer
     * @param shTextures optional baked higher-order SH textures (packed-u32) produced by the work buffer's SH decode.
     *   When provided, the draw path lights the decoded splats with view-dependent SH (the non-SOG `shTexture0..N`
     *   path). `shDegree` sets both the max and active SH degree.
     * @param shDegree SH degree of the baked SH textures (0 = none). Ignored when `shTextures` is empty/omitted.
     * @param rotationTextures optional decoded rotation/scale textures ([rotA, rotB, rotScale]) produced by the work
     *   buffer's rotation decode. When provided, they drive the voxel-IBL rotation/scale samplers so the streamed
     *   splats participate in voxel-based IBL shadowing.
     */
    protected _setExternalWorkBuffer(centers: BaseTexture, covariancesA: BaseTexture, covariancesB: BaseTexture, colors: BaseTexture, splatPositions: Float32Array, vertexCount: number, shTextures?: Nullable<BaseTexture[]>, shDegree?: number, rotationTextures?: Nullable<BaseTexture[]>): void;
    /**
     * returns the splats data array buffer that contains in order : postions (3 floats), size (3 floats), color (4 bytes), orientation quaternion (4 bytes)
     * Only available if the mesh was created with keepInRam: true
     */
    get splatsData(): Nullable<ArrayBuffer>;
    /**
     * returns the SH data arrays
     * Only available if the mesh was created with keepInRam: true
     */
    get shData(): Nullable<Uint8Array<ArrayBufferLike>[]>;
    /**
     * Returns the min/max size range of splats in this mesh, where size is pow(|det(Σ)|, 1/6)
     * of the 3D covariance matrix — equivalent to the geometric mean of the principal radii.
     * Computed automatically during updateData(). Returns null before any data has been loaded.
     */
    get splatSizeRange(): Nullable<{
        min: number;
        max: number;
    }>;
    /**
     * Set the number of batch (a batch is 16384 splats) after which a display update is performed
     * A value of 0 (default) means display update will not happens before splat is ready.
     */
    static ProgressiveUpdateAmount: number;
    /**
     * Gets the covariancesA texture
     */
    get covariancesATexture(): Nullable<BaseTexture>;
    /**
     * Gets the covariancesB texture
     */
    get covariancesBTexture(): Nullable<BaseTexture>;
    /**
     * Gets the centers texture
     */
    get centersTexture(): Nullable<BaseTexture>;
    /**
     * Gets the colors texture
     */
    get colorsTexture(): Nullable<BaseTexture>;
    /**
     * Gets the rotation matrix A texture (rotation elements m[0],m[1],m[2],m[4])
     */
    get rotationsATexture(): Nullable<BaseTexture>;
    /**
     * Gets the rotation matrix B texture (rotation elements m[5],m[6],m[8],m[9])
     */
    get rotationsBTexture(): Nullable<BaseTexture>;
    /**
     * Gets the rotation scale texture (rotation element m[10] followed by scale diagonal sx,sy,sz)
     */
    get rotationScaleTexture(): Nullable<BaseTexture>;
    /**
     * Enables or disables generation of rotation and scale matrix textures, required for voxel-based IBL shadows.
     */
    get needsRotationScaleTextures(): boolean;
    set needsRotationScaleTextures(value: boolean);
    /**
     * Gets the SH textures
     */
    get shTextures(): Nullable<BaseTexture[]>;
    /**
     * True when this mesh holds raw SOG webp textures (dequantized in-shader) rather than the
     * pre-decoded covariance/center/color textures produced by the standard splat loader.
     */
    get useSog(): boolean;
    /**
     * SOG dequantization parameters paired with the raw textures.
     * Set by the splat loader when `useSogTextures: true`. Null otherwise.
     */
    get sogParams(): Nullable<ISogPackInternal>;
    /**
     * Install a set of raw SOG webp textures and bind the mesh to the in-shader dequantization path.
     * @param pack SOG texture pack produced by ParseSogMetaAsTextures.
     * @internal
     */
    setSogTextureData(pack: ISogPackInternal): void;
    /**
     * Gets the kernel size
     * Documentation and mathematical explanations here:
     * https://github.com/graphdeco-inria/gaussian-splatting/issues/294#issuecomment-1772688093
     * https://github.com/autonomousvision/mip-splatting/issues/18#issuecomment-1929388931
     */
    get kernelSize(): number;
    /**
     * Get the compensation state
     */
    get compensation(): boolean;
    /**
     * Minimum projected splat size, in pixels, below which a splat is discarded (0 = disabled).
     * Applied in real time; no rebuild required.
     */
    get minPixelSize(): number;
    set minPixelSize(value: number);
    private _loadingPromise;
    /**
     * set rendering material
     */
    set material(value: Material);
    /**
     * get rendering material
     */
    get material(): Nullable<Material>;
    private static _MakeSplatGeometryForMesh;
    /**
     * Creates a new gaussian splatting mesh
     * @param name defines the name of the mesh
     * @param url defines the url to load from (optional)
     * @param scene defines the hosting scene (optional)
     * @param keepInRam keep datas in ram for editing purpose
     */
    constructor(name: string, url?: Nullable<string>, scene?: Nullable<Scene>, keepInRam?: boolean);
    /**
     * Get the loading promise when loading the mesh from a URL in the constructor
     * @returns constructor loading promise or null if no URL was provided
     */
    getLoadingPromise(): Promise<void> | null;
    /**
     * Returns the class name
     * @returns "GaussianSplattingMeshBase"
     */
    getClassName(): string;
    /**
     * Returns the total number of vertices (splats) within the mesh
     * @returns the total number of vertices
     */
    getTotalVertices(): number;
    /**
     * Is this node ready to be used/rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @returns true when ready
     */
    isReady(completeCheck?: boolean): boolean;
    _getCameraDirection(camera: Camera): Vector3;
    private _isSortStateDirty;
    /** @internal */
    _postToWorker(forced?: boolean): void;
    /**
     * Triggers the draw call for the mesh. Usually, you don't need to call this method by your own because the mesh rendering is handled by the scene rendering manager
     * @param subMesh defines the subMesh to render
     * @param enableAlphaMode defines if alpha mode can be changed
     * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering
     * @returns the current mesh
     */
    render(subMesh: SubMesh, enableAlphaMode: boolean, effectiveMeshReplacement?: AbstractMesh): Mesh;
    private static _TypeNameToEnum;
    private static _ValueNameToEnum;
    /**
     * Parse a PLY file header and returns metas infos on splats and chunks
     * @param data the loaded buffer
     * @returns a PLYHeader
     */
    static ParseHeader(data: ArrayBuffer): PLYHeader | null;
    private static _GetCompressedChunks;
    private static _GetSplat;
    /**
     * Converts a .ply data with SH coefficients splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @param useCoroutine use coroutine and yield
     * @returns the loaded splat buffer and optional array of sh coefficients
     */
    static ConvertPLYWithSHToSplat(data: ArrayBuffer, useCoroutine?: boolean): Generator<undefined, {
        buffer: ArrayBuffer;
        sh?: undefined;
        shDegree?: undefined;
    } | {
        buffer: ArrayBuffer;
        sh: any[] | null;
        shDegree: number;
    }, unknown>;
    /**
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @param useCoroutine use coroutine and yield
     * @returns the loaded splat buffer without SH coefficient, whether ply contains or not SH.
     */
    static ConvertPLYToSplat(data: ArrayBuffer, useCoroutine?: boolean): Generator<undefined, ArrayBuffer, unknown>;
    /**
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer
     */
    static ConvertPLYToSplatAsync(data: ArrayBuffer): Promise<ArrayBuffer>;
    /**
     * Converts a .ply with SH data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer with SH
     */
    static ConvertPLYWithSHToSplatAsync(data: ArrayBuffer): Promise<unknown>;
    /**
     * Loads a .splat Gaussian Splatting array buffer asynchronously
     * @param data arraybuffer containing splat file
     * @returns a promise that resolves when the operation is complete
     */
    loadDataAsync(data: ArrayBuffer): Promise<void>;
    /**
     * Loads a Gaussian or Splatting file asynchronously
     * @param url path to the splat file to load
     * @param scene optional scene it belongs to
     * @returns a promise that resolves when the operation is complete
     * @deprecated Please use SceneLoader.ImportMeshAsync instead
     */
    loadFileAsync(url: string, scene?: Scene): Promise<void>;
    /**
     * Releases resources associated with this mesh.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     */
    dispose(doNotRecurse?: boolean): void;
    protected _copyTextures(source: GaussianSplattingMeshBase): void;
    /**
     * Returns a new Mesh object generated from the current mesh properties.
     * @param name is a string, the name given to the new mesh
     * @returns a new Gaussian Splatting Mesh
     */
    clone(name?: string): GaussianSplattingMeshBase;
    protected _makeEmptySplat(index: number, covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array): void;
    /**
     * Processes a single splat from the source buffer (at srcIndex) and writes the result into
     * the destination texture arrays at dstIndex. This decoupling allows addPart to feed multiple
     * independent source buffers into a single set of destination arrays without merging them first.
     * @param dstIndex - destination splat index (into _splatPositions, covA, covB, colorArray)
     * @param fBuffer - float32 view of the source .splat buffer
     * @param uBuffer - uint8 view of the source .splat buffer
     * @param covA - destination covariancesA array
     * @param covB - destination covariancesB array
     * @param colorArray - destination color array
     * @param minimum - accumulated bounding minimum (updated in-place)
     * @param maximum - accumulated bounding maximum (updated in-place)
     * @param flipY - whether to negate the Y position
     * @param srcIndex - source splat index (defaults to dstIndex when omitted)
     * @param dstArrayIndex - index into the covA/covB/colorArray transients (defaults to dstIndex). Lets a streaming
     * write pass count-sized transients indexed from 0 while dstIndex still addresses the atlas-sized _splatPositions.
     */
    protected _makeSplat(dstIndex: number, fBuffer: Float32Array, uBuffer: Uint8Array, covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array, minimum: Vector3, maximum: Vector3, flipY: boolean, srcIndex?: number, dstArrayIndex?: number): void;
    protected _onUpdateTextures(_textureSize: Vector2): void;
    /**
     * Called when part index data is received during a data load. Override to store and manage
     * part index state (e.g. allocating the padded Uint8Array).
     * No-op in the base class.
     * @param _partIndices - the raw part indices passed in by the caller
     * @param _textureLength - the padded texture length (width × height) to allocate into
     */
    protected _onIndexDataReceived(_partIndices: Uint8Array, _textureLength: number): void;
    /**
     * Called at the start of an incremental texture update, before any splats are processed.
     * Override to perform incremental-specific setup, such as ensuring the part-index GPU texture
     * exists before the sub-texture upload begins.
     * No-op in the base class.
     * @param _textureSize - current texture dimensions
     */
    protected _onIncrementalUpdateStart(_textureSize: Vector2): void;
    /**
     * Whether this mesh is in compound mode (has at least one part added via addPart).
     * Returns `false` in the base class; overridden to return `true` in the compound subclass.
     * Consumed by the material and depth renderer to toggle compound-specific shader paths.
     * @internal
     */
    get isCompound(): boolean;
    protected _setDelayedTextureUpdate(covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array, sh?: Uint8Array[]): void;
    /**
     * Creates (or recreates) the MRT-backed data atlas at the given size and points the four core data
     * textures at its attachments. The attachments use the same decoded GS layout as {@link GaussianSplattingWorkBuffer}
     * — [centers F32, covA HALF_FLOAT, covB HALF_FLOAT, colors U8], all RGBA — so a streaming engine can render
     * (decode/relayout) directly into the same textures the GS material samples, while static parts CPU-upload
     * into them via {@link _updateSubTextures}. Covariance B is RGBA here (its extra channels unused), so the
     * atlas forces {@link _useRGBACovariants}.
     * @param textureSize atlas dimensions (width, height)
     */
    protected _createMrtAtlas(textureSize: Vector2): void;
    /**
     * Creates the shared higher-order SH atlas: `_shMrtAtlasTextureCount` single-attachment integer render targets
     * (RGBA_INTEGER / UNSIGNED_INTEGER, packed-u32), sized to the whole atlas, so a streaming engine can GPU-decode
     * baked SH into the reserved region and static SH parts CPU-upload into the same attachments. `_shTextures` (the
     * draw path's `shTexture0..N` samplers) are the attachments. One MRT per attachment keeps within WebGPU's
     * per-sample color-attachment byte budget. No-op without a real GPU backend (mirrors {@link _createMrtAtlas}).
     * @param textureSize atlas dimensions (width, height)
     */
    protected _createShMrtAtlas(textureSize: Vector2): void;
    /**
     * Creates the shared rotation/scale atlas: one 3-attachment half-float render target ([rotA, rotB, rotScale])
     * sized to the whole atlas, so a streaming engine can GPU-decode rotation/scale into the reserved region and
     * static parts CPU-upload into the same attachments. `_rotationsATexture`/`_rotationsBTexture`/
     * `_rotationScaleTexture` (the voxel-IBL samplers) become the three attachments. No-op without a real GPU
     * backend (mirrors {@link _createMrtAtlas}).
     * @param textureSize atlas dimensions (width, height)
     */
    protected _createRotMrtAtlas(textureSize: Vector2): void;
    protected _updateTextures(covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array, sh?: Uint8Array[]): void;
    /**
     * Checks whether the GPU textures can be incrementally updated for a new addPart operation,
     * avoiding a full texture re-upload for existing splats.
     * Requires that the GPU textures already exist and the texture height won't change.
     * @param previousVertexCount - The number of splats previously committed to GPU
     * @param vertexCount - The new total number of splats
     * @param requiredShTextureCount - SH texture count this update requires (the merged `sh.length`), 0 when no SH
     * @returns true when only the new splat region needs to be uploaded
     */
    protected _canReuseCachedData(previousVertexCount: number, vertexCount: number, requiredShTextureCount?: number): boolean;
    /**
     * Posts updated positions to the sort worker and marks the sort as dirty.
     * Called after processing new splats so the worker can re-sort with the complete position set.
     * Subclasses (e.g. compound) may override to additionally post part-index data.
     */
    protected _notifyWorkerNewData(): void;
    /**
     * Patches only a contiguous range of source-splat centers in the sort worker, instead of re-copying and
     * transferring the entire position buffer (which is hundreds of MB for large streamed datasets and caused
     * a multi-frame freeze on every LOD decode). The worker must already hold a full-size position buffer (from
     * the initial {@link GaussianSplattingSortWorkerCommand.POSITIONS} message at worker creation). Marks the
     * sort dirty so the new splats are sorted in; the caller is responsible for any interval/range refresh.
     * @param splatOffset first splat index of the updated range
     * @param splatCount number of splats in the updated range
     */
    protected _postWorkerPositionsRange(splatOffset: number, splatCount: number): void;
    /**
     * Decodes raw `.splat` bytes (32 bytes/splat) into a contiguous sub-range of the already-allocated atlas,
     * uploading only the affected texels (never touching neighboring parts' texels) and patching just that
     * range of positions in the sort worker. Used to populate a region reserved by
     * {@link GaussianSplattingMesh.reserveStreamingPart} — the CPU path a streaming engine uses when GPU
     * decode/readback is unavailable, and the seam that verifies reservation + interleaving before the
     * streaming engine exists.
     *
     * The atlas textures and `_splatPositions` must already be sized to cover `[globalOffset, globalOffset+count)`
     * (guaranteed after `reserveStreamingPart`). Bounds of the written centers are accumulated into `min`/`max`
     * when provided (so the caller can grow the owning part's bounding info).
     * @param globalOffset first atlas splat index to write
     * @param count number of splats to write
     * @param splatsData raw `.splat` bytes for `count` splats (stride 32)
     * @param min optional running min accumulator for the written centers
     * @param max optional running max accumulator for the written centers
     */
    protected _writeStreamingSplats(globalOffset: number, count: number, splatsData: ArrayBuffer | ArrayBufferView, min?: Vector3, max?: Vector3): void;
    private _updateData;
    /**
     * Update asynchronously the buffer
     * @param data array buffer containing center, color, orientation and scale of splats
     * @param sh optional array of uint8 array for SH data
     * @param partIndices optional array of uint8 for rig node indices
     * @param shDegree optional SH degree of the data
     * @returns a promise
     */
    updateDataAsync(data: ArrayBuffer, sh?: Uint8Array[], partIndices?: Uint8Array, shDegree?: number): Promise<void>;
    /**
     * @experimental
     * Update data from GS (position, orientation, color, scaling)
     * @param data array that contain all the datas
     * @param sh optional array of uint8 array for SH data
     * @param options optional informations on how to treat data (needs to be 3rd for backward compatibility)
     * @param partIndices optional array of uint8 for rig node indices
     * @param shDegree optional SH degree of the data
     */
    updateData(data: ArrayBuffer, sh?: Uint8Array[], options?: IUpdateOptions, partIndices?: Uint8Array, shDegree?: number): void;
    /**
     * Refreshes the bounding info, taking into account all the thin instances defined
     * @returns the current Gaussian Splatting
     */
    refreshBoundingInfo(): Mesh;
    protected _updateSplatIndexBuffer(vertexCount: number): void;
    protected _updateTextureFromData: (texture: BaseTexture, data: ArrayBufferView, width: number, lineStart: number, lineCount: number) => void;
    protected _updateTextureFromDataRect: (texture: BaseTexture, data: ArrayBufferView, xOffset: number, yOffset: number, width: number, height: number) => void;
    protected _getTextureDataUpdateEngine(): ITextureDataUpdateCapableEngine;
    protected _updateShTextureData(texture: BaseTexture, shData: Uint8Array, textureWidth: number, lineStart: number, lineCount: number): void;
    protected _updateSubTextures(centers: Float32Array, covA: Uint16Array, covB: Uint16Array, colors: Uint8Array, lineStart: number, lineCount: number, sh?: Uint8Array[]): void;
    protected _instantiateWorker(): void;
    protected _getTextureSize(length: number): Vector2;
    /**
     * Called after the sort worker has been created and the initial positions message has been sent.
     * Override in subclasses to post any additional setup messages the worker needs (e.g. group
     * indices, per-part matrices, etc.).
     * @param _worker the newly created worker
     */
    protected _onWorkerCreated(_worker: Worker): void;
    /**
     * Called by the material to bind any extra shader uniforms that are specific to this mesh type.
     * The base implementation is a no-op; override in subclasses to bind additional data.
     * @param _effect the shader effect that is being bound
     * @internal
     */
    bindExtraEffectUniforms(_effect: Effect): void;
    /**
     * Processes all splats from a source GaussianSplattingMesh directly into the destination
     * texture arrays starting at dstOffset. This is the core of the texture-direct compound API:
     * no merged CPU buffer is ever created; each source mesh is written straight into its region.
     *
     * @param source - The source mesh whose splats are appended
     * @param dstOffset - The destination splat index at which writing starts
     * @param covA - Destination covA array (full texture size)
     * @param covB - Destination covB array (full texture size)
     * @param colorArray - Destination color array (full texture size)
     * @param sh - Destination SH arrays (full texture size), or undefined
     * @param minimum - Accumulated bounding min (updated in-place)
     * @param maximum - Accumulated bounding max (updated in-place)
     * @internal Use GaussianSplattingMesh.addPart instead
     */
    protected _appendSourceToArrays(source: GaussianSplattingMeshBase, dstOffset: number, covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array, sh: Uint8Array[] | undefined, minimum: Vector3, maximum: Vector3): void;
    /**
     * Modifies the splats according to the passed transformation matrix.
     * @param transform defines the transform matrix to use
     * @returns the current mesh
     */
    bakeTransformIntoVertices(transform: DeepImmutable<Matrix>): Mesh;
}
/**
 * Allocates SH texture buffers pre-filled with 128 (the neutral encoding of ~0.0 in the
 * shader's decompose() function). Padding bytes beyond the actual coefficients in the last
 * texture are read as higher-order SH bands when the mesh is added to a compound with a
 * higher degree; zero would decode to -1.0 instead, producing wrong colors.
 * @param textureCount number of SH textures to allocate
 * @param bytesEach byte size of each texture buffer
 * @returns array of initialized Uint8Array buffers
 */
export declare function AllocateShBuffers(textureCount: number, bytesEach: number): Uint8Array[];
export {};

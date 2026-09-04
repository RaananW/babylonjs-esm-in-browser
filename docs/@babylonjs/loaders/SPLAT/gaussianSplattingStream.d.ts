import { GaussianSplattingMesh, type IGaussianSplattingLodBudgetParticipant } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh.js";
import { type GaussianSplattingPartProxyMesh } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingPartProxyMesh.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { Camera } from "@babylonjs/core/Cameras/camera.js";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo.js";
/**
 * A single LOD variant of a tree node: a contiguous splat range inside one streamed SOG file.
 */
interface ISOGLODEntry {
    /** Index into {@link ISOGLODMetadata.filenames}. */
    file: number;
    /** First splat index inside that file. */
    offset: number;
    /** Number of splats. */
    count: number;
}
/**
 * A node of the PlayCanvas-style SOG LOD octree. Internal nodes have `children`; leaves have `lods`.
 */
interface ISOGLODNode {
    bound: {
        min: number[];
        max: number[];
    };
    children?: ISOGLODNode[];
    lods?: {
        [level: string]: ISOGLODEntry;
    };
    /** LOD level currently streamed/rendered for this node, or undefined until its base LOD is ready. */
    activeLod?: number;
    /** Distance-based ideal LOD level for this node, recomputed per frame. */
    optimalLod?: number;
    /** Projected screen size (pixels) of the node's AABB — the max across active cameras. Larger nodes keep finer
     * detail under the splat budget. Only computed while the budget is enabled. */
    pixelSize?: number;
    /** Available LOD levels for this leaf, sorted ascending (0 = finest). Set during the tree walk. */
    availableLevels?: number[];
    /** Coarsest available level (= max key), always streamed as the permanent base layer. */
    baseLod?: number;
    /** Final LOD level the node should stream/render (distance optimal, capped by maxDetailLod). */
    targetLevel?: number;
    /** Frames remaining before this node may switch LOD again (oscillation damping). */
    lodCooldown?: number;
    /** True when the node's bounding box currently intersects the camera frustum. Drives the LOD bias that
     * pushes off-screen nodes to the coarsest level (they stay rendered, not hidden). */
    inFrustum?: boolean;
    /** Cached local-space bounding info used for the per-node frustum test (created once per leaf). */
    cullBounds?: BoundingInfo;
    /** File index this node currently has an in-flight/queued decode request for (its not-yet-decoded target),
     * or undefined when the node's target is already decoded. Drives pending-download reference counting. */
    pendingFile?: number;
    /** File index this node's current {@link activeLod} renders from, or undefined before any LOD is active.
     * Drives the resident reference count that keeps a file in the work buffer. */
    activeFile?: number;
}
/**
 * Parsed contents of a PlayCanvas-style `lod-meta.json` file.
 */
export interface ISOGLODMetadata {
    /** Number of LOD levels (0 = highest detail). */
    lodLevels: number;
    /** SOG `meta.json` paths, relative to the metadata file, indexed by `ISOGLODEntry.file`. */
    filenames: string[];
    /** Optional always-on environment `.sog` bundle, relative to the metadata file. */
    environment?: string;
    /** Root of the LOD octree. */
    tree: ISOGLODNode;
}
/**
 * Selects which LOD value drives the {@link GaussianSplattingStream} debug wireframe colors.
 */
export type GaussianSplattingStreamDebugLodSource = "optimal" | "current";
/**
 * Options for {@link GaussianSplattingStream}.
 */
export interface IGaussianSplattingStreamOptions {
    /** URL of the fflate UMD module used to unzip `.sog` environment bundles. */
    deflateURL?: string;
    /** Pre-loaded fflate module. */
    fflate?: any;
    /** When true, renders a wireframe box per LOD node, colored by the node's LOD level. */
    debugDisplay?: boolean;
    /** Which LOD value drives the debug wireframe colors. Defaults to `"optimal"`. */
    debugLodSource?: GaussianSplattingStreamDebugLodSource;
    /** Distance (in local units) of the first LOD transition. PlayCanvas default `5`. */
    lodBaseDistance?: number;
    /** Geometric ratio between successive LOD transition distances. PlayCanvas default `3`. */
    lodMultiplier?: number;
    /** Distance multiplier applied to nodes behind the camera (`1` = no penalty). PlayCanvas default `1`. */
    lodBehindPenalty?: number;
    /** Lowest LOD index the optimal-LOD heuristic may select. Defaults to `0`. */
    lodRangeMin?: number;
    /** Highest LOD index the optimal-LOD heuristic may select. Defaults to `lodLevels - 1`. */
    lodRangeMax?: number;
    /** Maximum number of LOD source files to GPU-decode per frame (spreads work to avoid hitches). Defaults to `1`. */
    maxDecodesPerFrame?: number;
    /** Frames a node must wait after switching LOD before it may switch again (oscillation damping). Defaults to `10`. */
    lodCooldownFrames?: number;
    /** Minimum number of frames between LOD re-evaluations (throttles per-frame work during motion). Defaults to `4`. */
    lodUpdateInterval?: number;
    /** Minimum camera movement (world units) required to re-evaluate LODs. Defaults to `0.5`. */
    lodUpdateDistance?: number;
    /**
     * Finest (most detailed) LOD level any node is allowed to render. `0` allows full detail (level 0);
     * `1` caps detail at the next-coarser level, and so on. Higher values force a coarser maximum detail.
     */
    maxDetailLod?: number;
    /**
     * When true (default), LOD nodes outside the camera frustum are biased to their coarsest LOD rather than
     * rendered at full detail. They stay in the sort/render set so they appear instantly (at low detail) when
     * the camera turns toward them, then refine. Set to `false` to render every node at its distance LOD.
     */
    frustumCulling?: boolean;
    /** Maximum number of LOD file downloads allowed to run concurrently. PlayCanvas default `2`. */
    maxConcurrentDownloads?: number;
    /** Number of times a failed file download is retried before giving up. PlayCanvas default `2`. */
    maxDownloadRetries?: number;
    /**
     * GPU memory budget (in megabytes) for resident splats. When set (and smaller than the full dataset),
     * LOD files are streamed through a fixed-size work buffer and unreferenced files are evicted to stay
     * within budget, allowing datasets larger than a single full-dataset buffer. Converted to a splat count
     * using the per-splat cost (core data plus any baked SH and rotation/scale textures). Combined with
     * {@link maxResidentSplats} by taking the smaller of the two.
     */
    memoryBudgetMb?: number;
    /**
     * Maximum number of splats kept resident in the work buffer. When set (and smaller than the full
     * dataset), enables eviction-based streaming (see {@link memoryBudgetMb}). Default unset = size the work
     * buffer for the whole dataset (no eviction).
     */
    maxResidentSplats?: number;
    /**
     * Frames an unreferenced (no longer rendered) LOD file stays resident before it is evicted, so a quick
     * return to it avoids a re-download. Only used when a budget enables eviction. PlayCanvas default `100`.
     */
    evictionCooldownFrames?: number;
    /**
     * Enables budget-driven LOD: caps the total rendered splats by converging a screen-space (size + distance)
     * pixel-size threshold to the budget. Selection is view-direction-independent, so it is consistent across any
     * number of active cameras (each node takes the finest level and largest projected size any camera demands).
     * A number is an explicit splat cap; `"auto"` picks a device-tiered default (desktop 2.5M / iOS 1.5M /
     * other mobile 1M; XR shares the mobile tier). **Undefined (default) disables the cap** — LOD is pure
     * distance, identical to prior behavior. Runtime-mutable via the {@link splatBudget} accessor. When this stream
     * is hosted in a compound, the compound's {@link GaussianSplattingMesh.splatBudget} (if set) overrides this and
     * apportions a shared budget across all its streams.
     */
    splatBudget?: number | "auto";
    /**
     * When set, the stream does not render itself; instead it reserves a region of this compound mesh and
     * decodes/sorts into it, so its splats are depth-sorted and drawn in ONE pass together with the compound's
     * other (static) parts. Used by {@link AddGaussianSplattingStreamPart}. The stream mesh becomes a hidden
     * controller; the SOG up-axis orientation is applied to the reserved part's proxy transform.
     * @internal
     */
    hostCompound?: GaussianSplattingMesh;
    /**
     * When true, higher-order spherical-harmonics carried by the SOG files (`shN`) are GPU-decoded into baked
     * packed-u32 SH textures so the streamed splats render with view-dependent lighting (matching the non-stream
     * `.spz`/`.sog` path) instead of flat DC-only color. The SH degree is the max `shN.bands` across the streamed
     * files (lower-band files neutral-fill). No effect when the files carry no `shN`. Defaults to `true`, matching
     * the non-stream path's always-decode-if-present behavior; set to `false` to force flat DC-only color even
     * when the data carries `shN` (e.g. to save the decode cost/texture memory).
     */
    decodeSh?: boolean;
    /**
     * When true, each splat's rotation matrix + scale are GPU-decoded into half-float rotation/scale textures so the
     * streamed splats participate in voxel-based IBL shadowing (matching the non-stream path). Standalone: the work
     * buffer owns the rotation textures. Hosted: the compound's rotation textures become a shared render-target atlas
     * the stream decodes into. Defaults to `false`.
     */
    needsRotationScale?: boolean;
}
/**
 * Streams a PlayCanvas-style SOG LOD scene (`lod-meta.json`) into a single Gaussian Splatting mesh.
 *
 * Each selected SOG file (plus the environment) is loaded directly as GPU textures and decoded on the
 * GPU into one unified, PlayCanvas-style square work buffer (no CPU splat decode or `updateData`). Only
 * the splats of each node's currently-selected LOD are rendered/sorted via the mesh's interval filter.
 *
 * The coarsest (least-detail) LOD of every node is streamed first as a permanent base layer so the whole
 * scene is visible quickly with no holes. A distance-based "optimal" LOD is then computed per node (see
 * {@link evaluateOptimalLods}); finer LOD source files are streamed on demand and a node only switches to
 * a finer LOD once that file is decoded, so transitions never flash or leave gaps.
 *
 * @experimental
 */
export declare class GaussianSplattingStream extends GaussianSplattingMesh implements IGaussianSplattingLodBudgetParticipant {
    private readonly _metadata;
    private readonly _rootUrl;
    private readonly _streamOptions;
    private readonly _leafNodes;
    private _lodBaseDistance;
    private _lodMultiplier;
    private _lodBehindPenalty;
    private _lodRangeMin;
    private _lodRangeMax;
    private _maxDecodesPerFrame;
    private _lodCooldownFrames;
    private _lodUpdateInterval;
    private _lodUpdateDistance;
    private _maxDetailLod;
    private _lodPixelThreshold;
    private _hostBudgetAllocation;
    private _frustumCulling;
    private readonly _frustumPlanes;
    private readonly _cullViewProj;
    private readonly _frustumScratch;
    private _workBuffer;
    private _decodeSh;
    private _streamShDegree;
    private _shTextureCount;
    private _needsRotationScale;
    private _useGpuPositionReadback;
    private _readbackCandidate;
    private _readbackProbed;
    private _residency;
    private readonly _fileCounts;
    private readonly _fileMeta;
    private readonly _decodedFiles;
    private readonly _loadingFiles;
    private readonly _decodeQueue;
    private readonly _fileRefs;
    private readonly _cancelledDecodes;
    private _evictionEnabled;
    private _residentBudget;
    private _maxResidentSplats;
    private _memoryBudgetMb;
    private _evictionCooldownFrames;
    private _decodeGate;
    private readonly _relayoutOldOffsets;
    private _relayoutSrcIndex;
    private readonly _downloadManager;
    private _environmentRange;
    private _environmentFiles;
    private _lodObserver;
    private _baseLayerReady;
    private _framesSinceLodUpdate;
    private readonly _lastLodCamPositions;
    private _lastLodSignature;
    private _forceLodUpdate;
    private readonly _boundsMin;
    private readonly _boundsMax;
    private _debugDisplay;
    private _debugLodSource;
    private _debugMesh;
    private _debugObserver;
    private _debugColorData;
    private _debugSignature;
    private _disposed;
    private readonly _hostCompound;
    private _host;
    private _positionBase;
    private _unsubBeforeRebuild;
    private _unsubAfterRebuild;
    private _hostUnsubRemove;
    private _hostUnsubDispose;
    private _partReleasedByHost;
    private _positionSnapshot;
    private _partReadyPromise;
    private _partReadyResolve;
    private _partReadyReject;
    private _partReadySettled;
    /**
     * Returns true when the parsed JSON looks like a PlayCanvas-style `lod-meta.json` payload.
     * @param data parsed JSON
     * @returns whether the data is SOG LOD metadata
     */
    static IsLODMetadata(data: unknown): data is ISOGLODMetadata;
    /**
     * Creates a new SOG LOD streaming mesh and immediately starts streaming (non-blocking).
     * @param name mesh name
     * @param metadata parsed `lod-meta.json`
     * @param rootUrl base URL the metadata's relative paths resolve against
     * @param scene hosting scene
     * @param options streaming options
     */
    constructor(name: string, metadata: ISOGLODMetadata, rootUrl: string, scene: Scene, options?: IGaussianSplattingStreamOptions);
    getClassName(): string;
    /**
     * When `_hostCompound` is set (i.e. this stream was created via {@link AddGaussianSplattingStreamPart}
     * to drive a reserved region of another compound mesh, rather than rendering itself), this instance is
     * disabled and never drawn — so it never runs its own depth-sort worker and the base class's readiness
     * check (which waits for one) would never pass. Report ready unconditionally in that case; the host
     * compound is the one actually rendering, and its own `isReady()` already covers real sort completion.
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @returns true when ready
     */
    isReady(completeCheck?: boolean): boolean;
    /**
     * Hosted mode only: the compound part proxy this stream drives (world transform + visibility of the
     * reserved region), or null before the part has been reserved (or when running standalone).
     */
    get streamingPartProxy(): Nullable<GaussianSplattingPartProxyMesh>;
    /**
     * Hosted mode only: resolves once the reserved part exists and its base layer has decoded (so the proxy's
     * bounds are real and the part is ready to be placed/framed), or rejects if streaming fails/disposes first.
     * Resolves immediately for a standalone stream. Used by {@link AddGaussianSplattingStreamPartAsync}.
     * @returns a promise that settles when the hosted part is ready to use
     */
    whenPartReadyAsync(): Promise<void>;
    /** Resolves the part-ready deferred (hosted mode); no-op if already settled or standalone. */
    private _resolvePartReady;
    /**
     * Rejects the part-ready deferred (hosted mode); no-op if already settled or standalone.
     * @param message failure reason surfaced to the awaiter
     */
    private _rejectPartReady;
    /**
     * Resolves once the scene is fully streamed and displayed for the current camera: a LOD re-evaluation has
     * run for the current point of view, every reachable LOD file has finished downloading and decoding (no
     * downloads, decodes, or queued work remain), and the depth sort for the resulting splats has been applied
     * and rendered. Intended for deterministic automated testing and screenshot/image comparison.
     *
     * Streaming and settling require rendered frames. If an external render loop is already running, this waits
     * on it passively; otherwise (e.g. when awaited inside an async `createScene` before the host starts its
     * render loop) it drives `scene.render()` itself until settled, so it never deadlocks.
     *
     * Note: the promise only resolves while the camera is still — if the camera keeps moving, the target LODs
     * (and the depth sort) keep changing and the stream never settles. Position the camera, then await this.
     * @param stableFrames number of consecutive settled frames to require before resolving (defaults to 3), so
     *   the final sorted frame is actually on screen
     * @returns a promise that resolves when loading and rendering are complete for the current view
     */
    whenSettledAsync(stableFrames?: number): Promise<void>;
    /**
     * Whether the base layer is ready and there is no streaming work in flight (nothing queued for decode, no
     * decode running, and no downloads pending).
     * @returns true when no loading work remains
     */
    private _isLoadingIdle;
    /**
     * Finest (most detailed) LOD level any node is allowed to render. `0` allows full detail (level 0);
     * `1` caps detail at the next-coarser level, and so on. Nodes already coarser than this cap (by
     * distance) are unaffected. Changes take effect in real time.
     */
    get maxDetailLod(): number;
    set maxDetailLod(value: number);
    /**
     * This stream's own budget-driven LOD cap in splats (see {@link IGaussianSplattingStreamOptions.splatBudget}).
     * `0` disables the budget (pure distance LOD). Setting it caps the rendered splat count, taking effect on the
     * next frame. When this stream is hosted in a compound whose own budget is set, that shared budget overrides
     * this value — read the actual runtime cap from {@link effectiveSplatBudget}, not this getter (which always
     * reports the configured own cap).
     * @experimental
     */
    get splatBudget(): number;
    set splatBudget(value: number);
    /**
     * The splat cap actually in force this frame: a hosting compound's apportioned allocation when this stream is
     * coordinated, otherwise this stream's own {@link splatBudget}, clamped to what can be kept resident. `0` means
     * no cap (pure distance LOD). Unlike {@link splatBudget}, this reflects the compound override, so it is the value
     * to display or reason about at runtime.
     * @experimental
     */
    get effectiveSplatBudget(): number;
    /**
     * Resolves the raw {@link splatBudget} option to a concrete cap: `undefined` ⇒ 0 (disabled), `"auto"` ⇒ a
     * device-tiered default, a positive number ⇒ itself (floored).
     * @param option the raw option value
     * @returns the resolved splat cap (0 = disabled)
     */
    private _resolveSplatBudget;
    /**
     * Device-tiered default splat budget for {@link splatBudget} `"auto"`: desktop 2.5M, iOS 1.5M, other mobile
     * (incl. Android/XR) 1M. XR is folded into the mobile tier (no reliable at-construction detection).
     * @returns the default splat cap for this device
     */
    private _computeDefaultSplatBudget;
    /**
     * The splat budget this stream converges against this frame: the compound's apportioned allocation when hosted
     * and coordinated, else this stream's own resolved budget. Clamped to the resident budget so the stream never
     * targets more splats than can be kept resident. `0` means the budget is disabled.
     * @returns the effective splat cap (0 = disabled)
     */
    private _effectiveSplatBudget;
    /**
     * Whether budget-driven LOD is active this frame.
     * @returns true when a positive effective budget is in force
     */
    private _splatBudgetEnabled;
    /**
     * {@link IGaussianSplattingLodBudgetParticipant}: the splats this stream would render at full (distance-optimal)
     * detail — its demand on a host compound's shared budget. Computed from the current per-node distance-optimal
     * levels (no pixel threshold), so it does not depend on the allocation it is helping to compute.
     * @returns the full-detail rendered splat count (0 before the base layer is ready)
     */
    getBudgetDemand(): number;
    /**
     * {@link IGaussianSplattingLodBudgetParticipant}: sets the compound's apportioned share of the shared budget.
     * `null` releases coordination (revert to this stream's own {@link splatBudget}); a number (incl. 0, meaning
     * "coordinated at the coarsest level") drives the pixel-threshold convergence. Any change to the (already integer)
     * allocation forces a next-frame re-eval: a decrease may put the current selection over the new cap, and even a
     * small increase can unlock a finer level that a stationary camera would otherwise never re-evaluate to. The
     * apportioned demand is allocation-independent, so this settles in one step and does not churn frame to frame.
     * @param splats the apportioned allocation, or null to release coordination
     */
    setBudgetAllocation(splats: Nullable<number>): void;
    /**
     * Coarsest LOD level index in the scene (number of LOD levels minus one). Useful as the upper bound
     * for {@link maxDetailLod}.
     */
    get maxLodLevel(): number;
    /**
     * When true (default), nodes whose bounding box is outside the camera frustum are biased to the coarsest
     * LOD instead of being hidden. They stay in the sort/render set (their off-screen splats are clipped), so
     * turning the camera toward them shows low detail immediately with no invisible frames, then refines.
     * Changes take effect in real time.
     */
    get frustumCulling(): boolean;
    set frustumCulling(value: boolean);
    /**
     * When true, renders a wireframe box per LOD node, colored by the LOD level selected by {@link debugLodSource}.
     */
    get debugDisplay(): boolean;
    set debugDisplay(value: boolean);
    /**
     * Selects which LOD value drives the debug wireframe colors: the distance-based `"optimal"` LOD
     * (default, recomputed as the camera moves) or the `"current"` streamed/rendered LOD.
     */
    get debugLodSource(): GaussianSplattingStreamDebugLodSource;
    set debugLodSource(value: GaussianSplattingStreamDebugLodSource);
    dispose(doNotRecurse?: boolean): void;
    /**
     * Disposes this stream (which tombstones its region) and then compacts the host once to actually reclaim the
     * reserved rows. Used on a definitive load failure / empty result — a discrete, one-off reclaim, versus a bare
     * {@link dispose} that only tombstones so tearing down several parts doesn't rebuild the atlas repeatedly.
     */
    private _disposeAndReclaim;
    /**
     * The world matrix that actually places this stream's splats, used to map the camera into the space the
     * node bounds live in (for LOD distance) and to build per-node world AABBs (for frustum culling). Standalone:
     * this controller mesh carries the transform. Hosted: this controller is a hidden, unplaced node — the splats
     * are placed by the reserved part's proxy (SOG up-axis basis composed with the host's placement), so LOD and
     * culling MUST use the proxy's world matrix or they compute distances/frustum tests in the wrong space
     * (producing wrong per-chunk LODs, i.e. holes, whenever the host applies a non-identity transform).
     * @param force when true, forces a full world-matrix recompute (else uses the renderId/sync fast-path)
     * @returns the effective world matrix for LOD/culling
     */
    private _getEffectiveWorldMatrix;
    /**
     * The cameras the LOD should serve: `scene.activeCameras` when set (split-view / multi-view), else the single
     * `scene.activeCamera`. Mirrors the sort path's multi-camera handling.
     * @returns the non-null active cameras (may be empty)
     */
    private _getActiveLodCameras;
    /**
     * Re-evaluates the optimal LOD for every node from the active cameras. Each node takes the finest level and the
     * largest projected pixel size any active camera demands (so every pane of a split view is served), and the
     * frustum bias uses the union of the frusta. Selection is view-direction-independent, so single- and multi-camera
     * rendering are consistent. The results are stored in each node's `optimalLod` / `pixelSize`.
     * @param camera when provided, evaluate against just this camera; otherwise use the active-camera set
     */
    evaluateOptimalLods(camera?: Nullable<Camera>): void;
    /**
     * The LOD level used to color a node's debug box, per {@link debugLodSource}.
     * @param node leaf node
     * @returns the displayed LOD level
     */
    private _displayedLodLevel;
    /**
     * Rebuilds the debug wireframe (evaluating the optimal LOD first when needed) and wires up the per-frame
     * recolor observer. The observer runs for both LOD sources: "optimal" colors track the camera, and
     * "current" colors track LOD levels as they stream in/out.
     */
    private _refreshDebugDisplay;
    /**
     * Per-frame debug update: recolors the existing wireframe in place whenever the displayed LOD levels
     * change. For the "optimal" source the optimal LOD is recomputed first (it tracks the camera); for the
     * "current" source the levels are driven by the streaming loop, so no recomputation is needed here. The
     * geometry is never rebuilt, which avoids the dispose/recreate flicker while the camera moves.
     */
    private _onDebugFrame;
    /**
     * Builds the LOD-node wireframe boxes once (one box per leaf node), colored by the displayed LOD level.
     * The color vertex buffer is created updatable so subsequent recolors can happen in place.
     */
    private _buildDebugMesh;
    /**
     * Recolors the existing wireframe in place from the current displayed LOD levels, without rebuilding geometry.
     */
    private _updateDebugColors;
    /**
     * Computes a cheap 32-bit rolling hash of every leaf's displayed LOD level, used to detect when the
     * debug wireframe needs recoloring. Avoids per-frame string allocation in the render loop.
     * @returns a numeric signature of the current displayed LOD levels
     */
    private _computeDebugSignature;
    /**
     * Disposes the LOD-node wireframe boxes and stops live debug updates.
     */
    private _clearDebugDisplay;
    /**
     * Walks the LOD tree and records every leaf that carries renderable LOD entries, capturing the set of
     * available levels and the coarsest (base) level for each.
     * @param node current tree node
     */
    private _collectLodEntries;
    /**
     * Streams the scene: learns every source file's splat count, allocates one unified GPU work buffer
     * sized for all LOD files, decodes the environment and the coarsest LOD of every node as a permanent
     * base layer, then installs the per-frame loop that streams finer LODs on demand.
     */
    private _streamAllAsync;
    /**
     * Waits (up to a frame cap) until the work buffer's backup/restore copy shaders are compiled, so a later
     * grow/compaction can preserve this hosted region (see {@link GaussianSplattingWorkBuffer.backupRegion}).
     * Polls per rendered frame: shader readiness here depends on the render loop (and the shared atlas can be
     * rebuilt concurrently), so this stays synchronized with the render-driven decode and always makes progress.
     * On timeout it proceeds best-effort — a subsequent grow/compaction then warns rather than blocking decode.
     * @param wb the hosted work buffer to wait on
     */
    private _waitForCanBackupAsync;
    /**
     * Resolves the resident-splat budget from the raw options, sizing a memory (MB) budget with the actual per-splat
     * GPU+CPU cost — core data plus the baked SH textures and rotation/scale textures when enabled — so SH/rotation
     * assets don't silently consume up to double the configured budget. Requires the SH degree (from the metadata
     * pre-pass) to be known. The smaller of the splat-count and memory budgets wins.
     */
    private _resolveResidentBudget;
    /**
     * Collects the unique set of source file indices referenced by any LOD of any leaf, sorted ascending.
     * @returns sorted unique file indices
     */
    private _collectAllFileIds;
    /**
     * Fetches the environment bundle and every referenced file's metadata to learn splat counts, caching
     * each file's parsed metadata for the later on-demand decode. Metadata fetches run in parallel.
     * @param fileIds file indices to fetch metadata for
     * @returns the environment splat count (0 when there is no environment)
     */
    private _gatherCountsAsync;
    /**
     * Queues a file for on-demand decode if it isn't already decoded, in flight, or already queued.
     * @param fileId file index to decode
     */
    private _enqueueDecode;
    /**
     * Starts up to {@link _maxDecodesPerFrame} queued decodes for this frame. Decodes run asynchronously
     * and promote any waiting nodes once they complete.
     */
    private _pumpDecodeQueue;
    /**
     * Writes a decoded splat range's positions into the shared buffer, expands the bounds, and incrementally
     * patches the sort worker.
     * @param positions stride-4 positions for the range
     * @param base first splat index of the range in the work buffer
     * @param count number of splats in the range
     */
    private _applyPositions;
    /**
     * Sets the active source ranges (local to the stream's buffer) on the render sink.
     * @param localRanges active ranges in the stream's local index space
     */
    private _sinkSetActiveRanges;
    /**
     * Patches a decoded position range (local offset) into the render sink's sort worker.
     * @param base first splat index of the range, local to the stream's buffer
     * @param count number of splats in the range
     */
    private _sinkPostPositionsRange;
    /** Re-posts the full position/part set to the render sink's worker (after a relayout moved the region). */
    private _sinkNotifyDataChanged;
    /** Whether the render sink's depth sort is settled. */
    private get _sinkIsDepthSortSettled();
    /**
     * One-time validation of GPU position readback: reads a sample of the just-decoded range back from the work
     * buffer and compares it to the CPU-decoded positions. Enables {@link _useGpuPositionReadback} only on an
     * exact (within float tolerance) match, so an unsupported or incorrect readback (e.g. a backend without the
     * required texture usage, or an orientation mismatch) safely keeps the CPU decode path.
     * @param base first splat index of the validated range
     * @param count number of splats in the range
     * @param cpuPositions the CPU-decoded stride-4 positions for the range (ground truth)
     */
    private _probeReadbackAsync;
    /**
     * Resolves the decoded positions for a splat range and applies them. Once GPU readback has been validated,
     * positions are read back from the work buffer (non-blocking) and `pack.positions` is empty; otherwise the
     * CPU-decoded `pack.positions` are used, and — on the first such decode — the GPU readback is validated
     * against them so subsequent decodes can use the fast path.
     * @param pack the parsed SOG pack (its `positions` is populated only on the CPU path)
     * @param base first splat index of the range in the work buffer
     * @param count number of splats in the range
     * @returns whether positions were applied
     */
    private _applyDecodedPositionsAsync;
    /**
     * Decodes the always-on environment bundle into its work-buffer block and activates its range.
     */
    private _decodeEnvironmentAsync;
    /**
     * Loads one LOD source file as GPU textures, decodes it into its fixed work-buffer block, records its
     * CPU centers for sorting, frees the source textures, then promotes any nodes that were waiting for it.
     * Concurrent or repeat requests for the same file are ignored. If the file is cancelled mid-flight
     * (because every node that wanted it retargeted), the decode bails cooperatively at the next checkpoint.
     * @param fileId file index to decode
     */
    private _decodeFileAsync;
    /**
     * Acquires the decode gate (a simple async mutex). Resolves once any prior holder releases, returning a
     * release function the caller must invoke in a `finally`.
     * @returns the release function
     */
    private _acquireDecodeGateAsync;
    /**
     * Defragments the work buffer to make room for a file that did not fit, then allocates its slot. Runs the
     * compaction + GPU relayout atomically inside a single `onBeforeRender` so no inconsistent CPU/GPU layout
     * is ever rendered. Returns the new slot offset, or null if even compaction cannot free enough contiguous
     * space (the caller refuses the upgrade).
     * @param fileId file to allocate after compaction
     * @param count splats the file needs
     * @returns the allocated offset, or null
     */
    private _relayoutAndAllocateAsync;
    /**
     * Compacts the resident set and relocates the corresponding GPU textures and CPU positions to the new
     * layout. Must run at a frame-safe point with the work buffer's relayout shader ready.
     */
    private _performRelayout;
    /**
     * Drops a file evicted by the residency controller from the decoded set so it will be re-decoded on demand.
     * The file had no remaining references, so no node was rendering or downloading it.
     * @param fileId evicted file index
     */
    private _onFileEvicted;
    /**
     * Snaps a desired LOD level to the nearest level the node provides, while never selecting a level finer
     * than {@link maxDetailLod} (i.e. with an index below the cap). Ties prefer the finer allowed level. If
     * the node has no level at or coarser than the cap, its coarsest available level is used.
     * @param node leaf node
     * @param desired desired LOD level
     * @returns the chosen available level
     */
    private _cappedLevelForNode;
    /**
     * Computes each node's {@link ISOGLODNode.targetLevel}. With the splat budget disabled this is the
     * distance-optimal level snapped to an available level (capped by {@link maxDetailLod}) — unchanged prior
     * behavior. With the budget enabled it converges a global pixel-size threshold to the budget and coarsens each
     * node from its distance-optimal ceiling by how far its projected size falls below that threshold.
     */
    private _computeTargetLevels;
    /**
     * Splat count of the always-rendered environment layer (0 when none), coerced to a finite non-negative integer.
     * Counted as a fixed cost in both the budget demand and the leaf convergence so it is never over-drawn.
     * @returns the environment's rendered splat count
     */
    private _environmentSplatCount;
    /**
     * The level a node renders at for a given pixel-size threshold `t`: its distance-optimal ceiling, coarsened by
     * `round(log_mult(t / pixelSize))` geometric steps when its projected size is below `t`. Snapped to
     * an available level honoring {@link maxDetailLod}.
     * @param node leaf node
     * @param t pixel-size threshold (pixels)
     * @returns the chosen available LOD level
     */
    private _budgetedLevel;
    /**
     * Splat count of a node's file at a given (already snapped) available level.
     * @param node leaf node
     * @param level available LOD level
     * @returns the level's splat count (0 if absent)
     */
    private _countAtLevel;
    /**
     * Sum of every leaf's rendered splat count at pixel-size threshold `t`.
     * @param t pixel-size threshold (pixels)
     * @returns total rendered splats
     */
    private _totalSplatsAtThreshold;
    /**
     * Converges the global pixel-size threshold {@link _lodPixelThreshold} to the largest detail whose total rendered
     * splats is still within `budget` (the pixel-scale cut, floored at the true sub-pixel limit of 1 px). The
     * total is monotonically non-increasing in the threshold, so a bisection on `[floorT, ceilT]` — where `ceilT`
     * coarsens every node to its coarsest available level — gives a GUARANTEED result at or under the cap. When even
     * that coarsest state exceeds the budget (the budget is below the pinned minimum detail), the threshold is set to
     * `ceilT` so every node renders at minimum detail — the best achievable; the cap is then unavoidable. O(leaves)
     * per iteration; no decode.
     * @param budget target maximum rendered splat count
     */
    private _convergePixelThreshold;
    /**
     * The finest already-decoded level of a node that is at least as coarse as `level` (index >= level). Used to
     * enforce the budget cap immediately without waiting for a download. Returns `null` when no such level is resident
     * — including when eviction has freed the base layer — so the caller keeps the currently-visible (resident) file
     * rather than switching to a non-resident one, which would render a hole.
     * @param node leaf node
     * @param level the minimum coarseness (level index) required
     * @returns a resident level index >= level, or null when none is resident
     */
    private _residentLevelAtLeast;
    /**
     * Applies each node's {@link ISOGLODNode.targetLevel}: switches a node to its target level when that
     * level's file is already decoded, otherwise records a pending download request for the file and leaves
     * the node on its current LOD (so nothing ever disappears). Nodes within their post-switch cooldown are
     * left untouched to damp oscillation (and keep their existing pending request).
     *
     * Each node tracks the single file it currently needs but lacks ({@link ISOGLODNode.pendingFile}). When a
     * node's target changes before that file finished downloading, the old file's reference is released; if no
     * other node still needs it, its queued/in-flight download is cancelled (see {@link _releaseFileRef}).
     * @returns true when at least one node changed LOD (callers should refresh the active ranges)
     */
    private _applyDesiredLods;
    /**
     * Moves a node's resident reference from its previous active file to the one it now renders, so the file
     * count that keeps a block in the work buffer stays accurate (and cancels any pending eviction of the new
     * file). The new file is already decoded.
     * @param node leaf node switching its rendered file
     * @param file the file the node now renders from
     */
    private _switchActiveFile;
    /**
     * Adds a reference to a file (active render or pending download), cancelling any scheduled eviction.
     * @param fileId file index
     */
    private _acquireFileRef;
    /**
     * Records that a node needs a not-yet-decoded file, bumping its reference count and queueing the decode.
     * @param fileId file index the node now targets
     */
    private _acquirePendingFile;
    /**
     * Releases a node's reference to a file. When the last reference is dropped: a decoded file is scheduled
     * for eviction (when streaming under a budget), and a still-downloading file has its queued decode dropped
     * and any in-flight download cancelled.
     * @param fileId file index the node no longer references
     */
    private _releaseFileRef;
    /**
     * Per-frame LOD streaming loop. Ticks cooldowns and pumps the decode queue every frame, and runs the
     * cheap per-node frustum test every frame so the off-screen LOD bias tracks camera rotation. The LOD
     * re-evaluation is throttled to at most every {@link _lodUpdateInterval} frames once the camera has
     * translated far enough, but also runs immediately whenever a node enters/leaves the frustum (so its
     * detail upgrades/downgrades promptly), a node whose cooldown just expired still needs to switch LOD,
     * or a cap change forces it. Active ranges rebuild on any LOD change.
     *
     * The cooldown-expiry trigger lets a node reach its already-computed target level as soon as its
     * cooldown clears, rather than waiting for the camera to move. This matters right from load: a
     * node's base-layer decode is itself applied as a switch (from no active level to the base one), so
     * it starts the same cooldown a later switch would — this trigger is what lets the node progress past
     * that base level promptly once it expires, even at a fixed camera pose.
     */
    private _onLodFrame;
    /**
     * A cheap signature of the discrete inputs (besides camera translation, tracked separately) that affect projected
     * pixel size: each camera's identity, FOV, FOV mode and viewport, plus the engine render size and the effective
     * world matrix revision. A change invalidates the throttled budget LOD so a colocated camera swap / viewport
     * resize / FOV change — or the stream (or its hosted proxy) being moved or scaled while still in frustum, which
     * shifts every node's distance and projected size — can't leave it stale.
     * @param cameras the active cameras
     * @returns the signature string
     */
    private _computeLodSignature;
    /**
     * Updates each leaf node's {@link ISOGLODNode.inFrustum} flag: a node is in-frustum if it is inside ANY
     * active camera's frustum (the union). When {@link frustumCulling} is disabled (or there are no cameras)
     * every node is marked in-frustum. Bounds are static (from the LOD tree), so flags are valid for all nodes
     * regardless of decode state. Returns true when any node's in-frustum state changed (so the LOD bias must be re-applied).
     * @returns whether any node's in-frustum state changed
     */
    private _updateNodeFrustum;
    /**
     * Reads the splat count from SOG metadata, coerced to a finite non-negative integer (metadata is untrusted, so
     * `count` / `shape[0]` may be a string or malformed — a non-numeric value must not leak into count arithmetic).
     * @param data SOG metadata
     * @returns the splat count (0 when absent/invalid)
     */
    private static _GetSplatCount;
    /**
     * Reads a SOG file's higher-order SH degree and coefficient count from its metadata, mirroring
     * {@link ParseSogDatas}'s `coeffs`/`shDegree` derivation. Returns zeros when the file carries no `shN`.
     * @param data parsed SOG root metadata
     * @returns the SH degree and higher-order coefficient count (excludes the DC/SH0 term)
     */
    private static _GetShInfo;
    /**
     * Disposes all GPU source textures of a SOG pack (they are only needed for the one decode pass).
     * @param pack the SOG texture pack
     */
    private static _DisposePack;
    /**
     * Expands the running splat-center bounds with a newly decoded file's centers and updates the
     * mesh bounding info so the GS is correctly frustum-culled and pickable.
     * @param positions stride-4 splat centers for the new file
     * @param count number of splats
     */
    private _updateBounds;
    /**
     * Rebuilds the active interval set from the environment plus each node's currently-selected LOD entry,
     * coalesces adjacent ranges, and pushes the result to the sort worker.
     */
    private _refreshActiveRanges;
    /**
     * Sorts and merges adjacent/overlapping ranges to keep the interval list compact.
     * @param ranges raw ranges
     * @returns coalesced ranges
     */
    private static _CoalesceRanges;
    /**
     * Unzips a `.sog` bundle into a name -> bytes map, loading fflate on demand.
     * @param data zipped bytes
     * @returns map of entry name to bytes
     */
    private _unzipAsync;
}
/**
 * Adds a PlayCanvas-style SOG LOD stream as a part of a compound Gaussian Splatting mesh, so the streamed
 * splats are depth-sorted and rendered in ONE pass together with the compound's other (static) parts.
 *
 * The returned mesh is a hidden controller: it streams SOG LOD files, GPU-decodes them into a reserved region
 * of the compound's shared atlas, and drives which of its splats are active (LOD) — the compound owns the sort
 * and the single instanced draw. The SOG up-axis orientation is applied to the reserved part's proxy transform;
 * move/hide the part via the proxy (`streamController` exposes it once streaming has started).
 * @param compound the compound mesh to add the streamed part to
 * @param name name for the streaming controller / part
 * @param metadata parsed `lod-meta.json`
 * @param rootUrl base URL the metadata's relative paths resolve against
 * @param options streaming options
 * @returns the streaming controller mesh (hidden; drives the reserved compound part)
 * @experimental
 */
export declare function AddGaussianSplattingStreamPart(compound: GaussianSplattingMesh, name: string, metadata: ISOGLODMetadata, rootUrl: string, options?: IGaussianSplattingStreamOptions): GaussianSplattingStream;
/**
 * Adds a PlayCanvas-style SOG LOD stream as a part of a compound Gaussian Splatting mesh and resolves once the
 * part is ready to use, returning its {@link GaussianSplattingPartProxyMesh} — the same handle
 * `GaussianSplattingCompoundMesh.addPart` returns for a static part. This lets a host application treat a
 * streamed splat exactly like any other compound part (place/frame/gizmo via the proxy, remove via
 * `compound.removePart(proxy.partIndex)`); the streaming controller lives behind the proxy and is disposed
 * automatically when the part is removed.
 *
 * Resolves after the reserved region exists and its base layer has decoded (so the proxy's bounds are real),
 * and rejects if streaming fails before that (the partially-constructed stream is disposed on rejection).
 *
 * NOTE: the base-layer decode runs on the GPU inside the scene's render loop, so this promise only resolves once
 * the scene is rendering. Do not `await` it before the render loop has started (it would never resolve) — start
 * rendering (e.g. `engine.runRenderLoop`) first, or `await` it concurrently with the first frames.
 * @param compound the compound mesh to add the streamed part to
 * @param name name for the streaming controller / part
 * @param metadata parsed `lod-meta.json`
 * @param rootUrl base URL the metadata's relative paths resolve against
 * @param options streaming options
 * @returns the part proxy driving the streamed region, ready to place/frame
 * @experimental
 */
export declare function AddGaussianSplattingStreamPartAsync(compound: GaussianSplattingMesh, name: string, metadata: ISOGLODMetadata, rootUrl: string, options?: IGaussianSplattingStreamOptions): Promise<GaussianSplattingPartProxyMesh>;
export {};

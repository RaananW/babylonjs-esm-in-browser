/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
import { type Vector2 } from "../../Maths/math.vector.js";
import { type Effect } from "../../Materials/effect.pure.js";
import { GaussianSplattingMeshBase, type IGaussianSplattingSplatRange } from "./gaussianSplattingMeshBase.pure.js";
import { type MultiRenderTarget } from "../../Materials/Textures/multiRenderTarget.pure.js";
import { GaussianSplattingPartProxyMesh } from "./gaussianSplattingPartProxyMesh.pure.js";
import { BoundingInfo } from "../../Culling/boundingInfo.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { type AbstractMesh } from "../abstractMesh.pure.js";
interface IGaussianSplattingPartSource {
    name: string;
    _vertexCount: number;
    _splatsData: Nullable<ArrayBuffer | ArrayBufferView>;
    _shData: Nullable<Uint8Array[]>;
    _shDegree: number;
    isCompound: boolean;
    getWorldMatrix(): Matrix;
    getBoundingInfo(): BoundingInfo;
    dispose(): void;
    /**
     * When true this is a placeholder that reserves `_vertexCount` empty (invisible) splats in the
     * atlas instead of copying real data. Used by {@link GaussianSplattingMesh.reserveStreamingPart}
     * so a streaming engine can later GPU-decode into the reserved region. Sources flagged this way
     * are allowed to have a null `_splatsData`; their atlas region is left zeroed (invisible padding).
     */
    _isReservedEmpty?: boolean;
}
/**
 * A LOD engine (e.g. a streamed part) that participates in a compound's shared splat budget. The compound
 * apportions {@link GaussianSplattingMesh.splatBudget} (net of static parts) across all registered participants
 * by demand and pushes each its allocation. Defined here (core) so the compound never depends on the loader's
 * streaming engine; the engine implements this and registers via
 * {@link GaussianSplattingMesh.registerLodBudgetParticipant}.
 * @experimental
 */
export interface IGaussianSplattingLodBudgetParticipant {
    /** The number of splats this participant would render at full (distance-optimal) detail — its budget demand. */
    getBudgetDemand(): number;
    /**
     * Sets the participant's apportioned share of the compound budget (in splats). `null` clears coordination so
     * the participant reverts to its own budget; `0` keeps it coordinated at the coarsest level.
     * @param splats the apportioned splat allocation, or null to release coordination
     */
    setBudgetAllocation(splats: Nullable<number>): void;
}
/**
 * Handle to a region of a compound Gaussian Splatting mesh reserved for dynamic (streamed) content by
 * {@link GaussianSplattingMesh.reserveStreamingPart}. It lets a streaming engine populate the region's
 * splats over time and drive which of them are sorted/rendered, while the compound keeps depth-sorting
 * and drawing every part (static + streamed) together in one pass.
 *
 * Ranges/offsets passed to this handle are LOCAL to the part (0-based within `[0, capacity)`); the handle
 * translates them to the compound's global atlas coordinates.
 */
export interface IGaussianSplattingStreamingPart {
    /** The proxy mesh controlling this part's world transform and visibility. */
    readonly proxy: GaussianSplattingPartProxyMesh;
    /** The part index assigned to this streaming region in the compound. */
    readonly partIndex: number;
    /** First atlas splat index of the reserved region. */
    readonly base: number;
    /** Number of splats reserved for the region. */
    readonly capacity: number;
    /** The compound's shared centers texture (the region occupies `[base, base+capacity)` within it). */
    readonly centersTexture: Nullable<BaseTexture>;
    /** The compound's shared covariance A texture. */
    readonly covariancesATexture: Nullable<BaseTexture>;
    /** The compound's shared covariance B texture. */
    readonly covariancesBTexture: Nullable<BaseTexture>;
    /** The compound's shared colors texture. */
    readonly colorsTexture: Nullable<BaseTexture>;
    /** The compound's shared CPU centers buffer consumed by the sort worker. */
    readonly splatPositions: Nullable<Float32Array>;
    /** The compound's shared render-target atlas a streaming engine decodes into, or null on a non-GPU backend. */
    readonly mrtAtlas: Nullable<MultiRenderTarget>;
    /**
     * The compound's shared higher-order SH render-target atlas (one single-attachment integer MRT per packed-u32
     * SH texture) a streaming engine bakes SH into, or null when SH decode was not requested for this part.
     */
    readonly shMrtAtlas: Nullable<MultiRenderTarget[]>;
    /**
     * The compound's shared rotation/scale render-target atlas (one 3-attachment half-float MRT) a streaming engine
     * decodes rotation/scale into for voxel-IBL shadows, or null when rotation decode was not requested for this part.
     */
    readonly rotMrtAtlas: Nullable<MultiRenderTarget>;
    /** Width (in texels) of the atlas, used to address decode/readback over the wide layout. */
    readonly atlasWidth: number;
    /** Whether the compound's shared depth sort is settled (a streaming engine polls this to detect readiness). */
    readonly isDepthSortSettled: boolean;
    /**
     * Restricts which of this part's splats are sorted/rendered, in LOCAL coordinates. `null` renders the
     * whole reserved region. The compound merges this with every other part's ranges into the single sort.
     * @param localRanges active local ranges, or `null` for the full region
     */
    setActiveRanges(localRanges: Nullable<readonly IGaussianSplattingSplatRange[]>): void;
    /**
     * CPU-decodes raw `.splat` bytes into the region at `localOffset`, uploading only those texels and
     * patching the sort worker. Grows the part's bounding info to include the written centers. This is the
     * CPU population path (used to seed the region or as a fallback when GPU decode is unavailable).
     * @param localOffset first local splat index to write
     * @param count number of splats to write
     * @param splatsData raw `.splat` bytes for `count` splats (stride 32)
     */
    writeSplats(localOffset: number, count: number, splatsData: ArrayBuffer | ArrayBufferView): void;
    /**
     * Patches only `[localOffset, localOffset+count)` of the worker's position buffer (for the GPU path,
     * where texel data is written directly to the atlas and only the CPU centers are pushed to the worker).
     * @param localOffset first local splat index
     * @param count number of splats
     */
    postPositionsRange(localOffset: number, count: number): void;
    /**
     * Grows the part's (and compound's) bounding info to include the given local-space centers extent.
     * @param min minimum corner
     * @param max maximum corner
     */
    expandBounds(min: Vector3, max: Vector3): void;
    /**
     * Re-posts the full merged position + part-index set to the compound's sort worker. Only needed after a
     * relayout moved the region's data wholesale; per-decode updates use {@link postPositionsRange} instead.
     */
    notifyDataChanged(): void;
    /**
     * Subscribes to the "about to recreate the shared atlas to grow it" event (e.g. another part is being added).
     * The callback receives the OLD atlas and should back up this region's GPU-only data before it is disposed.
     * @param callback invoked with the old atlas MRT
     * @returns an unsubscribe function (call it on dispose)
     */
    onBeforeAtlasRebuild(callback: (oldAtlas: MultiRenderTarget) => void): () => void;
    /**
     * Subscribes to the "shared atlas has been recreated" event. The callback receives the NEW atlas and should
     * rebind to it and restore this region's backed-up data.
     * @param callback invoked with the new atlas MRT
     * @returns an unsubscribe function (call it on dispose)
     */
    onAfterAtlasRebuild(callback: (newAtlas: MultiRenderTarget) => void): () => void;
}
/**
 * Class used to render a Gaussian Splatting mesh. Supports both single-cloud and compound
 * (multi-part) rendering. In compound mode, multiple Gaussian Splatting source meshes are
 * merged into one draw call while retaining per-part world-matrix control via
 * addPart/addParts and removePart.
 */
export declare class GaussianSplattingMesh extends GaussianSplattingMeshBase {
    /**
     * Proxy meshes indexed by part index. Maintained in sync with _partMatrices.
     */
    private _partProxies;
    /** Part 0 local-space AABB when owned directly (not proxied). Set on first addPart, cleared on dispose/reset. */
    private _part0LocalMin;
    private _part0LocalMax;
    /**
     * World matrices for each part, indexed by part index.
     */
    protected _partMatrices: Matrix[];
    /** When true, suppresses the sort trigger inside setWorldMatrixForPart during batch rebuilds. */
    private _rebuilding;
    /**
     * Visibility values for each part (0.0 to 1.0), indexed by part index.
     */
    protected _partVisibility: number[];
    /**
     * Per-part active source-splat range overrides, indexed by part index, in GLOBAL source-splat
     * coordinates (offsets into the merged atlas). A part with no entry (undefined) renders its full
     * range; a part with an entry renders only those ranges. Used by streaming parts to render just
     * their currently-active LOD splats while static parts render fully. No overrides at all means no
     * filter (the base renders every splat, preserving the non-streaming fast path).
     */
    private _partSplatRanges;
    /**
     * True once a streaming part has been reserved. A streamed region's data lives only on the GPU (no retained CPU
     * source), so atlas rebuilds and part add/remove take the streaming-aware paths that back up and restore each
     * region rather than regenerating it from a CPU source.
     * @internal
     */
    protected _hasStreamingPart: boolean;
    /** Mutable bookkeeping for each reserved streaming region, so {@link compactAtlas} can relocate them. */
    private _streamingStates;
    /**
     * Shared LOD splat budget for the whole compound (0 = disabled). When set, {@link _apportionBudget} divides it
     * (net of static parts) across the registered {@link IGaussianSplattingLodBudgetParticipant}s each frame, so
     * all hosted streams together stay within one cap. See {@link splatBudget}.
     * Protected so {@link GaussianSplattingStream} can reuse it as its own per-stream budget.
     */
    protected _splatBudget: number;
    /** LOD engines sharing {@link _splatBudget} (e.g. hosted streamed parts). */
    private _lodBudgetParticipants;
    /** Per-frame budget apportionment observer, installed only while a budget and participants are both present. */
    private _budgetObserver;
    private readonly _budgetDemands;
    private readonly _budgetAlloc;
    private readonly _budgetSettled;
    /**
     * Max SH degree contributed by the live (non-tombstoned) streaming parts. Recomputed by
     * {@link _refreshStreamingShState} whenever parts change, so removing the last SH stream turns the shared SH
     * atlas off instead of leaving SH_DEGREE high over texels nothing refills.
     */
    private _streamingShDegree;
    /** Part indices tombstoned by {@link removePart} while streaming — excluded from render, reclaimed by {@link compactAtlas}. */
    private _tombstonedPartIndices;
    private _partIndicesTexture;
    private _partIndices;
    /** Gets the part indices texture used for compound rendering */
    get partIndicesTexture(): Nullable<BaseTexture>;
    /**
     * Creates a new GaussianSplattingMesh
     * @param name the name of the mesh
     * @param url optional URL to load a Gaussian Splatting file from
     * @param scene the hosting scene
     * @param keepInRam whether to keep the raw splat data in RAM after uploading to GPU
     * @param needsRotationScaleTextures generate rotation and scale matrix textures required for voxel-based IBL shadows
     */
    constructor(name: string, url?: Nullable<string>, scene?: Nullable<Scene>, keepInRam?: boolean, needsRotationScaleTextures?: boolean);
    /**
     * Returns the class name
     * @returns "GaussianSplattingMesh"
     */
    getClassName(): string;
    /**
     * Is this node ready to be used/rendered.
     * Force-syncs every part proxy's world matrix into `_partMatrices` BEFORE delegating to
     * the base readiness check. This guarantees that any pending proxy transform changes
     * (for example a user-set `proxy.position`) are reflected in the next sort post, so the
     * base `isReady` will only return true once `sortAppliedId === sortRequestId` for that
     * up-to-date state. Without this, the proxy's `onAfterWorldMatrixUpdateObservable` would
     * fire during the first render and queue a fresh sort AFTER readiness was reported,
     * leaving the rendered frame with stale splat order on `renderCount=1` runs.
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @returns true when ready
     */
    isReady(completeCheck?: boolean): boolean;
    /**
     * Recomputes compound local-space bounds from part 0's stored AABB (if unproxied) plus all
     * proxy world AABBs inverse-transformed to compound-local space. All 8 corners of each proxy
     * AABB are transformed so the result is correct under non-identity compound rotation/scale.
     */
    private _updateBoundingInfoFromProxies;
    /**
     * Override for compound meshes: recomputes bounds from proxy world extents instead of
     * local bounds × world matrix, which is wrong for proxied parts with independent transforms.
     * @returns this mesh
     */
    _updateBoundingInfo(): AbstractMesh;
    /**
     * Replaces the base hierarchy bounds computation for compound meshes: computes world bounds
     * from scratch by iterating part 0's local AABB and all proxy meshes, rather than delegating
     * to the base _children traversal which never reaches proxies (they are not parented to the
     * compound). Visibility per-part is respected; invisible parts are excluded.
     * @param includeDescendants when true, includes descendants (default: true)
     * @param predicate optional filter predicate
     * @returns world-space min/max of the hierarchy bounding box
     */
    getHierarchyBoundingVectors(includeDescendants?: boolean, predicate?: Nullable<(abstractMesh: AbstractMesh) => boolean>): {
        min: Vector3;
        max: Vector3;
    };
    /**
     * Disposes proxy meshes and clears part data in addition to the base class GPU resources.
     * @param doNotRecurse Set to true to not recurse into each children
     */
    dispose(doNotRecurse?: boolean): void;
    /**
     * Posts the initial per-part data to the sort worker after it has been created.
     * Sends the current part matrices and group index array so the worker can correctly
     * weight depth values per part.
     * @param worker the newly created sort worker
     */
    protected _onWorkerCreated(worker: Worker): void;
    /**
     * Stores the raw part index array, padded to texture length, so the worker and GPU texture
     * creation step have access to it.
     * @param partIndices - the raw part indices array received during a data load
     * @param textureLength - the padded texture length to allocate into
     */
    protected _onIndexDataReceived(partIndices: Uint8Array, textureLength: number): void;
    /**
     * Returns `true` when at least one part has been added to this compound mesh.
     * Returns `false` before any parts are added, so the mesh renders in normal
     * (non-compound) mode until the first addPart/addParts call. This matches the
     * old base-class behavior of `this._partMatrices.length > 0` and avoids
     * binding unset partWorld uniforms (which would cause division-by-zero in the
     * Gaussian projection Jacobian and produce huge distorted splats).
     * @internal
     */
    get isCompound(): boolean;
    /**
     * During a removePart rebuild, keep the existing sort worker alive rather than
     * tearing it down and spinning up a new one. This avoids startup latency and the
     * transient state window where a stale sort could fire against an incomplete
     * partMatrices array.
     * Outside of a rebuild the base-class behaviour is used unchanged.
     */
    protected _instantiateWorker(): void;
    /**
     * Ensures the part-index GPU texture exists at the start of an incremental update.
     * Called before the sub-texture upload so the correct texture is available for the first batch.
     * @param textureSize - current texture dimensions
     */
    protected _onIncrementalUpdateStart(textureSize: Vector2): void;
    /**
     * Posts positions (via super) and then additionally posts the current part-index array
     * to the sort worker so it can associate each splat with its part.
     */
    protected _notifyWorkerNewData(): void;
    /**
     * Binds all compound-specific shader uniforms: the group index texture, per-part world
     * matrices, and per-part visibility values.
     * @param effect the shader effect that is being bound
     * @internal
     */
    bindExtraEffectUniforms(effect: Effect): void;
    /**
     * Gets the number of parts in the compound.
     */
    get partCount(): number;
    /**
     * Shared LOD splat budget for the whole compound: a cap on the total splats its budget-participating LOD
     * engines (hosted streamed parts) render together, net of static parts. `0`/undefined disables it (each stream
     * uses its own budget, or none). Setting it apportions the cap across all registered participants by demand and
     * takes effect on the next frame. See {@link IGaussianSplattingLodBudgetParticipant}.
     * @experimental
     */
    get splatBudget(): number;
    set splatBudget(value: number);
    /**
     * Registers a LOD engine to share this compound's {@link splatBudget}. The compound apportions the budget
     * across all registered participants each frame. No-op if already registered.
     * @param participant the LOD engine (e.g. a hosted streamed part)
     * @experimental
     */
    registerLodBudgetParticipant(participant: IGaussianSplattingLodBudgetParticipant): void;
    /**
     * Removes a previously registered budget participant and releases its coordinated allocation (it reverts to its
     * own budget).
     * @param participant the LOD engine to remove
     * @experimental
     */
    unregisterLodBudgetParticipant(participant: IGaussianSplattingLodBudgetParticipant): void;
    /**
     * Total splats contributed by static (non-streaming) parts — the fixed floor subtracted from the budget before
     * the streamable remainder is apportioned. Streaming regions are excluded (their rendered count is LOD-driven).
     * @returns the static parts' splat count
     */
    private _staticSplatCount;
    /**
     * Installs or removes the per-frame apportionment observer so it runs only while a budget and at least one
     * participant are both present. When coordination turns off, participants are released to their own budgets.
     */
    private _updateBudgetCoordination;
    /**
     * Apportions {@link splatBudget} (net of {@link _staticSplatCount}) across the registered participants by demand
     * via water-filling: each gets `min(demand, fairShare)` and any leftover is redistributed to the still-unmet
     * ones. Pushes each participant its allocation.
     */
    private _apportionBudget;
    /**
     * Gets the part visibility array.
     */
    get partVisibility(): number[];
    /**
     * Sets the world matrix for a specific part of the compound.
     * This will trigger a re-sort of the mesh.
     * The `_partMatrices` array is automatically extended when `partIndex >= partCount`.
     * @param partIndex index of the part
     * @param worldMatrix the world matrix to set
     */
    setWorldMatrixForPart(partIndex: number, worldMatrix: Matrix): void;
    /**
     * Gets the world matrix for a specific part of the compound.
     * @param partIndex index of the part, that must be between 0 and partCount - 1
     * @returns the world matrix for the part, or the current world matrix of the mesh if the part is not found
     */
    getWorldMatrixForPart(partIndex: number): Matrix;
    /**
     * Gets the visibility for a specific part of the compound.
     * @param partIndex index of the part, that must be between 0 and partCount - 1
     * @returns the visibility value (0.0 to 1.0) for the part
     */
    getPartVisibility(partIndex: number): number;
    /**
     * Sets the visibility for a specific part of the compound.
     * @param partIndex index of the part, that must be between 0 and partCount - 1
     * @param value the visibility value (0.0 to 1.0) to set
     */
    setPartVisibility(partIndex: number, value: number): void;
    /**
     * Restricts which source splats of a single part are sorted and rendered, in GLOBAL source-splat
     * coordinates (offsets into the merged atlas). Static parts render fully by default; a streaming
     * part uses this to render only its currently-active LOD splats. The compound recomputes the union
     * of every part's active ranges and drives the single shared depth sort / draw with it, so all
     * parts still sort together in one pass.
     *
     * Passing `null` clears the override for that part (it reverts to rendering its full range). When no
     * part has an override, the compound clears the range filter entirely (renders every splat), which
     * preserves the non-streaming fast path.
     * @param partIndex index of the part to constrain
     * @param ranges active global source-splat ranges for the part, or `null` to render the whole part
     */
    setPartSplatRanges(partIndex: number, ranges: Nullable<readonly IGaussianSplattingSplatRange[]>): void;
    /**
     * Recomputes the global active-range union across all parts and pushes it to the shared sort/draw
     * via the base {@link setSplatIndexRanges}. When no part carries an override the filter is cleared
     * (render everything). A part without an override contributes its full `[offset, count)` derived
     * from its proxy; a part with an override contributes exactly those ranges.
     */
    private _refreshPartRangeUnion;
    /**
     * Sorts and merges adjacent/overlapping source-splat ranges so the interval list handed to the sort
     * worker stays compact (parts occupy disjoint regions, so this mainly coalesces contiguous parts).
     * @param ranges raw ranges
     * @returns coalesced ranges sorted by offset
     */
    private static _CoalesceSplatRanges;
    protected _copyTextures(source: GaussianSplattingMeshBase): void;
    protected _onUpdateTextures(textureSize: Vector2): void;
    protected _updateSubTextures(splatPositions: Float32Array, covA: Uint16Array, covB: Uint16Array, colorArray: Uint8Array, lineStart: number, lineCount: number, sh?: Uint8Array[], partIndices?: Uint8Array): void;
    /**
     * Creates the part indices GPU texture the first time an incremental addPart introduces
     * compound data. Has no effect if the texture already exists or no partIndices are provided.
     * @param textureSize - Current texture dimensions
     * @param partIndices - Part index data; if undefined the method is a no-op
     */
    protected _ensurePartIndicesTexture(textureSize: Vector2, partIndices: Uint8Array | undefined): void;
    private _appendPartSourceToArrays;
    private _createRetainedPartSource;
    private _retainMergedPartData;
    /**
     * Core implementation for adding one or more source parts as new
     * parts. Writes directly into texture-sized CPU arrays, updates the retained merged source
     * buffers, and uploads in one pass.
     *
     * @param others - Source meshes to append (must each be non-compound and fully loaded)
     * @param disposeOthers - Dispose source meshes after appending
     * @returns Proxy meshes and their assigned part indices
     */
    protected _addPartsInternal(others: IGaussianSplattingPartSource[], disposeOthers: boolean): {
        proxyMeshes: GaussianSplattingPartProxyMesh[];
        assignedPartIndices: number[];
    };
    /**
     * Add another mesh to this mesh, as a new part. This makes the current mesh a compound, if not already.
     * The source mesh's splat data is read directly and copied into the compound's retained source buffers.
     * @param other - The other mesh to add. Must be fully loaded before calling this method.
     * @param disposeOther - Whether to dispose the other mesh after adding it to the current mesh.
     * @returns a placeholder mesh that can be used to manipulate the part transform
     * @deprecated Use {@link GaussianSplattingCompoundMesh.addPart} instead.
     */
    addPart(other: GaussianSplattingMesh, disposeOther?: boolean): GaussianSplattingPartProxyMesh;
    /**
     * Recomputes the shared SH-atlas state ({@link _useShMrtAtlas}, {@link _shMrtAtlasTextureCount},
     * {@link _streamingShDegree}) from the currently-live (non-tombstoned) streaming parts. Call before an atlas
     * rebuild that follows a removal so a stale SH degree/count from a removed part can't keep the SH atlas active
     * (and SH_DEGREE high) with nothing refilling the SH texels.
     */
    private _refreshStreamingShState;
    /**
     * Tombstones a part of a streaming compound: excludes it from the render union permanently and hides its
     * proxy, leaving its atlas rows idle. Used instead of the compacting {@link removePart} rebuild whenever a
     * streaming part is reserved — a streamed region has no retained CPU source and decodes at a FIXED base
     * offset, so the rebuild can neither reconstruct it nor shift any part without desynchronizing the streaming
     * engine. Every other part keeps its exact offset (no shift), so resident streams keep decoding at their base.
     * The empty `[]` override survives future add-driven rebuilds, so the region stays invisible even though its
     * texels get rebuilt; memory is only reclaimed by disposing/recreating the whole compound.
     * @param index the part index to tombstone
     */
    private _tombstonePart;
    /**
     * Tears the compound down to an empty state so a subsequent {@link _addPartsInternal} recreates fresh GPU
     * textures. Shared by {@link removePart} (compacting rebuild) and {@link compactAtlas}. Does NOT dispose the
     * part proxies — callers dispose only the proxies being removed and reuse the survivors' proxy objects.
     * @internal
     */
    protected _resetForRebuild(): void;
    /**
     * Reclaims the atlas rows of parts removed (tombstoned) while a streaming part was resident. `removePart`
     * on a streaming compound only tombstones — it excludes the part from the render union and hides its proxy,
     * but leaves its rows allocated, since compacting them would relocate the still-resident streaming regions.
     * This method performs that compaction: it rebuilds the shared atlas from the LIVE parts at new, contiguous
     * (row-aligned for streaming) offsets, physically relocating each surviving streaming region's GPU texels,
     * CPU sort positions, and decode/render base offset, and drops the tombstoned rows — shrinking the atlas.
     *
     * Call it after removing one or more models to actually free the GPU/CPU memory (e.g. on idle, or once a
     * batch of removals settles). No-op when nothing is tombstoned. Safe while streams are actively decoding:
     * each surviving region is backed up before the old atlas is disposed and restored at its new base after.
     */
    compactAtlas(): void;
    /**
     * Remove a part from this compound mesh.
     * The remaining parts are rebuilt directly from the compound mesh's retained source buffers.
     * The current mesh is reset to a plain (single-part) state and then each remaining source is
     * re-added via addParts.
     * When a streaming part is reserved the part is tombstoned instead of compacted (see {@link _tombstonePart}).
     * @param index - The index of the part to remove
     * @deprecated Use {@link GaussianSplattingCompoundMesh.removePart} instead.
     */
    removePart(index: number): void;
    /**
     * Reserves a contiguous region of `capacity` splats in the compound as a new part for dynamic (streamed)
     * content. Unlike {@link addPart}, no source data is copied: the region is created as invisible padding
     * (zeroed) for a streaming engine to populate over time via the returned handle. The reserved part
     * participates in the compound's single shared depth sort and draw exactly like a static part — it has a
     * `partIndex`, a per-part world matrix (via its proxy), and a per-part visibility — so streamed splats are
     * sorted and rendered together in one pass with the static parts.
     *
     * Add the streaming part LAST (after all static parts). The returned handle drives which of the region's
     * splats render (LOD) and writes their data.
     * @param capacity number of splats to reserve
     * @param worldMatrix initial world matrix for the region's proxy (e.g. carrying a source's up-axis
     *   convention); defaults to identity
     * @param name name for the region's proxy mesh
     * @param shTextureCount number of packed-u32 higher-order SH textures to allocate as a shared render-target SH
     *   atlas the streaming engine bakes into (`ceil(coeffs*3/16)` for the stream's max SH degree); 0 = no SH
     * @param shDegree SH degree of the streamed content (drives the compound's `SH_DEGREE`); ignored when
     *   `shTextureCount` is 0. The compound keeps the MAX SH degree across its parts.
     * @param needsRotationScale when true, converts the compound's rotation/scale textures to a shared render-target
     *   half-float atlas the streaming engine decodes into, so the streamed splats participate in voxel-IBL shadows.
     * @returns a handle used to populate and control the reserved region
     */
    reserveStreamingPart(capacity: number, worldMatrix?: Matrix, name?: string, shTextureCount?: number, shDegree?: number, needsRotationScale?: boolean): IGaussianSplattingStreamingPart;
    /**
     * Serialize current GaussianSplattingMesh
     * @param serializationObject defines the object which will receive the serialization data
     * @param encoding the encoding of binary data, defaults to base64 for json serialize,
     * kept for future internal use like cloning where base64 encoding wastes cycles and memory
     * @returns the serialized object
     */
    serialize(serializationObject?: any, encoding?: string): any;
    /**
     * Internal helper to parses a serialized GaussianSplattingMesh or GaussianSplattingCompoundMesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the GaussianSplattingMesh or GaussianSplattingCompoundMesh in
     * @param ctor the constructor of the mesh to create
     * @returns the created GaussianSplattingMesh
     * @internal
     */
    static _ParseInternal<T extends GaussianSplattingMesh>(parsedMesh: any, scene: Scene, ctor: new (name: string, url: Nullable<string>, scene: Nullable<Scene>, keepInRam: boolean) => T): T;
    /**
     * Parses a serialized GaussianSplattingMesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the GaussianSplattingMesh in
     * @returns the created GaussianSplattingMesh
     */
    static Parse(parsedMesh: any, scene: Scene): GaussianSplattingMesh;
}
/**
 * True when `className` (from `AbstractMesh.getClassName()`) identifies a Gaussian Splatting mesh whose
 * `position.z` vertex attribute encodes a splat index rather than world-space Z: `"GaussianSplattingMesh"`
 * (also returned by {@link GaussianSplattingCompoundMesh}, which deliberately does not override
 * `getClassName()`) and `"GaussianSplattingStream"` (which does override it, to remain distinguishable for
 * other purposes). Rendering-pipeline code that must treat any Gaussian Splatting mesh differently from an
 * ordinary mesh (geometry buffer, depth pre-pass, GPU picking, IBL voxelization, snapshot rendering, ...)
 * should use this instead of a literal string comparison, so a future splat mesh subclass only needs to be
 * added here once.
 * @param className the mesh class name to test, e.g. from `AbstractMesh.getClassName()`
 * @returns true if the class name identifies a Gaussian Splatting mesh
 */
export declare function IsGaussianSplattingClassName(className: string): boolean;
/**
 * Register side effects for gaussianSplattingMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingMesh(): void;
export {};

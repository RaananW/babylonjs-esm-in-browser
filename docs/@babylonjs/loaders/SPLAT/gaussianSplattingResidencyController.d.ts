import { type Nullable } from "@babylonjs/core/types.js";
/**
 * One resident block relocation produced by {@link GaussianSplattingResidencyController.compact}: the file's
 * splat data must be moved from `oldOffset` to `newOffset` (`count` splats) in the work buffer.
 */
export interface IResidencyMove {
    /** File index whose splat data must move. */
    file: number;
    /** The file's previous splat offset in the work buffer. */
    oldOffset: number;
    /** The file's new splat offset after compaction. */
    newOffset: number;
    /** Number of splats in the file. */
    count: number;
}
/**
 * Tracks which streamed Gaussian Splatting files are resident in the GPU work buffer and where, evicting
 * unreferenced files after a cooldown to keep the resident set within a fixed budget.
 *
 * Built on {@link GaussianSplattingBlockAllocator}: each resident file owns a contiguous block of the work
 * buffer's splat-index address space. A file with no remaining references is scheduled for eviction; after
 * `cooldownFrames` ticks (or sooner, if the space is needed by a new allocation — "evict-to-fit") its block
 * is freed and reused. Pinned files (e.g. the always-rendered environment and the padding splat) are never
 * evicted. The {@link onEvict} callback fires for every file the controller evicts so the owner can drop its
 * own bookkeeping (e.g. mark it no longer decoded).
 *
 * This controller owns only memory/residency bookkeeping — it has no knowledge of the scene, GPU, downloads,
 * or reference counting (the caller decides when a file's reference count reaches zero and calls
 * {@link scheduleEviction}).
 * @experimental
 */
export declare class GaussianSplattingResidencyController {
    private readonly _allocator;
    private readonly _blocks;
    private readonly _cooldown;
    private readonly _pinned;
    private readonly _cooldownFrames;
    private readonly _onEvict;
    /**
     * Creates a residency controller.
     * @param capacity total splat-index capacity of the work buffer
     * @param cooldownFrames number of ticks an unreferenced file stays resident before being evicted
     * @param onEvict called with the file index whenever the controller evicts a file (via tick or evict-to-fit)
     */
    constructor(capacity: number, cooldownFrames: number, onEvict: (file: number) => void);
    /**
     * Total splat-index capacity.
     */
    get capacity(): number;
    /**
     * Number of files currently resident.
     */
    get residentCount(): number;
    /**
     * Total free splat capacity (sum of all gaps, which may be fragmented). After {@link compact} an
     * allocation of up to this size is guaranteed to fit.
     */
    get freeSize(): number;
    /**
     * Whether the given file currently has a block in the work buffer.
     * @param file file index
     * @returns true if resident
     */
    has(file: number): boolean;
    /**
     * The work-buffer splat offset of a resident file, or undefined if not resident.
     * @param file file index
     * @returns the splat offset, or undefined
     */
    offset(file: number): number | undefined;
    /**
     * Allocates a contiguous block for a file about to be decoded. If there is no room, evicts files whose
     * eviction cooldown is pending (they are unreferenced) and retries once. Returns the splat offset, or null
     * if it still does not fit (the caller should refuse the decode and keep the node's current LOD).
     * @param file file index
     * @param count number of splats the file needs
     * @returns the allocated splat offset, or null if it cannot fit
     */
    allocate(file: number, count: number): Nullable<number>;
    /**
     * Allocates a block for a file that must never be evicted (e.g. the environment or padding splat).
     * @param file file index (use a sentinel that cannot collide with real file indices)
     * @param count number of splats
     * @returns the allocated splat offset, or null if it cannot fit
     */
    pin(file: number, count: number): Nullable<number>;
    /**
     * Frees a file's block immediately (e.g. when a decode was cancelled before completing). Does not fire
     * {@link onEvict}. No-op for pinned or non-resident files.
     * @param file file index
     */
    free(file: number): void;
    /**
     * Compacts the resident blocks to defragment free space (capacity is unchanged), returning every block
     * that moved so the caller can relocate the corresponding GPU/CPU splat data. Call when an allocation
     * fails despite sufficient total free space ({@link freeSize}); afterwards that allocation will fit.
     * @returns the relocations to apply (empty when nothing moved)
     */
    compact(): IResidencyMove[];
    /**
     * Returns the current resident blocks (file index, splat offset, splat count). Used to relocate GPU/CPU
     * data after {@link compact}.
     * @returns one entry per resident file
     */
    getResidentBlocks(): Array<{
        file: number;
        offset: number;
        count: number;
    }>;
    /**
     * Schedules an unreferenced resident file for eviction after the cooldown. No-op for pinned or
     * non-resident files.
     * @param file file index
     */
    scheduleEviction(file: number): void;
    /**
     * Cancels a pending eviction because the file was referenced again.
     * @param file file index
     */
    cancelEviction(file: number): void;
    /**
     * Advances all eviction cooldowns by one frame, evicting any that expire. Each evicted file fires
     * {@link onEvict}.
     * @returns the file indices evicted this tick
     */
    tick(): number[];
    /**
     * Releases all bookkeeping. The allocator and maps are cleared.
     */
    dispose(): void;
    private _evictAllCooled;
    private _evict;
}

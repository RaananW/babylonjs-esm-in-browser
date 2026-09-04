import { GaussianSplattingBlockAllocator } from "./gaussianSplattingBlockAllocator.js";
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
export class GaussianSplattingResidencyController {
    /**
     * Creates a residency controller.
     * @param capacity total splat-index capacity of the work buffer
     * @param cooldownFrames number of ticks an unreferenced file stays resident before being evicted
     * @param onEvict called with the file index whenever the controller evicts a file (via tick or evict-to-fit)
     */
    constructor(capacity, cooldownFrames, onEvict) {
        this._blocks = new Map();
        // file -> frames remaining before eviction (only present for unreferenced, evictable files).
        this._cooldown = new Map();
        this._pinned = new Set();
        this._allocator = new GaussianSplattingBlockAllocator(capacity);
        this._cooldownFrames = Math.max(0, cooldownFrames);
        this._onEvict = onEvict;
    }
    /**
     * Total splat-index capacity.
     */
    get capacity() {
        return this._allocator.capacity;
    }
    /**
     * Number of files currently resident.
     */
    get residentCount() {
        return this._blocks.size;
    }
    /**
     * Total free splat capacity (sum of all gaps, which may be fragmented). After {@link compact} an
     * allocation of up to this size is guaranteed to fit.
     */
    get freeSize() {
        return this._allocator.freeSize;
    }
    /**
     * Whether the given file currently has a block in the work buffer.
     * @param file file index
     * @returns true if resident
     */
    has(file) {
        return this._blocks.has(file);
    }
    /**
     * The work-buffer splat offset of a resident file, or undefined if not resident.
     * @param file file index
     * @returns the splat offset, or undefined
     */
    offset(file) {
        return this._blocks.get(file)?.offset;
    }
    /**
     * Allocates a contiguous block for a file about to be decoded. If there is no room, evicts files whose
     * eviction cooldown is pending (they are unreferenced) and retries once. Returns the splat offset, or null
     * if it still does not fit (the caller should refuse the decode and keep the node's current LOD).
     * @param file file index
     * @param count number of splats the file needs
     * @returns the allocated splat offset, or null if it cannot fit
     */
    allocate(file, count) {
        const existing = this._blocks.get(file);
        if (existing) {
            return existing.offset;
        }
        let block = this._allocator.allocate(count);
        if (!block) {
            // Evict-to-fit: reclaim every unreferenced (cooldown-scheduled) file, then retry once.
            this._evictAllCooled();
            block = this._allocator.allocate(count);
            if (!block) {
                return null;
            }
        }
        this._blocks.set(file, block);
        return block.offset;
    }
    /**
     * Allocates a block for a file that must never be evicted (e.g. the environment or padding splat).
     * @param file file index (use a sentinel that cannot collide with real file indices)
     * @param count number of splats
     * @returns the allocated splat offset, or null if it cannot fit
     */
    pin(file, count) {
        const offset = this.allocate(file, count);
        if (offset !== null) {
            this._pinned.add(file);
        }
        return offset;
    }
    /**
     * Frees a file's block immediately (e.g. when a decode was cancelled before completing). Does not fire
     * {@link onEvict}. No-op for pinned or non-resident files.
     * @param file file index
     */
    free(file) {
        if (this._pinned.has(file)) {
            return;
        }
        const block = this._blocks.get(file);
        if (!block) {
            return;
        }
        this._allocator.free(block);
        this._blocks.delete(file);
        this._cooldown.delete(file);
    }
    /**
     * Compacts the resident blocks to defragment free space (capacity is unchanged), returning every block
     * that moved so the caller can relocate the corresponding GPU/CPU splat data. Call when an allocation
     * fails despite sufficient total free space ({@link freeSize}); afterwards that allocation will fit.
     * @returns the relocations to apply (empty when nothing moved)
     */
    compact() {
        const before = new Map();
        for (const [file, block] of Array.from(this._blocks)) {
            before.set(file, block.offset);
        }
        this._allocator.defrag(0);
        const moves = [];
        for (const [file, block] of Array.from(this._blocks)) {
            const oldOffset = before.get(file);
            if (oldOffset !== block.offset) {
                moves.push({ file, oldOffset, newOffset: block.offset, count: block.size });
            }
        }
        return moves;
    }
    /**
     * Returns the current resident blocks (file index, splat offset, splat count). Used to relocate GPU/CPU
     * data after {@link compact}.
     * @returns one entry per resident file
     */
    getResidentBlocks() {
        const result = [];
        for (const [file, block] of Array.from(this._blocks)) {
            result.push({ file, offset: block.offset, count: block.size });
        }
        return result;
    }
    /**
     * Schedules an unreferenced resident file for eviction after the cooldown. No-op for pinned or
     * non-resident files.
     * @param file file index
     */
    scheduleEviction(file) {
        if (this._pinned.has(file) || !this._blocks.has(file)) {
            return;
        }
        this._cooldown.set(file, this._cooldownFrames);
    }
    /**
     * Cancels a pending eviction because the file was referenced again.
     * @param file file index
     */
    cancelEviction(file) {
        this._cooldown.delete(file);
    }
    /**
     * Advances all eviction cooldowns by one frame, evicting any that expire. Each evicted file fires
     * {@link onEvict}.
     * @returns the file indices evicted this tick
     */
    tick() {
        if (this._cooldown.size === 0) {
            return [];
        }
        const evicted = [];
        for (const [file, frames] of Array.from(this._cooldown)) {
            if (frames <= 1) {
                evicted.push(file);
            }
            else {
                this._cooldown.set(file, frames - 1);
            }
        }
        for (const file of evicted) {
            this._evict(file);
        }
        return evicted;
    }
    /**
     * Releases all bookkeeping. The allocator and maps are cleared.
     */
    dispose() {
        this._blocks.clear();
        this._cooldown.clear();
        this._pinned.clear();
    }
    _evictAllCooled() {
        const files = Array.from(this._cooldown.keys());
        for (const file of files) {
            this._evict(file);
        }
    }
    _evict(file) {
        const block = this._blocks.get(file);
        if (block) {
            this._allocator.free(block);
            this._blocks.delete(file);
        }
        this._cooldown.delete(file);
        this._onEvict(file);
    }
}
//# sourceMappingURL=gaussianSplattingResidencyController.js.map
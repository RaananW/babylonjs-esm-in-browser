import { type Nullable } from "@babylonjs/core/types.js";
/**
 * A node in the {@link GaussianSplattingBlockAllocator}'s linked list, representing either an allocated
 * block or a free region. Callers receive {@link GaussianSplattingMemBlock} instances as handles from
 * {@link GaussianSplattingBlockAllocator.allocate} and must treat their {@link offset}/{@link size} as
 * read-only.
 *
 * Ported from the PlayCanvas engine (`src/core/block-allocator.js`).
 * @experimental
 */
export declare class GaussianSplattingMemBlock {
    /** @internal Position in the address space. */
    _offset: number;
    /** @internal Size of this block. */
    _size: number;
    /** @internal True if this is a free region, false if allocated. */
    _free: boolean;
    /** @internal Previous node in the main (all-nodes, offset-ordered) list. */
    _prev: Nullable<GaussianSplattingMemBlock>;
    /** @internal Next node in the main (all-nodes, offset-ordered) list. */
    _next: Nullable<GaussianSplattingMemBlock>;
    /** @internal Previous node in the bucket free-list. */
    _prevFree: Nullable<GaussianSplattingMemBlock>;
    /** @internal Next node in the bucket free-list. */
    _nextFree: Nullable<GaussianSplattingMemBlock>;
    /** @internal Index of the size bucket this free block belongs to, or -1 if not in any bucket. */
    _bucket: number;
    /**
     * The offset of this block in the address space.
     */
    get offset(): number;
    /**
     * The size of this block.
     */
    get size(): number;
}
/**
 * A general-purpose 1D block allocator backed by a doubly-linked list with segregated free-list buckets.
 * Manages a linear address space where contiguous blocks can be allocated and freed.
 *
 * Free blocks are organized into power-of-2 size buckets for best-fit allocation, which reduces
 * fragmentation compared to a single first-fit free list. Supports incremental defragmentation and
 * automatic growth. Used to place streamed Gaussian Splatting LOD files into the unified GPU work buffer.
 *
 * Ported from the PlayCanvas engine (`src/core/block-allocator.js`).
 * @experimental
 */
export declare class GaussianSplattingBlockAllocator {
    private _headAll;
    private _tailAll;
    private readonly _freeBucketHeads;
    private readonly _pool;
    private _capacity;
    private _usedSize;
    private _freeSize;
    private _freeRegionCount;
    private readonly _growMultiplier;
    /**
     * Creates a new block allocator.
     * @param capacity initial address space capacity (defaults to 0)
     * @param growMultiplier multiplicative growth factor for auto-grow in {@link updateAllocation} (defaults to 1.1)
     */
    constructor(capacity?: number, growMultiplier?: number);
    /**
     * Total address space capacity.
     */
    get capacity(): number;
    /**
     * Total size of all allocated blocks.
     */
    get usedSize(): number;
    /**
     * Total size of all free regions.
     */
    get freeSize(): number;
    /**
     * Fragmentation ratio in the range [0, 1]. Returns 0 when all free space is one contiguous block
     * (ideal), and approaches 1 when free space is split into many pieces. Computed O(1).
     */
    get fragmentation(): number;
    /**
     * Allocates a contiguous block of the given size.
     * @param size the number of units to allocate (must be \> 0)
     * @returns a block handle, or null if no space is available
     */
    allocate(size: number): Nullable<GaussianSplattingMemBlock>;
    /**
     * Frees a previously allocated block. Adjacent free regions are merged automatically.
     * @param block the block to free (must have been returned by {@link allocate})
     */
    free(block: GaussianSplattingMemBlock): void;
    /**
     * Grows the address space. Only increases capacity, never decreases.
     * @param newCapacity the new capacity (must be \> current capacity)
     */
    grow(newCapacity: number): void;
    /**
     * Defragments the allocator by moving allocated blocks to reduce fragmentation.
     *
     * When maxMoves is 0, performs a full compaction in a single O(n) pass: all allocated blocks are packed
     * contiguously from offset 0 and a single free block is placed at the end. When maxMoves \> 0, performs
     * incremental defragmentation (relocate the last block into the first fitting gap, then slide blocks left).
     *
     * Moved blocks have their {@link GaussianSplattingMemBlock.offset} updated in place (handles stay valid),
     * so callers must relocate the corresponding GPU data for every block in the returned set.
     * @param maxMoves maximum number of block moves (0 = full compaction, the default)
     * @param result optional set to receive the moved blocks (defaults to a new set)
     * @returns the set of blocks that were moved
     */
    defrag(maxMoves?: number, result?: Set<GaussianSplattingMemBlock>): Set<GaussianSplattingMemBlock>;
    /**
     * Batch update: frees a set of blocks and allocates new ones. Handles growth and compaction internally
     * when allocations cannot be satisfied. The `toAllocate` array is modified in place: each numeric size
     * entry is replaced with the allocated block.
     * @param toFree blocks to release
     * @param toAllocate sizes to allocate; modified in place (numbers are replaced with block handles)
     * @returns true if a full defrag was performed (all existing blocks have new offsets and must be re-rendered)
     */
    updateAllocation(toFree: GaussianSplattingMemBlock[], toAllocate: Array<number | GaussianSplattingMemBlock>): boolean;
    /**
     * Computes the bucket index for a given block size (= floor(log2(size))).
     * @param size block size (must be \> 0)
     * @returns the bucket index
     */
    private _bucketFor;
    private _addToBucket;
    private _removeFromBucket;
    private _rebucket;
    private _obtain;
    private _release;
    private _insertAfterInMainList;
    private _removeFromMainList;
    private _findFreeBlock;
    private _defragFull;
    private _defragIncremental;
    private _moveBlock;
}

import { MultiRenderTarget } from "@babylonjs/core/Materials/Textures/multiRenderTarget.js";
import { type Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { type Scene } from "@babylonjs/core/scene.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { type ISogTexturePack } from "./splatDefs.js";
/**
 * A unified, GPU-decoded Gaussian Splatting work buffer.
 *
 * Holds a square MRT texture set (centers / covA / covB / colors) sized to a fixed splat capacity
 * (`ceil(sqrt(capacity))`). Each streamed SOG file is decoded directly on the GPU
 * (no CPU readback) into its allocated pixel range. The decoded textures are consumed unchanged by the
 * standard (non-SOG) Gaussian Splatting draw path.
 *
 * @experimental
 */
export declare class GaussianSplattingWorkBuffer {
    private readonly _scene;
    private _mrt;
    private readonly _textureSize;
    private readonly _shaderLanguage;
    private readonly _material;
    private readonly _quad;
    private readonly _ownsMrt;
    private _baseOffset;
    private readonly _capacity;
    private _copyMaterial;
    private _relayoutMapData;
    private _relayoutMapTexture;
    private _backupMrt;
    private _disposed;
    private _readFbo;
    private _shMrts;
    private _ownsShMrts;
    private _shMaterial;
    private _shCopyMaterial;
    private _backupShMrts;
    private _rotMrt;
    private _ownsRotMrt;
    private _rotMaterial;
    private _rotCopyMaterial;
    private _backupRotMrt;
    /**
     * True when the engine supports the non-blocking GPU readback used by {@link readCentersRangeAsync}:
     * WebGL2 (PBO + fence) or WebGPU (copyTextureToBuffer + mapAsync). When false (e.g. WebGL1), callers must
     * decode positions on the CPU instead.
     */
    get supportsAsyncCentersReadback(): boolean;
    /**
     * Square edge length (in pixels) of the work-buffer textures.
     */
    get textureSize(): number;
    /**
     * The decoded work-buffer textures: [centers, covA, covB, colors].
     */
    get textures(): Texture[];
    /**
     * The baked higher-order SH textures (packed-u32, one per `ceil(coeffs*3/16)`), consumed by the draw path's
     * `computeSHWeighted`/`decompose` as `shTexture0..N`. Empty when SH decoding is not enabled.
     */
    get shTextures(): Texture[];
    /**
     * The decoded rotation/scale textures ([rotationsA, rotationsB, rotationScale], half-float), consumed by the
     * voxel-IBL path as `rotationsATexture`/`rotationsBTexture`/`rotationScaleTexture`. Empty when rotation decode
     * is not enabled.
     */
    get rotationTextures(): Texture[];
    /**
     * Creates a work buffer sized to hold `capacity` splats.
     *
     * Standalone (default): the work buffer creates and owns a square MRT sized `ceil(sqrt(capacity))`, with
     * decodes addressed from splat 0.
     *
     * Hosted (`externalAtlas` provided): the work buffer decodes/reads back into an externally-owned MRT (a
     * compound mesh's shared atlas) instead of creating its own. Decodes are placed at `externalAtlas.baseOffset`
     * (the reserved region's first splat) and addressed over `externalAtlas.width` (the wide atlas width), so the
     * streamed splats land in the compound's atlas and sort/draw together with the static parts.
     * @param scene hosting scene
     * @param capacity total number of splats the work buffer must address
     * @param externalAtlas optional external atlas to decode into instead of creating an owned square MRT
     * @param sh optional higher-order SH decode configuration. `textureCount = ceil(coeffs*3/16)` for the max SH
     *   degree across the streamed files. Standalone: the work buffer creates that many owned single-attachment
     *   integer render targets. Hosted: `externalMrts` are the compound's shared SH atlas targets (borrowed).
     * @param rotationScale optional rotation/scale decode configuration (for voxel-IBL shadows). When present the
     *   work buffer decodes each splat's rotation matrix + scale into a 3-attachment half-float target. Standalone:
     *   the work buffer creates and owns that target. Hosted: `externalMrt` is the compound's shared rotation atlas.
     */
    constructor(scene: Scene, capacity: number, externalAtlas?: {
        mrt: MultiRenderTarget;
        width: number;
        baseOffset: number;
    }, sh?: {
        textureCount: number;
        externalMrts?: MultiRenderTarget[];
    }, rotationScale?: {
        externalMrt?: MultiRenderTarget;
    });
    /**
     * Rebinds a hosted work buffer to a new atlas MRT (after the compound recreated it on a grow). No-op for a
     * standalone work buffer, which owns its MRT.
     * @param mrt the compound's new shared atlas
     */
    rebindAtlas(mrt: MultiRenderTarget): void;
    /**
     * Rebinds a hosted work buffer to the compound's NEW shared SH atlas (after the compound recreated it on a
     * grow/compaction). No-op when SH isn't in use or the work buffer owns its SH targets (standalone).
     * @param shMrts the compound's new shared SH render targets (one per packed-u32 SH texture)
     */
    rebindShAtlas(shMrts: Nullable<MultiRenderTarget[]>): void;
    /**
     * Rebinds a hosted work buffer to the compound's NEW shared rotation atlas (after the compound recreated it on a
     * grow/compaction). No-op when rotation isn't in use or the work buffer owns its rotation target (standalone).
     * @param rotMrt the compound's new shared rotation atlas
     */
    rebindRotAtlas(rotMrt: Nullable<MultiRenderTarget>): void;
    /**
     * Relocates this hosted region to a new base splat offset in the shared atlas (used when the compound
     * compacts its atlas and this region's rows move). Subsequent decode/render/readback and
     * {@link restoreRegion} all address from the new base. Call between {@link backupRegion} (which read from
     * the old base) and {@link restoreRegion} (which will write to the new base). No-op for a standalone
     * work buffer, which owns its square MRT at base 0.
     * @param baseOffset the region's new first splat index in the atlas
     */
    setBaseOffset(baseOffset: number): void;
    /**
     * True once the backup/restore/relayout copy shaders are compiled, so {@link backupRegion} can preserve the
     * region across an atlas rebuild. Callers that decode into a hosted region should await this before writing
     * data, so a later grow/compaction can never race shader compilation and drop the region.
     */
    get canBackup(): boolean;
    /**
     * Copies this hosted region's four decoded textures out of the shared atlas into an internal backup MRT so
     * they survive the compound recreating the atlas on a grow. Call immediately before the atlas is recreated,
     * then {@link rebindAtlas} + {@link restoreRegion} after.
     */
    backupRegion(): void;
    /**
     * Restores the backed-up region into the (new) atlas, confined by a scissor to the region's rows so no other
     * part is touched. Call {@link rebindAtlas} to the new atlas first. Frees the backup afterwards.
     */
    restoreRegion(): void;
    /**
     * Creates a 4-attachment MRT (centers F32 / covA / covB / colors U8) sized to the work buffer. covA/covB
     * use HALF_FLOAT when the engine can render to it, matching the precision the non-streamed
     * GaussianSplattingMesh path already uses for these same two textures (see
     * `gaussianSplattingMeshBase.pure.ts`'s `createTextureFromDataF16` covA/covB textures); centers stays F32
     * and colors stays U8 in both paths.
     * @param name MRT and attachment base name
     * @param disableClear when true, clearing is suppressed so renders accumulate (the decode buffer); when
     *   false the MRT clears to zero on each render (the temporary relayout buffer, so gaps stay zeroed)
     * @param width texture width (defaults to the work-buffer size; the region row width for a scoped relayout)
     * @param height texture height (defaults to the work-buffer size; the region row count for a scoped relayout)
     * @returns the created MRT
     */
    private _createMrt;
    /**
     * Creates a single-attachment integer render target (RGBA_INTEGER / UNSIGNED_INTEGER) that holds one packed-u32
     * baked-SH texture. One attachment per pass keeps within WebGPU's per-sample color-attachment byte budget and
     * matches the format/type of the draw path's `shTexture0..N` samplers (`_GaussianSplattingBytesPerShTexel`).
     * @param name attachment name
     * @param disableClear when true, clearing is suppressed so SH decodes accumulate across files
     * @param width texture width (defaults to the work-buffer size)
     * @param height texture height (defaults to the work-buffer size)
     * @returns the created single-attachment integer MRT
     */
    private _createShMrt;
    /**
     * Creates a 3-attachment half-float MRT ([rotA, rotB, rotScale]) holding the per-splat rotation matrix + scale
     * consumed by voxel-IBL shadowing. RGBA half-float when the engine can render to it (matching the covariance
     * precision), else full float. 3 attachments = 24 B/sample, within WebGPU's per-sample budget (its own pass).
     * @param name MRT and attachment base name
     * @param disableClear when true, clearing is suppressed so decodes accumulate (the decode buffer)
     * @param width texture width (defaults to the work-buffer size; the region row width for a scoped relayout)
     * @param height texture height (defaults to the work-buffer size; the region row count for a scoped relayout)
     * @returns the created MRT
     */
    private _createRotMrt;
    /**
     * Decodes one SOG file into the work buffer at the given splat offset (accumulating; previously
     * decoded files are preserved). Resolves once the GPU decode has been issued. The caller may
     * dispose the source pack textures after this resolves.
     * @param pack the SOG texture pack (GPU source textures + per-file decode parameters)
     * @param offset first splat index (pixel offset) for this file in the work buffer
     */
    decodeAsync(pack: ISogTexturePack, offset: number): Promise<void>;
    /**
     * Whether the relayout copy shader is compiled and ready. Lazily creates the copy material on first call.
     * Callers should poll this before {@link relayoutSync} (which must only run when ready).
     * @returns true when {@link relayoutSync} can run this frame
     */
    isRelayoutReady(): boolean;
    /**
     * Re-points the relayout/backup copy materials' samplers at the live atlas textures (valid, never freed), so a
     * later {@link isRelayoutReady} check isn't tripped by a stale binding to a disposed temp/backup MRT.
     */
    private _bindCopyMaterialsToAtlas;
    /**
     * Relayouts the decoded work-buffer textures to a new (defragmented) splat layout, keeping the same
     * texture instances so the consuming mesh does not need to re-bind. `srcIndexByDst[d]` is the source splat
     * index whose decoded data should end up at destination index `d`, or a negative value for a gap (left
     * zeroed). Uses a temporary MRT ping-pong (old -> temp via the map, then temp -> old identity) so
     * overlapping moves stay correct. Must be called at a frame-safe point (inside `onBeforeRender`) and only
     * when {@link isRelayoutReady} returns true.
     * @param srcIndexByDst per-destination source splat index (negative = gap)
     */
    relayoutSync(srcIndexByDst: Float32Array): void;
    /**
     * Renders one relayout copy pass into the target MRT, sampling the given source textures.
     * @param target destination MRT
     * @param sources the four source work-buffer textures
     * @param mapTexture the R32F destination-to-source index map (only sampled when `useMap` is 1; any bound texture otherwise)
     * @param useMap 1 to read source indices from the map (gaps discarded), 0 for an identity copy
     * @param dstWidth destination width used to linearize the destination texel (defaults to the work-buffer size)
     * @param srcWidth source width used to convert a linear source index to a texel (defaults to the work-buffer size)
     * @param srcBaseOffset added to each mapped source index so a region-local map reads the correct global atlas texel (hosted relayout)
     * @param dstBaseRow subtracted from the destination row so an identity copy reads the region-local temp (hosted relayout)
     */
    private _renderRelayoutPass;
    private _createCopyMaterial;
    /**
     * Renders one INTEGER SH copy pass (one packed-u32 SH texture) into the target, sampling one integer source.
     * Same index/map/base math as {@link _renderRelayoutPass} but for the integer SH format.
     * @param target destination single-attachment integer MRT
     * @param srcSh the integer SH source texture
     * @param mapTexture the R32F destination-to-source index map (sampled only when `useMap` is 1)
     * @param useMap 1 to read source indices from the map (gaps discarded), 0 for an identity copy
     * @param dstWidth destination width used to linearize the destination texel
     * @param srcWidth source width used to convert a linear source index to a texel
     * @param srcBaseOffset added to each mapped source index (region-local map -> global atlas texel)
     * @param dstBaseRow subtracted from the destination row for an identity copy of a region-local temp
     */
    private _renderShCopyPass;
    private _createShCopyMaterial;
    /**
     * Renders one rotation/scale copy pass (the three half-float rotation textures) into the target. Same
     * index/map/base math as {@link _renderRelayoutPass} but with three attachments.
     * @param target destination 3-attachment MRT
     * @param sources the three source rotation textures ([rotA, rotB, rotScale])
     * @param mapTexture the R32F destination-to-source index map (sampled only when `useMap` is 1)
     * @param useMap 1 to read source indices from the map (gaps discarded), 0 for an identity copy
     * @param dstWidth destination width used to linearize the destination texel
     * @param srcWidth source width used to convert a linear source index to a texel
     * @param srcBaseOffset added to each mapped source index (region-local map -> global atlas texel)
     * @param dstBaseRow subtracted from the destination row for an identity copy of a region-local temp
     */
    private _renderRotCopyPass;
    private _createRotCopyMaterial;
    /**
     * Asynchronously reads back the decoded splat centers (stride-4 xyzw, w=1) for a contiguous splat range
     * from the work buffer's centers texture, using a non-blocking GPU readback (WebGL2 PBO + fence, or WebGPU
     * copyTextureToBuffer + mapAsync) so it never stalls the frame the way a CPU image decode does. The centers
     * texture already holds the GPU-decoded positions (identical to the CPU decode), so this replaces decoding
     * positions on the CPU from the means images. Returns null when async readback is unsupported (caller should
     * fall back to CPU decoding).
     * @param splatOffset first splat index of the range
     * @param splatCount number of splats in the range
     * @returns a stride-4 Float32Array of length `splatCount * 4`, or null when unsupported/failed
     */
    readCentersRangeAsync(splatOffset: number, splatCount: number): Promise<Nullable<Float32Array>>;
    /**
     * Disposes the work buffer and its decode resources.
     */
    dispose(): void;
    private _createQuad;
    private _createMaterial;
    private _applyPack;
    private _createShMaterial;
    private _applyShPack;
    private _createRotMaterial;
    private _applyRotPack;
}

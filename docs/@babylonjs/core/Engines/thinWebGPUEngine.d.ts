import { type InternalTexture } from "../Materials/Textures/internalTexture.js";
import { AbstractEngine } from "./abstractEngine.js";
import { type WebGPUCacheRenderPipeline } from "./WebGPU/webgpuCacheRenderPipeline.js";
import { type WebGPUTextureManager } from "./WebGPU/webgpuTextureManager.js";
import { type Nullable } from "../types.js";
import { WebGPUPerfCounter } from "./WebGPU/webgpuPerfCounter.js";
import { type WebGPUSnapshotRendering } from "./WebGPU/webgpuSnapshotRendering.js";
import { type WebGPUBundleList } from "./WebGPU/webgpuBundleList.js";
import { type WebGPUTimestampQuery } from "./WebGPU/webgpuTimestampQuery.js";
import { type WebGPUOcclusionQuery } from "./WebGPU/webgpuOcclusionQuery.js";
/**
 * The base engine class for WebGPU
 */
export declare abstract class ThinWebGPUEngine extends AbstractEngine {
    /** @internal */
    dbgShowShaderCode: boolean;
    /** @internal */
    dbgSanityChecks: boolean;
    /** @internal */
    dbgLogIfNotDrawWrapper: boolean;
    /** @internal */
    dbgShowEmptyEnableEffectCalls: boolean;
    /** @internal */
    _textureHelper: WebGPUTextureManager;
    /** @internal */
    _cacheRenderPipeline: WebGPUCacheRenderPipeline;
    /** @internal */
    _occlusionQuery: WebGPUOcclusionQuery;
    /** @internal */
    _renderEncoder: GPUCommandEncoder;
    /** @internal */
    _uploadEncoder: GPUCommandEncoder;
    /** @internal */
    _currentRenderPass: Nullable<GPURenderPassEncoder>;
    protected _snapshotRendering: WebGPUSnapshotRendering;
    protected _snapshotRenderingMode: number;
    /** @internal */
    _timestampQuery: WebGPUTimestampQuery;
    /** @internal */
    _timestampIndex: number;
    /** @internal */
    _showGPUDebugMarkersLog: boolean;
    /** @internal */
    _debugMarkersEncoderGroups: string[];
    /** @internal */
    _debugMarkersPassGroups: string[];
    /** @internal */
    _debugMarkersPendingEncoderPops: number;
    /**
     * Gets the GPU time spent in the main render pass for the last frame rendered (in nanoseconds).
     * You have to enable the "timestamp-query" extension in the engine constructor options and set engine.enableGPUTimingMeasurements = true.
     * It will only return time spent in the main pass, not additional render target / compute passes (if any)!
     */
    readonly gpuTimeInFrameForMainPass?: WebGPUPerfCounter;
    /**
     * Used for both the compatibilityMode=false and the snapshot rendering modes (as both can't be enabled at the same time)
     * @internal
     */
    _bundleList: WebGPUBundleList;
    /**
     * Enables or disables GPU timing measurements.
     * Note that this is only supported if the "timestamp-query" extension is enabled in the options.
     */
    get enableGPUTimingMeasurements(): boolean;
    set enableGPUTimingMeasurements(enable: boolean);
    protected _currentPassIsMainPass(): boolean;
    /** @internal */
    _endCurrentRenderPass(): number;
    /**
     * @internal
     */
    _generateMipmaps(texture: InternalTexture, commandEncoder?: GPUCommandEncoder): void;
    protected _debugPopBeforeEndOfEncoder(): void;
    protected _debugPushAfterStartOfEncoder(): void;
    protected _debugPendingPop(currentRenderPass: GPURenderPassEncoder): void;
}

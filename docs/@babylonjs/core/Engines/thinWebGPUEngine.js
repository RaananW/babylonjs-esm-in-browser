import { AbstractEngine } from "./abstractEngine.js";
import { Logger } from "../Misc/logger.js";
import { WebGPUTextureHelper } from "./WebGPU/webgpuTextureHelper.js";
import { WebGPUPerfCounter } from "./WebGPU/webgpuPerfCounter.js";

/**
 * The base engine class for WebGPU
 */
export class ThinWebGPUEngine extends AbstractEngine {
    constructor() {
        super(...arguments);
        // TODO WEBGPU remove those variables when code stabilized
        /** @internal */
        this.dbgShowShaderCode = false;
        /** @internal */
        this.dbgSanityChecks = true;
        /** @internal */
        this.dbgLogIfNotDrawWrapper = true;
        /** @internal */
        this.dbgShowEmptyEnableEffectCalls = true;
        /** @internal */
        this._currentRenderPass = null;
        this._snapshotRenderingMode = 0;
        /** @internal */
        this._timestampIndex = 0;
        /** @internal */
        this._showGPUDebugMarkersLog = false;
        /** @internal */
        this._debugMarkersEncoderGroups = [];
        /** @internal */
        this._debugMarkersPassGroups = [];
        /** @internal */
        this._debugMarkersPendingEncoderPops = 0;
    }
    /**
     * Enables or disables GPU timing measurements.
     * Note that this is only supported if the "timestamp-query" extension is enabled in the options.
     */
    get enableGPUTimingMeasurements() {
        return this._timestampQuery.enable;
    }
    set enableGPUTimingMeasurements(enable) {
        if (this._timestampQuery.enable === enable) {
            return;
        }
        this.gpuTimeInFrameForMainPass = enable ? new WebGPUPerfCounter() : undefined;
        this._timestampQuery.enable = enable;
    }
    _currentPassIsMainPass() {
        return this._currentRenderTarget === null;
    }
    /** @internal */
    _endCurrentRenderPass() {
        if (!this._currentRenderPass) {
            return 0;
        }
        this._debugPopBeforeEndOfEncoder();
        const currentPassIndex = this._currentPassIsMainPass() ? 2 : 1;
        if (!this._snapshotRendering.endRenderPass(this._currentRenderPass) && !this.compatibilityMode) {
            this._bundleList.run(this._currentRenderPass);
            this._bundleList.reset();
        }
        this._currentRenderPass.end();
        this._timestampQuery.endPass(this._timestampIndex, (this._currentRenderTarget && this._currentRenderTarget.gpuTimeInFrame
            ? this._currentRenderTarget.gpuTimeInFrame
            : this.gpuTimeInFrameForMainPass));
        this._timestampIndex += 2;
        this._debugPendingPop(this._currentRenderPass);
        this._currentRenderPass = null;
        return currentPassIndex;
    }
    /**
     * @internal
     */
    _generateMipmaps(texture, commandEncoder) {
        commandEncoder = commandEncoder ?? this._renderEncoder;
        const gpuHardwareTexture = texture._hardwareTexture;
        if (!gpuHardwareTexture) {
            return;
        }
        if (commandEncoder === this._renderEncoder) {
            // We must close the current pass (if any) because we are going to use the render encoder to generate the mipmaps (so, we are going to create a new render pass)
            this._endCurrentRenderPass();
        }
        const mipmapCount = WebGPUTextureHelper.ComputeNumMipmapLevels(texture.width, texture.height);
        if (texture.isCube) {
            this._textureHelper.generateCubeMipmaps(gpuHardwareTexture, mipmapCount, commandEncoder);
        }
        else if (texture._source === 3 /* InternalTextureSource.Raw */ || texture._source === 11 /* InternalTextureSource.Raw2DArray */) {
            this._textureHelper.generateMipmaps(gpuHardwareTexture, texture.mipLevelCount, 0, commandEncoder);
        }
        else {
            this._textureHelper.generateMipmaps(gpuHardwareTexture, mipmapCount, 0, commandEncoder);
        }
    }
    _debugPopBeforeEndOfEncoder() {
        if (!this._enableGPUDebugMarkers) {
            return;
        }
        // When a render pass is active, pop its groups; otherwise pop encoder-level groups.
        // Pass-level groups are never pushed on the encoder, so we never pop them from it.
        const groups = this._currentRenderPass ? this._debugMarkersPassGroups : this._debugMarkersEncoderGroups;
        const target = this._currentRenderPass ?? this._renderEncoder;
        for (let i = groups.length - 1; i >= 0; --i) {
            if (this._showGPUDebugMarkersLog) {
                Logger.Log(`[${this.frameId}] [E${this._debugMarkersEncoderGroups.length}|P${this._debugMarkersPassGroups.length}] [automatic] Popping debug group '${groups[i]}' on '${target.label}'.`);
            }
            target.popDebugGroup();
        }
    }
    _debugPushAfterStartOfEncoder() {
        if (!this._enableGPUDebugMarkers) {
            return;
        }
        // When a render pass is active, re-push its floating groups onto it; otherwise re-push
        // encoder-level groups onto the new render encoder.
        // Pass-level groups stay floating until the next render pass starts.
        const groups = this._currentRenderPass ? this._debugMarkersPassGroups : this._debugMarkersEncoderGroups;
        const target = this._currentRenderPass ?? this._renderEncoder;
        for (const groupName of groups) {
            if (this._showGPUDebugMarkersLog) {
                Logger.Log(`[${this.frameId}] [E${this._debugMarkersEncoderGroups.length}|P${this._debugMarkersPassGroups.length}] [automatic] Pushing debug group '${groupName}' on '${target.label}'.`);
            }
            target.pushDebugGroup(groupName);
        }
    }
    _debugPendingPop(currentRenderPass) {
        if (!this._enableGPUDebugMarkers) {
            return;
        }
        // The user popped encoder-level groups while a render pass was active (the pass was the live
        // object, so the pops were deferred). Now that the pass has ended we replay them on the render
        // encoder. Because _debugMarkersEncoderGroups only ever contains encoder-level entries, popping
        // from it here can never accidentally consume a pass-level group.
        while (this._debugMarkersPendingEncoderPops-- > 0) {
            const groupName = this._debugMarkersEncoderGroups.pop();
            if (this._showGPUDebugMarkersLog) {
                Logger.Log(`[${this.frameId}] [E${this._debugMarkersEncoderGroups.length}|P${this._debugMarkersPassGroups.length}] [automatic] Popping debug group '${groupName}' on render encoder '${this._renderEncoder.label}' after the end of render pass '${currentRenderPass.label}'.`);
            }
            this._renderEncoder.popDebugGroup();
        }
        this._debugMarkersPendingEncoderPops = 0;
    }
}
//# sourceMappingURL=thinWebGPUEngine.js.map
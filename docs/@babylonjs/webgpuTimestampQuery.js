import * as WebGPUConstants from "./webgpuConstants.js";
import { PerfCounter } from "../../Misc/perfCounter.js";
import { WebGPUQuerySet } from "./webgpuQuerySet.js";
/** @internal */
export class WebGPUTimestampQuery {
    constructor(device, bufferManager) {
        this._enabled = false;
        this._gpuFrameTimeCounter = new PerfCounter();
        this._measureDurationState = 0;
        this._device = device;
        this._bufferManager = bufferManager;
    }
    get gpuFrameTimeCounter() {
        return this._gpuFrameTimeCounter;
    }
    get enable() {
        return this._enabled;
    }
    set enable(value) {
        if (this._enabled === value) {
            return;
        }
        this._enabled = value;
        this._measureDurationState = 0;
        if (value) {
            this._measureDuration = new WebGPUDurationMeasure(this._device, this._bufferManager);
        }
        else {
            this._measureDuration.dispose();
        }
    }
    startFrame(commandEncoder) {
        if (this._enabled && this._measureDurationState === 0) {
            this._measureDuration.start(commandEncoder);
            this._measureDurationState = 1;
        }
    }
    endFrame(commandEncoder) {
        if (this._measureDurationState === 1) {
            this._measureDurationState = 2;
            this._measureDuration.stop(commandEncoder).then((duration) => {
                if (duration !== null && duration >= 0) {
                    this._gpuFrameTimeCounter.fetchNewFrame();
                    this._gpuFrameTimeCounter.addCount(duration, true);
                }
                this._measureDurationState = 0;
            });
        }
    }
}
/** @internal */
export class WebGPUDurationMeasure {
    constructor(device, bufferManager) {
        this._querySet = new WebGPUQuerySet(2, WebGPUConstants.QueryType.Timestamp, device, bufferManager);
    }
    start(encoder) {
        encoder.writeTimestamp(this._querySet.querySet, 0);
    }
    async stop(encoder) {
        encoder.writeTimestamp(this._querySet.querySet, 1);
        return this._querySet.readTwoValuesAndSubtract(0);
    }
    dispose() {
        this._querySet.dispose();
    }
}
//# sourceMappingURL=webgpuTimestampQuery.js.map
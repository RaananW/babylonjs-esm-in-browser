import { type Nullable } from "../../types.js";
import { type PerfCounter } from "../../Misc/perfCounter.js";
declare module "../../Engines/abstractEngine.pure.js" {
    interface AbstractEngine {
        /** @internal */
        _gpuFrameTime: Nullable<PerfCounter>;
        /**
         * Get the performance counter associated with the frame time computation
         * @returns the perf counter
         */
        getGPUFrameTimeCounter(): PerfCounter;
        /**
         * Enable or disable the GPU frame time capture
         * @param value True to enable, false to disable
         */
        captureGPUFrameTime(value: boolean): void;
    }
}

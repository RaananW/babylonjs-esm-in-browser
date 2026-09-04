/** This file must only contain pure code and pure imports */
import { AbstractEngine } from "../abstractEngine.pure.js";
import { PerfCounter } from "../../Misc/perfCounter.js";
let _Registered = false;
/**
 * Register side effects for abstractEngineTimeQuery.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAbstractEngineTimeQuery() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    AbstractEngine.prototype.getGPUFrameTimeCounter = function () {
        if (!this._gpuFrameTime) {
            this._gpuFrameTime = new PerfCounter();
        }
        return this._gpuFrameTime;
    };
    AbstractEngine.prototype.captureGPUFrameTime = function (value) {
        // Do nothing. Must be implemented by child classes
    };
}
//# sourceMappingURL=abstractEngine.timeQuery.pure.js.map
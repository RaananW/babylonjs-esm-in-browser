/** This file must only contain pure code and pure imports */
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
import { WebGPURenderItemBeginOcclusionQuery, WebGPURenderItemEndOcclusionQuery } from "../webgpuBundleList.js";
let _Registered = false;
/**
 * Register side effects for enginesWebGPUExtensionsEngineQuery.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineQuery() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinWebGPUEngine.prototype.getGPUFrameTimeCounter = function () {
        return this._timestampQuery.gpuFrameTimeCounter;
    };
    ThinWebGPUEngine.prototype.captureGPUFrameTime = function (value) {
        this._timestampQuery.enable = value && !!this._caps.timerQuery;
    };
    ThinWebGPUEngine.prototype.createQuery = function () {
        return this._occlusionQuery.createQuery();
    };
    ThinWebGPUEngine.prototype.deleteQuery = function (query) {
        this._occlusionQuery.deleteQuery(query);
        return this;
    };
    ThinWebGPUEngine.prototype.isQueryResultAvailable = function (query) {
        return this._occlusionQuery.isQueryResultAvailable(query);
    };
    ThinWebGPUEngine.prototype.getQueryResult = function (query) {
        return this._occlusionQuery.getQueryResult(query);
    };
    ThinWebGPUEngine.prototype.beginOcclusionQuery = function (algorithmType, query) {
        if (this.compatibilityMode) {
            if (this._occlusionQuery.canBeginQuery(query)) {
                this._currentRenderPass?.beginOcclusionQuery(query);
                return true;
            }
        }
        else {
            this._bundleList.addItem(new WebGPURenderItemBeginOcclusionQuery(query));
            return true;
        }
        return false;
    };
    ThinWebGPUEngine.prototype.endOcclusionQuery = function () {
        if (this.compatibilityMode) {
            this._currentRenderPass?.endOcclusionQuery();
        }
        else {
            this._bundleList.addItem(new WebGPURenderItemEndOcclusionQuery());
        }
        return this;
    };
}
//# sourceMappingURL=engine.query.pure.js.map
/** This file must only contain pure code and pure imports */
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
import { WebGPUCacheRenderPipeline } from "../webgpuCacheRenderPipeline.js";
let _Registered = false;
/**
 * Registers alpha-to-coverage support for WebGPU engines.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineAlphaToCoverage() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    const alphaToCoverageState = new WeakMap();
    ThinWebGPUEngine.prototype.getAlphaToCoverage = function () {
        return alphaToCoverageState.get(this) ?? false;
    };
    ThinWebGPUEngine.prototype.setAlphaToCoverage = function (enable) {
        const pipelineCache = this._cacheRenderPipeline;
        if ((alphaToCoverageState.get(this) ?? false) === enable && pipelineCache._alphaToCoverageEnabled === enable) {
            return;
        }
        alphaToCoverageState.set(this, enable);
        this._cacheRenderPipeline.setAlphaToCoverage(enable);
    };
    const pipelinePrototype = WebGPUCacheRenderPipeline.prototype;
    const buildRenderPipelineDescriptor = pipelinePrototype._buildRenderPipelineDescriptor;
    pipelinePrototype._buildRenderPipelineDescriptor = function (effect, topology, sampleCount) {
        const descriptor = buildRenderPipelineDescriptor.call(this, effect, topology, sampleCount);
        descriptor.multisample.alphaToCoverageEnabled = this._alphaToCoverageEnabled && sampleCount > 1;
        return descriptor;
    };
}
//# sourceMappingURL=engine.alphaToCoverage.pure.js.map
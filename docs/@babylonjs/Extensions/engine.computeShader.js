import { ComputeEffect } from "../../../Compute/computeEffect.js";
import { WebGPUEngine } from "../../webgpuEngine.js";
import { WebGPUComputeContext } from "../webgpuComputeContext.js";
import { WebGPUComputePipelineContext } from "../webgpuComputePipelineContext.js";
import * as WebGPUConstants from "../webgpuConstants.js";
WebGPUEngine.prototype.createComputeContext = function () {
    return new WebGPUComputeContext(this._device, this._cacheSampler);
};
WebGPUEngine.prototype.createComputeEffect = function (baseName, options) {
    const compute = baseName.computeElement || baseName.compute || baseName.computeToken || baseName.computeSource || baseName;
    const name = compute + "@" + options.defines;
    if (this._compiledComputeEffects[name]) {
        const compiledEffect = this._compiledComputeEffects[name];
        if (options.onCompiled && compiledEffect.isReady()) {
            options.onCompiled(compiledEffect);
        }
        return compiledEffect;
    }
    const effect = new ComputeEffect(baseName, options, this, name);
    this._compiledComputeEffects[name] = effect;
    return effect;
};
WebGPUEngine.prototype.createComputePipelineContext = function () {
    return new WebGPUComputePipelineContext(this);
};
WebGPUEngine.prototype.areAllComputeEffectsReady = function () {
    for (const key in this._compiledComputeEffects) {
        const effect = this._compiledComputeEffects[key];
        if (!effect.isReady()) {
            return false;
        }
    }
    return true;
};
WebGPUEngine.prototype.computeDispatch = function (effect, context, bindings, x, y, z, bindingsMapping) {
    if (this._currentRenderTarget) {
        // A render target pass is currently in effect (meaning beingRenderPass has been called on the command encoder this._renderTargetEncoder): we are not allowed to open
        // another pass on this command encoder (even if it's a compute pass) until endPass has been called, so we need to defer the compute pass for after the current render target pass is closed
        this._onAfterUnbindFrameBufferObservable.addOnce(() => {
            this.computeDispatch(effect, context, bindings, x, y, z, bindingsMapping);
        });
        return;
    }
    const contextPipeline = effect._pipelineContext;
    const computeContext = context;
    if (!contextPipeline.computePipeline) {
        contextPipeline.computePipeline = this._device.createComputePipeline({
            layout: WebGPUConstants.AutoLayoutMode.Auto,
            compute: contextPipeline.stage,
        });
    }
    const commandEncoder = this._renderTargetEncoder;
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(contextPipeline.computePipeline);
    const bindGroups = computeContext.getBindGroups(bindings, contextPipeline.computePipeline, bindingsMapping);
    for (let i = 0; i < bindGroups.length; ++i) {
        const bindGroup = bindGroups[i];
        if (!bindGroup) {
            continue;
        }
        computePass.setBindGroup(i, bindGroup);
    }
    computePass.dispatchWorkgroups(x, y, z);
    computePass.end();
};
WebGPUEngine.prototype.releaseComputeEffects = function () {
    for (const name in this._compiledComputeEffects) {
        const webGPUPipelineContextCompute = this._compiledComputeEffects[name].getPipelineContext();
        this._deleteComputePipelineContext(webGPUPipelineContextCompute);
    }
    this._compiledComputeEffects = {};
};
WebGPUEngine.prototype._prepareComputePipelineContext = function (pipelineContext, computeSourceCode, rawComputeSourceCode, defines, entryPoint) {
    const webGpuContext = pipelineContext;
    if (this.dbgShowShaderCode) {
        console.log(defines);
        console.log(computeSourceCode);
    }
    webGpuContext.sources = {
        compute: computeSourceCode,
        rawCompute: rawComputeSourceCode,
    };
    webGpuContext.stage = this._createComputePipelineStageDescriptor(computeSourceCode, defines, entryPoint);
};
WebGPUEngine.prototype._releaseComputeEffect = function (effect) {
    if (this._compiledComputeEffects[effect._key]) {
        delete this._compiledComputeEffects[effect._key];
        this._deleteComputePipelineContext(effect.getPipelineContext());
    }
};
WebGPUEngine.prototype._rebuildComputeEffects = function () {
    for (const key in this._compiledComputeEffects) {
        const effect = this._compiledComputeEffects[key];
        effect._pipelineContext = null;
        effect._wasPreviouslyReady = false;
        effect._prepareEffect();
    }
};
WebGPUEngine.prototype._deleteComputePipelineContext = function (pipelineContext) {
    const webgpuPipelineContext = pipelineContext;
    if (webgpuPipelineContext) {
        pipelineContext.dispose();
    }
};
WebGPUEngine.prototype._createComputePipelineStageDescriptor = function (computeShader, defines, entryPoint) {
    if (defines) {
        defines = "//" + defines.split("\n").join("\n//") + "\n";
    }
    else {
        defines = "";
    }
    return {
        module: this._device.createShaderModule({
            code: defines + computeShader,
        }),
        entryPoint,
    };
};
//# sourceMappingURL=engine.computeShader.js.map
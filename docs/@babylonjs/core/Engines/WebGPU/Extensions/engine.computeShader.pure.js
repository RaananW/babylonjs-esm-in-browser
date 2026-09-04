/** This file must only contain pure code and pure imports */
import { Logger } from "../../../Misc/logger.js";
import { ComputeEffect } from "../../../Compute/computeEffect.js";

import { WebGPUComputeContext } from "../webgpuComputeContext.js";
import { WebGPUComputePipelineContext } from "../webgpuComputePipelineContext.js";
import { WebGPUEngine } from "../../webgpuEngine.pure.js";
let _Registered = false;
const _GetComputeStorageBufferType = (source, group, binding) => {
    const bindingPattern = `@binding\\(${binding}\\)\\s*@group\\(${group}\\)`;
    const groupPattern = `@group\\(${group}\\)\\s*@binding\\(${binding}\\)`;
    const declarationPattern = `(?:${bindingPattern}|${groupPattern})\\s*var<storage\\s*,\\s*(read|read_write)>`;
    const access = source.match(new RegExp(declarationPattern))?.[1];
    return access === "read" ? "read-only-storage" /* WebGPUConstants.BufferBindingType.ReadOnlyStorage */ : "storage" /* WebGPUConstants.BufferBindingType.Storage */;
};
const _GetComputeTextureViewDimension = (source, group, binding) => {
    const bindingPattern = `@binding\\(${binding}\\)\\s*@group\\(${group}\\)`;
    const groupPattern = `@group\\(${group}\\)\\s*@binding\\(${binding}\\)`;
    const declaration = source.match(new RegExp(`(?:${bindingPattern}|${groupPattern})\\s*var\\s+\\w+\\s*:\\s*(texture_\\w+)`))?.[1];
    switch (declaration) {
        case "texture_2d_array":
        case "texture_depth_2d_array":
            return "2d-array" /* WebGPUConstants.TextureViewDimension.E2dArray */;
        case "texture_cube":
            return "cube" /* WebGPUConstants.TextureViewDimension.Cube */;
        case "texture_cube_array":
            return "cube-array" /* WebGPUConstants.TextureViewDimension.CubeArray */;
        case "texture_3d":
            return "3d" /* WebGPUConstants.TextureViewDimension.E3d */;
        default:
            return "2d" /* WebGPUConstants.TextureViewDimension.E2d */;
    }
};
const _GetInternalTexture = (texture) => {
    const internalTexture = texture;
    if (internalTexture._hardwareTexture !== undefined) {
        return internalTexture;
    }
    return texture._texture;
};
const _GetComputeTextureSampleType = (texture, textureFloatLinearFiltering) => {
    const internalTexture = _GetInternalTexture(texture);
    if (!internalTexture) {
        return "float" /* WebGPUConstants.TextureSampleType.Float */;
    }
    const textureIsDepth = internalTexture.format >= 13 && internalTexture.format <= 18;
    if (textureIsDepth) {
        return "depth" /* WebGPUConstants.TextureSampleType.Depth */;
    }
    if (internalTexture.type === 1 && !textureFloatLinearFiltering) {
        return "unfilterable-float" /* WebGPUConstants.TextureSampleType.UnfilterableFloat */;
    }
    return "float" /* WebGPUConstants.TextureSampleType.Float */;
};
const _GetComputePipelineLayout = (device, bindings, bindingsMapping, shaderSource, textureFloatLinearFiltering) => {
    if (!bindingsMapping) {
        return null;
    }
    const bindGroupLayoutEntries = [];
    const addEntry = (group, entry) => {
        const entries = (bindGroupLayoutEntries[group] ?? (bindGroupLayoutEntries[group] = []));
        const existingIndex = entries.findIndex((item) => item.binding === entry.binding);
        if (existingIndex >= 0) {
            entries[existingIndex] = entry;
        }
        else {
            entries.push(entry);
        }
    };
    for (const key in bindings) {
        const binding = bindings[key];
        const location = bindingsMapping[key];
        if (!location) {
            continue;
        }
        const group = location.group;
        const bindingIndex = location.binding;
        switch (binding.type) {
            case 0 /* ComputeBindingType.Texture */:
            case 4 /* ComputeBindingType.TextureWithoutSampler */:
            case 8 /* ComputeBindingType.InternalTexture */: {
                const sampleType = _GetComputeTextureSampleType(binding.object, textureFloatLinearFiltering);
                if (binding.type === 0 /* ComputeBindingType.Texture */) {
                    addEntry(group, {
                        binding: bindingIndex - 1,
                        visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                        sampler: {
                            type: sampleType === "unfilterable-float" /* WebGPUConstants.TextureSampleType.UnfilterableFloat */
                                ? "non-filtering" /* WebGPUConstants.SamplerBindingType.NonFiltering */
                                : "filtering" /* WebGPUConstants.SamplerBindingType.Filtering */,
                        },
                    });
                }
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    texture: {
                        sampleType,
                        viewDimension: _GetComputeTextureViewDimension(shaderSource, group, bindingIndex),
                        multisampled: false,
                    },
                });
                break;
            }
            case 1 /* ComputeBindingType.StorageTexture */: {
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    storageTexture: {
                        access: "write-only" /* WebGPUConstants.StorageTextureAccess.WriteOnly */,
                        format: binding.object._texture._hardwareTexture.format,
                        viewDimension: _GetComputeTextureViewDimension(shaderSource, group, bindingIndex),
                    },
                });
                break;
            }
            case 2 /* ComputeBindingType.UniformBuffer */:
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    buffer: { type: "uniform" /* WebGPUConstants.BufferBindingType.Uniform */ },
                });
                break;
            case 3 /* ComputeBindingType.StorageBuffer */:
            case 7 /* ComputeBindingType.DataBuffer */:
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    buffer: { type: _GetComputeStorageBufferType(shaderSource, group, bindingIndex) },
                });
                break;
            case 5 /* ComputeBindingType.Sampler */:
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    sampler: { type: "filtering" /* WebGPUConstants.SamplerBindingType.Filtering */ },
                });
                break;
            case 6 /* ComputeBindingType.ExternalTexture */:
                addEntry(group, {
                    binding: bindingIndex,
                    visibility: 4 /* WebGPUConstants.ShaderStage.Compute */,
                    externalTexture: {},
                });
                break;
        }
    }
    const bindGroupLayouts = [];
    for (let i = 0; i < bindGroupLayoutEntries.length; i++) {
        const entries = bindGroupLayoutEntries[i] ?? [];
        entries.sort((a, b) => a.binding - b.binding);
        bindGroupLayouts[i] = device.createBindGroupLayout({ entries });
    }
    return device.createPipelineLayout({ bindGroupLayouts });
};
/**
 * Register side effects for enginesWebGPUExtensionsEngineComputeShader.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineComputeShader() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const ComputePassDescriptor = {};
    WebGPUEngine.prototype.createComputeContext = function () {
        return new WebGPUComputeContext(this._device, this._cacheSampler);
    };
    WebGPUEngine.prototype.createComputeEffect = function (baseName, options) {
        const compute = typeof baseName === "string" ? baseName : baseName.computeToken || baseName.computeSource || baseName.computeElement || baseName.compute;
        const name = compute + "@" + options.defines + (options.useExplicitComputePipelineLayout ? "@explicitComputePipelineLayout" : "");
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
    WebGPUEngine.prototype.computeDispatch = function (effect, context, bindings, x, y = 1, z = 1, bindingsMapping, gpuPerfCounter) {
        this._computeDispatch(effect, context, bindings, x, y, z, undefined, undefined, bindingsMapping, gpuPerfCounter);
    };
    WebGPUEngine.prototype.computeDispatchIndirect = function (effect, context, bindings, buffer, offset = 0, bindingsMapping, gpuPerfCounter) {
        this._computeDispatch(effect, context, bindings, undefined, undefined, undefined, buffer, offset, bindingsMapping, gpuPerfCounter);
    };
    WebGPUEngine.prototype._computeDispatch = function (effect, context, bindings, x, y, z, buffer, offset, bindingsMapping, gpuPerfCounter) {
        this._endCurrentRenderPass();
        const contextPipeline = effect._pipelineContext;
        const computeContext = context;
        if (!contextPipeline.computePipeline) {
            const explicitLayout = effect._useExplicitComputePipelineLayout
                ? _GetComputePipelineLayout(this._device, bindings, bindingsMapping, contextPipeline.sources?.compute ?? "", this._caps.textureFloatLinearFiltering)
                : null;
            computeContext.clear();
            contextPipeline.computePipeline = this._device.createComputePipeline({
                layout: explicitLayout ?? "auto" /* WebGPUConstants.AutoLayoutMode.Auto */,
                compute: contextPipeline.stage,
            });
        }
        if (gpuPerfCounter) {
            this._timestampQuery.startPass(ComputePassDescriptor, this._timestampIndex);
        }
        const computePass = this._renderEncoder.beginComputePass(ComputePassDescriptor);
        computePass.setPipeline(contextPipeline.computePipeline);
        const bindGroups = computeContext.getBindGroups(bindings, contextPipeline.computePipeline, bindingsMapping);
        for (let i = 0; i < bindGroups.length; ++i) {
            const bindGroup = bindGroups[i];
            if (!bindGroup) {
                continue;
            }
            computePass.setBindGroup(i, bindGroup);
        }
        if (buffer !== undefined) {
            computePass.dispatchWorkgroupsIndirect(buffer.underlyingResource, offset);
        }
        else {
            if (x + y + z > 0) {
                computePass.dispatchWorkgroups(x, y, z);
            }
        }
        computePass.end();
        if (gpuPerfCounter) {
            this._timestampQuery.endPass(this._timestampIndex, gpuPerfCounter);
            this._timestampIndex += 2;
        }
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
            Logger.Log(defines);
            Logger.Log(computeSourceCode);
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
    WebGPUEngine.prototype._executeWhenComputeStateIsCompiled = function (pipelineContext, action) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
        pipelineContext.stage.module.getCompilationInfo().then((info) => {
            const compilationMessages = {
                numErrors: 0,
                messages: [],
            };
            for (const message of info.messages) {
                if (message.type === "error") {
                    compilationMessages.numErrors++;
                }
                compilationMessages.messages.push({
                    type: message.type,
                    text: message.message,
                    line: message.lineNum,
                    column: message.linePos,
                    length: message.length,
                    offset: message.offset,
                });
            }
            action(compilationMessages);
        });
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
}
//# sourceMappingURL=engine.computeShader.pure.js.map
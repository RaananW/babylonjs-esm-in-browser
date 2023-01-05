import { Logger } from "../../Misc/logger.js";
class WebGPUBindGroupCacheNode {
    constructor() {
        this.values = {};
    }
}
/** @internal */
export class WebGPUCacheBindGroups {
    constructor(device, cacheSampler, engine) {
        this.disabled = false;
        this._device = device;
        this._cacheSampler = cacheSampler;
        this._engine = engine;
    }
    static get Statistics() {
        return {
            totalCreated: WebGPUCacheBindGroups.NumBindGroupsCreatedTotal,
            lastFrameCreated: WebGPUCacheBindGroups.NumBindGroupsCreatedLastFrame,
            lookupLastFrame: WebGPUCacheBindGroups.NumBindGroupsLookupLastFrame,
            noLookupLastFrame: WebGPUCacheBindGroups.NumBindGroupsNoLookupLastFrame,
        };
    }
    endFrame() {
        WebGPUCacheBindGroups.NumBindGroupsCreatedLastFrame = WebGPUCacheBindGroups._NumBindGroupsCreatedCurrentFrame;
        WebGPUCacheBindGroups.NumBindGroupsLookupLastFrame = WebGPUCacheBindGroups._NumBindGroupsLookupCurrentFrame;
        WebGPUCacheBindGroups.NumBindGroupsNoLookupLastFrame = WebGPUCacheBindGroups._NumBindGroupsNoLookupCurrentFrame;
        WebGPUCacheBindGroups._NumBindGroupsCreatedCurrentFrame = 0;
        WebGPUCacheBindGroups._NumBindGroupsLookupCurrentFrame = 0;
        WebGPUCacheBindGroups._NumBindGroupsNoLookupCurrentFrame = 0;
    }
    /**
     * Cache is currently based on the uniform/storage buffers, samplers and textures used by the binding groups.
     * Note that all uniform buffers have an offset of 0 in Babylon and we don't have a use case where we would have the same buffer used with different capacity values:
     * that means we don't need to factor in the offset/size of the buffer in the cache, only the id
     * @param webgpuPipelineContext
     * @param drawContext
     * @param materialContext
     */
    getBindGroups(webgpuPipelineContext, drawContext, materialContext) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let bindGroups = undefined;
        let node = WebGPUCacheBindGroups._Cache;
        const cacheIsDisabled = this.disabled || materialContext.forceBindGroupCreation;
        if (!cacheIsDisabled) {
            if (!drawContext.isDirty(materialContext.updateId) && !materialContext.isDirty) {
                WebGPUCacheBindGroups._NumBindGroupsNoLookupCurrentFrame++;
                return drawContext.bindGroups;
            }
            for (const bufferName of webgpuPipelineContext.shaderProcessingContext.bufferNames) {
                const uboId = (_b = (_a = drawContext.buffers[bufferName]) === null || _a === void 0 ? void 0 : _a.uniqueId) !== null && _b !== void 0 ? _b : 0;
                let nextNode = node.values[uboId];
                if (!nextNode) {
                    nextNode = new WebGPUBindGroupCacheNode();
                    node.values[uboId] = nextNode;
                }
                node = nextNode;
            }
            for (const samplerName of webgpuPipelineContext.shaderProcessingContext.samplerNames) {
                const samplerHashCode = (_d = (_c = materialContext.samplers[samplerName]) === null || _c === void 0 ? void 0 : _c.hashCode) !== null && _d !== void 0 ? _d : 0;
                let nextNode = node.values[samplerHashCode];
                if (!nextNode) {
                    nextNode = new WebGPUBindGroupCacheNode();
                    node.values[samplerHashCode] = nextNode;
                }
                node = nextNode;
            }
            for (const textureName of webgpuPipelineContext.shaderProcessingContext.textureNames) {
                const textureId = (_g = (_f = (_e = materialContext.textures[textureName]) === null || _e === void 0 ? void 0 : _e.texture) === null || _f === void 0 ? void 0 : _f.uniqueId) !== null && _g !== void 0 ? _g : 0;
                let nextNode = node.values[textureId];
                if (!nextNode) {
                    nextNode = new WebGPUBindGroupCacheNode();
                    node.values[textureId] = nextNode;
                }
                node = nextNode;
            }
            bindGroups = node.bindGroups;
        }
        drawContext.resetIsDirty(materialContext.updateId);
        materialContext.isDirty = false;
        if (bindGroups) {
            drawContext.bindGroups = bindGroups;
            WebGPUCacheBindGroups._NumBindGroupsLookupCurrentFrame++;
            return bindGroups;
        }
        bindGroups = [];
        drawContext.bindGroups = bindGroups;
        if (!cacheIsDisabled) {
            node.bindGroups = bindGroups;
        }
        WebGPUCacheBindGroups.NumBindGroupsCreatedTotal++;
        WebGPUCacheBindGroups._NumBindGroupsCreatedCurrentFrame++;
        const bindGroupLayouts = webgpuPipelineContext.bindGroupLayouts;
        for (let i = 0; i < webgpuPipelineContext.shaderProcessingContext.bindGroupLayoutEntries.length; i++) {
            const setDefinition = webgpuPipelineContext.shaderProcessingContext.bindGroupLayoutEntries[i];
            const entries = webgpuPipelineContext.shaderProcessingContext.bindGroupEntries[i];
            for (let j = 0; j < setDefinition.length; j++) {
                const entry = webgpuPipelineContext.shaderProcessingContext.bindGroupLayoutEntries[i][j];
                const entryInfo = webgpuPipelineContext.shaderProcessingContext.bindGroupLayoutEntryInfo[i][entry.binding];
                const name = (_h = entryInfo.nameInArrayOfTexture) !== null && _h !== void 0 ? _h : entryInfo.name;
                if (entry.sampler) {
                    const bindingInfo = materialContext.samplers[name];
                    if (bindingInfo) {
                        const sampler = bindingInfo.sampler;
                        if (!sampler) {
                            if (this._engine.dbgSanityChecks) {
                                Logger.Error(`Trying to bind a null sampler! entry=${JSON.stringify(entry)}, name=${name}, bindingInfo=${JSON.stringify(bindingInfo, (key, value) => (key === "texture" ? "<no dump>" : value))}, materialContext.uniqueId=${materialContext.uniqueId}`, 50);
                            }
                            continue;
                        }
                        entries[j].resource = this._cacheSampler.getSampler(sampler, false, bindingInfo.hashCode);
                    }
                    else {
                        Logger.Error(`Sampler "${name}" could not be bound. entry=${JSON.stringify(entry)}, materialContext=${JSON.stringify(materialContext, (key, value) => key === "texture" || key === "sampler" ? "<no dump>" : value)}`, 50);
                    }
                }
                else if (entry.texture || entry.storageTexture) {
                    const bindingInfo = materialContext.textures[name];
                    if (bindingInfo) {
                        if (this._engine.dbgSanityChecks && bindingInfo.texture === null) {
                            Logger.Error(`Trying to bind a null texture! entry=${JSON.stringify(entry)}, bindingInfo=${JSON.stringify(bindingInfo, (key, value) => key === "texture" ? "<no dump>" : value)}, materialContext.uniqueId=${materialContext.uniqueId}`, 50);
                            continue;
                        }
                        const hardwareTexture = bindingInfo.texture._hardwareTexture;
                        if (this._engine.dbgSanityChecks &&
                            (!hardwareTexture || (entry.texture && !hardwareTexture.view) || (entry.storageTexture && !hardwareTexture.viewForWriting))) {
                            Logger.Error(`Trying to bind a null gpu texture or view! entry=${JSON.stringify(entry)}, name=${name}, bindingInfo=${JSON.stringify(bindingInfo, (key, value) => (key === "texture" ? "<no dump>" : value))}, isReady=${(_j = bindingInfo.texture) === null || _j === void 0 ? void 0 : _j.isReady}, materialContext.uniqueId=${materialContext.uniqueId}`, 50);
                            continue;
                        }
                        entries[j].resource = entry.storageTexture ? hardwareTexture.viewForWriting : hardwareTexture.view;
                    }
                    else {
                        Logger.Error(`Texture "${name}" could not be bound. entry=${JSON.stringify(entry)}, materialContext=${JSON.stringify(materialContext, (key, value) => key === "texture" || key === "sampler" ? "<no dump>" : value)}`, 50);
                    }
                }
                else if (entry.externalTexture) {
                    const bindingInfo = materialContext.textures[name];
                    if (bindingInfo) {
                        if (this._engine.dbgSanityChecks && bindingInfo.texture === null) {
                            Logger.Error(`Trying to bind a null external texture! entry=${JSON.stringify(entry)}, name=${name}, bindingInfo=${JSON.stringify(bindingInfo, (key, value) => (key === "texture" ? "<no dump>" : value))}, materialContext.uniqueId=${materialContext.uniqueId}`, 50);
                            continue;
                        }
                        const externalTexture = bindingInfo.texture.underlyingResource;
                        if (this._engine.dbgSanityChecks && !externalTexture) {
                            Logger.Error(`Trying to bind a null gpu external texture! entry=${JSON.stringify(entry)}, name=${name}, bindingInfo=${JSON.stringify(bindingInfo, (key, value) => (key === "texture" ? "<no dump>" : value))}, isReady=${(_k = bindingInfo.texture) === null || _k === void 0 ? void 0 : _k.isReady}, materialContext.uniqueId=${materialContext.uniqueId}`, 50);
                            continue;
                        }
                        entries[j].resource = this._device.importExternalTexture({ source: externalTexture });
                    }
                    else {
                        Logger.Error(`Texture "${name}" could not be bound. entry=${JSON.stringify(entry)}, materialContext=${JSON.stringify(materialContext, (key, value) => key === "texture" || key === "sampler" ? "<no dump>" : value)}`, 50);
                    }
                }
                else if (entry.buffer) {
                    const dataBuffer = drawContext.buffers[name];
                    if (dataBuffer) {
                        const webgpuBuffer = dataBuffer.underlyingResource;
                        entries[j].resource.buffer = webgpuBuffer;
                        entries[j].resource.size = dataBuffer.capacity;
                    }
                    else {
                        Logger.Error(`Can't find buffer "${name}". entry=${JSON.stringify(entry)}, buffers=${JSON.stringify(drawContext.buffers)}, drawContext.uniqueId=${drawContext.uniqueId}`, 50);
                    }
                }
            }
            const groupLayout = bindGroupLayouts[i];
            bindGroups[i] = this._device.createBindGroup({
                layout: groupLayout,
                entries,
            });
        }
        return bindGroups;
    }
}
WebGPUCacheBindGroups.NumBindGroupsCreatedTotal = 0;
WebGPUCacheBindGroups.NumBindGroupsCreatedLastFrame = 0;
WebGPUCacheBindGroups.NumBindGroupsLookupLastFrame = 0;
WebGPUCacheBindGroups.NumBindGroupsNoLookupLastFrame = 0;
WebGPUCacheBindGroups._Cache = new WebGPUBindGroupCacheNode();
WebGPUCacheBindGroups._NumBindGroupsCreatedCurrentFrame = 0;
WebGPUCacheBindGroups._NumBindGroupsLookupCurrentFrame = 0;
WebGPUCacheBindGroups._NumBindGroupsNoLookupCurrentFrame = 0;
//# sourceMappingURL=webgpuCacheBindGroups.js.map
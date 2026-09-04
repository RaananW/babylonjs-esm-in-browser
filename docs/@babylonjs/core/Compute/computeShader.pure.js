/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { UniqueIdGenerator } from "../Misc/uniqueIdGenerator.js";
import { Logger } from "../Misc/logger.js";
import { TextureSampler } from "../Materials/Textures/textureSampler.js";
import { WebGPUPerfCounter } from "../Engines/WebGPU/webgpuPerfCounter.js";
import { _RetryWithInterval } from "../Misc/timingTools.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The ComputeShader object lets you execute a compute shader on your GPU (if supported by the engine)
 */
let ComputeShader = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _fastMode_decorators;
    let _fastMode_initializers = [];
    let _fastMode_extraInitializers = [];
    return _a = class ComputeShader {
            /**
             * The options used to create the shader
             */
            get options() {
                return this._options;
            }
            /**
             * The shaderPath used to create the shader
             */
            get shaderPath() {
                return this._shaderPath;
            }
            /**
             * Instantiates a new compute shader.
             * @param name Defines the name of the compute shader in the scene
             * @param engine Defines the engine the compute shader belongs to
             * @param shaderPath Defines the route to the shader code in one of three ways:
             *  * object: \{ compute: "custom" \}, used with ShaderStore.ShadersStoreWGSL["customComputeShader"]
             *  * object: \{ computeElement: "HTMLElementId" \}, used with shader code in script tags
             *  * object: \{ computeSource: "compute shader code string" \}, where the string contains the shader code
             *  * string: try first to find the code in ShaderStore.ShadersStoreWGSL[shaderPath + "ComputeShader"]. If not, assumes it is a file with name shaderPath.compute.fx in index.html folder.
             * @param options Define the options used to create the shader
             */
            constructor(name, engine, shaderPath, options = {}) {
                this._bindings = {};
                this._samplers = {};
                this._contextIsDirty = false;
                /**
                 * The name of the shader
                 */
                this.name = __runInitializers(this, _name_initializers, void 0);
                /**
                 * When set to true, dispatch won't call isReady anymore and won't check if the underlying GPU resources should be (re)created because of a change in the inputs (texture, uniform buffer, etc.)
                 * If you know that your inputs did not change since last time dispatch was called and that isReady() returns true, set this flag to true to improve performance
                 */
                this.fastMode = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _fastMode_initializers, false));
                /**
                 * Callback triggered when the shader is compiled
                 */
                this.onCompiled = (__runInitializers(this, _fastMode_extraInitializers), null);
                /**
                 * Callback triggered when an error occurs
                 */
                this.onError = null;
                /**
                 * If set to true, the compute context will be rebuilt at the next dispatch even if in fast mode
                 */
                this.triggerContextRebuild = false;
                this.name = name;
                this._engine = engine;
                this.uniqueId = UniqueIdGenerator.UniqueId;
                if (engine.enableGPUTimingMeasurements) {
                    this.gpuTimeInFrame = new WebGPUPerfCounter();
                }
                if (!this._engine.getCaps().supportComputeShaders) {
                    Logger.Error("This engine does not support compute shaders!");
                    return;
                }
                if (!options.bindingsMapping) {
                    Logger.Error("You must provide the binding mappings as browsers don't support reflection for wgsl shaders yet!");
                    return;
                }
                this._context = engine.createComputeContext();
                this._shaderPath = shaderPath;
                this._options = {
                    bindingsMapping: {},
                    defines: [],
                    entryPoint: "main",
                    ...options,
                };
            }
            /**
             * Gets the current class name of the material e.g. "ComputeShader"
             * Mainly use in serialization.
             * @returns the class name
             */
            getClassName() {
                return "ComputeShader";
            }
            /**
             * Binds a texture to the shader
             * @param name Binding name of the texture
             * @param texture Texture to bind
             * @param bindSampler Bind the sampler corresponding to the texture (default: true). The sampler will be bound just before the binding index of the texture
             */
            setTexture(name, texture, bindSampler = true) {
                const current = this._bindings[name];
                this._bindings[name] = {
                    type: bindSampler ? 0 /* ComputeBindingType.Texture */ : 4 /* ComputeBindingType.TextureWithoutSampler */,
                    object: texture,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture || current.type !== this._bindings[name].type);
            }
            /**
             * Binds an internal texture to the shader
             * @param name Binding name of the texture
             * @param texture Texture to bind
             */
            setInternalTexture(name, texture) {
                const current = this._bindings[name];
                this._bindings[name] = {
                    type: 8 /* ComputeBindingType.InternalTexture */,
                    object: texture,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture || current.type !== this._bindings[name].type);
            }
            /**
             * Binds a storage texture to the shader
             * @param name Binding name of the texture
             * @param texture Texture to bind
             */
            setStorageTexture(name, texture) {
                const current = this._bindings[name];
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture);
                this._bindings[name] = {
                    type: 1 /* ComputeBindingType.StorageTexture */,
                    object: texture,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
            }
            /**
             * Binds an external texture to the shader
             * @param name Binding name of the texture
             * @param texture Texture to bind
             */
            setExternalTexture(name, texture) {
                const current = this._bindings[name];
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture);
                this._bindings[name] = {
                    type: 6 /* ComputeBindingType.ExternalTexture */,
                    object: texture,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
            }
            /**
             * Binds a video texture to the shader (by binding the external texture attached to this video)
             * @param name Binding name of the texture
             * @param texture Texture to bind
             * @returns true if the video texture was successfully bound, else false. false will be returned if the current engine does not support external textures
             */
            setVideoTexture(name, texture) {
                if (texture.externalTexture) {
                    this.setExternalTexture(name, texture.externalTexture);
                    return true;
                }
                return false;
            }
            /**
             * Binds a uniform buffer to the shader
             * @param name Binding name of the buffer
             * @param buffer Buffer to bind
             */
            setUniformBuffer(name, buffer) {
                const current = this._bindings[name];
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== buffer);
                this._bindings[name] = {
                    type: _a._BufferIsDataBuffer(buffer) ? 7 /* ComputeBindingType.DataBuffer */ : 2 /* ComputeBindingType.UniformBuffer */,
                    object: buffer,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
            }
            /**
             * Binds a storage buffer to the shader
             * @param name Binding name of the buffer
             * @param buffer Buffer to bind
             */
            setStorageBuffer(name, buffer) {
                const current = this._bindings[name];
                this._contextIsDirty || (this._contextIsDirty = !current || current.object !== buffer);
                this._bindings[name] = {
                    type: _a._BufferIsDataBuffer(buffer) ? 7 /* ComputeBindingType.DataBuffer */ : 3 /* ComputeBindingType.StorageBuffer */,
                    object: buffer,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
            }
            /**
             * Binds a texture sampler to the shader
             * @param name Binding name of the sampler
             * @param sampler Sampler to bind
             */
            setTextureSampler(name, sampler) {
                const current = this._bindings[name];
                this._contextIsDirty || (this._contextIsDirty = !current || !sampler.compareSampler(current.object));
                this._bindings[name] = {
                    type: 5 /* ComputeBindingType.Sampler */,
                    object: sampler,
                    indexInGroupEntries: current?.indexInGroupEntries,
                };
            }
            /**
             * Specifies that the compute shader is ready to be executed (the compute effect and all the resources are ready)
             * @returns true if the compute shader is ready to be executed
             */
            isReady() {
                let effect = this._effect;
                for (const key in this._bindings) {
                    const binding = this._bindings[key], type = binding.type, object = binding.object;
                    switch (type) {
                        case 0 /* ComputeBindingType.Texture */:
                        case 4 /* ComputeBindingType.TextureWithoutSampler */:
                        case 1 /* ComputeBindingType.StorageTexture */: {
                            const texture = object;
                            if (!texture.isReady()) {
                                return false;
                            }
                            break;
                        }
                        case 6 /* ComputeBindingType.ExternalTexture */: {
                            const texture = object;
                            if (!texture.isReady()) {
                                return false;
                            }
                            break;
                        }
                    }
                }
                const defines = ["#define " + this._options.entryPoint];
                const shaderName = this._shaderPath;
                if (this._options.defines) {
                    for (let index = 0; index < this._options.defines.length; index++) {
                        defines.push(this._options.defines[index]);
                    }
                }
                const join = defines.join("\n");
                if (this._cachedDefines !== join) {
                    this._cachedDefines = join;
                    effect = this._engine.createComputeEffect(shaderName, {
                        defines: join,
                        entryPoint: this._options.entryPoint,
                        onCompiled: this.onCompiled,
                        onError: this.onError,
                        useExplicitComputePipelineLayout: this._options.useExplicitComputePipelineLayout,
                    });
                    this._effect = effect;
                }
                if (!effect.isReady()) {
                    return false;
                }
                return true;
            }
            /**
             * Dispatches (executes) the compute shader
             * @param x Number of workgroups to execute on the X dimension
             * @param y Number of workgroups to execute on the Y dimension (default: 1)
             * @param z Number of workgroups to execute on the Z dimension (default: 1)
             * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
             */
            dispatch(x, y, z) {
                if ((!this.fastMode || this.triggerContextRebuild) && !this._checkContext()) {
                    return false;
                }
                this._engine.computeDispatch(this._effect, this._context, this._bindings, x, y, z, this._options.bindingsMapping, this.gpuTimeInFrame);
                return true;
            }
            /**
             * Dispatches (executes) the compute shader.
             * @param buffer Buffer containing the number of workgroups to execute on the X, Y and Z dimensions
             * @param offset Offset in the buffer where the workgroup counts are stored (default: 0)
             * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
             */
            dispatchIndirect(buffer, offset = 0) {
                if ((!this.fastMode || this.triggerContextRebuild) && !this._checkContext()) {
                    return false;
                }
                const dataBuffer = _a._BufferIsDataBuffer(buffer) ? buffer : buffer.getBuffer();
                this._engine.computeDispatchIndirect(this._effect, this._context, this._bindings, dataBuffer, offset, this._options.bindingsMapping, this.gpuTimeInFrame);
                return true;
            }
            _checkContext() {
                if (!this.isReady()) {
                    return false;
                }
                // If the sampling parameters of a texture bound to the shader have changed, we must clear the compute context so that it is recreated with the updated values
                // Also, if the actual (gpu) buffer used by a uniform buffer has changed, we must clear the compute context so that it is recreated with the updated value
                for (const key in this._bindings) {
                    const binding = this._bindings[key];
                    if (!this._options.bindingsMapping[key]) {
                        throw new Error("ComputeShader ('" + this.name + "'): No binding mapping has been provided for the property '" + key + "'");
                    }
                    switch (binding.type) {
                        case 0 /* ComputeBindingType.Texture */: {
                            const sampler = this._samplers[key];
                            const texture = binding.object;
                            if (!sampler || !texture._texture || !sampler.compareSampler(texture._texture)) {
                                this._samplers[key] = new TextureSampler().setParameters(texture.wrapU, texture.wrapV, texture.wrapR, texture.anisotropicFilteringLevel, texture._texture.samplingMode, texture._texture?._comparisonFunction);
                                this._contextIsDirty = true;
                            }
                            break;
                        }
                        case 6 /* ComputeBindingType.ExternalTexture */: {
                            // we must recreate the bind groups each time if there's an external texture, because device.importExternalTexture must be called each frame
                            this._contextIsDirty = true;
                            break;
                        }
                        case 2 /* ComputeBindingType.UniformBuffer */: {
                            const ubo = binding.object;
                            if (ubo.getBuffer() !== binding.buffer) {
                                binding.buffer = ubo.getBuffer();
                                this._contextIsDirty = true;
                            }
                            break;
                        }
                    }
                }
                if (this._contextIsDirty) {
                    this.triggerContextRebuild = false;
                    this._contextIsDirty = false;
                    this._context.clear();
                }
                return true;
            }
            /**
             * Waits for the compute shader to be ready and executes it
             * @param x Number of workgroups to execute on the X dimension
             * @param y Number of workgroups to execute on the Y dimension (default: 1)
             * @param z Number of workgroups to execute on the Z dimension (default: 1)
             * @param delay Delay between the retries while the shader is not ready (in milliseconds - 10 by default)
             * @returns A promise that is resolved once the shader has been sent to the GPU. Note that it does not mean that the shader execution itself is finished!
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            async dispatchWhenReady(x, y, z, delay = 10) {
                return await new Promise((resolve) => {
                    _RetryWithInterval(() => this.dispatch(x, y, z), resolve, undefined, delay);
                });
            }
            /**
             * Serializes this compute shader in a JSON representation
             * @returns the serialized compute shader object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.options = this._options;
                serializationObject.shaderPath = this._shaderPath;
                serializationObject.bindings = {};
                serializationObject.textures = {};
                for (const key in this._bindings) {
                    const binding = this._bindings[key];
                    const object = binding.object;
                    switch (binding.type) {
                        case 0 /* ComputeBindingType.Texture */:
                        case 4 /* ComputeBindingType.TextureWithoutSampler */:
                        case 1 /* ComputeBindingType.StorageTexture */: {
                            const serializedData = object.serialize();
                            if (serializedData) {
                                serializationObject.textures[key] = serializedData;
                                serializationObject.bindings[key] = {
                                    type: binding.type,
                                };
                            }
                            break;
                        }
                        case 8 /* ComputeBindingType.InternalTexture */:
                        case 2 /* ComputeBindingType.UniformBuffer */: {
                            break;
                        }
                    }
                }
                return serializationObject;
            }
            static _BufferIsDataBuffer(buffer) {
                return buffer.underlyingResource !== undefined;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [serialize()];
            _fastMode_decorators = [serialize()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _fastMode_decorators, { kind: "field", name: "fastMode", static: false, private: false, access: { has: obj => "fastMode" in obj, get: obj => obj.fastMode, set: (obj, value) => { obj.fastMode = value; } }, metadata: _metadata }, _fastMode_initializers, _fastMode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ComputeShader };
let _Registered = false;
/**
 * Creates a compute shader from parsed compute shader data
 * @param source defines the JSON representation of the compute shader
 * @param scene defines the hosting scene
 * @param rootUrl defines the root URL to use to load textures and relative dependencies
 * @returns a new compute shader
 */
export function ComputeShaderParse(source, scene, rootUrl) {
    const compute = SerializationHelper.Parse(() => new ComputeShader(source.name, scene.getEngine(), source.shaderPath, source.options), source, scene, rootUrl);
    for (const key in source.textures) {
        const binding = source.bindings[key];
        const texture = Texture.Parse(source.textures[key], scene, rootUrl);
        if (binding.type === 0 /* ComputeBindingType.Texture */) {
            compute.setTexture(key, texture);
        }
        else if (binding.type === 4 /* ComputeBindingType.TextureWithoutSampler */) {
            compute.setTexture(key, texture, false);
        }
        else {
            compute.setStorageTexture(key, texture);
        }
    }
    return compute;
}
/**
 * Register side effects for computeShader.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterComputeShader() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ComputeShader.Parse = ComputeShaderParse;
    RegisterClass("BABYLON.ComputeShader", ComputeShader);
}
//# sourceMappingURL=computeShader.pure.js.map
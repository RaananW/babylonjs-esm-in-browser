/** This file must only contain pure code and pure imports */
import { type WebGPUEngine } from "../Engines/webgpuEngine.pure.js";
import { type IGPUParticleSystemPlatform } from "./IGPUParticleSystemPlatform.js";
import { type Buffer, type VertexBuffer } from "../Buffers/buffer.pure.js";
import { type GPUParticleSystem } from "./gpuParticleSystem.pure.js";
import { type DataArray, type Nullable } from "../types.js";
import { type DataBuffer } from "../Buffers/dataBuffer.js";
import { UniformBufferEffectCommonAccessor } from "../Materials/uniformBufferEffectCommonAccessor.js";
import { type Effect } from "../Materials/effect.pure.js";
/** @internal */
export declare class ComputeShaderParticleSystem implements IGPUParticleSystemPlatform {
    private _parent;
    private _engine;
    private _updateComputeShader;
    private _simParamsComputeShader;
    private _bufferComputeShader;
    private _renderVertexBuffers;
    /** @internal */
    readonly alignDataInBuffer = true;
    /** @internal */
    constructor(parent: GPUParticleSystem, engine: WebGPUEngine);
    /** @internal */
    contextLost(): void;
    /** @internal */
    isUpdateBufferCreated(): boolean;
    /** @internal */
    isUpdateBufferReady(): boolean;
    /** @internal */
    createUpdateBuffer(defines: string): UniformBufferEffectCommonAccessor;
    /** @internal */
    createVertexBuffers(updateBuffer: Buffer, renderVertexBuffers: {
        [key: string]: VertexBuffer;
    }): void;
    /** @internal */
    createParticleBuffer(data: number[]): DataArray | DataBuffer;
    /** @internal */
    bindDrawBuffers(index: number, effect: Effect, indexBuffer: Nullable<DataBuffer>): void;
    /** @internal */
    preUpdateParticleBuffer(): void;
    /** @internal */
    updateParticleBuffer(index: number, targetBuffer: Buffer, currentActiveCount: number): void;
    /** @internal */
    releaseBuffers(): void;
    /** @internal */
    releaseVertexBuffers(): void;
}
/**
 * Register side effects for computeShaderParticleSystem.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterComputeShaderParticleSystem(): void;

/** This file must only contain pure code and pure imports */
import { type VertexBuffer, type Buffer } from "../Buffers/buffer.pure.js";
import { type ThinEngine } from "../Engines/thinEngine.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type IGPUParticleSystemPlatform } from "./IGPUParticleSystemPlatform.js";
import { type GPUParticleSystem } from "./gpuParticleSystem.pure.js";
import { type DataArray, type Nullable } from "../types.js";
import { type DataBuffer } from "../Buffers/dataBuffer.js";
import { UniformBufferEffectCommonAccessor } from "../Materials/uniformBufferEffectCommonAccessor.js";
/** @internal */
export declare class WebGL2ParticleSystem implements IGPUParticleSystemPlatform {
    private _parent;
    private _engine;
    private _updateEffect;
    private _updateEffectOptions;
    private _renderVAO;
    private _updateVAO;
    private _renderVertexBuffers;
    private _baseUniformsNamesLength;
    /** @internal */
    readonly alignDataInBuffer = false;
    /** @internal */
    constructor(parent: GPUParticleSystem, engine: ThinEngine);
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
    private _createUpdateVAO;
}
/**
 * Register side effects for webgl2ParticleSystem.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebgl2ParticleSystem(): void;

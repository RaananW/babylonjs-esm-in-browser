import { type Buffer, type VertexBuffer } from "../Buffers/buffer.js";
import { type DataBuffer } from "../Buffers/dataBuffer.js";
import { type Effect } from "../Materials/effect.js";
import { type UniformBufferEffectCommonAccessor } from "../Materials/uniformBufferEffectCommonAccessor.js";
import { type DataArray, type Nullable } from "../types.js";
/** @internal */
export interface IGPUParticleSystemPlatform {
    alignDataInBuffer: boolean;
    contextLost: () => void;
    isUpdateBufferCreated: () => boolean;
    isUpdateBufferReady: () => boolean;
    createUpdateBuffer: (defines: string) => UniformBufferEffectCommonAccessor;
    createVertexBuffers: (updateBuffer: Buffer, renderVertexBuffers: {
        [key: string]: VertexBuffer;
    }) => void;
    createParticleBuffer: (data: number[]) => DataArray | DataBuffer;
    bindDrawBuffers: (index: number, effect: Effect, indexBuffer: Nullable<DataBuffer>) => void;
    preUpdateParticleBuffer: () => void;
    updateParticleBuffer: (index: number, targetBuffer: Buffer, currentActiveCount: number) => void;
    releaseBuffers: () => void;
    releaseVertexBuffers: () => void;
}

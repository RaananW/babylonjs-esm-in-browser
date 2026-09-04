import { DataBuffer } from "../../Buffers/dataBuffer.js";
import { type Nullable } from "../../types.js";
/** @internal */
export declare class WebGPUDataBuffer extends DataBuffer {
    private _buffer;
    /** @internal */
    engineId: number;
    /** @internal */
    set buffer(buffer: Nullable<GPUBuffer>);
    /** @internal */
    constructor(resource?: GPUBuffer, capacity?: number);
    /** @internal */
    get underlyingResource(): any;
}

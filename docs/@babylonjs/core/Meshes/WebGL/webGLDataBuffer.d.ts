import { DataBuffer } from "../../Buffers/dataBuffer.js";
/** @internal */
export declare class WebGLDataBuffer extends DataBuffer {
    private _buffer;
    /** @internal */
    constructor(resource: WebGLBuffer);
    /** @internal */
    get underlyingResource(): any;
}

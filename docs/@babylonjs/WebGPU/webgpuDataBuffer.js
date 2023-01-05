import { DataBuffer } from "../../Buffers/dataBuffer.js";
/** @internal */
export class WebGPUDataBuffer extends DataBuffer {
    constructor(resource) {
        super();
        this._buffer = resource;
    }
    get underlyingResource() {
        return this._buffer;
    }
}
//# sourceMappingURL=webgpuDataBuffer.js.map
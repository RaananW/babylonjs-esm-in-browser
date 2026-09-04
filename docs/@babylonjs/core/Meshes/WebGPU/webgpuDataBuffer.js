import { DataBuffer } from "../../Buffers/dataBuffer.js";
/** @internal */
export class WebGPUDataBuffer extends DataBuffer {
    /** @internal */
    set buffer(buffer) {
        this._buffer = buffer;
    }
    /** @internal */
    constructor(resource, capacity = 0) {
        super();
        // Used to make sure the buffer is not recreated twice after a context loss/restoration
        /** @internal */
        this.engineId = -1;
        this.capacity = capacity;
        if (resource) {
            this._buffer = resource;
        }
    }
    /** @internal */
    get underlyingResource() {
        return this._buffer;
    }
}
//# sourceMappingURL=webgpuDataBuffer.js.map
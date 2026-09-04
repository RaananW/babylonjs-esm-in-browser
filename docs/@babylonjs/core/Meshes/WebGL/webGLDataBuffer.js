import { DataBuffer } from "../../Buffers/dataBuffer.js";
/** @internal */
export class WebGLDataBuffer extends DataBuffer {
    /** @internal */
    constructor(resource) {
        super();
        this._buffer = resource;
    }
    /** @internal */
    get underlyingResource() {
        return this._buffer;
    }
}
//# sourceMappingURL=webGLDataBuffer.js.map
import { WebGPUEngine } from "../../webgpuEngine.js";
WebGPUEngine.prototype.updateDynamicIndexBuffer = function (indexBuffer, indices, offset = 0) {
    const gpuBuffer = indexBuffer;
    let view;
    if (indexBuffer.is32Bits) {
        view = indices instanceof Uint32Array ? indices : new Uint32Array(indices);
    }
    else {
        view = indices instanceof Uint16Array ? indices : new Uint16Array(indices);
    }
    this._bufferManager.setSubData(gpuBuffer, offset, view);
};
WebGPUEngine.prototype.updateDynamicVertexBuffer = function (vertexBuffer, data, byteOffset, byteLength) {
    const dataBuffer = vertexBuffer;
    if (byteOffset === undefined) {
        byteOffset = 0;
    }
    let view;
    if (byteLength === undefined) {
        if (data instanceof Array) {
            view = new Float32Array(data);
        }
        else if (data instanceof ArrayBuffer) {
            view = new Uint8Array(data);
        }
        else {
            view = data;
        }
        byteLength = view.byteLength;
    }
    else {
        if (data instanceof Array) {
            view = new Float32Array(data);
        }
        else if (data instanceof ArrayBuffer) {
            view = new Uint8Array(data);
        }
        else {
            view = data;
        }
    }
    this._bufferManager.setSubData(dataBuffer, byteOffset, view, 0, byteLength);
};
//# sourceMappingURL=engine.dynamicBuffer.js.map
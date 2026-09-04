
import { Logger } from "../Misc/logger.js";
import { FromHalfFloat, ToHalfFloat } from "../Misc/halfFloat.js";
function GetFloatValue(dataView, type, byteOffset, normalized) {
    switch (type) {
        case 5120: {
            let value = dataView.getInt8(byteOffset);
            if (normalized) {
                value = Math.max(value / 127, -1);
            }
            return value;
        }
        case 5121: {
            let value = dataView.getUint8(byteOffset);
            if (normalized) {
                value = value / 255;
            }
            return value;
        }
        case 5122: {
            let value = dataView.getInt16(byteOffset, true);
            if (normalized) {
                value = Math.max(value / 32767, -1);
            }
            return value;
        }
        case 5123: {
            let value = dataView.getUint16(byteOffset, true);
            if (normalized) {
                value = value / 65535;
            }
            return value;
        }
        case 5131: {
            return FromHalfFloat(dataView.getUint16(byteOffset, true));
        }
        case 5124: {
            return dataView.getInt32(byteOffset, true);
        }
        case 5125: {
            return dataView.getUint32(byteOffset, true);
        }
        case 5126: {
            return dataView.getFloat32(byteOffset, true);
        }
        default: {
            throw new Error(`Invalid component type ${type}`);
        }
    }
}
function SetFloatValue(dataView, type, byteOffset, normalized, value) {
    switch (type) {
        case 5120: {
            if (normalized) {
                value = Math.round(value * 127.0);
            }
            dataView.setInt8(byteOffset, value);
            break;
        }
        case 5121: {
            if (normalized) {
                value = Math.round(value * 255);
            }
            dataView.setUint8(byteOffset, value);
            break;
        }
        case 5122: {
            if (normalized) {
                value = Math.round(value * 32767);
            }
            dataView.setInt16(byteOffset, value, true);
            break;
        }
        case 5123: {
            if (normalized) {
                value = Math.round(value * 65535);
            }
            dataView.setUint16(byteOffset, value, true);
            break;
        }
        case 5131: {
            dataView.setUint16(byteOffset, ToHalfFloat(value), true);
            break;
        }
        case 5124: {
            dataView.setInt32(byteOffset, value, true);
            break;
        }
        case 5125: {
            dataView.setUint32(byteOffset, value, true);
            break;
        }
        case 5126: {
            dataView.setFloat32(byteOffset, value, true);
            break;
        }
        default: {
            throw new Error(`Invalid component type ${type}`);
        }
    }
}
/**
 * Gets the byte length of the given type.
 * @param type the type
 * @returns the number of bytes
 */
export function GetTypeByteLength(type) {
    switch (type) {
        case 5120:
        case 5121:
            return 1;
        case 5122:
        case 5123:
        case 5131:
            return 2;
        case 5124:
        case 5125:
        case 5126:
            return 4;
        default:
            throw new Error(`Invalid type '${type}'`);
    }
}
/**
 * Gets the appropriate TypedArray constructor for the given component type.
 * @param componentType the component type
 * @returns the constructor object
 */
export function GetTypedArrayConstructor(componentType) {
    switch (componentType) {
        case 5120:
            return Int8Array;
        case 5121:
            return Uint8Array;
        case 5122:
            return Int16Array;
        case 5123:
            return Uint16Array;
        case 5131:
            return Uint16Array;
        case 5124:
            return Int32Array;
        case 5125:
            return Uint32Array;
        case 5126:
            return Float32Array;
        default:
            throw new Error(`Invalid component type '${componentType}'`);
    }
}
/**
 * Enumerates each value of the data array and calls the given callback.
 * @param data the data to enumerate
 * @param byteOffset the byte offset of the data
 * @param byteStride the byte stride of the data
 * @param componentCount the number of components per element
 * @param componentType the type of the component
 * @param count the number of values to enumerate
 * @param normalized whether the data is normalized
 * @param callback the callback function called for each group of component values
 */
export function EnumerateFloatValues(data, byteOffset, byteStride, componentCount, componentType, count, normalized, callback) {
    const oldValues = new Array(componentCount);
    const newValues = new Array(componentCount);
    if (data instanceof Array) {
        let offset = byteOffset / 4;
        const stride = byteStride / 4;
        for (let index = 0; index < count; index += componentCount) {
            for (let componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                oldValues[componentIndex] = newValues[componentIndex] = data[offset + componentIndex];
            }
            callback(newValues, index);
            for (let componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                if (oldValues[componentIndex] !== newValues[componentIndex]) {
                    data[offset + componentIndex] = newValues[componentIndex];
                }
            }
            offset += stride;
        }
    }
    else {
        const dataView = !ArrayBuffer.isView(data) ? new DataView(data) : new DataView(data.buffer, data.byteOffset, data.byteLength);
        const componentByteLength = GetTypeByteLength(componentType);
        for (let index = 0; index < count; index += componentCount) {
            for (let componentIndex = 0, componentByteOffset = byteOffset; componentIndex < componentCount; componentIndex++, componentByteOffset += componentByteLength) {
                oldValues[componentIndex] = newValues[componentIndex] = GetFloatValue(dataView, componentType, componentByteOffset, normalized);
            }
            callback(newValues, index);
            for (let componentIndex = 0, componentByteOffset = byteOffset; componentIndex < componentCount; componentIndex++, componentByteOffset += componentByteLength) {
                if (oldValues[componentIndex] !== newValues[componentIndex]) {
                    SetFloatValue(dataView, componentType, componentByteOffset, normalized, newValues[componentIndex]);
                }
            }
            byteOffset += byteStride;
        }
    }
}
/**
 * Gets the given data array as a float array. Float data is constructed if the data array cannot be returned directly.
 * @param data the input data array
 * @param size the number of components
 * @param type the component type
 * @param byteOffset the byte offset of the data
 * @param byteStride the byte stride of the data
 * @param normalized whether the data is normalized
 * @param totalVertices number of vertices in the buffer to take into account
 * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
 * @returns a float array containing vertex data
 */
export function GetFloatData(data, size, type, byteOffset, byteStride, normalized, totalVertices, forceCopy) {
    const tightlyPackedByteStride = size * GetTypeByteLength(type);
    const count = totalVertices * size;
    if (type !== 5126 || byteStride !== tightlyPackedByteStride) {
        const copy = new Float32Array(count);
        EnumerateFloatValues(data, byteOffset, byteStride, size, type, count, normalized, (values, index) => {
            for (let i = 0; i < size; i++) {
                copy[index + i] = values[i];
            }
        });
        return copy;
    }
    if (!(data instanceof Array || data instanceof Float32Array) || byteOffset !== 0 || data.length !== count) {
        if (data instanceof Array) {
            const offset = byteOffset / 4;
            return data.slice(offset, offset + count);
        }
        else if (ArrayBuffer.isView(data)) {
            const offset = data.byteOffset + byteOffset;
            if ((offset & 3) !== 0) {
                Logger.Warn("Float array must be aligned to 4-bytes border");
                forceCopy = true;
            }
            if (forceCopy) {
                return new Float32Array(data.buffer.slice(offset, offset + count * Float32Array.BYTES_PER_ELEMENT));
            }
            else {
                return new Float32Array(data.buffer, offset, count);
            }
        }
        else {
            return new Float32Array(data, byteOffset, count);
        }
    }
    if (forceCopy) {
        return data.slice();
    }
    return data;
}
/**
 * Gets the given data array as a typed array that matches the component type. If the data cannot be used directly, a copy is made to support the new typed array.
 * If the data is number[], byteOffset and byteStride must be a multiple of 4, as data will be treated like a list of floats.
 * @param data the input data array
 * @param size the number of components
 * @param type the component type
 * @param byteOffset the byte offset of the data
 * @param byteStride the byte stride of the data
 * @param totalVertices number of vertices in the buffer to take into account
 * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
 * @returns a typed array containing vertex data
 */
export function GetTypedArrayData(data, size, type, byteOffset, byteStride, totalVertices, forceCopy) {
    const typeByteLength = GetTypeByteLength(type);
    const constructor = GetTypedArrayConstructor(type);
    const count = totalVertices * size;
    // Handle number[]
    if (Array.isArray(data)) {
        if ((byteOffset & 3) !== 0 || (byteStride & 3) !== 0) {
            throw new Error("byteOffset and byteStride must be a multiple of 4 for number[] data.");
        }
        const offset = byteOffset / 4;
        const stride = byteStride / 4;
        const lastIndex = offset + (totalVertices - 1) * stride + size;
        if (lastIndex > data.length) {
            throw new Error("Last accessed index is out of bounds.");
        }
        if (stride < size) {
            throw new Error("Data stride cannot be smaller than the component size.");
        }
        if (stride !== size) {
            const copy = new constructor(count);
            EnumerateFloatValues(data, byteOffset, byteStride, size, type, count, false, (values, index) => {
                for (let i = 0; i < size; i++) {
                    copy[index + i] = values[i];
                }
            });
            return copy;
        }
        return new constructor(data.slice(offset, offset + count));
    }
    // Handle ArrayBuffer and ArrayBufferView
    let buffer;
    let adjustedByteOffset = byteOffset;
    if (ArrayBuffer.isView(data)) {
        buffer = data.buffer;
        adjustedByteOffset += data.byteOffset;
    }
    else {
        buffer = data;
    }
    const lastByteOffset = adjustedByteOffset + (totalVertices - 1) * byteStride + size * typeByteLength;
    if (lastByteOffset > buffer.byteLength) {
        throw new Error("Last accessed byte is out of bounds.");
    }
    const tightlyPackedByteStride = size * typeByteLength;
    if (byteStride < tightlyPackedByteStride) {
        throw new Error("Byte stride cannot be smaller than the component's byte size.");
    }
    if (byteStride !== tightlyPackedByteStride) {
        const copy = new constructor(count);
        const src = new Uint8Array(buffer, adjustedByteOffset);
        const dst = new Uint8Array(copy.buffer);
        const rowBytes = size * typeByteLength;
        for (let v = 0, s = 0, d = 0; v < totalVertices; v++, s += byteStride, d += rowBytes) {
            dst.set(src.subarray(s, s + rowBytes), d);
        }
        return copy;
    }
    if (typeByteLength !== 1 && (adjustedByteOffset & (typeByteLength - 1)) !== 0) {
        Logger.Warn("Array must be aligned to border of element size. Data will be copied.");
        forceCopy = true;
    }
    if (forceCopy) {
        return new constructor(buffer.slice(adjustedByteOffset, adjustedByteOffset + count * typeByteLength));
    }
    return new constructor(buffer, adjustedByteOffset, count);
}
/**
 * Copies the given data array to the given float array.
 * @param input the input data array
 * @param size the number of components
 * @param type the component type
 * @param byteOffset the byte offset of the data
 * @param byteStride the byte stride of the data
 * @param normalized whether the data is normalized
 * @param totalVertices number of vertices in the buffer to take into account
 * @param output the output float array
 */
export function CopyFloatData(input, size, type, byteOffset, byteStride, normalized, totalVertices, output) {
    const tightlyPackedByteStride = size * GetTypeByteLength(type);
    const count = totalVertices * size;
    if (output.length !== count) {
        throw new Error("Output length is not valid");
    }
    if (type !== 5126 || byteStride !== tightlyPackedByteStride) {
        EnumerateFloatValues(input, byteOffset, byteStride, size, type, count, normalized, (values, index) => {
            for (let i = 0; i < size; i++) {
                output[index + i] = values[i];
            }
        });
        return;
    }
    if (input instanceof Array) {
        const offset = byteOffset / 4;
        output.set(input, offset);
    }
    else if (ArrayBuffer.isView(input)) {
        const offset = input.byteOffset + byteOffset;
        if ((offset & 3) !== 0) {
            Logger.Warn("Float array must be aligned to 4-bytes border");
            output.set(new Float32Array(input.buffer.slice(offset, offset + count * Float32Array.BYTES_PER_ELEMENT)));
            return;
        }
        const floatData = new Float32Array(input.buffer, offset, count);
        output.set(floatData);
    }
    else {
        const floatData = new Float32Array(input, byteOffset, count);
        output.set(floatData);
    }
}
/**
 * Utility function to determine if an IndicesArray is an Uint32Array. If indices is an Array, determines whether at least one index is 32 bits.
 * @param indices The IndicesArray to check.
 * @param count The number of indices. Only used if indices is an Array.
 * @param start The offset to start at (default: 0). Only used if indices is an Array.
 * @param offset The offset to substract from the indices before testing (default: 0). Only used if indices is an Array.
 * @returns True if the indices use 32 bits
 */
export function AreIndices32Bits(indices, count, start = 0, offset = 0) {
    if (Array.isArray(indices)) {
        for (let index = 0; index < count; index++) {
            if (indices[start + index] - offset > 65535) {
                return true;
            }
        }
        return false;
    }
    return indices.BYTES_PER_ELEMENT === 4;
}
/**
 * Creates a typed array suitable for GPU buffer operations, as some engines require CPU buffer sizes to be aligned to specific boundaries (e.g., 4 bytes).
 * The use of non-aligned arrays still works but may result in a performance penalty.
 * @param type The type of the array. For instance, Float32Array or Uint8Array
 * @param elementCount The number of elements to store in the array
 * @returns The aligned typed array
 */
export function CreateAlignedTypedArray(type, elementCount) {
    let byteSize = elementCount * type.BYTES_PER_ELEMENT;
    if ((byteSize & 3) === 0) {
        return new type(elementCount);
    }
    byteSize = (byteSize + 3) & ~3;
    const backingBuffer = new ArrayBuffer(byteSize);
    return new type(backingBuffer, 0, elementCount);
}
/**
 * Gets a BufferSource from an ArrayBufferView, ensuring that the returned ArrayBuffer is not a SharedArrayBuffer.
 * If the input view's buffer is a SharedArrayBuffer, a new ArrayBuffer is created and the data is copied over.
 * @param view The input ArrayBufferView
 * @returns An ArrayBuffer containing the data from the view
 */
export function GetBlobBufferSource(view) {
    const buffer = view.buffer;
    if (buffer instanceof ArrayBuffer) {
        // Safely cast here because we know bytes is not a SharedArrayBuffer
        return view;
    }
    // We are dealing with a SharedArrayBuffer, so we need to create a new ArrayBuffer and copy the data over
    const unsharedBuffer = new ArrayBuffer(view.byteLength);
    const copyView = new Uint8Array(unsharedBuffer);
    copyView.set(new Uint8Array(buffer, view.byteOffset, view.byteLength));
    return unsharedBuffer;
}
//# sourceMappingURL=bufferUtils.js.map
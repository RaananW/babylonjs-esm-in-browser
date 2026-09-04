/** This file must only contain pure code and pure imports */
import { NativeDataStream } from "./nativeDataStream.js";
import { ThinNativeEngine } from "../thinNativeEngine.pure.js";
/**
 * Validated Native Data Stream
 */
export class ValidatedNativeDataStream extends NativeDataStream {
    constructor() {
        super();
    }
    writeUint32(value) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_UINT_32);
        super.writeUint32(value);
    }
    writeInt32(value) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_INT_32);
        super.writeInt32(value);
    }
    writeFloat32(value) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_FLOAT_32);
        super.writeFloat32(value);
    }
    writeUint32Array(values) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_UINT_32_ARRAY);
        super.writeUint32Array(values);
    }
    writeInt32Array(values) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_INT_32_ARRAY);
        super.writeInt32Array(values);
    }
    writeFloat32Array(values) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_FLOAT_32_ARRAY);
        super.writeFloat32Array(values);
    }
    writeNativeData(handle) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_NATIVE_DATA);
        super.writeNativeData(handle);
    }
    writeBoolean(value) {
        super.writeUint32(_native.NativeDataStream.VALIDATION_BOOLEAN);
        super.writeBoolean(value);
    }
}
let _Registered = false;
/**
 * Register side effects for validatedNativeDataStream.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterValidatedNativeDataStream() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinNativeEngine._createNativeDataStream = function () {
        if (_native.NativeDataStream.VALIDATION_ENABLED) {
            return new ValidatedNativeDataStream();
        }
        else {
            return new NativeDataStream();
        }
    };
}
//# sourceMappingURL=validatedNativeDataStream.pure.js.map
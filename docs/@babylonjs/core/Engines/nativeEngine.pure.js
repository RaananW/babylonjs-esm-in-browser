/** This file must only contain pure code and pure imports */
import { Engine } from "./engine.pure.js";
import { ThinNativeEngine } from "./thinNativeEngine.pure.js";
/** @internal */
export class NativeEngine extends Engine {
    /**
     * @internal
     * Will be overriden by the Thin Native engine implementation
     * No code should be placed here
     */
    _initializeNativeEngine(_adaptToDeviceRatio) { }
    /**
     * @internal
     */
    constructor(options = {}) {
        super(null, false, undefined, options.adaptToDeviceRatio);
        this._initializeNativeEngine(options.adaptToDeviceRatio ?? false);
    }
    /**
     * @internal
     */
    wrapWebGLTexture() {
        throw new Error("wrapWebGLTexture is not supported, use wrapNativeTexture instead.");
    }
    /**
     * @internal
     */
    updateWrappedWebGLTexture() {
        throw new Error("updateWrappedWebGLTexture is not supported, use updateWrappedNativeTexture instead.");
    }
    /**
     * @internal
     */
    _uploadImageToTexture(texture, image, _faceIndex = 0, _lod = 0) {
        throw new Error("_uploadArrayBufferViewToTexture not implemented.");
    }
}
/**
 * @internal
 * Applies the functionality of one or more base constructors to a derived constructor.
 */
let _Registered = false;
/**
 * Register side effects for nativeEngine.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterNativeEngine() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    function applyMixins(derivedCtor, constructors) {
        constructors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== "constructor") {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    // Apply the ThinNativeEngine mixins to the NativeEngine.
    applyMixins(NativeEngine, [ThinNativeEngine]);
}
//# sourceMappingURL=nativeEngine.pure.js.map
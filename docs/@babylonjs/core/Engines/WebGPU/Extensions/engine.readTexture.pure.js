/** This file must only contain pure code and pure imports */
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
let _Registered = false;
/**
 * Register side effects for enginesWebGPUExtensionsEngineReadTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineReadTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    ThinWebGPUEngine.prototype._readTexturePixels = function (texture, width, height, faceIndex = -1, level = 0, buffer = null, flushRenderer = true, noDataConversion = false, x = 0, y = 0) {
        const gpuTextureWrapper = texture._hardwareTexture;
        if (flushRenderer) {
            this.flushFramebuffer();
        }
        return this._textureHelper.readPixels(gpuTextureWrapper.underlyingResource, x, y, width, height, gpuTextureWrapper.format, faceIndex, level, buffer, noDataConversion);
    };
    ThinWebGPUEngine.prototype._readTexturePixelsSync = function () {
        // eslint-disable-next-line no-throw-literal
        throw "_readTexturePixelsSync is unsupported in WebGPU!";
    };
}
//# sourceMappingURL=engine.readTexture.pure.js.map
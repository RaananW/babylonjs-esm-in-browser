/** This file must only contain pure code and pure imports */
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
let _Registered = false;
/**
 * Register side effects for enginesWebGPUExtensionsEngineTexture2DArrayImageSource.
 * Adds AbstractEngine.updateTextureArrayLayerFromImageSource on the WebGPU engine.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineTexture2DArrayImageSource() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinWebGPUEngine.prototype.updateTextureArrayLayerFromImageSource = function (texture, source, layer, invertY = false, premultiplyAlpha = false) {
        const gpuTextureWrapper = texture._hardwareTexture;
        this._textureHelper.updateTexture(source, texture, texture.width, texture.height, 1, gpuTextureWrapper.format, layer, 0, invertY, premultiplyAlpha, 0, 0);
        if (texture.generateMipMaps) {
            this._generateMipmaps(texture, this._uploadEncoder);
        }
        texture.isReady = true;
    };
}
//# sourceMappingURL=engine.texture2DArrayImageSource.pure.js.map
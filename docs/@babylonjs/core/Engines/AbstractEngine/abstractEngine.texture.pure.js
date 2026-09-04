/** This file must only contain pure code and pure imports */
import { AbstractEngine } from "../abstractEngine.pure.js";
let _Registered = false;
/**
 * Register side effects for abstractEngineTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAbstractEngineTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    AbstractEngine.prototype.createDepthStencilTexture = function (size, options, rtWrapper) {
        if (options.isCube) {
            const width = size.width || size;
            return this._createDepthStencilCubeTexture(width, options);
        }
        else {
            return this._createDepthStencilTexture(size, options, rtWrapper);
        }
    };
}
//# sourceMappingURL=abstractEngine.texture.pure.js.map
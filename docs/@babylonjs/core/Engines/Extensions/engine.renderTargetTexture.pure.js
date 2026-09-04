/** This file must only contain pure code and pure imports */
import { ThinEngine } from "../../Engines/thinEngine.pure.js";
let _Registered = false;
/**
 * Register side effects for enginesExtensionsEngineRenderTargetTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesExtensionsEngineRenderTargetTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinEngine.prototype.setDepthStencilTexture = function (channel, uniform, texture, name) {
        if (channel === undefined) {
            return;
        }
        if (uniform) {
            this._boundUniforms[channel] = uniform;
        }
        if (!texture || !texture.depthStencilTexture) {
            this._setTexture(channel, null, undefined, undefined, name);
        }
        else {
            this._setTexture(channel, texture, false, true, name);
        }
    };
}
//# sourceMappingURL=engine.renderTargetTexture.pure.js.map
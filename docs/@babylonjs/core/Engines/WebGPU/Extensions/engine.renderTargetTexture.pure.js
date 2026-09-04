/** This file must only contain pure code and pure imports */
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
let _Registered = false;
/**
 * Register side effects for enginesWebGPUExtensionsEngineRenderTargetTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineRenderTargetTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinWebGPUEngine.prototype.setDepthStencilTexture = function (channel, uniform, texture, name) {
        if (!texture || !texture.depthStencilTexture) {
            this._setTexture(channel, null, undefined, undefined, name);
        }
        else {
            this._setTexture(channel, texture, false, true, name);
        }
    };
}
//# sourceMappingURL=engine.renderTargetTexture.pure.js.map
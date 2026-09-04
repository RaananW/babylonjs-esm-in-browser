import { ThinEngine } from "../../Engines/thinEngine.pure.js";

let _Registered = false;
/**
 * Register side effects for enginesExtensionsEngineAlpha.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesExtensionsEngineAlpha() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinEngine.prototype.setAlphaMode = function (mode, noDepthWriteChange = false, targetIndex = 0) {
        if (this._alphaMode[targetIndex] === mode) {
            if (!noDepthWriteChange) {
                // Make sure we still have the correct depth mask according to the alpha mode (a transparent material could have forced writting to the depth buffer, for instance)
                const depthMask = mode === 0;
                if (this.depthCullingState.depthMask !== depthMask) {
                    this.depthCullingState.depthMask = depthMask;
                }
            }
            return;
        }
        const alphaBlendDisabled = mode === 0;
        this._alphaState.setAlphaBlend(!alphaBlendDisabled, targetIndex);
        this._alphaState.setAlphaMode(mode, targetIndex);
        if (!noDepthWriteChange) {
            this.depthCullingState.depthMask = alphaBlendDisabled;
        }
        this._alphaMode[targetIndex] = mode;
    };
}
//# sourceMappingURL=engine.alpha.pure.js.map
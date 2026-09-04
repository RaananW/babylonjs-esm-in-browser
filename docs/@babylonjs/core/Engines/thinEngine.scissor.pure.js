/** This file must only contain pure code and pure imports */
import { ThinEngine } from "./thinEngine.pure.js";
let _Registered = false;
/**
 * Registers the WebGL scissor implementation on ThinEngine.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterThinEngineScissor() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinEngine.prototype.enableScissor = function (x, y, width, height) {
        const gl = this._gl;
        // Change state
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x, y, width, height);
    };
    ThinEngine.prototype.disableScissor = function () {
        const gl = this._gl;
        gl.disable(gl.SCISSOR_TEST);
    };
}
//# sourceMappingURL=thinEngine.scissor.pure.js.map
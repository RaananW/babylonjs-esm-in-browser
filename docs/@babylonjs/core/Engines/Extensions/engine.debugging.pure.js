import { AbstractEngine } from "../../Engines/abstractEngine.pure.js";
/** This file must only contain pure code and pure imports */
let _Registered = false;
/**
 * Register side effects for engineDebugging.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEngineDebugging() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    AbstractEngine.prototype._debugPushGroup = function (groupName) { };
    AbstractEngine.prototype._debugPopGroup = function () { };
    AbstractEngine.prototype._debugInsertMarker = function (text) { };
}
//# sourceMappingURL=engine.debugging.pure.js.map
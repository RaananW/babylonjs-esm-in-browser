/** This file must only contain pure code and pure imports */
import { DecalMapConfiguration } from "./material.decalMapConfiguration.pure.js";
import { StandardMaterial } from "./standardMaterial.pure.js";
let _Registered = false;
/**
 * Register side effects for standardMaterialDecalMap.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStandardMaterialDecalMap() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(StandardMaterial.prototype, "decalMap", {
        get: function () {
            if (!this._decalMap) {
                this._decalMap = new DecalMapConfiguration(this);
            }
            return this._decalMap;
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=standardMaterial.decalMap.pure.js.map
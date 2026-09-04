/** This file must only contain pure code and pure imports */
import { AbstractMesh } from "../Meshes/abstractMesh.pure.js";
let _Registered = false;
/**
 * Register side effects for abstractMeshDecalMap.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAbstractMeshDecalMap() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(AbstractMesh.prototype, "decalMap", {
        get: function () {
            return this._decalMap;
        },
        set: function (decalMap) {
            this._decalMap = decalMap;
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=abstractMesh.decalMap.pure.js.map
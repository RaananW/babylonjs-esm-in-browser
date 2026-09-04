/** This file must only contain pure code and pure imports */
import { Scene } from "../../scene.pure.js";
import { PerformanceViewerCollector } from "./performanceViewerCollector.js";
let _Registered = false;
/**
 * Register the getPerfCollector method on Scene.
 * @internal
 */
export function RegisterPerformanceViewerSceneExtension() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Scene.prototype.getPerfCollector = function () {
        if (!this._perfCollector) {
            this._perfCollector = new PerformanceViewerCollector(this);
        }
        return this._perfCollector;
    };
}
//# sourceMappingURL=performanceViewerSceneExtension.pure.js.map
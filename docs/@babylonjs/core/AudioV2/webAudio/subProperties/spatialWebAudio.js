import { _SpatialAudio } from "../../abstractAudio/subProperties/spatialAudio.js";
import { _SpatialWebAudioUpdaterComponent } from "../components/spatialWebAudioUpdaterComponent.js";
/** @internal */
export class _SpatialWebAudio extends _SpatialAudio {
    /** @internal */
    constructor(subGraph, autoUpdate, minUpdateTime) {
        super(subGraph);
        this._updaterComponent = new _SpatialWebAudioUpdaterComponent(this, autoUpdate, minUpdateTime);
    }
    /** @internal */
    get minUpdateTime() {
        return this._updaterComponent.minUpdateTime;
    }
    /** @internal */
    set minUpdateTime(value) {
        this._updaterComponent.minUpdateTime = value;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._updaterComponent.dispose();
        this._updaterComponent = null;
    }
}
//# sourceMappingURL=spatialWebAudio.js.map
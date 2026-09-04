import { PrecisionDate } from "../../../Misc/precisionDate.js";
/** @internal */
export class _SpatialWebAudioUpdaterComponent {
    /** @internal */
    constructor(parent, autoUpdate, minUpdateTime) {
        this._autoUpdate = true;
        this._lastUpdateTime = 0;
        /**
         * The minimum time in seconds between spatial audio updates. Defaults to `0`.
         * @internal
         */
        this.minUpdateTime = 0;
        if (!autoUpdate) {
            return;
        }
        this.minUpdateTime = minUpdateTime;
        const update = () => {
            if (!this._autoUpdate) {
                return;
            }
            let skipUpdate = false;
            if (0 < this.minUpdateTime) {
                const now = PrecisionDate.Now;
                if (this._lastUpdateTime && now - this._lastUpdateTime < this.minUpdateTime * 1000) {
                    skipUpdate = true;
                }
                this._lastUpdateTime = now;
            }
            if (!skipUpdate) {
                parent.update();
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
    /** @internal */
    dispose() {
        this._autoUpdate = false;
    }
}
//# sourceMappingURL=spatialWebAudioUpdaterComponent.js.map
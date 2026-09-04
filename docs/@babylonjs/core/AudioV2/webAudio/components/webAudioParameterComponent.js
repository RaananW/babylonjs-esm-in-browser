import { Logger } from "../../../Misc/logger.js";
import { _GetAudioParamCurveValues } from "../../audioUtils.js";
/**
 * Minimum duration in seconds for a ramp to be considered valid.
 *
 * If the duration is less than this value, the value will be set immediately instead of being ramped smoothly since
 * there is no perceptual difference for such short durations, so a ramp is not needed.
 */
const MinRampDuration = 0.000001;
let Warn = true;
/** @internal */
export class _WebAudioParameterComponent {
    /** @internal */
    constructor(engine, param) {
        this._rampEndTime = 0;
        this._engine = engine;
        this._param = param;
        this._targetValue = param.value;
    }
    /** @internal */
    get isRamping() {
        return this._engine.currentTime < this._rampEndTime;
    }
    /** @internal */
    get targetValue() {
        return this._targetValue;
    }
    set targetValue(value) {
        this.setTargetValue(value);
    }
    /** @internal */
    get value() {
        return this._param.value;
    }
    /** @internal */
    dispose() {
        this._param = null;
        this._engine = null;
    }
    /**
     * Sets the target value of the audio parameter with an optional ramping duration and shape.
     *
     * @internal
     */
    setTargetValue(value, options = null) {
        if (!Number.isFinite(value)) {
            Logger.Warn(`Attempted to set audio parameter to non-finite value: ${value}`);
            return;
        }
        this._param.cancelScheduledValues(0);
        const shape = typeof options?.shape === "string" ? options.shape : "linear" /* AudioParameterRampShape.Linear */;
        const startTime = this._engine.currentTime;
        if (shape === "none" /* AudioParameterRampShape.None */) {
            this._param.value = this._targetValue = value;
            this._rampEndTime = startTime;
            return;
        }
        let duration = typeof options?.duration === "number" ? Math.max(options.duration, this._engine.parameterRampDuration) : this._engine.parameterRampDuration;
        this._targetValue = value;
        if ((duration = Math.max(this._engine.parameterRampDuration, duration)) < MinRampDuration) {
            this._param.setValueAtTime(value, startTime);
            return;
        }
        try {
            this._param.setValueCurveAtTime(_GetAudioParamCurveValues(shape, Number.isFinite(this._param.value) ? this._param.value : 0, value), startTime, duration);
            this._rampEndTime = startTime + duration;
        }
        catch (e) {
            if (Warn) {
                Logger.Warn(`Audio parameter ramping failed: ${e.message}`);
                Warn = false;
            }
        }
    }
}
//# sourceMappingURL=webAudioParameterComponent.js.map
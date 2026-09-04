import { type Nullable } from "../../../types.js";
import { type IAudioParameterRampOptions } from "../../audioParameter.js";
import { type _WebAudioEngine } from "../webAudioEngine.js";
/** @internal */
export declare class _WebAudioParameterComponent {
    private _rampEndTime;
    private _engine;
    private _param;
    private _targetValue;
    /** @internal */
    constructor(engine: _WebAudioEngine, param: AudioParam);
    /** @internal */
    get isRamping(): boolean;
    /** @internal */
    get targetValue(): number;
    set targetValue(value: number);
    /** @internal */
    get value(): number;
    /** @internal */
    dispose(): void;
    /**
     * Sets the target value of the audio parameter with an optional ramping duration and shape.
     *
     * @internal
     */
    setTargetValue(value: number, options?: Nullable<Partial<IAudioParameterRampOptions>>): void;
}

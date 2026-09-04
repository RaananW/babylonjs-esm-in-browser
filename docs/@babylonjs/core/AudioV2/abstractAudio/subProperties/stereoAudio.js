import { _StereoAudioDefaults, AbstractStereoAudio } from "../../abstractAudio/subProperties/abstractStereoAudio.js";
import { _SetStereoAudioProperty } from "../subNodes/stereoAudioSubNode.js";
/** @internal */
export class _StereoAudio extends AbstractStereoAudio {
    /** @internal */
    constructor(subGraph) {
        super();
        this._pan = _StereoAudioDefaults.pan;
        this._subGraph = subGraph;
    }
    /** @internal */
    get pan() {
        return this._pan;
    }
    set pan(value) {
        this._pan = value;
        _SetStereoAudioProperty(this._subGraph, "pan", value);
    }
}
//# sourceMappingURL=stereoAudio.js.map
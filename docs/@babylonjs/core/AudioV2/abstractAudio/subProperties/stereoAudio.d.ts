import { AbstractStereoAudio } from "../../abstractAudio/subProperties/abstractStereoAudio.js";
import { type _AbstractAudioSubGraph } from "../subNodes/abstractAudioSubGraph.js";
/** @internal */
export declare class _StereoAudio extends AbstractStereoAudio {
    private _pan;
    private _subGraph;
    /** @internal */
    constructor(subGraph: _AbstractAudioSubGraph);
    /** @internal */
    get pan(): number;
    set pan(value: number);
}

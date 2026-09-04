import { _AbstractAudioSubNode } from "../../abstractAudio/subNodes/abstractAudioSubNode.js";
import { _StereoAudioDefaults } from "../../abstractAudio/subProperties/abstractStereoAudio.js";
/** @internal */
export class _StereoAudioSubNode extends _AbstractAudioSubNode {
    constructor(engine) {
        super("Stereo" /* AudioSubNode.STEREO */, engine);
    }
    /** @internal */
    setOptions(options) {
        this.pan = options.stereoPan ?? _StereoAudioDefaults.pan;
    }
}
/** @internal */
export function _GetStereoAudioSubNode(subGraph) {
    return subGraph.getSubNode("Stereo" /* AudioSubNode.STEREO */);
}
/** @internal */
export function _SetStereoAudioProperty(subGraph, property, value) {
    subGraph.callOnSubNode("Stereo" /* AudioSubNode.STEREO */, (node) => {
        node[property] = value;
    });
}
//# sourceMappingURL=stereoAudioSubNode.js.map
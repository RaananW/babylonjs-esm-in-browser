import { _AbstractAudioSubNode } from "../subNodes/abstractAudioSubNode.js";
/** @internal */
export const _VolumeAudioDefaults = {
    volume: 1,
};
/** @internal */
export class _VolumeAudioSubNode extends _AbstractAudioSubNode {
    constructor(engine) {
        super("Volume" /* AudioSubNode.VOLUME */, engine);
    }
    /** @internal */
    setOptions(options) {
        this.setVolume(options.volume ?? _VolumeAudioDefaults.volume, { shape: "none" /* AudioParameterRampShape.None */ });
    }
}
/** @internal */
export function _GetVolumeAudioSubNode(subGraph) {
    return subGraph.getSubNode("Volume" /* AudioSubNode.VOLUME */);
}
/** @internal */
export function _GetVolumeAudioProperty(subGraph, property) {
    return _GetVolumeAudioSubNode(subGraph)?.[property] ?? _VolumeAudioDefaults[property];
}
//# sourceMappingURL=volumeAudioSubNode.js.map
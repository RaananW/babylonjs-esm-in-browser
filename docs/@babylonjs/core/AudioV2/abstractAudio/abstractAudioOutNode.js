import { AbstractNamedAudioNode } from "./abstractAudioNode.js";
import { _GetVolumeAudioProperty, _GetVolumeAudioSubNode } from "./subNodes/volumeAudioSubNode.js";
import { _AudioAnalyzer } from "./subProperties/audioAnalyzer.js";
/**
 * Abstract class representing and audio output node with an analyzer and volume control.
 */
export class AbstractAudioOutNode extends AbstractNamedAudioNode {
    constructor(name, engine, nodeType) {
        super(name, engine, nodeType);
        this._analyzer = null;
    }
    /**
     * The audio analyzer features.
     */
    get analyzer() {
        return this._analyzer ?? (this._analyzer = new _AudioAnalyzer(this._subGraph));
    }
    /**
     * The audio output volume.
     */
    get volume() {
        return _GetVolumeAudioProperty(this._subGraph, "volume");
    }
    set volume(value) {
        // The volume subnode is created on initialization and should always exist.
        const node = _GetVolumeAudioSubNode(this._subGraph);
        if (!node) {
            throw new Error("No volume subnode");
        }
        node.volume = value;
    }
    /**
     * Releases associated resources.
     */
    dispose() {
        super.dispose();
        this._analyzer?.dispose();
        this._analyzer = null;
        this._subGraph.dispose();
    }
    /**
     * Sets the audio output volume with optional ramping.
     * If the duration is 0 then the volume is set immediately, otherwise it is ramped to the new value over the given duration using the given shape.
     * If a ramp is already in progress then the volume is not set and an error is thrown.
     * @param value The value to set the volume to.
     * @param options The options to use for ramping the volume change.
     */
    setVolume(value, options = null) {
        const node = _GetVolumeAudioSubNode(this._subGraph);
        if (!node) {
            throw new Error("No volume subnode");
        }
        node.setVolume(value, options);
    }
}
//# sourceMappingURL=abstractAudioOutNode.js.map
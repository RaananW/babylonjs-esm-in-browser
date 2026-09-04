import { _VolumeAudioSubNode } from "../../abstractAudio/subNodes/volumeAudioSubNode.js";
import { _WebAudioParameterComponent } from "../components/webAudioParameterComponent.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateVolumeAudioSubNodeAsync(engine) {
    return new _VolumeWebAudioSubNode(engine);
}
/** @internal */
export class _VolumeWebAudioSubNode extends _VolumeAudioSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        const gainNode = (this.node = new GainNode(engine._audioContext));
        this._volume = new _WebAudioParameterComponent(engine, gainNode.gain);
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._volume.dispose();
    }
    /** @internal */
    get volume() {
        return this._volume.value;
    }
    /** @internal */
    set volume(value) {
        this.setVolume(value);
    }
    /** @internal */
    get _inNode() {
        return this.node;
    }
    /** @internal */
    get _outNode() {
        return this.node;
    }
    /** @internal */
    setVolume(value, options = null) {
        this._volume.setTargetValue(value, options);
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this.node.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this.node.disconnect(node._inNode);
        }
        return true;
    }
    /** @internal */
    getClassName() {
        return "_VolumeWebAudioSubNode";
    }
}
//# sourceMappingURL=volumeWebAudioSubNode.js.map
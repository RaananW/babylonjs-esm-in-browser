import { _MainAudioOut } from "../abstractAudio/mainAudioOut.js";
import { _WebAudioParameterComponent } from "./components/webAudioParameterComponent.js";
/** @internal */
export class _WebAudioMainOut extends _MainAudioOut {
    /** @internal */
    constructor(engine) {
        super(engine);
        this._setGainNode(new GainNode(engine._audioContext));
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._volume.dispose();
        this._gainNode.disconnect();
        this._destinationNode.disconnect();
    }
    /** @internal */
    get _inNode() {
        return this._gainNode;
    }
    set _inNode(value) {
        if (this._gainNode === value) {
            return;
        }
        this._setGainNode(value);
    }
    /** @internal */
    get volume() {
        return this._volume.targetValue;
    }
    /** @internal */
    set volume(value) {
        this._volume.targetValue = value;
    }
    get _destinationNode() {
        return this.engine._audioDestination;
    }
    /** @internal */
    getClassName() {
        return "_WebAudioMainOut";
    }
    /** @internal */
    setVolume(value, options = null) {
        this._volume.setTargetValue(value, options);
    }
    _setGainNode(gainNode) {
        if (this._gainNode === gainNode) {
            return;
        }
        this._gainNode?.disconnect();
        gainNode.connect(this._destinationNode);
        this._volume = new _WebAudioParameterComponent(this.engine, gainNode.gain);
        this._gainNode = gainNode;
    }
}
//# sourceMappingURL=webAudioMainOut.js.map
import { Observable } from "../../Misc/observable.js";
import { AbstractAudioNode } from "./abstractAudioNode.js";
/** @internal */
export class _AbstractSoundInstance extends AbstractAudioNode {
    constructor(sound) {
        super(sound.engine, 2 /* AudioNodeType.HAS_OUTPUTS */);
        this._state = 1 /* SoundState.Stopped */;
        /** Observable triggered when the sound instance's playback ends */
        this.onEndedObservable = new Observable();
        /** Observable triggered if the sound instance encounters an error and can not be played */
        this.onErrorObservable = new Observable();
        /** Observable triggered when the sound instance's state changes */
        this.onStateChangedObservable = new Observable();
        this._sound = sound;
    }
    /** The playback state of the sound instance */
    get state() {
        return this._state;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this.stop();
        this.onEndedObservable.clear();
        this.onStateChangedObservable.clear();
    }
    _setState(value) {
        if (this._state === value) {
            return;
        }
        this._state = value;
        this.onStateChangedObservable.notifyObservers(this);
        if (this._state === 1 /* SoundState.Stopped */) {
            this.onEndedObservable.notifyObservers(this);
        }
    }
}
//# sourceMappingURL=abstractSoundInstance.js.map
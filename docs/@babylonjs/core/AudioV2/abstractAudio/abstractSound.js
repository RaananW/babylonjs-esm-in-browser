import { Observable } from "../../Misc/observable.js";
import { AbstractSoundSource } from "./abstractSoundSource.js";
/**
 * Abstract class representing a sound in the audio engine.
 */
export class AbstractSound extends AbstractSoundSource {
    constructor(name, engine, options) {
        super(name, engine, options, 3 /* AudioNodeType.HAS_INPUTS_AND_OUTPUTS */); // Inputs are for instances.
        this._newestInstance = null;
        this._privateInstances = new Set();
        this._state = 1 /* SoundState.Stopped */;
        this._instances = this._privateInstances;
        /**
         * Observable for when the sound stops playing.
         */
        this.onEndedObservable = new Observable();
        this._onInstanceEnded = (instance) => {
            if (this._newestInstance === instance) {
                this._newestInstance = null;
            }
            instance.onStateChangedObservable.removeCallback(this._onInstanceStateChanged);
            this._privateInstances.delete(instance);
            if (this._instances.size === 0) {
                this._state = 1 /* SoundState.Stopped */;
                this.onEndedObservable.notifyObservers(this);
            }
            instance.dispose();
            this.engine._onSoundPlaybackStateChanged();
        };
        this._onInstanceStateChanged = (_instance) => {
            this.engine._onSoundPlaybackStateChanged();
        };
    }
    /**
     * The number of active instances of the sound that are currently playing.
     */
    get activeInstancesCount() {
        return this._instances.size;
    }
    /**
     * Whether the sound should start playing automatically. Defaults to `false`.
     */
    get autoplay() {
        return this._options.autoplay;
    }
    /**
     * The current playback time of the sound, in seconds.
     */
    get currentTime() {
        const instance = this._getNewestInstance();
        return instance ? instance.currentTime : 0;
    }
    set currentTime(value) {
        this.startOffset = value;
        const instance = this._getNewestInstance();
        if (instance) {
            instance.currentTime = value;
        }
    }
    /**
     * Whether the sound should loop. Defaults to `false`.
     */
    get loop() {
        return this._options.loop;
    }
    set loop(value) {
        this._options.loop = value;
        const it = this._instances.values();
        for (let instance = it.next(); !instance.done; instance = it.next()) {
            instance.value.loop = value;
        }
    }
    /**
     * The maximum number of instances that can play at the same time. Defaults to `Infinity`.
     */
    get maxInstances() {
        return this._options.maxInstances;
    }
    set maxInstances(value) {
        this._options.maxInstances = value;
    }
    /**
     * The time within the sound buffer to start playing at, in seconds. Defaults to `0`.
     */
    get startOffset() {
        return this._options.startOffset;
    }
    set startOffset(value) {
        this._options.startOffset = value;
    }
    /**
     * The state of the sound.
     */
    get state() {
        return this._state;
    }
    /**
     * Releases associated resources.
     */
    dispose() {
        super.dispose();
        this.stop();
        this._newestInstance = null;
        this._privateInstances.clear();
        this.onEndedObservable.clear();
    }
    /**
     * Pauses the sound.
     */
    pause() {
        const it = this._instances.values();
        for (let next = it.next(); !next.done; next = it.next()) {
            next.value.pause();
        }
        this._state = 5 /* SoundState.Paused */;
        this.engine._onSoundPlaybackStateChanged();
    }
    /**
     * Resumes the sound.
     * @param options The options to use when resuming the sound. Only options explicitly set here override the paused instance's current options; unset options keep their paused values so playback continues from where it was paused.
     */
    resume(options) {
        if (this._state !== 5 /* SoundState.Paused */) {
            return;
        }
        const it = this._instances.values();
        for (let next = it.next(); !next.done; next = it.next()) {
            next.value.resume(options);
        }
        this._state = 3 /* SoundState.Started */;
        this.engine._onSoundPlaybackStateChanged();
    }
    _beforePlay(instance) {
        if (this.state === 5 /* SoundState.Paused */ && this._instances.size > 0) {
            this.resume();
            return;
        }
        instance.onEndedObservable.addOnce(this._onInstanceEnded);
        instance.onStateChangedObservable.add(this._onInstanceStateChanged);
        this._privateInstances.add(instance);
        this._newestInstance = instance;
    }
    _afterPlay(instance) {
        this._state = instance.state;
        this.engine._onSoundPlaybackStateChanged();
    }
    _getNewestInstance() {
        if (this._instances.size === 0) {
            return null;
        }
        if (!this._newestInstance) {
            const it = this._instances.values();
            for (let next = it.next(); !next.done; next = it.next()) {
                this._newestInstance = next.value;
            }
        }
        return this._newestInstance;
    }
    _setState(state) {
        this._state = state;
    }
    _stopExcessInstances() {
        if (this.maxInstances < Infinity) {
            const startedInstances = Array.from(this._instances).filter((instance) => instance.state === 3 /* SoundState.Started */);
            const numberOfInstancesToStop = startedInstances.length - this.maxInstances;
            for (let i = 0; i < numberOfInstancesToStop; i++) {
                startedInstances[i].stop();
            }
        }
    }
}
//# sourceMappingURL=abstractSound.js.map
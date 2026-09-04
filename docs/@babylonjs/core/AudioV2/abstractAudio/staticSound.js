import { AbstractSound } from "./abstractSound.js";
/**
 * Abstract class representing a static sound.
 *
 * A static sound has a sound buffer that is loaded into memory all at once. This allows it to have more capabilities
 * than a streaming sound, such as loop points and playback rate changes, but it also means that the sound must be
 * fully downloaded and decoded before it can be played, which may take a long time for sounds with long durations.
 *
 * To prevent downloading and decoding a sound multiple times, a sound's buffer can be shared with other sounds.
 * See {@link CreateSoundBufferAsync}, {@link StaticSoundBuffer} and {@link StaticSound.buffer} for more information.
 *
 * Static sounds are created by the {@link CreateSoundAsync} function.
 */
export class StaticSound extends AbstractSound {
    constructor(name, engine, options) {
        super(name, engine, options);
    }
    /**
     * The amount of time to play the sound for, in seconds. Defaults to `0`.
     * - If less than or equal to `0`, the sound plays for its full duration.
     */
    get duration() {
        return this._options.duration;
    }
    set duration(value) {
        this._options.duration = value;
    }
    /**
     * The start of the loop range, in seconds. Defaults to `0`.
     * - If less than or equal to `0`, the loop starts at the beginning of the sound.
     */
    get loopStart() {
        return this._options.loopStart;
    }
    set loopStart(value) {
        this._options.loopStart = value;
        const it = this._instances.values();
        for (let instance = it.next(); !instance.done; instance = it.next()) {
            instance.value.loopStart = value;
        }
    }
    /**
     * The end of the loop range, in seconds. Defaults to `0`.
     * - If less than or equal to `0`, the loop plays for the sound's full duration.
     */
    get loopEnd() {
        return this._options.loopEnd;
    }
    set loopEnd(value) {
        this._options.loopEnd = value;
        const it = this._instances.values();
        for (let instance = it.next(); !instance.done; instance = it.next()) {
            instance.value.loopEnd = value;
        }
    }
    /**
     * The pitch of the sound, in cents. Defaults to `0`.
     * - Gets combined with {@link playbackRate} to determine the final pitch.
     */
    get pitch() {
        return this._options.pitch;
    }
    set pitch(value) {
        this._options.pitch = value;
        const it = this._instances.values();
        for (let instance = it.next(); !instance.done; instance = it.next()) {
            instance.value.pitch = value;
        }
    }
    /**
     * The playback rate of the sound. Defaults to `1`.
     * - Gets combined with {@link pitch} to determine the final playback rate.
     */
    get playbackRate() {
        return this._options.playbackRate;
    }
    set playbackRate(value) {
        this._options.playbackRate = value;
        const it = this._instances.values();
        for (let instance = it.next(); !instance.done; instance = it.next()) {
            instance.value.playbackRate = value;
        }
    }
    /**
     * Plays the sound.
     * - Triggers `onEndedObservable` if played for the full duration and the `loop` option is not set.
     * @param options The options to use when playing the sound. Options set here override the sound's options.
     */
    play(options = {}) {
        if (this.state === 5 /* SoundState.Paused */) {
            this.resume(options);
            return;
        }
        options.duration ?? (options.duration = this.duration);
        options.loop ?? (options.loop = this.loop);
        options.loopStart ?? (options.loopStart = this.loopStart);
        options.loopEnd ?? (options.loopEnd = this.loopEnd);
        options.startOffset ?? (options.startOffset = this.startOffset);
        options.volume ?? (options.volume = 1);
        options.waitTime ?? (options.waitTime = 0);
        const instance = this._createInstance();
        this._beforePlay(instance);
        instance.play(options);
        this._afterPlay(instance);
        this._stopExcessInstances();
    }
    /**
     * Resumes the sound.
     * - Only options explicitly set here override the paused instance's current options; unset options keep their paused values so playback continues from where it was paused.
     * @param options The options to use when resuming the sound.
     */
    resume(options) {
        super.resume(options);
    }
    /**
     * Stops the sound.
     * - Triggers `onEndedObservable` if the sound is playing.
     * @param options - The options to use when stopping the sound.
     */
    stop(options = {}) {
        if (options.waitTime && 0 < options.waitTime) {
            this._setState(0 /* SoundState.Stopping */);
        }
        else {
            this._setState(1 /* SoundState.Stopped */);
        }
        if (!this._instances) {
            return;
        }
        for (const instance of Array.from(this._instances)) {
            instance.stop(options);
        }
    }
}
//# sourceMappingURL=staticSound.js.map
import { AbstractSound } from "./abstractSound.js";
/**
 * Abstract class representing a streaming sound.
 *
 * A streaming sound has a sound buffer that is loaded into memory in chunks as it is played. This allows it to be played
 * more quickly than a static sound, but it also means that it cannot have loop points or playback rate changes.
 *
 * Due to the way streaming sounds are typically implemented, there can be a significant delay when attempting to play
 * a streaming sound for the first time. To prevent this delay, it is recommended to preload instances of the sound
 * using the {@link IStreamingSoundStoredOptions.preloadCount} options, or the {@link preloadInstanceAsync} and
 * {@link preloadInstancesAsync} methods before calling the `play` method.
 *
 * Streaming sounds are created by the {@link CreateStreamingSoundAsync} function.
 */
export class StreamingSound extends AbstractSound {
    constructor(name, engine, options) {
        super(name, engine, options);
        this._preloadedInstances = new Array();
    }
    /**
     * The number of instances to preload. Defaults to `1`.
     */
    get preloadCount() {
        return this._options.preloadCount ?? 1;
    }
    /**
     * Returns the number of instances that have been preloaded.
     */
    get preloadCompletedCount() {
        return this._preloadedInstances.length;
    }
    /**
     * Preloads an instance of the sound.
     * @returns A promise that resolves when the instance is preloaded.
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    preloadInstanceAsync() {
        const instance = this._createInstance();
        this._addPreloadedInstance(instance);
        return instance.preloadedPromise;
    }
    /**
     * Preloads the given number of instances of the sound.
     * @param count - The number of instances to preload.
     * @returns A promise that resolves when all instances are preloaded.
     */
    async preloadInstancesAsync(count) {
        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.preloadInstanceAsync();
        }
        await Promise.all(this._preloadedInstances.map(async (instance) => await instance.preloadedPromise));
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
        let instance;
        if (this.preloadCompletedCount > 0) {
            instance = this._preloadedInstances[0];
            instance.startOffset = this.startOffset;
            this._removePreloadedInstance(instance);
        }
        else {
            instance = this._createInstance();
        }
        const onInstanceStateChanged = () => {
            if (instance.state === 3 /* SoundState.Started */) {
                this._stopExcessInstances();
                instance.onStateChangedObservable.removeCallback(onInstanceStateChanged);
            }
        };
        instance.onStateChangedObservable.add(onInstanceStateChanged);
        options.startOffset ?? (options.startOffset = this.startOffset);
        options.loop ?? (options.loop = this.loop);
        options.volume ?? (options.volume = 1);
        this._beforePlay(instance);
        instance.play(options);
        this._afterPlay(instance);
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
     */
    stop() {
        this._setState(1 /* SoundState.Stopped */);
        if (!this._instances) {
            return;
        }
        for (const instance of Array.from(this._instances)) {
            instance.stop();
        }
    }
    _addPreloadedInstance(instance) {
        if (!this._preloadedInstances.includes(instance)) {
            this._preloadedInstances.push(instance);
        }
    }
    _removePreloadedInstance(instance) {
        const index = this._preloadedInstances.indexOf(instance);
        if (index !== -1) {
            this._preloadedInstances.splice(index, 1);
        }
    }
}
//# sourceMappingURL=streamingSound.js.map
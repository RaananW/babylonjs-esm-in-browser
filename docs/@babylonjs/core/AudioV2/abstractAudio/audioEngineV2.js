import { Observable } from "../../Misc/observable.js";
const Instances = [];
/**
 * Observable that notifies when a new v2 audio engine instance has been created.
 * - Fires after the engine has been fully constructed and initialized (e.g. from {@link CreateAudioEngineAsync}),
 *   so subclass state (audio context, listener, etc.) is guaranteed to be available to observers.
 */
export const OnAudioEngineV2CreatedObservable = new Observable();
/**
 * Gets the most recently created v2 audio engine.
 * @returns The most recently created v2 audio engine.
 */
export function LastCreatedAudioEngine() {
    if (Instances.length === 0) {
        return null;
    }
    return Instances[Instances.length - 1];
}
/**
 * Abstract base class for v2 audio engines.
 *
 * A v2 audio engine based on the WebAudio API can be created with the {@link CreateAudioEngineAsync} function.
 */
export class AudioEngineV2 {
    /**
     * The list of v2 audio engines that have been created and not yet disposed.
     * - Engines are added on construction and removed on {@link AudioEngineV2.dispose}.
     */
    static get Instances() {
        return Instances;
    }
    /**
     * Observable that notifies when a top-level audio node (sound, sound source, bus, or main bus) is added to this engine.
     */
    get onNodeAddedObservable() {
        return this._onNodeAddedObservable;
    }
    /**
     * Observable that notifies when a top-level audio node (sound, sound source, bus, or main bus) is removed from this engine.
     */
    get onNodeRemovedObservable() {
        return this._onNodeRemovedObservable;
    }
    /**
     * Observable that notifies when this engine is disposed.
     * - Fires from {@link AudioEngineV2.dispose} after the engine has been removed from {@link AudioEngineV2.Instances}.
     */
    get onDisposeObservable() {
        return this._onDisposeObservable;
    }
    constructor(options) {
        /** Not owned, but all items should be in `_nodes` container, too, which is owned. */
        this._mainBuses = new Set();
        this._sounds = new Set();
        this._soundsArray = null;
        /** Owned top-level sound and bus nodes. */
        this._nodes = new Set();
        this._defaultMainBus = null;
        this._parameterRampDuration = 0.01;
        this._onNodeAddedObservable = new Observable();
        this._onNodeRemovedObservable = new Observable();
        this._onDisposeObservable = new Observable();
        Instances.push(this);
        if (typeof options.parameterRampDuration === "number") {
            this.parameterRampDuration = options.parameterRampDuration;
        }
        // Intentionally do NOT notify {@link OnAudioEngineV2CreatedObservable} here:
        // - This base constructor runs before subclass fields (audio context, listener, ...) are initialized
        //   and before any async {@link CreateAudioEngineAsync}-style setup completes, so observers would
        //   see a partially constructed engine.
        // - Engine factory functions (e.g. {@link CreateAudioEngineAsync}) call `notifyObservers` themselves
        //   once the engine is fully constructed and initialized.
    }
    /**
     * The default main bus that will be used for audio buses and sounds if their `outBus` option is not set.
     * @see {@link IAudioBusOptions.outBus}
     * @see {@link IAbstractSoundOptions.outBus}
     */
    get defaultMainBus() {
        if (this._mainBuses.size === 0) {
            return null;
        }
        if (!this._defaultMainBus) {
            this._defaultMainBus = Array.from(this._mainBuses)[0];
        }
        return this._defaultMainBus;
    }
    /**
     * The smoothing duration to use when changing audio parameters, in seconds. Defaults to `0.01` (10 milliseconds).
     */
    get parameterRampDuration() {
        return this._parameterRampDuration;
    }
    set parameterRampDuration(value) {
        this._parameterRampDuration = Math.max(0, value);
    }
    /**
     * The list of static and streaming sounds created by the audio engine.
     */
    get sounds() {
        if (!this._soundsArray) {
            this._soundsArray = Array.from(this._sounds);
        }
        return this._soundsArray;
    }
    /**
     * The list of top-level audio nodes (sounds, sound sources, buses, main buses) owned by the audio engine.
     */
    get nodes() {
        return this._nodes;
    }
    /**
     * Releases associated resources.
     */
    dispose() {
        if (Instances.includes(this)) {
            Instances.splice(Instances.indexOf(this), 1);
        }
        const nodeIt = this._nodes.values();
        for (let next = nodeIt.next(); !next.done; next = nodeIt.next()) {
            next.value.dispose();
        }
        this._mainBuses.clear();
        this._nodes.clear();
        this._sounds.clear();
        this._disposeSoundsArray();
        this._defaultMainBus = null;
        this._onDisposeObservable.notifyObservers(this);
        this._onDisposeObservable.clear();
        this._onNodeAddedObservable.clear();
        this._onNodeRemovedObservable.clear();
    }
    /**
     * Unlocks the audio engine if it is locked.
     * - Note that the returned promise may already be resolved if the audio engine is already unlocked.
     * @returns A promise that is resolved when the audio engine is unlocked.
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    unlockAsync() {
        return this.resumeAsync();
    }
    _addMainBus(mainBus) {
        this._mainBuses.add(mainBus);
        this._addNode(mainBus);
    }
    _removeMainBus(mainBus) {
        this._mainBuses.delete(mainBus);
        this._defaultMainBus = null;
        this._removeNode(mainBus);
    }
    _addNode(node) {
        this._nodes.add(node);
        this._onNodeAddedObservable.notifyObservers(node);
    }
    _removeNode(node) {
        this._nodes.delete(node);
        this._onNodeRemovedObservable.notifyObservers(node);
    }
    _addSound(sound) {
        this._disposeSoundsArray();
        this._sounds.add(sound);
        this._addNode(sound);
    }
    _removeSound(sound) {
        this._disposeSoundsArray();
        this._sounds.delete(sound);
        this._removeNode(sound);
    }
    /**
     * Called when any sound's playback state changes (started, stopped, paused, resumed).
     * Override in platform-specific implementations to react to sound playback state changes.
     * @internal
     */
    _onSoundPlaybackStateChanged() {
        // No-op base implementation.
    }
    _disposeSoundsArray() {
        if (this._soundsArray) {
            this._soundsArray.length = 0;
            this._soundsArray = null;
        }
    }
}
/**
 * @internal
 * @param engine - The given audio engine. If `null` then the last created audio engine is used.
 * @returns the given audio engine or the last created audio engine.
 * @throws An error if the resulting engine is `null`.
 */
export function _GetAudioEngine(engine) {
    if (!engine) {
        engine = LastCreatedAudioEngine();
    }
    if (engine) {
        return engine;
    }
    throw new Error("No audio engine.");
}
/**
 * Creates a new audio bus.
 * @param name - The name of the audio bus.
 * @param options - The options to use when creating the audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created audio bus.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateAudioBusAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createBusAsync(name, options);
}
/**
 * Creates a new main audio bus.
 * @param name - The name of the main audio bus.
 * @param options - The options to use when creating the main audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created main audio bus.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateMainAudioBusAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createMainBusAsync(name, options);
}
/**
 * Creates a new microphone sound source.
 * @param name - The name of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateMicrophoneSoundSourceAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createMicrophoneSoundSourceAsync(name, options);
}
/**
 * Creates a new static sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the static sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateSoundAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createSoundAsync(name, source, options);
}
/**
 * Creates a new static sound buffer.
 * @param source - The source of the sound buffer.
 * @param options - The options for the static sound buffer.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound buffer.
 */
export async function CreateSoundBufferAsync(source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return await engine.createSoundBufferAsync(source, options);
}
/**
 * Creates a new sound source.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateSoundSourceAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createSoundSourceAsync(name, source, options);
}
/**
 * Creates a new streaming sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the streaming sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created streaming sound.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateStreamingSoundAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createStreamingSoundAsync(name, source, options);
}
//# sourceMappingURL=audioEngineV2.js.map
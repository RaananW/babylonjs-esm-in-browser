import { Observable } from "../../Misc/observable.js";
import { AudioEngineV2, OnAudioEngineV2CreatedObservable } from "../abstractAudio/audioEngineV2.js";
import { _HasSpatialAudioListenerOptions } from "../abstractAudio/subProperties/abstractSpatialAudioListener.js";
import { _CreateSpatialAudioListener } from "./subProperties/spatialWebAudioListener.js";
import { _WebAudioMainOut } from "./webAudioMainOut.js";
import { _WebAudioUnmuteUI } from "./webAudioUnmuteUI.js";
/**
 * Creates a new v2 audio engine that uses the WebAudio API.
 * @param options - The options for creating the audio engine.
 * @returns A promise that resolves with the created audio engine.
 */
export async function CreateAudioEngineAsync(options = {}) {
    const engine = new _WebAudioEngine(options);
    await engine._initAsync(options);
    OnAudioEngineV2CreatedObservable.notifyObservers(engine);
    return engine;
}
const FormatMimeTypes = {
    aac: "audio/aac",
    ac3: "audio/ac3",
    flac: "audio/flac",
    m4a: "audio/mp4",
    mp3: 'audio/mpeg; codecs="mp3"',
    mp4: "audio/mp4",
    ogg: 'audio/ogg; codecs="vorbis"',
    wav: "audio/wav",
    webm: 'audio/webm; codecs="vorbis"',
};
/** @internal */
export class _WebAudioEngine extends AudioEngineV2 {
    /** @internal */
    constructor(options = {}) {
        super(options);
        this._audioContextStarted = false;
        this._destinationNode = null;
        this._invalidFormats = new Set();
        this._isUpdating = false;
        this._listener = null;
        this._listenerAutoUpdate = true;
        this._listenerMinUpdateTime = 0;
        this._pauseCalled = false;
        this._resumeOnInteraction = true;
        this._resumeOnPause = true;
        this._resumeOnPauseRetryInterval = 1000;
        this._resumeOnPauseTimerId = null;
        this._resumePromise = null;
        this._silentHtmlAudio = null;
        this._unmuteUI = null;
        this._updateObservable = null;
        this._validFormats = new Set();
        this._volume = 1;
        /** @internal */
        this._isUsingOfflineAudioContext = false;
        /** @internal */
        this.isReadyPromise = new Promise((resolve) => {
            this._resolveIsReadyPromise = resolve;
        });
        /** @internal */
        this.stateChangedObservable = new Observable();
        /** @internal */
        this.userGestureObservable = new Observable();
        this._initAudioContextAsync = async () => {
            this._audioContext.addEventListener("statechange", this._onAudioContextStateChange);
            this._mainOut = new _WebAudioMainOut(this);
            this._mainOut.volume = this._volume;
            await this.createMainBusAsync("default");
        };
        this._onAudioContextStateChange = () => {
            if (this.state === "running") {
                clearInterval(this._resumeOnPauseTimerId);
                this._audioContextStarted = true;
                this._resumePromise = null;
            }
            if (this.state === "suspended" || this.state === "interrupted") {
                if (this._audioContextStarted && this._resumeOnPause && !this._pauseCalled) {
                    clearInterval(this._resumeOnPauseTimerId);
                    this._resumeOnPauseTimerId = setInterval(() => {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        this.resumeAsync();
                    }, this._resumeOnPauseRetryInterval);
                }
            }
            this.stateChangedObservable.notifyObservers(this.state);
        };
        this._onUserGestureAsync = async () => {
            if (this._resumeOnInteraction) {
                await this._audioContext.resume();
            }
            // On iOS the ringer switch must be turned on for WebAudio to play.
            // This gets WebAudio to play with the ringer switch turned off by playing an HTMLAudioElement.
            // The element is activated during a user gesture so it can be played/paused programmatically
            // later. It is immediately paused to avoid triggering iOS Safari's "now playing" detection,
            // which throttles the page to 30 FPS.
            if (!this._silentHtmlAudio) {
                this._silentHtmlAudio = document.createElement("audio");
                const audio = this._silentHtmlAudio;
                audio.controls = false;
                audio.preload = "auto";
                audio.loop = true;
                // Wave data for 0.0001 seconds of silence.
                audio.src = "data:audio/wav;base64,UklGRjAAAABXQVZFZm10IBAAAAABAAEAgLsAAAB3AQACABAAZGF0YQwAAAAAAAEA/v8CAP//AQA=";
                // Play briefly to activate the element, then immediately pause.
                // The rejection handler is intentionally empty — play() can reject if the
                // browser requires a more specific user gesture; this is non-fatal since
                // the audio context unlock is the primary goal, and the silent element is
                // only a supplementary iOS ringer-switch workaround.
                // eslint-disable-next-line github/no-then
                audio.play().then(() => audio.pause(), () => { });
            }
            this.userGestureObservable.notifyObservers();
        };
        this._startUpdating = () => {
            if (this._isUpdating) {
                return;
            }
            this._isUpdating = true;
            if (this.state === "running") {
                this._update();
            }
            else {
                const callback = () => {
                    if (this.state === "running") {
                        this._update();
                        this.stateChangedObservable.removeCallback(callback);
                    }
                };
                this.stateChangedObservable.add(callback);
            }
        };
        this._update = () => {
            if (this._updateObservable?.hasObservers()) {
                this._updateObservable.notifyObservers();
                requestAnimationFrame(this._update);
            }
            else {
                this._isUpdating = false;
            }
        };
        if (typeof options.listenerAutoUpdate === "boolean") {
            this._listenerAutoUpdate = options.listenerAutoUpdate;
        }
        if (typeof options.listenerMinUpdateTime === "number") {
            this._listenerMinUpdateTime = options.listenerMinUpdateTime;
        }
        this._volume = options.volume ?? 1;
        if (options.audioContext) {
            this._isUsingOfflineAudioContext = options.audioContext instanceof OfflineAudioContext;
            this._audioContext = options.audioContext;
        }
        else {
            this._audioContext = new AudioContext();
        }
        if (!options.disableDefaultUI) {
            this._unmuteUI = new _WebAudioUnmuteUI(this, options.defaultUIParentElement);
        }
    }
    /** @internal */
    async _initAsync(options) {
        this._resumeOnInteraction = typeof options.resumeOnInteraction === "boolean" ? options.resumeOnInteraction : true;
        this._resumeOnPause = typeof options.resumeOnPause === "boolean" ? options.resumeOnPause : true;
        this._resumeOnPauseRetryInterval = options.resumeOnPauseRetryInterval ?? 1000;
        document.addEventListener("click", this._onUserGestureAsync);
        await this._initAudioContextAsync();
        if (_HasSpatialAudioListenerOptions(options)) {
            this._listener = _CreateSpatialAudioListener(this, this._listenerAutoUpdate, this._listenerMinUpdateTime);
            this._listener.setOptions(options);
        }
        this._resolveIsReadyPromise();
    }
    /** @internal */
    get currentTime() {
        return this._audioContext.currentTime ?? 0;
    }
    /** @internal */
    get _inNode() {
        return this._audioContext.destination;
    }
    /** @internal */
    get mainOut() {
        return this._mainOut;
    }
    /** @internal */
    get listener() {
        return this._listener ?? (this._listener = _CreateSpatialAudioListener(this, this._listenerAutoUpdate, this._listenerMinUpdateTime));
    }
    /** @internal */
    get state() {
        // Always return "running" for OfflineAudioContext so sound `play` calls work while the context is suspended.
        return this._isUsingOfflineAudioContext ? "running" : this._audioContext.state;
    }
    /** @internal */
    get volume() {
        return this._volume;
    }
    /** @internal */
    set volume(value) {
        if (this._volume === value) {
            return;
        }
        this._volume = value;
        if (this._mainOut) {
            this._mainOut.volume = value;
        }
    }
    /**
     * This property should only be used by the legacy audio engine.
     * @internal
     * */
    get _audioDestination() {
        return this._destinationNode ? this._destinationNode : (this._destinationNode = this._audioContext.destination);
    }
    set _audioDestination(value) {
        this._destinationNode = value;
    }
    /**
     * This property should only be used by the legacy audio engine.
     * @internal
     */
    get _unmuteUIEnabled() {
        return this._unmuteUI ? this._unmuteUI.enabled : false;
    }
    set _unmuteUIEnabled(value) {
        if (this._unmuteUI) {
            this._unmuteUI.enabled = value;
        }
    }
    /** @internal */
    async createBusAsync(name, options = {}) {
        const module = await import("./webAudioBus.js");
        const bus = new module._WebAudioBus(name, this, options);
        await bus._initAsync(options);
        return bus;
    }
    /** @internal */
    async createMainBusAsync(name, options = {}) {
        const module = await import("./webAudioMainBus.js");
        const bus = new module._WebAudioMainBus(name, this);
        await bus._initAsync(options);
        return bus;
    }
    /** @internal */
    async createMicrophoneSoundSourceAsync(name, options) {
        let mediaStream;
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        catch (e) {
            throw new Error("Unable to access microphone: " + e, { cause: e });
        }
        return await this.createSoundSourceAsync(name, new MediaStreamAudioSourceNode(this._audioContext, { mediaStream }), {
            outBusAutoDefault: false,
            mediaStreamSinkEnabled: false,
            stopMediaStreamTracksOnDispose: true,
            ...options,
        });
    }
    /** @internal */
    async createSoundAsync(name, source, options = {}) {
        const module = await import("./webAudioStaticSound.js");
        const sound = new module._WebAudioStaticSound(name, this, options);
        await sound._initAsync(source, options);
        return sound;
    }
    /** @internal */
    async createSoundBufferAsync(source, options = {}) {
        const module = await import("./webAudioStaticSound.js");
        const soundBuffer = new module._WebAudioStaticSoundBuffer(this);
        await soundBuffer._initAsync(source, options);
        return soundBuffer;
    }
    /** @internal */
    async createSoundSourceAsync(name, source, options = {}) {
        const module = await import("./webAudioSoundSource.js");
        const soundSource = new module._WebAudioSoundSource(name, source, this, options);
        await soundSource._initAsync(options);
        return soundSource;
    }
    /** @internal */
    async createStreamingSoundAsync(name, source, options = {}) {
        const module = await import("./webAudioStreamingSound.js");
        const sound = new module._WebAudioStreamingSound(name, this, options);
        await sound._initAsync(source, options);
        return sound;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._listener?.dispose();
        this._listener = null;
        // Note that OfflineAudioContext does not have a `close` method.
        if (this._audioContext.state !== "closed" && !this._isUsingOfflineAudioContext) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._audioContext.close();
        }
        document.removeEventListener("click", this._onUserGestureAsync);
        this._audioContext.removeEventListener("statechange", this._onAudioContextStateChange);
        this._silentHtmlAudio?.remove();
        this._updateObservable?.clear();
        this._updateObservable = null;
        this._unmuteUI?.dispose();
        this._unmuteUI = null;
        this.stateChangedObservable.clear();
    }
    /** @internal */
    flagInvalidFormat(format) {
        this._invalidFormats.add(format);
    }
    /** @internal */
    isFormatValid(format) {
        if (this._validFormats.has(format)) {
            return true;
        }
        if (this._invalidFormats.has(format)) {
            return false;
        }
        const mimeType = FormatMimeTypes[format];
        if (mimeType === undefined) {
            return false;
        }
        const audio = new Audio();
        if (audio.canPlayType(mimeType) === "") {
            this._invalidFormats.add(format);
            return false;
        }
        this._validFormats.add(format);
        return true;
    }
    /** @internal */
    async pauseAsync() {
        await this._audioContext.suspend();
        this._pauseCalled = true;
    }
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    resumeAsync() {
        this._pauseCalled = false;
        if (this._resumePromise) {
            return this._resumePromise;
        }
        this._resumePromise = this._audioContext.resume();
        this.stateChangedObservable.notifyObservers(this.state);
        return this._resumePromise;
    }
    /** @internal */
    setVolume(value, options = null) {
        if (this._mainOut) {
            this._mainOut.setVolume(value, options);
        }
        else {
            throw new Error("Main output not initialized yet.");
        }
    }
    /** @internal */
    _addMainBus(mainBus) {
        super._addMainBus(mainBus);
    }
    /** @internal */
    _removeMainBus(mainBus) {
        super._removeMainBus(mainBus);
    }
    /** @internal */
    _addNode(node) {
        super._addNode(node);
    }
    /** @internal */
    _removeNode(node) {
        super._removeNode(node);
    }
    /** @internal */
    _addSound(sound) {
        super._addSound(sound);
    }
    /** @internal */
    _removeSound(sound) {
        super._removeSound(sound);
    }
    /** @internal */
    _onSoundPlaybackStateChanged() {
        if (!this._silentHtmlAudio) {
            return;
        }
        const hasActiveSounds = this.sounds.some((s) => s.state === 3 /* SoundState.Started */ || s.state === 2 /* SoundState.Starting */ || s.state === 0 /* SoundState.Stopping */);
        if (hasActiveSounds && this._silentHtmlAudio.paused) {
            // Resume silent audio for iOS ringer switch workaround while sounds are playing.
            // Errors are safe to ignore — the silent audio element is a workaround, not a
            // user-facing sound, so a rejected play (e.g. missing user gesture) is harmless.
            // eslint-disable-next-line github/no-then
            void this._silentHtmlAudio.play().catch(() => { });
        }
        else if (!hasActiveSounds && !this._silentHtmlAudio.paused) {
            // Pause silent audio when no sounds are playing to avoid triggering iOS Safari's
            // audio playback detection, which causes FPS throttling and shows a blue audio icon.
            this._silentHtmlAudio.pause();
        }
    }
    /** @internal */
    _addUpdateObserver(callback) {
        if (!this._updateObservable) {
            this._updateObservable = new Observable();
        }
        this._updateObservable.add(callback);
        this._startUpdating();
    }
    _removeUpdateObserver(callback) {
        if (this._updateObservable) {
            this._updateObservable.removeCallback(callback);
        }
    }
}
//# sourceMappingURL=webAudioEngine.js.map
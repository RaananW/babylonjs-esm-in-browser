import { Logger } from "../../Misc/logger.js";
import { Tools } from "../../Misc/tools.pure.js";
import { StreamingSound } from "../abstractAudio/streamingSound.js";
import { _StreamingSoundInstance } from "../abstractAudio/streamingSoundInstance.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _CleanUrl, _GetUrlForStreaming } from "../audioUtils.js";
import { WebRequest } from "../../Misc/webRequest.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioStreamingSound extends StreamingSound {
    /** @internal */
    constructor(name, engine, options) {
        super(name, engine, options);
        this._stereo = null;
        this._options = {
            autoplay: options.autoplay ?? false,
            loop: options.loop ?? false,
            maxInstances: options.maxInstances ?? Infinity,
            preloadCount: options.preloadCount ?? 1,
            startOffset: options.startOffset ?? 0,
        };
        this._subGraph = new _WebAudioStreamingSound._SubGraph(this);
    }
    /** @internal */
    async _initAsync(source, options) {
        const audioContext = this.engine._audioContext;
        if (!(audioContext instanceof AudioContext)) {
            throw new Error("Unsupported audio context type.");
        }
        this._audioContext = audioContext;
        this._source = source;
        if (options.outBus) {
            this.outBus = options.outBus;
        }
        else if (options.outBusAutoDefault !== false) {
            await this.engine.isReadyPromise;
            this.outBus = this.engine.defaultMainBus;
        }
        await this._subGraph.initAsync(options);
        if (_HasSpatialAudioOptions(options)) {
            this._initSpatialProperty();
        }
        if (this.preloadCount) {
            await this.preloadInstancesAsync(this.preloadCount);
        }
        if (options.autoplay) {
            this.play(options);
        }
        this.engine._addSound(this);
    }
    /** @internal */
    get _inNode() {
        return this._subGraph._inNode;
    }
    /** @internal */
    get _outNode() {
        return this._subGraph._outNode;
    }
    /** @internal */
    get stereo() {
        return this._stereo ?? (this._stereo = new _StereoAudio(this._subGraph));
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._stereo = null;
        this._subGraph.dispose();
        this.engine._removeSound(this);
    }
    /** @internal */
    getClassName() {
        return "_WebAudioStreamingSound";
    }
    _createInstance() {
        return new _WebAudioStreamingSoundInstance(this, this._options);
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this._outNode?.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this._outNode?.disconnect(node._inNode);
        }
        return true;
    }
    _createSpatialProperty(autoUpdate, minUpdateTime) {
        return new _SpatialWebAudio(this._subGraph, autoUpdate, minUpdateTime);
    }
    _getOptions() {
        return this._options;
    }
}
_WebAudioStreamingSound._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
};
/** @internal */
class _WebAudioStreamingSoundInstance extends _StreamingSoundInstance {
    constructor(sound, options) {
        super(sound);
        this._currentTimeChangedWhilePaused = false;
        this._enginePlayTime = Infinity;
        this._enginePauseTime = 0;
        this._isReady = false;
        this._isReadyPromise = new Promise((resolve, reject) => {
            this._resolveIsReadyPromise = resolve;
            this._rejectIsReadyPromise = reject;
        });
        this._onCanPlayThrough = () => {
            this._isReady = true;
            this._resolveIsReadyPromise(this._mediaElement);
            this.onReadyObservable.notifyObservers(this);
        };
        this._onEnded = () => {
            this._setState(1 /* SoundState.Stopped */);
        };
        this._onError = (reason) => {
            this._setState(4 /* SoundState.FailedToStart */);
            this.onErrorObservable.notifyObservers(reason);
            this._rejectIsReadyPromise(reason);
            this.dispose();
        };
        this._onEngineStateChanged = () => {
            if (this.engine.state !== "running") {
                return;
            }
            if (this._options.loop && this.state === 2 /* SoundState.Starting */) {
                this.play();
            }
            this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
        };
        this._onUserGesture = () => {
            this.play();
        };
        this._options = options;
        this._volumeNode = new GainNode(sound._audioContext);
        if (typeof sound._source === "string") {
            this._initFromUrl(sound._source);
        }
        else if (Array.isArray(sound._source)) {
            this._initFromUrls(sound._source);
        }
        else if (sound._source instanceof HTMLMediaElement) {
            this._initFromMediaElement(sound._source);
        }
        else {
            throw new Error(`Invalid streaming sound source (${sound._source}).`);
        }
    }
    /** @internal */
    get currentTime() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return 0;
        }
        const timeSinceLastStart = this._state === 5 /* SoundState.Paused */ ? 0 : this.engine.currentTime - this._enginePlayTime;
        return this._enginePauseTime + timeSinceLastStart + this._options.startOffset;
    }
    set currentTime(value) {
        const restart = this._state === 2 /* SoundState.Starting */ || this._state === 3 /* SoundState.Started */;
        if (restart) {
            this._mediaElement.pause();
            this._state = 1 /* SoundState.Stopped */;
        }
        // Seeking sets an absolute position that is fully described by `startOffset`, so any playback time accumulated
        // across previous pause/resume cycles must be cleared. Otherwise the stale value leaks into the `currentTime`
        // getter and the next `pause()` calculation, offsetting them by the total paused duration.
        this._enginePauseTime = 0;
        this._options.startOffset = value;
        if (restart) {
            this.play({ startOffset: value });
        }
        else if (this._state === 5 /* SoundState.Paused */) {
            this._currentTimeChangedWhilePaused = true;
        }
    }
    get _outNode() {
        return this._volumeNode;
    }
    /** @internal */
    set loop(value) {
        this._options.loop = value;
        this._mediaElement.loop = value;
    }
    /** @internal */
    get startTime() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return 0;
        }
        return this._enginePlayTime;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this.stop();
        this._sourceNode?.disconnect(this._volumeNode);
        this._sourceNode = null;
        this._mediaElement.removeEventListener("error", this._onError);
        this._mediaElement.removeEventListener("ended", this._onEnded);
        this._mediaElement.removeEventListener("canplaythrough", this._onCanPlayThrough);
        for (const source of Array.from(this._mediaElement.children)) {
            this._mediaElement.removeChild(source);
        }
        this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
        this.engine.userGestureObservable.removeCallback(this._onUserGesture);
    }
    /** @internal */
    play(options = {}) {
        if (this._state === 3 /* SoundState.Started */) {
            return;
        }
        if (options.loop !== undefined) {
            this._options.loop = options.loop;
        }
        this._mediaElement.loop = this._options.loop;
        let startOffset = options.startOffset;
        if (this._currentTimeChangedWhilePaused) {
            startOffset = this._options.startOffset;
            this._currentTimeChangedWhilePaused = false;
        }
        else if (this._state === 5 /* SoundState.Paused */) {
            startOffset = this.currentTime;
        }
        if (startOffset && startOffset > 0) {
            this._mediaElement.currentTime = startOffset;
        }
        // Only override the volume when explicitly provided so resuming a paused instance keeps its current volume.
        if (options.volume !== undefined) {
            this._volumeNode.gain.value = options.volume;
        }
        this._play();
    }
    /** @internal */
    pause() {
        if (this._state !== 2 /* SoundState.Starting */ && this._state !== 3 /* SoundState.Started */) {
            return;
        }
        this._setState(5 /* SoundState.Paused */);
        this._enginePauseTime += this.engine.currentTime - this._enginePlayTime;
        this._mediaElement.pause();
    }
    /** @internal */
    resume(options = {}) {
        if (this._state === 5 /* SoundState.Paused */) {
            this.play(options);
        }
        else if (this._currentTimeChangedWhilePaused) {
            this.play(options);
        }
    }
    /** @internal */
    stop() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return;
        }
        this._stop();
    }
    /** @internal */
    getClassName() {
        return "_WebAudioStreamingSoundInstance";
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the sound's subgraph.
        if (node instanceof _WebAudioStreamingSound && node._inNode) {
            this._outNode?.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node instanceof _WebAudioStreamingSound && node._inNode) {
            this._outNode?.disconnect(node._inNode);
        }
        return true;
    }
    _initFromMediaElement(mediaElement) {
        Tools.SetCorsBehavior(mediaElement.currentSrc, mediaElement);
        mediaElement.controls = false;
        mediaElement.loop = this._options.loop;
        mediaElement.preload = "auto";
        mediaElement.addEventListener("canplaythrough", this._onCanPlayThrough, { once: true });
        mediaElement.addEventListener("ended", this._onEnded, { once: true });
        mediaElement.addEventListener("error", this._onError, { once: true });
        mediaElement.load();
        this._sourceNode = new MediaElementAudioSourceNode(this._sound._audioContext, { mediaElement: mediaElement });
        this._sourceNode.connect(this._volumeNode);
        if (!this._connect(this._sound)) {
            throw new Error("Connect failed");
        }
        this._mediaElement = mediaElement;
    }
    _initFromUrl(url) {
        // Apply any WebRequest URL modifiers (but do NOT download the content — the <audio> element streams natively).
        // Custom headers cannot be forwarded to HTMLMediaElement; _GetUrlForStreaming logs a warning if any are present.
        const resolvedUrl = WebRequest.IsCustomRequestAvailable ? _GetUrlForStreaming(_CleanUrl(url)) : _CleanUrl(url);
        const audio = new Audio(resolvedUrl);
        this._initFromMediaElement(audio);
    }
    _initFromUrls(urls) {
        const audio = new Audio();
        // Apply any WebRequest URL modifiers to each candidate URL (but do NOT download the content —
        // the <audio> element picks the first compatible format and streams natively).
        // Custom headers cannot be forwarded to HTMLMediaElement; _GetUrlForStreaming logs a warning if any are present.
        for (const url of urls) {
            const source = document.createElement("source");
            source.src = WebRequest.IsCustomRequestAvailable ? _GetUrlForStreaming(_CleanUrl(url)) : _CleanUrl(url);
            audio.appendChild(source);
        }
        this._initFromMediaElement(audio);
    }
    _play() {
        this._setState(2 /* SoundState.Starting */);
        if (!this._isReady) {
            this._playWhenReady();
            return;
        }
        if (this._state !== 2 /* SoundState.Starting */) {
            return;
        }
        if (this.engine.state === "running") {
            const result = this._mediaElement.play();
            this._enginePlayTime = this.engine.currentTime;
            this._setState(3 /* SoundState.Started */);
            // It's possible that the play() method fails on Safari, even if the audio engine's state is "running".
            // This occurs when the audio context is paused by the system and resumed automatically by the audio engine
            // without a user interaction (e.g. when the Vision Pro exits and reenters immersive mode).
            // eslint-disable-next-line github/no-then
            result.catch(() => {
                this._setState(4 /* SoundState.FailedToStart */);
                if (this._options.loop) {
                    this.engine.userGestureObservable.addOnce(this._onUserGesture);
                }
            });
        }
        else if (this._options.loop) {
            this.engine.stateChangedObservable.add(this._onEngineStateChanged);
        }
        else {
            this.stop();
            this._setState(4 /* SoundState.FailedToStart */);
        }
    }
    _playWhenReady() {
        this._isReadyPromise
            // eslint-disable-next-line github/no-then
            .then(() => {
            this._play();
        })
            // eslint-disable-next-line github/no-then
            .catch(() => {
            Logger.Error("Streaming sound instance failed to play");
            this._setState(4 /* SoundState.FailedToStart */);
        });
    }
    _stop() {
        this._mediaElement.pause();
        this._onEnded();
        this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
    }
}
//# sourceMappingURL=webAudioStreamingSound.js.map
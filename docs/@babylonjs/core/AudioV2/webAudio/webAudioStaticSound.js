import { StaticSound, } from "../abstractAudio/staticSound.js";
import { StaticSoundBuffer } from "../abstractAudio/staticSoundBuffer.js";
import { _StaticSoundInstance } from "../abstractAudio/staticSoundInstance.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _CleanUrl, _FileExtensionRegex, _LoadArrayBufferFromUrlAsync } from "../audioUtils.js";
import { _WebAudioParameterComponent } from "./components/webAudioParameterComponent.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioStaticSound extends StaticSound {
    /** @internal */
    constructor(name, engine, options) {
        super(name, engine, options);
        this._stereo = null;
        this._options = {
            autoplay: options.autoplay ?? false,
            duration: options.duration ?? 0,
            loop: options.loop ?? false,
            loopEnd: options.loopEnd ?? 0,
            loopStart: options.loopStart ?? 0,
            maxInstances: options.maxInstances ?? Infinity,
            pitch: options.pitch ?? 0,
            playbackRate: options.playbackRate ?? 1,
            startOffset: options.startOffset ?? 0,
        };
        this._subGraph = new _WebAudioStaticSound._SubGraph(this);
    }
    /** @internal */
    async _initAsync(source, options) {
        this._audioContext = this.engine._audioContext;
        if (source instanceof _WebAudioStaticSoundBuffer) {
            this._buffer = source;
        }
        else if (typeof source === "string" || Array.isArray(source) || source instanceof ArrayBuffer || source instanceof AudioBuffer) {
            this._buffer = (await this.engine.createSoundBufferAsync(source, options));
        }
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
        if (options.autoplay) {
            this.play();
        }
        this.engine._addSound(this);
    }
    /** @internal */
    get buffer() {
        return this._buffer;
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
    async cloneAsync(options = null) {
        const clone = await this.engine.createSoundAsync(this.name, options?.cloneBuffer ? this.buffer.clone() : this.buffer, this._options);
        clone.outBus = options?.outBus ? options.outBus : this.outBus;
        return clone;
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
        return "_WebAudioStaticSound";
    }
    _createInstance() {
        return new _WebAudioStaticSoundInstance(this, this._options);
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
_WebAudioStaticSound._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
};
/** @internal */
export class _WebAudioStaticSoundBuffer extends StaticSoundBuffer {
    /** @internal */
    constructor(engine) {
        super(engine);
    }
    async _initAsync(source, options) {
        if (source instanceof AudioBuffer) {
            this._audioBuffer = source;
        }
        else if (typeof source === "string") {
            await this._initFromUrlAsync(source);
        }
        else if (Array.isArray(source)) {
            await this._initFromUrlsAsync(source, options.skipCodecCheck ?? false);
        }
        else if (source instanceof ArrayBuffer) {
            await this._initFromArrayBufferAsync(source);
        }
    }
    /** @internal */
    get channelCount() {
        return this._audioBuffer.numberOfChannels;
    }
    /** @internal */
    get duration() {
        return this._audioBuffer.duration;
    }
    /** @internal */
    get length() {
        return this._audioBuffer.length;
    }
    /** @internal */
    get sampleRate() {
        return this._audioBuffer.sampleRate;
    }
    /** @internal */
    clone(options = null) {
        const audioBuffer = new AudioBuffer({
            length: this._audioBuffer.length,
            numberOfChannels: this._audioBuffer.numberOfChannels,
            sampleRate: this._audioBuffer.sampleRate,
        });
        for (let i = 0; i < this._audioBuffer.numberOfChannels; i++) {
            audioBuffer.copyToChannel(this._audioBuffer.getChannelData(i), i);
        }
        const buffer = new _WebAudioStaticSoundBuffer(this.engine);
        buffer._audioBuffer = audioBuffer;
        buffer.name = options?.name ? options.name : this.name;
        return buffer;
    }
    async _initFromArrayBufferAsync(arrayBuffer) {
        this._audioBuffer = await this.engine._audioContext.decodeAudioData(arrayBuffer);
    }
    async _initFromUrlAsync(url) {
        url = _CleanUrl(url);
        const { data } = await _LoadArrayBufferFromUrlAsync(url);
        await this._initFromArrayBufferAsync(data);
    }
    async _initFromUrlsAsync(urls, skipCodecCheck) {
        for (const url of urls) {
            if (skipCodecCheck) {
                // eslint-disable-next-line no-await-in-loop
                await this._initFromUrlAsync(url);
            }
            else {
                const matches = url.match(_FileExtensionRegex);
                const format = matches?.at(1);
                if (format && this.engine.isFormatValid(format)) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await this._initFromUrlAsync(url);
                    }
                    catch {
                        if (format && 0 < format.length) {
                            this.engine.flagInvalidFormat(format);
                        }
                    }
                }
            }
            if (this._audioBuffer) {
                break;
            }
        }
    }
}
/** @internal */
class _WebAudioStaticSoundInstance extends _StaticSoundInstance {
    constructor(sound, options) {
        super(sound);
        this._enginePlayTime = 0;
        this._enginePauseTime = 0;
        this._isConnected = false;
        this._pitch = null;
        this._playbackRate = null;
        this._sourceNode = null;
        this._onEnded = () => {
            this._enginePlayTime = 0;
            if (this._state !== 5 /* SoundState.Paused */) {
                this.onEndedObservable.notifyObservers(this);
            }
            this._deinitSourceNode();
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
        this._options = options;
        this._volumeNode = new GainNode(sound._audioContext);
        this._initSourceNode();
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._pitch?.dispose();
        this._playbackRate?.dispose();
        this.stop();
        this._deinitSourceNode();
        this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
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
            // Stop source node without sending `onEndedObservable` so instance's `dispose` function is not called.
            const sourceNode = this._sourceNode;
            this._deinitSourceNode();
            sourceNode?.stop();
            this._state = 1 /* SoundState.Stopped */;
        }
        // Seeking sets an absolute position that is fully described by `startOffset`, so any playback time accumulated
        // across previous pause/resume cycles must be cleared. Otherwise the stale value leaks into the `currentTime`
        // getter and the next `pause()` calculation, offsetting them by the total paused duration.
        this._enginePauseTime = 0;
        this._options.startOffset = value;
        if (restart) {
            this.play();
        }
    }
    get _outNode() {
        return this._volumeNode;
    }
    /** @internal */
    set loop(value) {
        this._options.loop = value;
        if (this._sourceNode) {
            this._sourceNode.loop = value;
        }
    }
    /** @internal */
    set loopStart(value) {
        this._options.loopStart = value;
        if (this._sourceNode) {
            this._sourceNode.loopStart = value;
        }
    }
    /** @internal */
    set loopEnd(value) {
        this._options.loopEnd = value;
        if (this._sourceNode) {
            this._sourceNode.loopEnd = value;
        }
    }
    /** @internal */
    set pitch(value) {
        this._pitch?.setTargetValue(value);
    }
    /** @internal */
    set playbackRate(value) {
        this._playbackRate?.setTargetValue(value);
    }
    /** @internal */
    get startTime() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return 0;
        }
        return this._enginePlayTime;
    }
    /** @internal */
    getClassName() {
        return "_WebAudioStaticSoundInstance";
    }
    /** @internal */
    play(options = {}) {
        if (this._state === 3 /* SoundState.Started */) {
            return;
        }
        if (options.duration !== undefined) {
            this._options.duration = options.duration;
        }
        if (options.loop !== undefined) {
            this._options.loop = options.loop;
        }
        if (options.loopStart !== undefined) {
            this._options.loopStart = options.loopStart;
        }
        if (options.loopEnd !== undefined) {
            this._options.loopEnd = options.loopEnd;
        }
        if (options.startOffset !== undefined) {
            this._options.startOffset = options.startOffset;
        }
        let startOffset = this._options.startOffset;
        if (this._state === 5 /* SoundState.Paused */) {
            const duration = this._sound.buffer.duration;
            const elapsed = this._enginePauseTime;
            if (this._options.loop) {
                // Web Audio only loops over `[loopStart, loopEnd)` when they describe a valid sub-range; otherwise it
                // loops over the whole buffer. Mirror that here (matching the `AudioBufferSourceNode` playback algorithm)
                // to compute the correct resume position inside the loop region.
                let loopStart = 0;
                let loopEnd = duration;
                if (this._options.loopStart >= 0 && this._options.loopEnd > 0 && this._options.loopStart < this._options.loopEnd) {
                    loopStart = this._options.loopStart;
                    loopEnd = Math.min(this._options.loopEnd, duration);
                }
                // Time spent before the playback position first reaches `loopEnd` and wraps back to `loopStart`.
                const timeToLoopEnd = loopEnd - startOffset;
                if (elapsed < timeToLoopEnd) {
                    startOffset += elapsed;
                }
                else {
                    startOffset = loopStart + ((elapsed - timeToLoopEnd) % (loopEnd - loopStart));
                }
            }
            else {
                startOffset += elapsed;
                startOffset %= duration;
            }
        }
        this._enginePlayTime = this.engine.currentTime + (options.waitTime ?? 0);
        // Only override the volume when explicitly provided so resuming a paused instance keeps its current volume.
        if (options.volume !== undefined) {
            this._volumeNode.gain.value = options.volume;
        }
        this._initSourceNode();
        if (this.engine.state === "running") {
            this._setState(3 /* SoundState.Started */);
            this._sourceNode?.start(this._enginePlayTime, startOffset, this._options.duration > 0 ? this._options.duration : undefined);
        }
        else if (this._options.loop) {
            this._setState(2 /* SoundState.Starting */);
            this.engine.stateChangedObservable.add(this._onEngineStateChanged);
        }
    }
    /** @internal */
    pause() {
        if (this._state !== 3 /* SoundState.Started */ && this._state !== 2 /* SoundState.Starting */) {
            return;
        }
        const wasStarted = this._state === 3 /* SoundState.Started */;
        this._setState(5 /* SoundState.Paused */);
        this._enginePauseTime += this.engine.currentTime - this._enginePlayTime;
        if (wasStarted) {
            this._sourceNode?.stop();
        }
        else {
            this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
        }
        this._deinitSourceNode();
    }
    /** @internal */
    resume(options = {}) {
        if (this._state === 5 /* SoundState.Paused */) {
            this.play(options);
        }
    }
    /** @internal */
    stop(options = {}) {
        if (this._state === 1 /* SoundState.Stopped */) {
            return;
        }
        if (this._state === 3 /* SoundState.Started */) {
            const engineStopTime = this.engine.currentTime + (options.waitTime ?? 0);
            this._sourceNode?.stop(engineStopTime);
        }
        if (options.waitTime === undefined || options.waitTime <= 0) {
            this._setState(1 /* SoundState.Stopped */);
            this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
        }
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the sound's subgraph.
        if (node instanceof _WebAudioStaticSound && node._inNode) {
            this._outNode?.connect(node._inNode);
            this._isConnected = true;
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node instanceof _WebAudioStaticSound && node._inNode) {
            this._outNode?.disconnect(node._inNode);
            this._isConnected = false;
        }
        return true;
    }
    _deinitSourceNode() {
        if (!this._sourceNode) {
            return;
        }
        if (this._isConnected && !this._disconnect(this._sound)) {
            throw new Error("Disconnect failed");
        }
        this._sourceNode.disconnect(this._volumeNode);
        this._sourceNode.removeEventListener("ended", this._onEnded);
        this._sourceNode = null;
    }
    _initSourceNode() {
        if (!this._sourceNode) {
            this._sourceNode = new AudioBufferSourceNode(this._sound._audioContext, { buffer: this._sound.buffer._audioBuffer });
            this._sourceNode.addEventListener("ended", this._onEnded, { once: true });
            this._sourceNode.connect(this._volumeNode);
            if (!this._connect(this._sound)) {
                throw new Error("Connect failed");
            }
            this._pitch = new _WebAudioParameterComponent(this.engine, this._sourceNode.detune);
            this._playbackRate = new _WebAudioParameterComponent(this.engine, this._sourceNode.playbackRate);
        }
        const node = this._sourceNode;
        node.detune.value = this._sound.pitch;
        node.loop = this._options.loop;
        node.loopEnd = this._options.loopEnd;
        node.loopStart = this._options.loopStart;
        node.playbackRate.value = this._sound.playbackRate;
    }
}
//# sourceMappingURL=webAudioStaticSound.js.map
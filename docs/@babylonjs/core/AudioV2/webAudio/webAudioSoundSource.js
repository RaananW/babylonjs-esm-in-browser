import { AbstractSoundSource } from "../abstractAudio/abstractSoundSource.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioSoundSource extends AbstractSoundSource {
    /** @internal */
    constructor(name, webAudioNode, engine, options) {
        super(name, engine, options);
        this._stereo = null;
        this._webAudioNode = null;
        this._mediaStreamAudioElement = null;
        this._stopMediaStreamTracksOnDispose = false;
        this._audioContext = this.engine._audioContext;
        this._webAudioNode = webAudioNode;
        this._stopMediaStreamTracksOnDispose = options.stopMediaStreamTracksOnDispose === true;
        if (options.mediaStreamSinkEnabled !== false && webAudioNode instanceof MediaStreamAudioSourceNode) {
            this._attachMediaStreamSink(webAudioNode.mediaStream);
        }
        this._subGraph = new _WebAudioSoundSource._SubGraph(this);
    }
    /**
     * Keeps a `MediaStream`-backed source audible by attaching the stream to a hidden, muted audio element.
     *
     * Some browsers (notably Chromium) only deliver samples from a `MediaStreamAudioSourceNode` while its `MediaStream`
     * is also being pulled by an `HTMLMediaElement`; without this, a remote WebRTC stream routed through Web Audio is
     * silent and cannot be spatialized. The element is muted so it does not add a second, non-spatial playback.
     * @param mediaStream - the `MediaStream` backing this sound source
     */
    _attachMediaStreamSink(mediaStream) {
        if (typeof Audio === "undefined") {
            return;
        }
        const mediaElement = new Audio();
        mediaElement.muted = true;
        mediaElement.srcObject = mediaStream;
        this._mediaStreamAudioElement = mediaElement;
        void this._startMediaStreamSinkAsync(mediaElement);
    }
    /**
     * Starts best-effort playback of the muted keep-alive media element.
     * @param mediaElement - the muted media element pulling the source `MediaStream`
     */
    async _startMediaStreamSinkAsync(mediaElement) {
        try {
            // Muted media is allowed to autoplay without a user gesture.
            await mediaElement.play();
        }
        catch {
            // A rejected play() only means this browser-specific keep-alive is unavailable, which is non-fatal.
        }
    }
    /** @internal */
    async _initAsync(options) {
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
        this.engine._addNode(this);
    }
    /** @internal */
    get _inNode() {
        return this._webAudioNode;
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
        if (this._mediaStreamAudioElement) {
            this._mediaStreamAudioElement.pause();
            this._mediaStreamAudioElement.srcObject = null;
            this._mediaStreamAudioElement = null;
        }
        if (this._webAudioNode) {
            if (this._stopMediaStreamTracksOnDispose && this._webAudioNode instanceof MediaStreamAudioSourceNode) {
                for (const track of this._webAudioNode.mediaStream.getTracks()) {
                    track.stop();
                }
            }
            this._webAudioNode.disconnect();
            this._webAudioNode = null;
        }
        this._stereo = null;
        this._subGraph.dispose();
        this.engine._removeNode(this);
    }
    /** @internal */
    getClassName() {
        return "_WebAudioSoundSource";
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
}
_WebAudioSoundSource._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
    _onSubNodesChanged() {
        super._onSubNodesChanged();
        this._owner._inNode?.disconnect();
        if (this._owner._subGraph._inNode) {
            this._owner._inNode?.connect(this._owner._subGraph._inNode);
        }
    }
};
//# sourceMappingURL=webAudioSoundSource.js.map
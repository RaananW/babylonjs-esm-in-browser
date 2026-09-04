import { AudioBus } from "../abstractAudio/audioBus.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioBus extends AudioBus {
    /** @internal */
    constructor(name, engine, options) {
        super(name, engine, options);
        this._stereo = null;
        this._subGraph = new _WebAudioBus._SubGraph(this);
    }
    /** @internal */
    async _initAsync(options) {
        if (options.outBus) {
            this.outBus = options.outBus;
        }
        else {
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
    dispose() {
        super.dispose();
        this._stereo = null;
        this.engine._removeNode(this);
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
    getClassName() {
        return "_WebAudioBus";
    }
    _createSpatialProperty(autoUpdate, minUpdateTime) {
        return new _SpatialWebAudio(this._subGraph, autoUpdate, minUpdateTime);
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
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
}
_WebAudioBus._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
};
//# sourceMappingURL=webAudioBus.js.map
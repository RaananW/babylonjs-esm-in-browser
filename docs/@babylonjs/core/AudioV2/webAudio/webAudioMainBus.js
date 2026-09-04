import { MainAudioBus } from "../abstractAudio/mainAudioBus.js";
import { _WebAudioBaseSubGraph } from "./subNodes/webAudioBaseSubGraph.js";
/** @internal */
export class _WebAudioMainBus extends MainAudioBus {
    /** @internal */
    constructor(name, engine) {
        super(name, engine);
        this._subGraph = new _WebAudioMainBus._SubGraph(this);
    }
    /** @internal */
    async _initAsync(options) {
        await this._subGraph.initAsync(options);
        if (this.engine.mainOut) {
            if (!this._connect(this.engine.mainOut)) {
                throw new Error("Connect failed");
            }
        }
        this.engine._addMainBus(this);
    }
    /** @internal */
    dispose() {
        super.dispose();
        this.engine._removeMainBus(this);
    }
    /** @internal */
    get _inNode() {
        return this._subGraph._inNode;
    }
    /** @internal */
    get _outNode() {
        return this._subGraph._outNode;
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
    /** @internal */
    getClassName() {
        return "_WebAudioMainBus";
    }
}
_WebAudioMainBus._SubGraph = class extends _WebAudioBaseSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
};
//# sourceMappingURL=webAudioMainBus.js.map
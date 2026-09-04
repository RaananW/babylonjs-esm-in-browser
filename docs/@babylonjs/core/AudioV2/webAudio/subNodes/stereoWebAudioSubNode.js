import { _StereoAudioSubNode } from "../../abstractAudio/subNodes/stereoAudioSubNode.js";
import { _WebAudioParameterComponent } from "../components/webAudioParameterComponent.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateStereoAudioSubNodeAsync(engine) {
    return new _StereoWebAudioSubNode(engine);
}
/** @internal */
export class _StereoWebAudioSubNode extends _StereoAudioSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        this.node = new StereoPannerNode(engine._audioContext);
        this._pan = new _WebAudioParameterComponent(engine, this.node.pan);
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._pan.dispose();
    }
    /** @internal */
    get pan() {
        return this._pan.targetValue;
    }
    /** @internal */
    set pan(value) {
        this._pan.targetValue = value;
    }
    /** @internal */
    get _inNode() {
        return this.node;
    }
    /** @internal */
    get _outNode() {
        return this.node;
    }
    /** @internal */
    getClassName() {
        return "_StereoWebAudioSubNode";
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this.node.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this.node.disconnect(node._inNode);
        }
        return true;
    }
}
//# sourceMappingURL=stereoWebAudioSubNode.js.map
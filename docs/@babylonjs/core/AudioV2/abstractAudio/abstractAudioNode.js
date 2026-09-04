import { Observable } from "../../Misc/observable.js";
export var AudioNodeType;
(function (AudioNodeType) {
    AudioNodeType[AudioNodeType["HAS_INPUTS"] = 1] = "HAS_INPUTS";
    AudioNodeType[AudioNodeType["HAS_OUTPUTS"] = 2] = "HAS_OUTPUTS";
    AudioNodeType[AudioNodeType["HAS_INPUTS_AND_OUTPUTS"] = 3] = "HAS_INPUTS_AND_OUTPUTS";
})(AudioNodeType || (AudioNodeType = {}));
/**
 * Abstract class for an audio node.
 *
 * An audio node is a processing unit that can receive audio data from an upstream node and/or send audio data to a
 * downstream node.
 *
 * Nodes can be connected to other nodes to create an audio graph. The audio graph represents the flow of audio data.
 *
 * There are 3 types of audio nodes:
 * 1. Input: Receives audio data from upstream nodes.
 * 2. Output: Sends audio data to downstream nodes.
 * 3. Input/Output: Receives audio data from upstream nodes and sends audio data to downstream nodes.
 */
export class AbstractAudioNode {
    constructor(engine, nodeType) {
        /**
         * Observable for when the audio node is disposed.
         */
        this.onDisposeObservable = new Observable();
        this.engine = engine;
        if (nodeType & 1 /* AudioNodeType.HAS_INPUTS */) {
            this._upstreamNodes = new Set();
        }
        if (nodeType & 2 /* AudioNodeType.HAS_OUTPUTS */) {
            this._downstreamNodes = new Set();
        }
    }
    /**
     * Releases associated resources.
     * - Triggers `onDisposeObservable`.
     * @see {@link onDisposeObservable}
     */
    dispose() {
        if (this._downstreamNodes) {
            for (const node of Array.from(this._downstreamNodes)) {
                if (!this._disconnect(node)) {
                    throw new Error("Disconnect failed");
                }
            }
            this._downstreamNodes.clear();
        }
        if (this._upstreamNodes) {
            for (const node of Array.from(this._upstreamNodes)) {
                if (!node._disconnect(this)) {
                    throw new Error("Disconnect failed");
                }
            }
            this._upstreamNodes.clear();
        }
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
    }
    /**
     * Connect to a downstream audio input node.
     * @param node - The downstream audio input node to connect
     * @returns `true` if the node is successfully connected; otherwise `false`
     */
    _connect(node) {
        if (!this._downstreamNodes) {
            return false;
        }
        if (this._downstreamNodes.has(node)) {
            return false;
        }
        if (!node._onConnect(this)) {
            return false;
        }
        this._downstreamNodes.add(node);
        return true;
    }
    /**
     * Disconnects a downstream audio input node.
     * @param node - The downstream audio input node to disconnect
     * @returns `true` if the node is successfully disconnected; otherwise `false`
     */
    _disconnect(node) {
        if (!this._downstreamNodes) {
            return false;
        }
        if (!this._downstreamNodes.delete(node)) {
            return false;
        }
        return node._onDisconnect(this);
    }
    /**
     * Called when an upstream audio output node is connecting.
     * @param node - The connecting upstream audio node
     * @returns `true` if the node is successfully connected; otherwise `false`
     */
    _onConnect(node) {
        if (!this._upstreamNodes) {
            return false;
        }
        if (this._upstreamNodes.has(node)) {
            return false;
        }
        this._upstreamNodes.add(node);
        return true;
    }
    /**
     * Called when an upstream audio output node disconnects.
     * @param node - The disconnecting upstream audio node
     * @returns `true` if node is sucessfully disconnected; otherwise `false`
     */
    _onDisconnect(node) {
        return this._upstreamNodes?.delete(node) ?? false;
    }
}
/**
 * Abstract class for a named audio node.
 */
export class AbstractNamedAudioNode extends AbstractAudioNode {
    constructor(name, engine, nodeType) {
        super(engine, nodeType);
        /**
         * Observable for when the audio node is renamed.
         */
        this.onNameChangedObservable = new Observable();
        this._name = name;
    }
    /**
     * The name of the audio node.
     * - Triggers `onNameChangedObservable` when changed.
     * @see {@link onNameChangedObservable}
     */
    get name() {
        return this._name;
    }
    set name(newName) {
        if (this._name === newName) {
            return;
        }
        const oldName = this._name;
        this._name = newName;
        this.onNameChangedObservable.notifyObservers({ newName, oldName, node: this });
    }
    dispose() {
        super.dispose();
        this.onNameChangedObservable.clear();
    }
}
//# sourceMappingURL=abstractAudioNode.js.map
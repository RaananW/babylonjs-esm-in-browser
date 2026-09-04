import { _GetSpatialAudioSubNode } from "../../abstractAudio/subNodes/spatialAudioSubNode.js";
import { _GetStereoAudioSubNode } from "../../abstractAudio/subNodes/stereoAudioSubNode.js";
import { _GetVolumeAudioSubNode } from "../../abstractAudio/subNodes/volumeAudioSubNode.js";
import { _HasSpatialAudioOptions } from "../../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _HasStereoAudioOptions } from "../../abstractAudio/subProperties/abstractStereoAudio.js";
import { _CreateSpatialAudioSubNodeAsync } from "./spatialWebAudioSubNode.js";
import { _CreateStereoAudioSubNodeAsync } from "./stereoWebAudioSubNode.js";
import { _WebAudioBaseSubGraph } from "./webAudioBaseSubGraph.js";
/** @internal */
export class _WebAudioBusAndSoundSubGraph extends _WebAudioBaseSubGraph {
    constructor() {
        super(...arguments);
        this._rootNode = null;
        this._inputNode = null;
    }
    /** @internal */
    async initAsync(options) {
        await super.initAsync(options);
        let hasSpatialOptions;
        let hasStereoOptions;
        if ((hasSpatialOptions = _HasSpatialAudioOptions(options))) {
            await this.createAndAddSubNodeAsync("Spatial" /* AudioSubNode.SPATIAL */);
        }
        if ((hasStereoOptions = _HasStereoAudioOptions(options))) {
            await this.createAndAddSubNodeAsync("Stereo" /* AudioSubNode.STEREO */);
        }
        await this._createSubNodePromisesResolvedAsync();
        if (hasSpatialOptions) {
            _GetSpatialAudioSubNode(this)?.setOptions(options);
        }
        if (hasStereoOptions) {
            _GetStereoAudioSubNode(this)?.setOptions(options);
        }
    }
    /** @internal */
    get _inNode() {
        return this._inputNode;
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    _createSubNode(name) {
        try {
            const node = super._createSubNode(name);
            return node;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (e) { }
        switch (name) {
            case "Spatial" /* AudioSubNode.SPATIAL */:
                return _CreateSpatialAudioSubNodeAsync(this._owner.engine);
            case "Stereo" /* AudioSubNode.STEREO */:
                return _CreateStereoAudioSubNodeAsync(this._owner.engine);
            default:
                throw new Error(`Unknown subnode name: ${name}`);
        }
    }
    _onSubNodesChanged() {
        super._onSubNodesChanged();
        const spatialNode = _GetSpatialAudioSubNode(this);
        const stereoNode = _GetStereoAudioSubNode(this);
        const volumeNode = _GetVolumeAudioSubNode(this);
        if (spatialNode && spatialNode.getClassName() !== "_SpatialWebAudioSubNode") {
            throw new Error("Not a WebAudio subnode.");
        }
        if (stereoNode && stereoNode.getClassName() !== "_StereoWebAudioSubNode") {
            throw new Error("Not a WebAudio subnode.");
        }
        if (volumeNode && volumeNode.getClassName() !== "_VolumeWebAudioSubNode") {
            throw new Error("Not a WebAudio subnode.");
        }
        if (spatialNode) {
            spatialNode.disconnectAll();
            if (volumeNode) {
                spatialNode.connect(volumeNode);
            }
        }
        if (stereoNode) {
            stereoNode.disconnectAll();
            if (volumeNode) {
                stereoNode.connect(volumeNode);
            }
        }
        if (spatialNode && stereoNode) {
            this._rootNode = new GainNode(this._owner.engine._audioContext);
            this._rootNode.connect(spatialNode._inNode);
            this._rootNode.connect(stereoNode._inNode);
        }
        else {
            this._rootNode?.disconnect();
            this._rootNode = null;
        }
        let inSubNode = null;
        let inNode;
        if (this._rootNode) {
            inNode = this._rootNode;
        }
        else {
            if (spatialNode) {
                inSubNode = spatialNode;
            }
            else if (stereoNode) {
                inSubNode = stereoNode;
            }
            else if (volumeNode) {
                inSubNode = volumeNode;
            }
            inNode = inSubNode?._inNode ?? null;
        }
        if (this._inputNode !== inNode) {
            // Disconnect the wrapped upstream WebAudio nodes from the old wrapped WebAudio node.
            // The wrapper nodes are unaware of this change.
            if (this._inputNode && this._upstreamNodes) {
                const it = this._upstreamNodes.values();
                for (let next = it.next(); !next.done; next = it.next()) {
                    next.value._outNode?.disconnect(this._inputNode);
                }
            }
            this._inputNode = inNode;
            // Connect the wrapped upstream WebAudio nodes to the new wrapped WebAudio node.
            // The wrapper nodes are unaware of this change.
            if (inNode && this._upstreamNodes) {
                const it = this._upstreamNodes.values();
                for (let next = it.next(); !next.done; next = it.next()) {
                    next.value._outNode?.connect(inNode);
                }
            }
        }
    }
}
//# sourceMappingURL=webAudioBusAndSoundSubGraph.js.map
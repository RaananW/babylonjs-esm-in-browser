import { _AbstractAudioSubGraph } from "../../abstractAudio/subNodes/abstractAudioSubGraph.js";
import { _GetAudioAnalyzerSubNode } from "../../abstractAudio/subNodes/audioAnalyzerSubNode.js";
import { _GetVolumeAudioSubNode } from "../../abstractAudio/subNodes/volumeAudioSubNode.js";
import { _HasAudioAnalyzerOptions } from "../../abstractAudio/subProperties/abstractAudioAnalyzer.js";
import { _CreateVolumeAudioSubNodeAsync } from "./volumeWebAudioSubNode.js";
import { _CreateAudioAnalyzerSubNodeAsync } from "./webAudioAnalyzerSubNode.js";
/** @internal */
export class _WebAudioBaseSubGraph extends _AbstractAudioSubGraph {
    /** @internal */
    constructor(owner) {
        super();
        this._outputNode = null;
        this._owner = owner;
    }
    /** @internal */
    async initAsync(options) {
        const hasAnalyzerOptions = _HasAudioAnalyzerOptions(options);
        if (hasAnalyzerOptions) {
            await this.createAndAddSubNodeAsync("Analyzer" /* AudioSubNode.ANALYZER */);
        }
        await this.createAndAddSubNodeAsync("Volume" /* AudioSubNode.VOLUME */);
        await this._createSubNodePromisesResolvedAsync();
        if (hasAnalyzerOptions) {
            const analyzerNode = _GetAudioAnalyzerSubNode(this);
            if (!analyzerNode) {
                throw new Error("No analyzer subnode.");
            }
            analyzerNode.setOptions(options);
        }
        const volumeNode = _GetVolumeAudioSubNode(this);
        if (!volumeNode) {
            throw new Error("No volume subnode.");
        }
        volumeNode.setOptions(options);
        if (volumeNode.getClassName() !== "_VolumeWebAudioSubNode") {
            throw new Error("Not a WebAudio subnode.");
        }
        this._outputNode = volumeNode.node;
        // Connect the new wrapped WebAudio node to the wrapped downstream WebAudio nodes.
        // The wrapper nodes are unaware of this change.
        if (this._outputNode && this._downstreamNodes) {
            const it = this._downstreamNodes.values();
            for (let next = it.next(); !next.done; next = it.next()) {
                const inNode = next.value._inNode;
                if (inNode) {
                    this._outputNode.connect(inNode);
                }
            }
        }
    }
    /** @internal */
    get _inNode() {
        return this._outputNode;
    }
    /** @internal */
    get _outNode() {
        return this._outputNode;
    }
    // Function is async, but throws synchronously. Avoiding breaking changes.
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    _createSubNode(name) {
        switch (name) {
            case "Analyzer" /* AudioSubNode.ANALYZER */:
                return _CreateAudioAnalyzerSubNodeAsync(this._owner.engine);
            case "Volume" /* AudioSubNode.VOLUME */:
                return _CreateVolumeAudioSubNodeAsync(this._owner.engine);
            default:
                throw new Error(`Unknown subnode name: ${name}`);
        }
    }
    _onSubNodesChanged() {
        const analyzerNode = _GetAudioAnalyzerSubNode(this);
        const volumeNode = _GetVolumeAudioSubNode(this);
        if (analyzerNode && volumeNode) {
            volumeNode.connect(analyzerNode);
        }
    }
}
//# sourceMappingURL=webAudioBaseSubGraph.js.map
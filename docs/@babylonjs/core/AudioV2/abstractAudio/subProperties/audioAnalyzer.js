import { Logger } from "../../../Misc/logger.js";
import { _AudioAnalyzerDefaults, AbstractAudioAnalyzer } from "../../abstractAudio/subProperties/abstractAudioAnalyzer.js";
import { _GetAudioAnalyzerSubNode, _SetAudioAnalyzerProperty } from "../subNodes/audioAnalyzerSubNode.js";
let EmptyByteFrequencyData = null;
let EmptyFloatFrequencyData = null;
/** @internal */
export function _GetEmptyByteFrequencyData() {
    if (!EmptyByteFrequencyData) {
        EmptyByteFrequencyData = new Uint8Array();
    }
    return EmptyByteFrequencyData;
}
/** @internal */
export function _GetEmptyFloatFrequencyData() {
    if (!EmptyFloatFrequencyData) {
        EmptyFloatFrequencyData = new Float32Array();
    }
    return EmptyFloatFrequencyData;
}
/** @internal */
export class _AudioAnalyzer extends AbstractAudioAnalyzer {
    /** @internal */
    constructor(subGraph) {
        super();
        this._fftSize = _AudioAnalyzerDefaults.fftSize;
        this._maxDecibels = _AudioAnalyzerDefaults.maxDecibels;
        this._minDecibels = _AudioAnalyzerDefaults.minDecibels;
        this._smoothing = _AudioAnalyzerDefaults.smoothing;
        this._subGraph = subGraph;
    }
    /** @internal */
    get fftSize() {
        return this._fftSize;
    }
    set fftSize(value) {
        this._fftSize = value;
        _SetAudioAnalyzerProperty(this._subGraph, "fftSize", value);
    }
    /** @internal */
    get isEnabled() {
        return _GetAudioAnalyzerSubNode(this._subGraph) !== null;
    }
    /** @internal */
    get minDecibels() {
        return this._minDecibels;
    }
    set minDecibels(value) {
        this._minDecibels = value;
        _SetAudioAnalyzerProperty(this._subGraph, "minDecibels", value);
    }
    /** @internal */
    get maxDecibels() {
        return this._maxDecibels;
    }
    set maxDecibels(value) {
        this._maxDecibels = value;
        _SetAudioAnalyzerProperty(this._subGraph, "maxDecibels", value);
    }
    /** @internal */
    get smoothing() {
        return this._smoothing;
    }
    set smoothing(value) {
        this._smoothing = value;
        _SetAudioAnalyzerProperty(this._subGraph, "smoothing", value);
    }
    /** @internal */
    dispose() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (subNode) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._subGraph.removeSubNodeAsync(subNode);
            subNode.dispose();
        }
    }
    /** @internal */
    async enableAsync() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (!subNode) {
            await this._subGraph.createAndAddSubNodeAsync("Analyzer" /* AudioSubNode.ANALYZER */);
        }
    }
    /** @internal */
    getByteFrequencyData() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (!subNode) {
            Logger.Warn("AudioAnalyzer not enabled");
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.enableAsync();
            return _GetEmptyByteFrequencyData();
        }
        return subNode.getByteFrequencyData();
    }
    /** @internal */
    getByteTimeDomainData() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (!subNode) {
            Logger.Warn("AudioAnalyzer not enabled");
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.enableAsync();
            return super.getByteTimeDomainData();
        }
        return subNode.getByteTimeDomainData();
    }
    /** @internal */
    getFloatFrequencyData() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (!subNode) {
            Logger.Warn("AudioAnalyzer not enabled");
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.enableAsync();
            return _GetEmptyFloatFrequencyData();
        }
        return subNode.getFloatFrequencyData();
    }
    /** @internal */
    getFloatTimeDomainData() {
        const subNode = _GetAudioAnalyzerSubNode(this._subGraph);
        if (!subNode) {
            Logger.Warn("AudioAnalyzer not enabled");
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.enableAsync();
            return super.getFloatTimeDomainData();
        }
        return subNode.getFloatTimeDomainData();
    }
}
//# sourceMappingURL=audioAnalyzer.js.map
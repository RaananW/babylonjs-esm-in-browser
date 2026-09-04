import { _AudioAnalyzerDefaults } from "../subProperties/abstractAudioAnalyzer.js";
import { _AbstractAudioSubNode } from "./abstractAudioSubNode.js";
/** @internal */
export class _AudioAnalyzerSubNode extends _AbstractAudioSubNode {
    constructor(engine) {
        super("Analyzer" /* AudioSubNode.ANALYZER */, engine);
    }
    /** @internal */
    setOptions(options) {
        this.fftSize = options.analyzerFFTSize ?? _AudioAnalyzerDefaults.fftSize;
        this.minDecibels = options.analyzerMinDecibels ?? _AudioAnalyzerDefaults.minDecibels;
        this.maxDecibels = options.analyzerMaxDecibels ?? _AudioAnalyzerDefaults.maxDecibels;
        this.smoothing = options.analyzerSmoothing ?? _AudioAnalyzerDefaults.smoothing;
    }
}
/** @internal */
export function _GetAudioAnalyzerSubNode(subGraph) {
    return subGraph.getSubNode("Analyzer" /* AudioSubNode.ANALYZER */);
}
/** @internal */
export function _SetAudioAnalyzerProperty(subGraph, property, value) {
    subGraph.callOnSubNode("Analyzer" /* AudioSubNode.ANALYZER */, (node) => {
        node[property] = value;
    });
}
//# sourceMappingURL=audioAnalyzerSubNode.js.map
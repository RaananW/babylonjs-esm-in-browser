import { _AudioAnalyzerSubNode } from "../../abstractAudio/subNodes/audioAnalyzerSubNode.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateAudioAnalyzerSubNodeAsync(engine) {
    return new _WebAudioAnalyzerSubNode(engine);
}
/** @internal */
export class _WebAudioAnalyzerSubNode extends _AudioAnalyzerSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        this._byteFrequencyData = null;
        this._byteTimeDomainData = null;
        this._floatFrequencyData = null;
        this._floatTimeDomainData = null;
        this._analyzerNode = new AnalyserNode(engine._audioContext);
    }
    /** @internal */
    get fftSize() {
        return this._analyzerNode.fftSize;
    }
    set fftSize(value) {
        if (value === this._analyzerNode.fftSize) {
            return;
        }
        this._analyzerNode.fftSize = value;
        this._clearArrays();
    }
    /** @internal */
    get _inNode() {
        return this._analyzerNode;
    }
    /** @internal */
    get minDecibels() {
        return this._analyzerNode.minDecibels;
    }
    set minDecibels(value) {
        this._analyzerNode.minDecibels = value;
    }
    /** @internal */
    get maxDecibels() {
        return this._analyzerNode.maxDecibels;
    }
    set maxDecibels(value) {
        this._analyzerNode.maxDecibels = value;
    }
    /** @internal */
    get smoothing() {
        return this._analyzerNode.smoothingTimeConstant;
    }
    set smoothing(value) {
        this._analyzerNode.smoothingTimeConstant = value;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._clearArrays();
        this._analyzerNode.disconnect();
    }
    /** @internal */
    getClassName() {
        return "_WebAudioAnalyzerSubNode";
    }
    /** @internal */
    getByteFrequencyData() {
        if (!this._byteFrequencyData || this._byteFrequencyData.length === 0) {
            this._byteFrequencyData = new Uint8Array(this._analyzerNode.frequencyBinCount);
        }
        this._analyzerNode.getByteFrequencyData(this._byteFrequencyData);
        return this._byteFrequencyData;
    }
    /** @internal */
    getByteTimeDomainData() {
        if (!this._byteTimeDomainData || this._byteTimeDomainData.length === 0) {
            this._byteTimeDomainData = new Uint8Array(this._analyzerNode.fftSize);
        }
        this._analyzerNode.getByteTimeDomainData(this._byteTimeDomainData);
        return this._byteTimeDomainData;
    }
    /** @internal */
    getFloatFrequencyData() {
        if (!this._floatFrequencyData || this._floatFrequencyData.length === 0) {
            this._floatFrequencyData = new Float32Array(this._analyzerNode.frequencyBinCount);
        }
        this._analyzerNode.getFloatFrequencyData(this._floatFrequencyData);
        return this._floatFrequencyData;
    }
    /** @internal */
    getFloatTimeDomainData() {
        if (!this._floatTimeDomainData || this._floatTimeDomainData.length === 0) {
            this._floatTimeDomainData = new Float32Array(this._analyzerNode.fftSize);
        }
        this._analyzerNode.getFloatTimeDomainData(this._floatTimeDomainData);
        return this._floatTimeDomainData;
    }
    _clearArrays() {
        this._byteFrequencyData = null;
        this._byteTimeDomainData = null;
        this._floatFrequencyData = null;
        this._floatTimeDomainData = null;
    }
}
//# sourceMappingURL=webAudioAnalyzerSubNode.js.map
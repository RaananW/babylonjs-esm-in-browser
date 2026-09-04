import { type AudioAnalyzerFFTSizeType, AbstractAudioAnalyzer } from "../../abstractAudio/subProperties/abstractAudioAnalyzer.js";
import { type _AbstractAudioSubGraph } from "../subNodes/abstractAudioSubGraph.js";
/** @internal */
export declare function _GetEmptyByteFrequencyData(): Uint8Array;
/** @internal */
export declare function _GetEmptyFloatFrequencyData(): Float32Array;
/** @internal */
export declare class _AudioAnalyzer extends AbstractAudioAnalyzer {
    private _fftSize;
    private _maxDecibels;
    private _minDecibels;
    private _smoothing;
    private _subGraph;
    /** @internal */
    constructor(subGraph: _AbstractAudioSubGraph);
    /** @internal */
    get fftSize(): AudioAnalyzerFFTSizeType;
    set fftSize(value: AudioAnalyzerFFTSizeType);
    /** @internal */
    get isEnabled(): boolean;
    /** @internal */
    get minDecibels(): number;
    set minDecibels(value: number);
    /** @internal */
    get maxDecibels(): number;
    set maxDecibels(value: number);
    /** @internal */
    get smoothing(): number;
    set smoothing(value: number);
    /** @internal */
    dispose(): void;
    /** @internal */
    enableAsync(): Promise<void>;
    /** @internal */
    getByteFrequencyData(): Uint8Array;
    /** @internal */
    getByteTimeDomainData(): Uint8Array;
    /** @internal */
    getFloatFrequencyData(): Float32Array;
    /** @internal */
    getFloatTimeDomainData(): Float32Array;
}

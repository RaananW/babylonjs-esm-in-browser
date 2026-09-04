import { type Nullable } from "../../../types.js";
import { type AudioEngineV2 } from "../audioEngineV2.js";
import { type AudioAnalyzerFFTSizeType, type IAudioAnalyzerOptions, _AudioAnalyzerDefaults } from "../subProperties/abstractAudioAnalyzer.js";
import { type _AbstractAudioSubGraph } from "./abstractAudioSubGraph.js";
import { _AbstractAudioSubNode } from "./abstractAudioSubNode.js";
/** @internal */
export declare abstract class _AudioAnalyzerSubNode extends _AbstractAudioSubNode {
    protected constructor(engine: AudioEngineV2);
    abstract fftSize: AudioAnalyzerFFTSizeType;
    abstract minDecibels: number;
    abstract maxDecibels: number;
    abstract smoothing: number;
    abstract getByteFrequencyData(): Uint8Array;
    abstract getByteTimeDomainData(): Uint8Array;
    abstract getFloatFrequencyData(): Float32Array;
    abstract getFloatTimeDomainData(): Float32Array;
    /** @internal */
    setOptions(options: Partial<IAudioAnalyzerOptions>): void;
}
/** @internal */
export declare function _GetAudioAnalyzerSubNode(subGraph: _AbstractAudioSubGraph): Nullable<_AudioAnalyzerSubNode>;
/** @internal */
export declare function _SetAudioAnalyzerProperty<K extends keyof typeof _AudioAnalyzerDefaults>(subGraph: _AbstractAudioSubGraph, property: K, value: _AudioAnalyzerSubNode[K]): void;

import { type Nullable } from "../../types.js";
import { type ISoundSourceOptions, AbstractSoundSource } from "../abstractAudio/abstractSoundSource.js";
import { type AbstractSpatialAudio } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { type _WebAudioEngine } from "./webAudioEngine.js";
import { type IWebAudioInNode } from "./webAudioNode.js";
/** @internal */
export declare class _WebAudioSoundSource extends AbstractSoundSource {
    private _stereo;
    protected _subGraph: _WebAudioBusAndSoundSubGraph;
    protected _webAudioNode: Nullable<AudioNode>;
    private _mediaStreamAudioElement;
    private _stopMediaStreamTracksOnDispose;
    /** @internal */
    _audioContext: AudioContext | OfflineAudioContext;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    constructor(name: string, webAudioNode: AudioNode, engine: _WebAudioEngine, options: Partial<ISoundSourceOptions>);
    /**
     * Keeps a `MediaStream`-backed source audible by attaching the stream to a hidden, muted audio element.
     *
     * Some browsers (notably Chromium) only deliver samples from a `MediaStreamAudioSourceNode` while its `MediaStream`
     * is also being pulled by an `HTMLMediaElement`; without this, a remote WebRTC stream routed through Web Audio is
     * silent and cannot be spatialized. The element is muted so it does not add a second, non-spatial playback.
     * @param mediaStream - the `MediaStream` backing this sound source
     */
    private _attachMediaStreamSink;
    /**
     * Starts best-effort playback of the muted keep-alive media element.
     * @param mediaElement - the muted media element pulling the source `MediaStream`
     */
    private _startMediaStreamSinkAsync;
    /** @internal */
    _initAsync(options: Partial<ISoundSourceOptions>): Promise<void>;
    /** @internal */
    get _inNode(): Nullable<AudioNode>;
    /** @internal */
    get _outNode(): Nullable<AudioNode>;
    /** @internal */
    get stereo(): _StereoAudio;
    /** @internal */
    dispose(): void;
    /** @internal */
    getClassName(): string;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    protected _createSpatialProperty(autoUpdate: boolean, minUpdateTime: number): AbstractSpatialAudio;
    private static _SubGraph;
}

import { type Nullable } from "../../types.js";
import { type AbstractAudioNode } from "../abstractAudio/abstractAudioNode.js";
import { type IStreamingSoundOptions, type IStreamingSoundPlayOptions, type IStreamingSoundStoredOptions, StreamingSound } from "../abstractAudio/streamingSound.js";
import { _StreamingSoundInstance } from "../abstractAudio/streamingSoundInstance.js";
import { type AbstractSpatialAudio } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { type _WebAudioEngine } from "./webAudioEngine.js";
import { type IWebAudioInNode, type IWebAudioOutNode, type IWebAudioSuperNode } from "./webAudioNode.js";
type StreamingSoundSourceType = HTMLMediaElement | string | string[];
/** @internal */
export declare class _WebAudioStreamingSound extends StreamingSound implements IWebAudioSuperNode {
    private _stereo;
    protected readonly _options: IStreamingSoundStoredOptions;
    protected _subGraph: _WebAudioBusAndSoundSubGraph;
    /** @internal */
    _audioContext: AudioContext;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    _source: StreamingSoundSourceType;
    /** @internal */
    constructor(name: string, engine: _WebAudioEngine, options: Partial<IStreamingSoundOptions>);
    /** @internal */
    _initAsync(source: StreamingSoundSourceType, options: Partial<IStreamingSoundOptions>): Promise<void>;
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
    protected _createInstance(): _WebAudioStreamingSoundInstance;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    protected _createSpatialProperty(autoUpdate: boolean, minUpdateTime: number): AbstractSpatialAudio;
    _getOptions(): IStreamingSoundStoredOptions;
    private static _SubGraph;
}
/** @internal */
declare class _WebAudioStreamingSoundInstance extends _StreamingSoundInstance implements IWebAudioOutNode {
    private _currentTimeChangedWhilePaused;
    private _enginePlayTime;
    private _enginePauseTime;
    private _isReady;
    private _isReadyPromise;
    private _mediaElement;
    private _sourceNode;
    private _volumeNode;
    protected readonly _options: IStreamingSoundStoredOptions;
    protected _sound: _WebAudioStreamingSound;
    /** @internal */
    readonly engine: _WebAudioEngine;
    constructor(sound: _WebAudioStreamingSound, options: IStreamingSoundStoredOptions);
    /** @internal */
    get currentTime(): number;
    set currentTime(value: number);
    get _outNode(): Nullable<AudioNode>;
    /** @internal */
    set loop(value: boolean);
    /** @internal */
    get startTime(): number;
    /** @internal */
    dispose(): void;
    /** @internal */
    play(options?: Partial<IStreamingSoundPlayOptions>): void;
    /** @internal */
    pause(): void;
    /** @internal */
    resume(options?: Partial<IStreamingSoundPlayOptions>): void;
    /** @internal */
    stop(): void;
    /** @internal */
    getClassName(): string;
    protected _connect(node: AbstractAudioNode): boolean;
    protected _disconnect(node: AbstractAudioNode): boolean;
    private _initFromMediaElement;
    private _initFromUrl;
    private _initFromUrls;
    private _onCanPlayThrough;
    private _onEnded;
    private _onError;
    private _onEngineStateChanged;
    private _onUserGesture;
    private _play;
    private _playWhenReady;
    private _rejectIsReadyPromise;
    private _resolveIsReadyPromise;
    private _stop;
}
export {};

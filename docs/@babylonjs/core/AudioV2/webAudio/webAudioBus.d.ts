import { type Nullable } from "../../types.js";
import { type IAudioBusOptions, AudioBus } from "../abstractAudio/audioBus.js";
import { type AbstractSpatialAudio } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { type _WebAudioEngine } from "./webAudioEngine.js";
import { type IWebAudioInNode, type IWebAudioSuperNode } from "./webAudioNode.js";
/** @internal */
export declare class _WebAudioBus extends AudioBus implements IWebAudioSuperNode {
    private _stereo;
    protected _subGraph: _WebAudioBusAndSoundSubGraph;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    constructor(name: string, engine: _WebAudioEngine, options: Partial<IAudioBusOptions>);
    /** @internal */
    _initAsync(options: Partial<IAudioBusOptions>): Promise<void>;
    /** @internal */
    dispose(): void;
    /** @internal */
    get _inNode(): Nullable<AudioNode>;
    /** @internal */
    get _outNode(): Nullable<AudioNode>;
    /** @internal */
    get stereo(): _StereoAudio;
    /** @internal */
    getClassName(): string;
    protected _createSpatialProperty(autoUpdate: boolean, minUpdateTime: number): AbstractSpatialAudio;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    private static _SubGraph;
}

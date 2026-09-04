import { type Nullable } from "../../../types.js";
import { type AbstractAudioNode } from "../../abstractAudio/abstractAudioNode.js";
import { type _AbstractAudioSubNode } from "../../abstractAudio/subNodes/abstractAudioSubNode.js";
import { type IVolumeAudioOptions } from "../../abstractAudio/subNodes/volumeAudioSubNode.js";
import { type ISpatialAudioOptions } from "../../abstractAudio/subProperties/abstractSpatialAudio.js";
import { type IStereoAudioOptions } from "../../abstractAudio/subProperties/abstractStereoAudio.js";
import { _WebAudioBaseSubGraph } from "./webAudioBaseSubGraph.js";
/** @internal */
export interface IWebAudioBusAndSoundSubGraphOptions extends ISpatialAudioOptions, IStereoAudioOptions, IVolumeAudioOptions {
}
/** @internal */
export declare abstract class _WebAudioBusAndSoundSubGraph extends _WebAudioBaseSubGraph {
    private _rootNode;
    protected abstract readonly _upstreamNodes: Nullable<Set<AbstractAudioNode>>;
    protected _inputNode: Nullable<AudioNode>;
    /** @internal */
    initAsync(options: Partial<IWebAudioBusAndSoundSubGraphOptions>): Promise<void>;
    /** @internal */
    get _inNode(): Nullable<AudioNode>;
    protected _createSubNode(name: string): Promise<_AbstractAudioSubNode>;
    protected _onSubNodesChanged(): void;
}

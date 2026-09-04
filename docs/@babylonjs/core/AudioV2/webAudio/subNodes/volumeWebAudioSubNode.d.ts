import { type Nullable } from "../../../types.js";
import { _VolumeAudioSubNode } from "../../abstractAudio/subNodes/volumeAudioSubNode.js";
import { type IAudioParameterRampOptions } from "../../audioParameter.js";
import { type _WebAudioEngine } from "../webAudioEngine.js";
import { type IWebAudioInNode, type IWebAudioSubNode } from "../webAudioNode.js";
/** @internal */
export declare function _CreateVolumeAudioSubNodeAsync(engine: _WebAudioEngine): Promise<_VolumeAudioSubNode>;
/** @internal */
export declare class _VolumeWebAudioSubNode extends _VolumeAudioSubNode implements IWebAudioSubNode {
    private _volume;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    readonly node: AudioNode;
    /** @internal */
    constructor(engine: _WebAudioEngine);
    /** @internal */
    dispose(): void;
    /** @internal */
    get volume(): number;
    /** @internal */
    set volume(value: number);
    /** @internal */
    get _inNode(): AudioNode;
    /** @internal */
    get _outNode(): AudioNode;
    /** @internal */
    setVolume(value: number, options?: Nullable<Partial<IAudioParameterRampOptions>>): void;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    /** @internal */
    getClassName(): string;
}

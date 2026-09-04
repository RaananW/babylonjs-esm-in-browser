import { type Nullable } from "../../types.js";
import { _MainAudioOut } from "../abstractAudio/mainAudioOut.js";
import { type IAudioParameterRampOptions } from "../audioParameter.js";
import { type _WebAudioEngine } from "./webAudioEngine.js";
import { type IWebAudioInNode } from "./webAudioNode.js";
/** @internal */
export declare class _WebAudioMainOut extends _MainAudioOut implements IWebAudioInNode {
    private _gainNode;
    private _volume;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    constructor(engine: _WebAudioEngine);
    /** @internal */
    dispose(): void;
    /** @internal */
    get _inNode(): GainNode;
    set _inNode(value: GainNode);
    /** @internal */
    get volume(): number;
    /** @internal */
    set volume(value: number);
    private get _destinationNode();
    /** @internal */
    getClassName(): string;
    /** @internal */
    setVolume(value: number, options?: Nullable<Partial<IAudioParameterRampOptions>>): void;
    private _setGainNode;
}

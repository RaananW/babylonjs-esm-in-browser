import { type Nullable } from "../../../types.js";
import { type IAudioParameterRampOptions } from "../../audioParameter.js";
import { type AudioEngineV2 } from "../audioEngineV2.js";
import { _AbstractAudioSubNode } from "../subNodes/abstractAudioSubNode.js";
import { type _AbstractAudioSubGraph } from "./abstractAudioSubGraph.js";
/** @internal */
export declare const _VolumeAudioDefaults: {
    readonly volume: number;
};
/**
 * Volume options.
 */
export interface IVolumeAudioOptions {
    /**
     * The volume/gain. Defaults to 1.
     */
    volume: number;
}
/** @internal */
export declare abstract class _VolumeAudioSubNode extends _AbstractAudioSubNode {
    protected constructor(engine: AudioEngineV2);
    abstract volume: number;
    /** @internal */
    setOptions(options: Partial<IVolumeAudioOptions>): void;
    /** @internal */
    abstract setVolume(value: number, options?: Nullable<Partial<IAudioParameterRampOptions>>): void;
}
/** @internal */
export declare function _GetVolumeAudioSubNode(subGraph: _AbstractAudioSubGraph): Nullable<_VolumeAudioSubNode>;
/** @internal */
export declare function _GetVolumeAudioProperty<K extends keyof typeof _VolumeAudioDefaults>(subGraph: _AbstractAudioSubGraph, property: K): (typeof _VolumeAudioDefaults)[K];

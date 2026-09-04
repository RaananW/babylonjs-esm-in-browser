import { type Nullable } from "../../types.js";
import { type IAbstractAudioBusOptions, AbstractAudioBus } from "./abstractAudioBus.js";
import { type AudioEngineV2 } from "./audioEngineV2.js";
import { type MainAudioBus } from "./mainAudioBus.js";
import { type AbstractSpatialAudio, type ISpatialAudioOptions } from "./subProperties/abstractSpatialAudio.js";
import { type AbstractStereoAudio, type IStereoAudioOptions } from "./subProperties/abstractStereoAudio.js";
export type PrimaryAudioBus = MainAudioBus | AudioBus;
/**
 * Options for creating an audio bus.
 */
export interface IAudioBusOptions extends IAbstractAudioBusOptions, ISpatialAudioOptions, IStereoAudioOptions {
    /**
     * The output bus of the audio bus. Defaults to the audio engine's default main bus.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    outBus: PrimaryAudioBus;
}
/**
 * Abstract class for an audio bus that has spatial audio and stereo output capabilities.
 *
 * Instances of this class can be connected to other audio buses.
 *
 * Audio buses are created by the {@link CreateAudioBusAsync} function.
 */
export declare abstract class AudioBus extends AbstractAudioBus {
    private readonly _spatialAutoUpdate;
    private readonly _spatialMinUpdateTime;
    private _outBus;
    private _spatial;
    protected constructor(name: string, engine: AudioEngineV2, options: Partial<IAudioBusOptions>);
    /**
     * The output bus of the audio bus. Defaults to the audio engine's default main bus.
     */
    get outBus(): Nullable<PrimaryAudioBus>;
    set outBus(outBus: Nullable<PrimaryAudioBus>);
    /**
     * The spatial audio features.
     */
    get spatial(): AbstractSpatialAudio;
    /**
     * The stereo features of the audio bus.
     */
    abstract readonly stereo: AbstractStereoAudio;
    /**
     * Releases associated resources.
     */
    dispose(): void;
    protected abstract _createSpatialProperty(autoUpdate: boolean, minUpdateTime: number): AbstractSpatialAudio;
    protected _initSpatialProperty(): AbstractSpatialAudio;
    private _onOutBusDisposed;
}

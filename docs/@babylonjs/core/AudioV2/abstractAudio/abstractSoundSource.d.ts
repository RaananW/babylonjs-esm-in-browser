import { type Nullable } from "../../types.js";
import { AudioNodeType } from "./abstractAudioNode.js";
import { type IAbstractAudioOutNodeOptions, AbstractAudioOutNode } from "./abstractAudioOutNode.js";
import { type PrimaryAudioBus } from "./audioBus.js";
import { type AudioEngineV2 } from "./audioEngineV2.js";
import { type AbstractSpatialAudio, type ISpatialAudioOptions } from "./subProperties/abstractSpatialAudio.js";
import { type AbstractStereoAudio, type IStereoAudioOptions } from "./subProperties/abstractStereoAudio.js";
/**
 * Options for creating a sound source.
 */
export interface ISoundSourceOptions extends IAbstractAudioOutNodeOptions, ISpatialAudioOptions, IStereoAudioOptions {
    /**
     * The output bus for the sound source. Defaults to `null`.
     * - If not set or `null`, and `outBusAutoDefault` is `true`, then the sound source is automatically connected to the audio engine's default main bus.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    outBus: Nullable<PrimaryAudioBus>;
    /**
     * Whether the sound's `outBus` should default to the audio engine's main bus. Defaults to `true` for all sound sources except microphones.
     */
    outBusAutoDefault: boolean;
    /**
     * Whether a `MediaStream`-backed sound source (for example, a `MediaStreamAudioSourceNode` created from a remote
     * WebRTC stream) is automatically kept audible by attaching its `MediaStream` to a hidden, muted `HTMLAudioElement`.
     * Defaults to `true`.
     *
     * Some browsers (notably Chromium) only deliver audio samples from a `MediaStreamAudioSourceNode` while the
     * underlying `MediaStream` is also being pulled by an `HTMLMediaElement`. Without this, a remote WebRTC stream routed
     * through the Web Audio graph is silent and therefore cannot be heard or spatialized. The attached element is muted
     * so it does not add a second, non-spatial playback of the stream.
     *
     * Set this to `false` if you are already routing the same `MediaStream` through your own `HTMLMediaElement`, to avoid
     * creating a redundant one. Has no effect for sources that are not backed by a `MediaStreamAudioSourceNode`.
     */
    mediaStreamSinkEnabled: boolean;
    /**
     * Whether disposing the sound source stops the tracks of its backing `MediaStream` (via `MediaStreamTrack.stop()`).
     * Defaults to `false`.
     *
     * When the `MediaStream` is owned by the caller (for example, a remote WebRTC stream), stopping its tracks on dispose
     * would permanently end them and could not be resumed without renegotiation, so the sound source leaves the stream
     * lifecycle to the caller by default. The microphone source enables this so it releases the capture device it owns.
     *
     * Set this to `true` if the sound source should own and stop the stream's tracks when disposed. Has no effect for
     * sources that are not backed by a `MediaStreamAudioSourceNode`.
     */
    stopMediaStreamTracksOnDispose: boolean;
}
/**
 * Abstract class representing a sound in the audio engine.
 */
export declare abstract class AbstractSoundSource extends AbstractAudioOutNode {
    private readonly _spatialAutoUpdate;
    private readonly _spatialMinUpdateTime;
    private _outBus;
    private _spatial;
    protected constructor(name: string, engine: AudioEngineV2, options: Partial<ISoundSourceOptions>, nodeType?: AudioNodeType);
    /**
     * The output bus for the sound.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    get outBus(): Nullable<PrimaryAudioBus>;
    set outBus(outBus: Nullable<PrimaryAudioBus>);
    /**
     * The spatial audio features.
     */
    get spatial(): AbstractSpatialAudio;
    /**
     * The stereo features of the sound.
     */
    abstract stereo: AbstractStereoAudio;
    /**
     * Releases associated resources.
     */
    dispose(): void;
    protected abstract _createSpatialProperty(autoUpdate: boolean, minUpdateTime: number): AbstractSpatialAudio;
    protected _initSpatialProperty(): AbstractSpatialAudio;
    private _onOutBusDisposed;
    /** @internal */
    get _isSpatial(): boolean;
    set _isSpatial(value: boolean);
}

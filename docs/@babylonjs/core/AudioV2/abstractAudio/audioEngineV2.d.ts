import { type IDisposable } from "../../scene.js";
import { type Nullable } from "../../types.js";
import { type IReadonlyObservable, Observable } from "../../Misc/observable.js";
import { type IAudioParameterRampOptions } from "../audioParameter.js";
import { type AbstractAudioNode, type AbstractNamedAudioNode } from "./abstractAudioNode.js";
import { type AbstractSound } from "./abstractSound.js";
import { type AbstractSoundSource, type ISoundSourceOptions } from "./abstractSoundSource.js";
import { type AudioBus, type IAudioBusOptions } from "./audioBus.js";
import { type IMainAudioBusOptions, type MainAudioBus } from "./mainAudioBus.js";
import { type IStaticSoundOptions, type StaticSound } from "./staticSound.js";
import { type IStaticSoundBufferOptions, type StaticSoundBuffer } from "./staticSoundBuffer.js";
import { type IStreamingSoundOptions, type StreamingSound } from "./streamingSound.js";
import { type AbstractSpatialAudioListener, type ISpatialAudioListenerOptions } from "./subProperties/abstractSpatialAudioListener.js";
/**
 * Observable that notifies when a new v2 audio engine instance has been created.
 * - Fires after the engine has been fully constructed and initialized (e.g. from {@link CreateAudioEngineAsync}),
 *   so subclass state (audio context, listener, etc.) is guaranteed to be available to observers.
 */
export declare const OnAudioEngineV2CreatedObservable: Observable<AudioEngineV2>;
/**
 * Gets the most recently created v2 audio engine.
 * @returns The most recently created v2 audio engine.
 */
export declare function LastCreatedAudioEngine(): Nullable<AudioEngineV2>;
/**
 * Options for creating a v2 audio engine.
 */
export interface IAudioEngineV2Options extends ISpatialAudioListenerOptions {
    /**
     * The smoothing duration to use when changing audio parameters, in seconds. Defaults to `0.01` (10 milliseconds).
     */
    parameterRampDuration: number;
    /**
     * The initial output volume of the audio engine. Defaults to `1`.
     */
    volume: number;
}
/**
 * The state of a v2 audio engine.
 * @see {@link AudioEngineV2.state}
 */
export type AudioEngineV2State = "closed" | "interrupted" | "running" | "suspended";
/**
 * Abstract base class for v2 audio engines.
 *
 * A v2 audio engine based on the WebAudio API can be created with the {@link CreateAudioEngineAsync} function.
 */
export declare abstract class AudioEngineV2 implements IDisposable {
    /**
     * The list of v2 audio engines that have been created and not yet disposed.
     * - Engines are added on construction and removed on {@link AudioEngineV2.dispose}.
     */
    static get Instances(): ReadonlyArray<AudioEngineV2>;
    /** Not owned, but all items should be in `_nodes` container, too, which is owned. */
    private readonly _mainBuses;
    private readonly _sounds;
    private _soundsArray;
    /** Owned top-level sound and bus nodes. */
    private readonly _nodes;
    private _defaultMainBus;
    private _parameterRampDuration;
    private readonly _onNodeAddedObservable;
    private readonly _onNodeRemovedObservable;
    private readonly _onDisposeObservable;
    /**
     * Observable that notifies when a top-level audio node (sound, sound source, bus, or main bus) is added to this engine.
     */
    get onNodeAddedObservable(): IReadonlyObservable<AbstractNamedAudioNode>;
    /**
     * Observable that notifies when a top-level audio node (sound, sound source, bus, or main bus) is removed from this engine.
     */
    get onNodeRemovedObservable(): IReadonlyObservable<AbstractNamedAudioNode>;
    /**
     * Observable that notifies when this engine is disposed.
     * - Fires from {@link AudioEngineV2.dispose} after the engine has been removed from {@link AudioEngineV2.Instances}.
     */
    get onDisposeObservable(): IReadonlyObservable<AudioEngineV2>;
    protected constructor(options: Partial<IAudioEngineV2Options>);
    /**
     * The elapsed time since the audio engine was started, in seconds.
     */
    abstract readonly currentTime: number;
    /**
     * The default main bus that will be used for audio buses and sounds if their `outBus` option is not set.
     * @see {@link IAudioBusOptions.outBus}
     * @see {@link IAbstractSoundOptions.outBus}
     */
    get defaultMainBus(): Nullable<MainAudioBus>;
    /**
     * The spatial audio listener properties for the audio engine.
     * - Each audio engine has exactly one listener.
     */
    abstract readonly listener: AbstractSpatialAudioListener;
    /**
     * The main output node.
     * - This is the last node in the audio graph before the audio is sent to the speakers.
     */
    abstract readonly mainOut: AbstractAudioNode;
    /**
     * The current state of the audio engine.
     *
     * Possible values are:
     * - `"closed"`: The audio engine has been closed.
     * - `"interrupted"`: The audio engine has been interrupted and is not running.
     * - `"running"`: The audio engine is running normally.
     * - `"suspended"`: The audio engine is suspended and is not running.
     */
    abstract readonly state: AudioEngineV2State;
    /**
     * The output volume of the audio engine.
     */
    abstract volume: number;
    /**
     * The smoothing duration to use when changing audio parameters, in seconds. Defaults to `0.01` (10 milliseconds).
     */
    get parameterRampDuration(): number;
    set parameterRampDuration(value: number);
    /**
     * The list of static and streaming sounds created by the audio engine.
     */
    get sounds(): ReadonlyArray<AbstractSound>;
    /**
     * The list of top-level audio nodes (sounds, sound sources, buses, main buses) owned by the audio engine.
     */
    get nodes(): ReadonlySet<AbstractNamedAudioNode>;
    /**
     * Creates a new audio bus.
     * @param name - The name of the audio bus.
     * @param options - The options to use when creating the audio bus.
     * @returns A promise that resolves with the created audio bus.
     */
    abstract createBusAsync(name: string, options?: Partial<IAudioBusOptions>): Promise<AudioBus>;
    /**
     * Creates a new main audio bus.
     * @param name - The name of the main audio bus.
     * @param options - The options to use when creating the main audio bus.
     * @returns A promise that resolves with the created main audio bus.
     */
    abstract createMainBusAsync(name: string, options?: Partial<IMainAudioBusOptions>): Promise<MainAudioBus>;
    /**
     * Creates a new microphone sound source.
     * @param name - The name of the sound.
     * @param options - The options for the sound source.
     * @returns A promise that resolves to the created sound source.
     */
    abstract createMicrophoneSoundSourceAsync(name: string, options?: Partial<ISoundSourceOptions>): Promise<AbstractSoundSource>;
    /**
     * Creates a new static sound.
     * @param name - The name of the sound.
     * @param source - The source of the sound.
     * @param options - The options for the static sound.
     * @returns A promise that resolves to the created static sound.
     */
    abstract createSoundAsync(name: string, source: ArrayBuffer | AudioBuffer | StaticSoundBuffer | string | string[], options?: Partial<IStaticSoundOptions>): Promise<StaticSound>;
    /**
     * Creates a new static sound buffer.
     * @param source - The source of the sound buffer.
     * @param options - The options for the static sound buffer.
     * @returns A promise that resolves to the created static sound buffer.
     */
    abstract createSoundBufferAsync(source: ArrayBuffer | AudioBuffer | StaticSoundBuffer | string | string[], options?: Partial<IStaticSoundBufferOptions>): Promise<StaticSoundBuffer>;
    /**
     * Creates a new sound source.
     * @param name - The name of the sound.
     * @param source - The source of the sound.
     * @param options - The options for the sound source.
     * @returns A promise that resolves to the created sound source.
     */
    abstract createSoundSourceAsync(name: string, source: AudioNode, options?: Partial<ISoundSourceOptions>): Promise<AbstractSoundSource>;
    /**
     * Creates a new streaming sound.
     * @param name - The name of the sound.
     * @param source - The source of the sound.
     * @param options - The options for the streaming sound.
     * @returns A promise that resolves to the created streaming sound.
     */
    abstract createStreamingSoundAsync(name: string, source: HTMLMediaElement | string | string[], options?: Partial<IStreamingSoundOptions>): Promise<StreamingSound>;
    /**
     * Releases associated resources.
     */
    dispose(): void;
    /**
     * Checks if the specified format is valid.
     * @param format The format to check as an audio file extension like "mp3" or "wav".
     * @returns `true` if the format is valid; otherwise `false`.
     */
    abstract isFormatValid(format: string): boolean;
    /**
     * Pauses the audio engine if it is running.
     * @returns A promise that resolves when the audio engine is paused.
     */
    abstract pauseAsync(): Promise<void>;
    /**
     * Resumes the audio engine if it is not running.
     * @returns A promise that resolves when the audio engine is running.
     */
    abstract resumeAsync(): Promise<void>;
    /**
     * Sets the audio output volume with optional ramping.
     * If the duration is 0 then the volume is set immediately, otherwise it is ramped to the new value over the given duration using the given shape.
     * If a ramp is already in progress then the volume is not set and an error is thrown.
     * @param value The value to set the volume to.
     * @param options The options to use for ramping the volume change.
     */
    abstract setVolume(value: number, options?: Partial<IAudioParameterRampOptions>): void;
    /**
     * Unlocks the audio engine if it is locked.
     * - Note that the returned promise may already be resolved if the audio engine is already unlocked.
     * @returns A promise that is resolved when the audio engine is unlocked.
     */
    unlockAsync(): Promise<void>;
    protected _addMainBus(mainBus: MainAudioBus): void;
    protected _removeMainBus(mainBus: MainAudioBus): void;
    protected _addNode(node: AbstractNamedAudioNode): void;
    protected _removeNode(node: AbstractNamedAudioNode): void;
    protected _addSound(sound: AbstractSound): void;
    protected _removeSound(sound: AbstractSound): void;
    /**
     * Called when any sound's playback state changes (started, stopped, paused, resumed).
     * Override in platform-specific implementations to react to sound playback state changes.
     * @internal
     */
    _onSoundPlaybackStateChanged(): void;
    private _disposeSoundsArray;
}
/**
 * @internal
 * @param engine - The given audio engine. If `null` then the last created audio engine is used.
 * @returns the given audio engine or the last created audio engine.
 * @throws An error if the resulting engine is `null`.
 */
export declare function _GetAudioEngine(engine: Nullable<AudioEngineV2>): AudioEngineV2;
/**
 * Creates a new audio bus.
 * @param name - The name of the audio bus.
 * @param options - The options to use when creating the audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created audio bus.
 */
export declare function CreateAudioBusAsync(name: string, options?: Partial<IAudioBusOptions>, engine?: Nullable<AudioEngineV2>): Promise<AudioBus>;
/**
 * Creates a new main audio bus.
 * @param name - The name of the main audio bus.
 * @param options - The options to use when creating the main audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created main audio bus.
 */
export declare function CreateMainAudioBusAsync(name: string, options?: Partial<IMainAudioBusOptions>, engine?: Nullable<AudioEngineV2>): Promise<MainAudioBus>;
/**
 * Creates a new microphone sound source.
 * @param name - The name of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
export declare function CreateMicrophoneSoundSourceAsync(name: string, options?: Partial<ISoundSourceOptions>, engine?: Nullable<AudioEngineV2>): Promise<AbstractSoundSource>;
/**
 * Creates a new static sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the static sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound.
 */
export declare function CreateSoundAsync(name: string, source: ArrayBuffer | AudioBuffer | StaticSoundBuffer | string | string[], options?: Partial<IStaticSoundOptions>, engine?: Nullable<AudioEngineV2>): Promise<StaticSound>;
/**
 * Creates a new static sound buffer.
 * @param source - The source of the sound buffer.
 * @param options - The options for the static sound buffer.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound buffer.
 */
export declare function CreateSoundBufferAsync(source: ArrayBuffer | AudioBuffer | StaticSoundBuffer | string | string[], options?: Partial<IStaticSoundBufferOptions>, engine?: Nullable<AudioEngineV2>): Promise<StaticSoundBuffer>;
/**
 * Creates a new sound source.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
export declare function CreateSoundSourceAsync(name: string, source: AudioNode, options?: Partial<ISoundSourceOptions>, engine?: Nullable<AudioEngineV2>): Promise<AbstractSoundSource>;
/**
 * Creates a new streaming sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the streaming sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created streaming sound.
 */
export declare function CreateStreamingSoundAsync(name: string, source: HTMLMediaElement | string | string[], options?: Partial<IStreamingSoundOptions>, engine?: Nullable<AudioEngineV2>): Promise<StreamingSound>;

/** This file must only contain pure code and pure imports */
import { _WebAudioEngine } from "../AudioV2/webAudio/webAudioEngine.js";
import { Observable } from "../Misc/observable.pure.js";
import { type Analyser } from "./analyser.js";
import { type IAudioEngine } from "./Interfaces/IAudioEngine.js";
import { type Nullable } from "../types.js";
/**
 * This represents the default audio engine used in babylon.
 * It is responsible to play, synchronize and analyse sounds throughout the  application.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic
 */
export declare class AudioEngine implements IAudioEngine {
    private _masterGain;
    private _tryToRun;
    private _useCustomUnlockedButton;
    /**
     * Gets whether the current host supports Web Audio and thus could create AudioContexts.
     */
    canUseWebAudio: boolean;
    /**
     * The master gain node defines the global audio volume of your audio engine.
     */
    get masterGain(): GainNode;
    set masterGain(value: GainNode);
    /**
     * Defines if Babylon should emit a warning if WebAudio is not supported.
     */
    WarnedWebAudioUnsupported: boolean;
    /**
     * Gets whether or not mp3 are supported by your browser.
     */
    isMP3supported: boolean;
    /**
     * Gets whether or not ogg are supported by your browser.
     */
    isOGGsupported: boolean;
    /**
     * Gets whether audio has been unlocked on the device.
     * Some Browsers have strong restrictions about Audio and won't autoplay unless
     * a user interaction has happened.
     */
    unlocked: boolean;
    /**
     * Defines if the audio engine relies on a custom unlocked button.
     * In this case, the embedded button will not be displayed.
     */
    get useCustomUnlockedButton(): boolean;
    set useCustomUnlockedButton(value: boolean);
    /**
     * Event raised when audio has been unlocked on the browser.
     */
    onAudioUnlockedObservable: Observable<IAudioEngine>;
    /**
     * Event raised when audio has been locked on the browser.
     */
    onAudioLockedObservable: Observable<IAudioEngine>;
    /** @internal */
    _v2: _WebAudioEngine;
    /**
     * Gets the current AudioContext if available.
     */
    get audioContext(): Nullable<AudioContext>;
    private _connectedAnalyser;
    /**
     * Instantiates a new audio engine.
     *
     * @param hostElement defines the host element where to display the mute icon if necessary
     * @param audioContext defines the audio context to be used by the audio engine
     * @param audioDestination defines the audio destination node to be used by audio engine
     */
    constructor(hostElement?: Nullable<HTMLElement>, audioContext?: Nullable<AudioContext>, audioDestination?: Nullable<AudioDestinationNode | MediaStreamAudioDestinationNode>);
    /**
     * Flags the audio engine in Locked state.
     * This happens due to new browser policies preventing audio to autoplay.
     */
    lock(): void;
    /**
     * Unlocks the audio engine once a user action has been done on the dom.
     * This is helpful to resume play once browser policies have been satisfied.
     */
    unlock(): void;
    /** @internal */
    _resumeAudioContextOnStateChange(): void;
    private _resumeAudioContextAsync;
    /**
     * Destroy and release the resources associated with the audio context.
     */
    dispose(): void;
    /**
     * Gets the global volume sets on the master gain.
     * @returns the global volume if set or -1 otherwise
     */
    getGlobalVolume(): number;
    /**
     * Sets the global volume of your experience (sets on the master gain).
     * @param newVolume Defines the new global volume of the application
     */
    setGlobalVolume(newVolume: number): void;
    /**
     * Connect the audio engine to an audio analyser allowing some amazing
     * synchronization between the sounds/music and your visualization (VuMeter for instance).
     * @see https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#using-the-analyser
     * @param analyser The analyser to connect to the engine
     */
    connectToAnalyser(analyser: Analyser): void;
    private _triggerRunningStateAsync;
}
/**
 * Register side effects for audioEngine.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAudioEngine(): void;

/** This file must only contain pure code and pure imports */
import { _WebAudioEngine } from "../AudioV2/webAudio/webAudioEngine.js";
import { Observable } from "../Misc/observable.pure.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
/**
 * This represents the default audio engine used in babylon.
 * It is responsible to play, synchronize and analyse sounds throughout the  application.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic
 */
export class AudioEngine {
    /**
     * The master gain node defines the global audio volume of your audio engine.
     */
    get masterGain() {
        return this._masterGain;
    }
    set masterGain(value) {
        this._masterGain = this._v2.mainOut._inNode = value;
    }
    /**
     * Defines if the audio engine relies on a custom unlocked button.
     * In this case, the embedded button will not be displayed.
     */
    get useCustomUnlockedButton() {
        return this._useCustomUnlockedButton;
    }
    set useCustomUnlockedButton(value) {
        this._useCustomUnlockedButton = value;
        this._v2._unmuteUIEnabled = !value;
    }
    /**
     * Gets the current AudioContext if available.
     */
    get audioContext() {
        if (this._v2.state === "running") {
            // Do not wait for the promise to unlock.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._triggerRunningStateAsync();
        }
        return this._v2._audioContext;
    }
    /**
     * Instantiates a new audio engine.
     *
     * @param hostElement defines the host element where to display the mute icon if necessary
     * @param audioContext defines the audio context to be used by the audio engine
     * @param audioDestination defines the audio destination node to be used by audio engine
     */
    constructor(hostElement = null, audioContext = null, audioDestination = null) {
        this._tryToRun = false;
        this._useCustomUnlockedButton = false;
        /**
         * Gets whether the current host supports Web Audio and thus could create AudioContexts.
         */
        this.canUseWebAudio = true;
        /**
         * Defines if Babylon should emit a warning if WebAudio is not supported.
         */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.WarnedWebAudioUnsupported = false;
        /**
         * Gets whether or not mp3 are supported by your browser.
         */
        this.isMP3supported = false;
        /**
         * Gets whether or not ogg are supported by your browser.
         */
        this.isOGGsupported = false;
        /**
         * Gets whether audio has been unlocked on the device.
         * Some Browsers have strong restrictions about Audio and won't autoplay unless
         * a user interaction has happened.
         */
        this.unlocked = false;
        /**
         * Event raised when audio has been unlocked on the browser.
         */
        this.onAudioUnlockedObservable = new Observable();
        /**
         * Event raised when audio has been locked on the browser.
         */
        this.onAudioLockedObservable = new Observable();
        const v2 = new _WebAudioEngine({
            audioContext: audioContext ? audioContext : undefined,
            defaultUIParentElement: hostElement?.parentElement ? hostElement.parentElement : undefined,
        });
        // Historically the unmute button is disabled until a sound tries to play and can't, which results in a call
        // to `AudioEngine.lock()`, which is where the unmute button is enabled if no custom UI is requested.
        v2._unmuteUIEnabled = false;
        this._masterGain = new GainNode(v2._audioContext);
        v2._audioDestination = audioDestination;
        v2.stateChangedObservable.add((state) => {
            if (state === "running") {
                this.unlocked = true;
                this.onAudioUnlockedObservable.notifyObservers(this);
            }
            else {
                this.unlocked = false;
                this.onAudioLockedObservable.notifyObservers(this);
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
        v2._initAsync({ resumeOnInteraction: false }).then(() => {
            const mainBusOutNode = v2.defaultMainBus._outNode;
            if (mainBusOutNode) {
                mainBusOutNode.disconnect(v2.mainOut._inNode);
                mainBusOutNode.connect(this._masterGain);
            }
            v2.mainOut._inNode = this._masterGain;
            v2.stateChangedObservable.notifyObservers(v2.state);
        });
        this.isMP3supported = v2.isFormatValid("mp3");
        this.isOGGsupported = v2.isFormatValid("ogg");
        this._v2 = v2;
    }
    /**
     * Flags the audio engine in Locked state.
     * This happens due to new browser policies preventing audio to autoplay.
     */
    lock() {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._v2._audioContext.suspend();
        if (!this._useCustomUnlockedButton) {
            this._v2._unmuteUIEnabled = true;
        }
    }
    /**
     * Unlocks the audio engine once a user action has been done on the dom.
     * This is helpful to resume play once browser policies have been satisfied.
     */
    unlock() {
        if (this._v2._audioContext?.state === "running") {
            if (!this.unlocked) {
                // Notify users that the audio stack is unlocked/unmuted
                this.unlocked = true;
                this.onAudioUnlockedObservable.notifyObservers(this);
            }
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._triggerRunningStateAsync();
    }
    /** @internal */
    _resumeAudioContextOnStateChange() {
        this._v2._audioContext?.addEventListener("statechange", () => {
            if (this.unlocked && this._v2._audioContext?.state !== "running") {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this._resumeAudioContextAsync();
            }
        }, {
            once: true,
            passive: true,
            signal: AbortSignal.timeout(3000),
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _resumeAudioContextAsync() {
        if (this._v2._isUsingOfflineAudioContext) {
            return Promise.resolve();
        }
        if (this._v2._audioContext.state === "suspended" && !this._useCustomUnlockedButton) {
            this._v2._unmuteUIEnabled = true;
        }
        return this._v2._audioContext.resume();
    }
    /**
     * Destroy and release the resources associated with the audio context.
     */
    dispose() {
        this._v2.dispose();
        this.onAudioUnlockedObservable.clear();
        this.onAudioLockedObservable.clear();
    }
    /**
     * Gets the global volume sets on the master gain.
     * @returns the global volume if set or -1 otherwise
     */
    getGlobalVolume() {
        return this.masterGain.gain.value;
    }
    /**
     * Sets the global volume of your experience (sets on the master gain).
     * @param newVolume Defines the new global volume of the application
     */
    setGlobalVolume(newVolume) {
        this.masterGain.gain.value = newVolume;
    }
    /**
     * Connect the audio engine to an audio analyser allowing some amazing
     * synchronization between the sounds/music and your visualization (VuMeter for instance).
     * @see https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#using-the-analyser
     * @param analyser The analyser to connect to the engine
     */
    connectToAnalyser(analyser) {
        if (this._connectedAnalyser) {
            this._connectedAnalyser.stopDebugCanvas();
        }
        this._connectedAnalyser = analyser;
        this.masterGain.disconnect();
        this._connectedAnalyser.connectAudioNodes(this.masterGain, this._v2._audioContext.destination);
    }
    async _triggerRunningStateAsync() {
        if (this._tryToRun) {
            void this._v2._audioContext.resume();
            return;
        }
        this._tryToRun = true;
        await this._resumeAudioContextAsync();
        this._tryToRun = false;
        this.unlocked = true;
        this.onAudioUnlockedObservable.notifyObservers(this);
    }
}
let _Registered = false;
/**
 * Register side effects for audioEngine.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAudioEngine() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // Sets the default audio engine to Babylon.js
    AbstractEngine.AudioEngineFactory = (hostElement, audioContext, audioDestination) => {
        return new AudioEngine(hostElement, audioContext, audioDestination);
    };
}
//# sourceMappingURL=audioEngine.pure.js.map
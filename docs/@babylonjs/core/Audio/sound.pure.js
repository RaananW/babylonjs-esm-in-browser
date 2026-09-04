/** This file must only contain pure code and pure imports */
import { _HasSpatialAudioOptions, _SpatialAudioDefaults } from "../AudioV2/abstractAudio/subProperties/abstractSpatialAudio.js";
import { _WebAudioSoundSource } from "../AudioV2/webAudio/webAudioSoundSource.js";
import { _WebAudioStaticSound } from "../AudioV2/webAudio/webAudioStaticSound.js";
import { _WebAudioStreamingSound } from "../AudioV2/webAudio/webAudioStreamingSound.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { _WarnImport } from "../Misc/devTools.js";
import { Logger } from "../Misc/logger.js";
import { Observable } from "../Misc/observable.pure.js";
import { _RetryWithInterval } from "../Misc/timingTools.js";
import { RegisterClass } from "../Misc/typeStore.js";
import { RegisterAudioSceneComponent } from "./audioSceneComponent.pure.js";
const TmpRampOptions = {
    duration: 0,
    shape: "linear" /* AudioParameterRampShape.Linear */,
};
const TmpPlayOptions = {
    duration: 0,
    startOffset: 0,
    waitTime: 0,
};
const TmpStopOptions = {
    waitTime: 0,
};
function D2r(degrees) {
    return (degrees * Math.PI) / 180;
}
function R2d(radians) {
    return (radians * 180) / Math.PI;
}
/**
 * Defines a sound that can be played in the application.
 * The sound can either be an ambient track or a simple sound played in reaction to a user action.
 * @see https://doc.babylonjs.com/legacy/audio
 */
export class Sound {
    /**
     * The name of the sound in the scene.
     */
    get name() {
        return this._soundV2.name;
    }
    set name(value) {
        this._soundV2.name = value;
    }
    /**
     * Does the sound autoplay once loaded.
     */
    get autoplay() {
        return this._soundV2 instanceof _WebAudioSoundSource ? true : this._optionsV2.autoplay;
    }
    set autoplay(value) {
        this._optionsV2.autoplay = value;
    }
    /**
     * Does the sound loop after it finishes playing once.
     */
    get loop() {
        return this._soundV2 instanceof _WebAudioSoundSource ? true : this._soundV2.loop;
    }
    set loop(value) {
        if (this._soundV2 instanceof _WebAudioSoundSource) {
            return;
        }
        if (this._soundV2) {
            this._soundV2.loop = value;
        }
    }
    /**
     * Is this sound currently played.
     */
    get isPlaying() {
        return this._soundV2 instanceof _WebAudioSoundSource ? true : this._soundV2?.state === 3 /* SoundState.Started */ || (!this.isReady() && this._optionsV2.autoplay);
    }
    /**
     * Is this sound currently paused.
     */
    get isPaused() {
        return this._soundV2 instanceof _WebAudioSoundSource ? false : this._soundV2.state === 5 /* SoundState.Paused */;
    }
    /**
     * Define the max distance the sound should be heard (intensity just became 0 at this point).
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get maxDistance() {
        return this._optionsV2.spatialMaxDistance || 100;
    }
    set maxDistance(value) {
        this._optionsV2.spatialMaxDistance = value;
        if (this.useCustomAttenuation) {
            return;
        }
        if (this._soundV2) {
            this._initSpatial();
            this._soundV2.spatial.maxDistance = value;
        }
    }
    /**
     * Define the distance attenuation model the sound will follow.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get distanceModel() {
        return this._optionsV2.spatialDistanceModel || "linear";
    }
    set distanceModel(value) {
        this._optionsV2.spatialDistanceModel = value;
        if (this._soundV2) {
            this._initSpatial();
            this._soundV2.spatial.distanceModel = value;
        }
    }
    /**
     * Gets the current time for the sound.
     */
    get currentTime() {
        return this._soundV2 instanceof _WebAudioSoundSource ? this._soundV2.engine.currentTime : this._soundV2.currentTime;
    }
    /**
     * Does this sound enables spatial sound.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get spatialSound() {
        return this._soundV2?._isSpatial ?? false;
    }
    /**
     * Does this sound enables spatial sound.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    set spatialSound(newValue) {
        if (this._soundV2) {
            if (newValue) {
                this._initSpatial();
            }
            else {
                this._soundV2._isSpatial = false;
            }
        }
    }
    get _onReady() {
        if (!this._onReadyObservable) {
            this._onReadyObservable = new Observable();
        }
        return this._onReadyObservable;
    }
    /**
     * Create a sound and attach it to a scene
     * @param name Name of your sound
     * @param urlOrArrayBuffer Url to the sound to load async or ArrayBuffer, it also works with MediaStreams and AudioBuffers
     * @param scene defines the scene the sound belongs to
     * @param readyToPlayCallback Provide a callback function if you'd like to load your code once the sound is ready to be played
     * @param options Objects to provide with the current available options: autoplay, loop, volume, spatialSound, maxDistance, rolloffFactor, refDistance, distanceModel, panningModel, streaming
     */
    constructor(name, urlOrArrayBuffer, scene, readyToPlayCallback = null, options) {
        /**
         * Does the sound use a custom attenuation curve to simulate the falloff
         * happening when the source gets further away from the camera.
         * @see https://doc.babylonjs.com/legacy/audio#creating-your-own-custom-attenuation-function
         */
        this.useCustomAttenuation = false;
        /**
         * The sound track id this sound belongs to.
         */
        this.soundTrackId = -1;
        /**
         * Define the reference distance the sound should be heard perfectly.
         * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
         */
        this.refDistance = 1;
        /**
         * Define the roll off factor of spatial sounds.
         * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
         */
        this.rolloffFactor = 1;
        /**
         * Gets or sets an object used to store user defined information for the sound.
         */
        this.metadata = null;
        /**
         * Observable event when the current playing sound finishes.
         */
        this.onEndedObservable = new Observable();
        this._localDirection = new Vector3(1, 0, 0);
        this._volume = 1;
        this._isReadyToPlay = false;
        this._isDirectional = false;
        this._isOutputConnected = false;
        this._url = null;
        this._onReadyObservable = null;
        this._onReadyToPlay = () => {
            this._scene.mainSoundTrack.addSound(this);
            this._isReadyToPlay = true;
            this._readyToPlayCallback();
            if (this._onReadyObservable) {
                this._onReadyObservable.notifyObservers();
            }
            if (this._optionsV2.autoplay) {
                this.play();
            }
        };
        this._onended = () => {
            if (this.onended) {
                this.onended();
            }
            this.onEndedObservable.notifyObservers(this);
        };
        scene = scene || EngineStore.LastCreatedScene;
        if (!scene) {
            return;
        }
        this._scene = scene;
        RegisterAudioSceneComponent(Sound);
        Sound._SceneComponentInitialization(scene);
        this._readyToPlayCallback = readyToPlayCallback || (() => { });
        // Default custom attenuation function is a linear attenuation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._customAttenuationFunction = (currentVolume, currentDistance, maxDistance, refDistance, rolloffFactor) => {
            if (currentDistance < maxDistance) {
                return currentVolume * (1 - currentDistance / maxDistance);
            }
            else {
                return 0;
            }
        };
        options = options || {};
        const optionsV2 = {
            analyzerEnabled: false,
            autoplay: false, // `false` for now, but will be set to given option later
            duration: options.length || 0,
            loop: options.loop || false,
            loopEnd: 0,
            loopStart: 0,
            outBus: null,
            outBusAutoDefault: false,
            playbackRate: options.playbackRate || 1,
            pitch: 0,
            skipCodecCheck: options.skipCodecCheck || false,
            spatialDistanceModel: options.distanceModel,
            spatialEnabled: options.spatialSound,
            spatialMaxDistance: options.maxDistance,
            spatialMinDistance: options.refDistance,
            spatialRolloffFactor: options.rolloffFactor,
            stereoEnabled: false,
            startOffset: options.offset || 0,
            volume: options.volume ?? 1,
        };
        this._volume = options.volume ?? 1;
        if (_HasSpatialAudioOptions(optionsV2)) {
            optionsV2.spatialAutoUpdate = false;
            optionsV2.spatialConeInnerAngle = _SpatialAudioDefaults.coneInnerAngle;
            optionsV2.spatialConeOuterAngle = _SpatialAudioDefaults.coneOuterAngle;
            optionsV2.spatialConeOuterVolume = _SpatialAudioDefaults.coneOuterVolume;
            optionsV2.spatialMinUpdateTime = 0;
            optionsV2.spatialOrientation = _SpatialAudioDefaults.orientation.clone();
            optionsV2.spatialPanningModel = (this._scene.headphone ? "HRTF" : "equalpower");
            optionsV2.spatialPosition = _SpatialAudioDefaults.position.clone();
            optionsV2.spatialRotation = _SpatialAudioDefaults.rotation.clone();
            optionsV2.spatialRotationQuaternion = _SpatialAudioDefaults.rotationQuaternion.clone();
            if (optionsV2.spatialMaxDistance === undefined) {
                optionsV2.spatialMaxDistance = 100;
            }
        }
        this._optionsV2 = { ...optionsV2 };
        this._optionsV2.autoplay = options.autoplay || false;
        this.useCustomAttenuation = options.useCustomAttenuation ?? false;
        if (this.useCustomAttenuation) {
            optionsV2.spatialMaxDistance = Number.MAX_VALUE;
            optionsV2.volume = 0;
        }
        let streaming = options?.streaming || false;
        const audioEngine = AbstractEngine.audioEngine;
        if (!audioEngine) {
            return;
        }
        const audioEngineV2 = AbstractEngine.audioEngine._v2;
        const createSoundV2 = () => {
            if (streaming) {
                const streamingOptionsV2 = {
                    preloadCount: 0,
                    ...optionsV2,
                };
                const sound = new _WebAudioStreamingSound(name, audioEngineV2, streamingOptionsV2);
                // eslint-disable-next-line github/no-then
                void sound._initAsync(urlOrArrayBuffer, optionsV2).then(() => {
                    // eslint-disable-next-line github/no-then
                    void sound.preloadInstancesAsync(1).then(this._onReadyToPlay);
                });
                return sound;
            }
            else {
                const sound = new _WebAudioStaticSound(name, audioEngineV2, optionsV2);
                // eslint-disable-next-line github/no-then
                void sound._initAsync(urlOrArrayBuffer, optionsV2).then(this._onReadyToPlay);
                return sound;
            }
        };
        // If no parameter is passed then the setAudioBuffer should be called to prepare the sound.
        if (!urlOrArrayBuffer) {
            // Create the sound but don't call _initAsync on it, yet. Call it later when `setAudioBuffer` is called.
            this._soundV2 = new _WebAudioStaticSound(name, audioEngineV2, optionsV2);
        }
        else if (typeof urlOrArrayBuffer === "string") {
            this._url = urlOrArrayBuffer;
            this._soundV2 = createSoundV2();
        }
        else if (urlOrArrayBuffer instanceof ArrayBuffer) {
            streaming = false;
            this._soundV2 = createSoundV2();
        }
        else if (urlOrArrayBuffer instanceof HTMLMediaElement) {
            streaming = true;
            this._soundV2 = createSoundV2();
        }
        else if (urlOrArrayBuffer instanceof MediaStream) {
            const node = new MediaStreamAudioSourceNode(audioEngineV2._audioContext, { mediaStream: urlOrArrayBuffer });
            this._soundV2 = new _WebAudioSoundSource(name, node, audioEngineV2, optionsV2);
            // eslint-disable-next-line github/no-then
            void this._soundV2._initAsync(optionsV2).then(this._onReadyToPlay);
        }
        else if (urlOrArrayBuffer instanceof AudioBuffer) {
            streaming = false;
            this._soundV2 = createSoundV2();
        }
        else if (Array.isArray(urlOrArrayBuffer)) {
            this._soundV2 = createSoundV2();
        }
        if (!this._soundV2) {
            Logger.Error("Parameter must be a URL to the sound, an Array of URLs (.mp3 & .ogg) or an ArrayBuffer of the sound.");
            return;
        }
        if (!(this._soundV2 instanceof _WebAudioSoundSource)) {
            this._soundV2.onEndedObservable.add(this._onended);
        }
    }
    /**
     * Release the sound and its associated resources
     */
    dispose() {
        if (this.isPlaying) {
            this.stop();
        }
        this._isReadyToPlay = false;
        if (this.soundTrackId === -1) {
            this._scene.mainSoundTrack.removeSound(this);
        }
        else if (this._scene.soundTracks) {
            this._scene.soundTracks[this.soundTrackId].removeSound(this);
        }
        if (this._connectedTransformNode && this._registerFunc) {
            this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
            this._connectedTransformNode = null;
        }
        this._soundV2.dispose();
    }
    /**
     * Gets if the sounds is ready to be played or not.
     * @returns true if ready, otherwise false
     */
    isReady() {
        return this._isReadyToPlay;
    }
    /**
     * Get the current class name.
     * @returns current class name
     */
    getClassName() {
        return "Sound";
    }
    /**
     * Sets the data of the sound from an audiobuffer
     * @param audioBuffer The audioBuffer containing the data
     */
    setAudioBuffer(audioBuffer) {
        if (this._isReadyToPlay) {
            return;
        }
        if (this._soundV2 instanceof _WebAudioStaticSound) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
            this._soundV2._initAsync(audioBuffer, this._optionsV2).then(this._onReadyToPlay);
        }
    }
    /**
     * Updates the current sounds options such as maxdistance, loop...
     * @param options A JSON object containing values named as the object properties
     */
    updateOptions(options) {
        if (options) {
            this.loop = options.loop ?? this.loop;
            this.maxDistance = options.maxDistance ?? this.maxDistance;
            this.useCustomAttenuation = options.useCustomAttenuation ?? this.useCustomAttenuation;
            this.rolloffFactor = options.rolloffFactor ?? this.rolloffFactor;
            this.refDistance = options.refDistance ?? this.refDistance;
            this.distanceModel = options.distanceModel ?? this.distanceModel;
            if (options.playbackRate !== undefined) {
                this.setPlaybackRate(options.playbackRate);
            }
            if (options.spatialSound !== undefined) {
                this.spatialSound = options.spatialSound;
            }
            if (options.volume !== undefined) {
                this.setVolume(options.volume);
            }
            if (this._soundV2 instanceof _WebAudioStaticSound) {
                let updated = false;
                if (options.offset !== undefined) {
                    this._optionsV2.startOffset = options.offset;
                    updated = true;
                }
                if (options.length !== undefined) {
                    this._soundV2.duration = options.length;
                    updated = true;
                }
                if (updated && this.isPaused) {
                    this.stop();
                }
            }
            this._updateSpatialParameters();
        }
    }
    _updateSpatialParameters() {
        if (!this.spatialSound) {
            return;
        }
        const spatial = this._soundV2.spatial;
        if (this.useCustomAttenuation) {
            // Disable WebAudio attenuation.
            spatial.distanceModel = "linear";
            spatial.minDistance = 1;
            spatial.maxDistance = Number.MAX_VALUE;
            spatial.rolloffFactor = 1;
            spatial.panningModel = "equalpower";
        }
        else {
            spatial.distanceModel = this.distanceModel;
            spatial.minDistance = this.refDistance;
            spatial.maxDistance = this.maxDistance;
            spatial.rolloffFactor = this.rolloffFactor;
            spatial.panningModel = this._optionsV2.spatialPanningModel || "equalpower";
        }
    }
    /**
     * Switch the panning model to HRTF:
     * Renders a stereo output of higher quality than equalpower — it uses a convolution with measured impulse responses from human subjects.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    switchPanningModelToHRTF() {
        if (this.spatialSound) {
            this._initSpatial();
            this._soundV2.spatial.panningModel = "HRTF";
        }
    }
    /**
     * Switch the panning model to Equal Power:
     * Represents the equal-power panning algorithm, generally regarded as simple and efficient. equalpower is the default value.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    switchPanningModelToEqualPower() {
        if (this.spatialSound) {
            this._initSpatial();
            this._soundV2.spatial.panningModel = "equalpower";
        }
    }
    /**
     * Connect this sound to a sound track audio node like gain...
     * @param soundTrackAudioNode the sound track audio node to connect to
     */
    connectToSoundTrackAudioNode(soundTrackAudioNode) {
        const outputNode = this._soundV2._outNode;
        if (outputNode) {
            if (this._isOutputConnected) {
                outputNode.disconnect();
            }
            outputNode.connect(soundTrackAudioNode);
            this._isOutputConnected = true;
        }
    }
    /**
     * Transform this sound into a directional source
     * @param coneInnerAngle Size of the inner cone in degree
     * @param coneOuterAngle Size of the outer cone in degree
     * @param coneOuterGain Volume of the sound outside the outer cone (between 0.0 and 1.0)
     */
    setDirectionalCone(coneInnerAngle, coneOuterAngle, coneOuterGain) {
        if (coneOuterAngle < coneInnerAngle) {
            Logger.Error("setDirectionalCone(): outer angle of the cone must be superior or equal to the inner angle.");
            return;
        }
        this._optionsV2.spatialConeInnerAngle = D2r(coneInnerAngle);
        this._optionsV2.spatialConeOuterAngle = D2r(coneOuterAngle);
        this._optionsV2.spatialConeOuterVolume = coneOuterGain;
        this._initSpatial();
        this._soundV2.spatial.coneInnerAngle = this._optionsV2.spatialConeInnerAngle;
        this._soundV2.spatial.coneOuterAngle = this._optionsV2.spatialConeOuterAngle;
        this._soundV2.spatial.coneOuterVolume = coneOuterGain;
        this._isDirectional = true;
        if (this.isPlaying && this.loop) {
            this.stop();
            this.play(0, this._optionsV2.startOffset, this._optionsV2.duration);
        }
    }
    /**
     * Gets or sets the inner angle for the directional cone.
     */
    get directionalConeInnerAngle() {
        return R2d(typeof this._optionsV2.spatialConeInnerAngle === "number" ? this._optionsV2.spatialConeInnerAngle : _SpatialAudioDefaults.coneInnerAngle);
    }
    /**
     * Gets or sets the inner angle for the directional cone.
     */
    set directionalConeInnerAngle(value) {
        value = D2r(value);
        if (value != this._optionsV2.spatialConeInnerAngle) {
            if (this.directionalConeOuterAngle < value) {
                Logger.Error("directionalConeInnerAngle: outer angle of the cone must be superior or equal to the inner angle.");
                return;
            }
            this._optionsV2.spatialConeInnerAngle = value;
            if (this.spatialSound) {
                this._initSpatial();
                this._soundV2.spatial.coneInnerAngle = value;
            }
        }
    }
    /**
     * Gets or sets the outer angle for the directional cone.
     */
    get directionalConeOuterAngle() {
        return R2d(typeof this._optionsV2.spatialConeOuterAngle === "number" ? this._optionsV2.spatialConeOuterAngle : _SpatialAudioDefaults.coneOuterAngle);
    }
    /**
     * Gets or sets the outer angle for the directional cone.
     */
    set directionalConeOuterAngle(value) {
        value = D2r(value);
        if (value != this._optionsV2.spatialConeOuterAngle) {
            if (value < this.directionalConeInnerAngle) {
                Logger.Error("directionalConeOuterAngle: outer angle of the cone must be superior or equal to the inner angle.");
                return;
            }
            this._optionsV2.spatialConeOuterAngle = value;
            if (this.spatialSound) {
                this._initSpatial();
                this._soundV2.spatial.coneOuterAngle = value;
            }
        }
    }
    /**
     * Sets the position of the emitter if spatial sound is enabled
     * @param newPosition Defines the new position
     */
    setPosition(newPosition) {
        if (this._optionsV2.spatialPosition && newPosition.equals(this._optionsV2.spatialPosition)) {
            return;
        }
        if (!this._optionsV2.spatialPosition) {
            this._optionsV2.spatialPosition = Vector3.Zero();
        }
        this._optionsV2.spatialPosition.copyFrom(newPosition);
        if (this.spatialSound && !isNaN(newPosition.x) && !isNaN(newPosition.y) && !isNaN(newPosition.z)) {
            this._initSpatial();
            this._soundV2.spatial.position = newPosition;
        }
    }
    /**
     * Sets the local direction of the emitter if spatial sound is enabled
     * @param newLocalDirection Defines the new local direction
     */
    setLocalDirectionToMesh(newLocalDirection) {
        this._localDirection = newLocalDirection;
        if (this._connectedTransformNode && this.isPlaying) {
            this._updateDirection();
        }
    }
    _updateDirection() {
        if (!this._connectedTransformNode || !this.spatialSound) {
            return;
        }
        const mat = this._connectedTransformNode.getWorldMatrix();
        const direction = Vector3.TransformNormal(this._localDirection, mat);
        direction.normalize();
        this._initSpatial();
        this._soundV2.spatial.orientation = direction;
    }
    _initSpatial() {
        this._soundV2._isSpatial = true;
        if (this._optionsV2.spatialDistanceModel === undefined) {
            this._optionsV2.spatialDistanceModel = "linear";
            this._soundV2.spatial.distanceModel = "linear";
        }
        if (this._optionsV2.spatialMaxDistance === undefined) {
            this._optionsV2.spatialMaxDistance = 100;
            this._soundV2.spatial.maxDistance = 100;
        }
    }
    /** @internal */
    updateDistanceFromListener() {
        if (this._soundV2._outNode && this._connectedTransformNode && this.useCustomAttenuation && this._scene.activeCamera) {
            const distance = this._scene.audioListenerPositionProvider
                ? this._connectedTransformNode.position.subtract(this._scene.audioListenerPositionProvider()).length()
                : this._connectedTransformNode.getDistanceToCamera(this._scene.activeCamera);
            this._soundV2.volume = this._customAttenuationFunction(this._volume, distance, this.maxDistance, this.refDistance, this.rolloffFactor);
        }
    }
    /**
     * Sets a new custom attenuation function for the sound.
     * @param callback Defines the function used for the attenuation
     * @see https://doc.babylonjs.com/legacy/audio#creating-your-own-custom-attenuation-function
     */
    setAttenuationFunction(callback) {
        this._customAttenuationFunction = callback;
    }
    /**
     * Play the sound
     * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
     * @param offset (optional) Start the sound at a specific time in seconds
     * @param length (optional) Sound duration (in seconds)
     */
    play(time, offset, length) {
        const audioEngine = AbstractEngine.audioEngine;
        audioEngine?.unlock();
        // WebAudio sound sources have no `play` function because they are always playing.
        if (this._soundV2 instanceof _WebAudioSoundSource) {
            return;
        }
        if (this._isReadyToPlay && this._scene.audioEnabled) {
            // The sound can only resume from pause when the `time`, `offset` and `length` args are not set.
            if (this._soundV2.state === 5 /* SoundState.Paused */ && (time !== undefined || offset !== undefined || length !== undefined)) {
                this._soundV2.stop();
            }
            try {
                TmpPlayOptions.duration = length || 0;
                TmpPlayOptions.startOffset = offset !== undefined ? offset || this._optionsV2.startOffset : this._optionsV2.startOffset;
                TmpPlayOptions.waitTime = time || 0;
                TmpPlayOptions.loop = undefined;
                TmpPlayOptions.loopStart = undefined;
                TmpPlayOptions.loopEnd = undefined;
                TmpPlayOptions.volume = undefined;
                if (audioEngine?.unlocked) {
                    this._soundV2.play(TmpPlayOptions);
                }
                else {
                    // Wait a bit for FF as context seems late to be ready.
                    setTimeout(() => {
                        this._soundV2.play(TmpPlayOptions);
                    }, 500);
                }
            }
            catch (ex) {
                Logger.Error("Error while trying to play audio: " + this.name + ", " + ex.message);
            }
        }
    }
    /**
     * Stop the sound
     * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
     */
    stop(time) {
        if (!this._soundV2) {
            return;
        }
        // WebAudio sound sources have no `stop` function because they are always playing.
        if (this._soundV2 instanceof _WebAudioSoundSource) {
            return;
        }
        TmpStopOptions.waitTime = time || 0;
        this._soundV2.stop(TmpStopOptions);
    }
    /**
     * Put the sound in pause
     */
    pause() {
        if (!this._soundV2) {
            return;
        }
        // WebAudio sound sources have no `pause` function because they are always playing.
        if (this._soundV2 instanceof _WebAudioSoundSource) {
            return;
        }
        this._soundV2.pause();
    }
    /**
     * Sets a dedicated volume for this sounds
     * @param newVolume Define the new volume of the sound
     * @param time Define time for gradual change to new volume
     */
    setVolume(newVolume, time) {
        if (!this.isReady()) {
            this._onReady.addOnce(() => {
                this.setVolume(newVolume, time);
            });
            return;
        }
        TmpRampOptions.duration = time || 0;
        this._soundV2.setVolume(newVolume, TmpRampOptions);
        this._volume = newVolume;
    }
    /**
     * Set the sound play back rate
     * @param newPlaybackRate Define the playback rate the sound should be played at
     */
    setPlaybackRate(newPlaybackRate) {
        if (this._soundV2 instanceof _WebAudioStaticSound) {
            this._soundV2.playbackRate = newPlaybackRate;
        }
    }
    /**
     * Gets the sound play back rate.
     * @returns the  play back rate of the sound
     */
    getPlaybackRate() {
        if (this._soundV2 instanceof _WebAudioStaticSound) {
            return this._soundV2.playbackRate;
        }
        return 1;
    }
    /**
     * Gets the volume of the sound.
     * @returns the volume of the sound
     */
    getVolume() {
        return this._volume;
    }
    /**
     * Attach the sound to a dedicated mesh
     * @param transformNode The transform node to connect the sound with
     * @see https://doc.babylonjs.com/legacy/audio#attaching-a-sound-to-a-mesh
     */
    attachToMesh(transformNode) {
        if (this._connectedTransformNode && this._registerFunc) {
            this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
            this._registerFunc = null;
        }
        this._connectedTransformNode = transformNode;
        if (!this.spatialSound) {
            this.spatialSound = true;
            if (this.isPlaying && this.loop) {
                this.stop();
                this.play(0, this._optionsV2.startOffset, this._optionsV2.duration);
            }
        }
        this._onRegisterAfterWorldMatrixUpdate(this._connectedTransformNode);
        this._registerFunc = (transformNode) => this._onRegisterAfterWorldMatrixUpdate(transformNode);
        this._connectedTransformNode.registerAfterWorldMatrixUpdate(this._registerFunc);
    }
    /**
     * Detach the sound from the previously attached mesh
     * @see https://doc.babylonjs.com/legacy/audio#attaching-a-sound-to-a-mesh
     */
    detachFromMesh() {
        if (this._connectedTransformNode && this._registerFunc) {
            this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
            this._registerFunc = null;
            this._connectedTransformNode = null;
        }
    }
    _onRegisterAfterWorldMatrixUpdate(node) {
        if (!node.getBoundingInfo) {
            this.setPosition(node.absolutePosition);
        }
        else {
            const mesh = node;
            const boundingInfo = mesh.getBoundingInfo();
            this.setPosition(boundingInfo.boundingSphere.centerWorld);
        }
        if (this._isDirectional && this.isPlaying) {
            this._updateDirection();
        }
    }
    /**
     * Clone the current sound in the scene.
     * @returns the new sound clone
     */
    clone() {
        if (!(this._soundV2 instanceof _WebAudioStaticSound)) {
            return null;
        }
        const currentOptions = {
            autoplay: this.autoplay,
            loop: this.loop,
            volume: this._volume,
            spatialSound: this.spatialSound,
            maxDistance: this.maxDistance,
            useCustomAttenuation: this.useCustomAttenuation,
            rolloffFactor: this.rolloffFactor,
            refDistance: this.refDistance,
            distanceModel: this.distanceModel,
        };
        const clonedSound = new Sound(this.name + "_cloned", this._soundV2.buffer, this._scene, null, currentOptions);
        clonedSound._optionsV2 = this._optionsV2;
        if (this.useCustomAttenuation) {
            clonedSound.setAttenuationFunction(this._customAttenuationFunction);
        }
        return clonedSound;
    }
    /**
     * Gets the current underlying audio buffer containing the data
     * @returns the audio buffer
     */
    getAudioBuffer() {
        if (this._soundV2 instanceof _WebAudioStaticSound) {
            return this._soundV2.buffer._audioBuffer;
        }
        return null;
    }
    /**
     * Gets the WebAudio AudioBufferSourceNode, lets you keep track of and stop instances of this Sound.
     * @returns the source node
     */
    getSoundSource() {
        // return this._soundSource;
        return null;
    }
    /**
     * Gets the WebAudio GainNode, gives you precise control over the gain of instances of this Sound.
     * @returns the gain node
     */
    getSoundGain() {
        return this._soundV2._outNode;
    }
    /**
     * Serializes the Sound in a JSON representation
     * @returns the JSON representation of the sound
     */
    serialize() {
        const serializationObject = {
            name: this.name,
            url: this._url,
            autoplay: this.autoplay,
            loop: this.loop,
            volume: this._volume,
            spatialSound: this.spatialSound,
            maxDistance: this.maxDistance,
            rolloffFactor: this.rolloffFactor,
            refDistance: this.refDistance,
            distanceModel: this.distanceModel,
            playbackRate: this.getPlaybackRate(),
            panningModel: this._soundV2.spatial.panningModel,
            soundTrackId: this.soundTrackId,
            metadata: this.metadata,
        };
        if (this.spatialSound) {
            if (this._connectedTransformNode) {
                serializationObject.connectedMeshId = this._connectedTransformNode.id;
            }
            serializationObject.position = this._soundV2.spatial.position.asArray();
            serializationObject.refDistance = this.refDistance;
            serializationObject.distanceModel = this.distanceModel;
            serializationObject.isDirectional = this._isDirectional;
            serializationObject.localDirectionToMesh = this._localDirection.asArray();
            serializationObject.coneInnerAngle = this.directionalConeInnerAngle;
            serializationObject.coneOuterAngle = this.directionalConeOuterAngle;
            serializationObject.coneOuterGain = this._soundV2.spatial.coneOuterVolume;
        }
        return serializationObject;
    }
    /**
     * Parse a JSON representation of a sound to instantiate in a given scene
     * @param parsedSound Define the JSON representation of the sound (usually coming from the serialize method)
     * @param scene Define the scene the new parsed sound should be created in
     * @param rootUrl Define the rooturl of the load in case we need to fetch relative dependencies
     * @param sourceSound Define a sound place holder if do not need to instantiate a new one
     * @returns the newly parsed sound
     */
    static Parse(parsedSound, scene, rootUrl, sourceSound) {
        const soundName = parsedSound.name;
        let soundUrl;
        if (parsedSound.url) {
            soundUrl = rootUrl + parsedSound.url;
        }
        else {
            soundUrl = rootUrl + soundName;
        }
        const options = {
            autoplay: parsedSound.autoplay,
            loop: parsedSound.loop,
            volume: parsedSound.volume,
            spatialSound: parsedSound.spatialSound,
            maxDistance: parsedSound.maxDistance,
            rolloffFactor: parsedSound.rolloffFactor,
            refDistance: parsedSound.refDistance,
            distanceModel: parsedSound.distanceModel,
            playbackRate: parsedSound.playbackRate,
        };
        let newSound;
        if (!sourceSound) {
            newSound = new Sound(soundName, soundUrl, scene, () => {
                scene.removePendingData(newSound);
            }, options);
            scene.addPendingData(newSound);
        }
        else {
            const setBufferAndRun = () => {
                _RetryWithInterval(() => sourceSound._isReadyToPlay, () => {
                    const audioBuffer = sourceSound.getAudioBuffer();
                    if (audioBuffer) {
                        newSound.setAudioBuffer(audioBuffer);
                    }
                    newSound._isReadyToPlay = true;
                    if (newSound.autoplay) {
                        newSound.play(0, sourceSound._optionsV2.startOffset, sourceSound._optionsV2.duration);
                    }
                }, undefined, 300);
            };
            newSound = new Sound(soundName, new ArrayBuffer(0), scene, null, options);
            setBufferAndRun();
        }
        if (parsedSound.position) {
            const soundPosition = Vector3.FromArray(parsedSound.position);
            newSound.setPosition(soundPosition);
        }
        if (parsedSound.isDirectional) {
            newSound.setDirectionalCone(parsedSound.coneInnerAngle || 360, parsedSound.coneOuterAngle || 360, parsedSound.coneOuterGain || 0);
            if (parsedSound.localDirectionToMesh) {
                const localDirectionToMesh = Vector3.FromArray(parsedSound.localDirectionToMesh);
                newSound.setLocalDirectionToMesh(localDirectionToMesh);
            }
        }
        if (parsedSound.connectedMeshId) {
            const connectedMesh = scene.getMeshById(parsedSound.connectedMeshId);
            if (connectedMesh) {
                newSound.attachToMesh(connectedMesh);
            }
        }
        if (parsedSound.metadata) {
            newSound.metadata = parsedSound.metadata;
        }
        return newSound;
    }
}
/**
 * @internal
 */
Sound._SceneComponentInitialization = (_) => {
    throw _WarnImport("AudioSceneComponent");
};
// Register Class Name
let _Registered = false;
/**
 * Register side effects for sound.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSound() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.Sound", Sound);
}
//# sourceMappingURL=sound.pure.js.map
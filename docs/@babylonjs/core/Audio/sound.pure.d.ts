/** This file must only contain pure code and pure imports */
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type TransformNode } from "../Meshes/transformNode.pure.js";
import { Observable } from "../Misc/observable.pure.js";
import { type Scene } from "../scene.pure.js";
import { type Nullable } from "../types.js";
import { type ISoundOptions } from "./Interfaces/ISoundOptions.js";
/**
 * Defines a sound that can be played in the application.
 * The sound can either be an ambient track or a simple sound played in reaction to a user action.
 * @see https://doc.babylonjs.com/legacy/audio
 */
export declare class Sound {
    /**
     * The name of the sound in the scene.
     */
    get name(): string;
    set name(value: string);
    /**
     * Does the sound autoplay once loaded.
     */
    get autoplay(): boolean;
    set autoplay(value: boolean);
    /**
     * Does the sound loop after it finishes playing once.
     */
    get loop(): boolean;
    set loop(value: boolean);
    /**
     * Does the sound use a custom attenuation curve to simulate the falloff
     * happening when the source gets further away from the camera.
     * @see https://doc.babylonjs.com/legacy/audio#creating-your-own-custom-attenuation-function
     */
    useCustomAttenuation: boolean;
    /**
     * The sound track id this sound belongs to.
     */
    soundTrackId: number;
    /**
     * Is this sound currently played.
     */
    get isPlaying(): boolean;
    /**
     * Is this sound currently paused.
     */
    get isPaused(): boolean;
    /**
     * Define the reference distance the sound should be heard perfectly.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    refDistance: number;
    /**
     * Define the roll off factor of spatial sounds.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    rolloffFactor: number;
    /**
     * Define the max distance the sound should be heard (intensity just became 0 at this point).
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get maxDistance(): number;
    set maxDistance(value: number);
    /**
     * Define the distance attenuation model the sound will follow.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get distanceModel(): "linear" | "inverse" | "exponential";
    set distanceModel(value: "linear" | "inverse" | "exponential");
    /**
     * @internal
     * Back Compat
     **/
    onended: () => any;
    /**
     * Gets or sets an object used to store user defined information for the sound.
     */
    metadata: any;
    /**
     * Observable event when the current playing sound finishes.
     */
    onEndedObservable: Observable<Sound>;
    /**
     * Gets the current time for the sound.
     */
    get currentTime(): number;
    /**
     * Does this sound enables spatial sound.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    get spatialSound(): boolean;
    /**
     * Does this sound enables spatial sound.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    set spatialSound(newValue: boolean);
    private _localDirection;
    private _volume;
    private _isReadyToPlay;
    private _isDirectional;
    private _readyToPlayCallback;
    private _scene;
    private _connectedTransformNode;
    private _customAttenuationFunction;
    private _registerFunc;
    private _isOutputConnected;
    private _url;
    private readonly _optionsV2;
    private readonly _soundV2;
    private _onReadyObservable;
    private get _onReady();
    /**
     * @internal
     */
    static _SceneComponentInitialization: (scene: Scene) => void;
    /**
     * Create a sound and attach it to a scene
     * @param name Name of your sound
     * @param urlOrArrayBuffer Url to the sound to load async or ArrayBuffer, it also works with MediaStreams and AudioBuffers
     * @param scene defines the scene the sound belongs to
     * @param readyToPlayCallback Provide a callback function if you'd like to load your code once the sound is ready to be played
     * @param options Objects to provide with the current available options: autoplay, loop, volume, spatialSound, maxDistance, rolloffFactor, refDistance, distanceModel, panningModel, streaming
     */
    constructor(name: string, urlOrArrayBuffer: any, scene?: Nullable<Scene>, readyToPlayCallback?: Nullable<() => void>, options?: ISoundOptions);
    private _onReadyToPlay;
    /**
     * Release the sound and its associated resources
     */
    dispose(): void;
    /**
     * Gets if the sounds is ready to be played or not.
     * @returns true if ready, otherwise false
     */
    isReady(): boolean;
    /**
     * Get the current class name.
     * @returns current class name
     */
    getClassName(): string;
    /**
     * Sets the data of the sound from an audiobuffer
     * @param audioBuffer The audioBuffer containing the data
     */
    setAudioBuffer(audioBuffer: AudioBuffer): void;
    /**
     * Updates the current sounds options such as maxdistance, loop...
     * @param options A JSON object containing values named as the object properties
     */
    updateOptions(options: ISoundOptions): void;
    private _updateSpatialParameters;
    /**
     * Switch the panning model to HRTF:
     * Renders a stereo output of higher quality than equalpower — it uses a convolution with measured impulse responses from human subjects.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    switchPanningModelToHRTF(): void;
    /**
     * Switch the panning model to Equal Power:
     * Represents the equal-power panning algorithm, generally regarded as simple and efficient. equalpower is the default value.
     * @see https://doc.babylonjs.com/legacy/audio#creating-a-spatial-3d-sound
     */
    switchPanningModelToEqualPower(): void;
    /**
     * Connect this sound to a sound track audio node like gain...
     * @param soundTrackAudioNode the sound track audio node to connect to
     */
    connectToSoundTrackAudioNode(soundTrackAudioNode: AudioNode): void;
    /**
     * Transform this sound into a directional source
     * @param coneInnerAngle Size of the inner cone in degree
     * @param coneOuterAngle Size of the outer cone in degree
     * @param coneOuterGain Volume of the sound outside the outer cone (between 0.0 and 1.0)
     */
    setDirectionalCone(coneInnerAngle: number, coneOuterAngle: number, coneOuterGain: number): void;
    /**
     * Gets or sets the inner angle for the directional cone.
     */
    get directionalConeInnerAngle(): number;
    /**
     * Gets or sets the inner angle for the directional cone.
     */
    set directionalConeInnerAngle(value: number);
    /**
     * Gets or sets the outer angle for the directional cone.
     */
    get directionalConeOuterAngle(): number;
    /**
     * Gets or sets the outer angle for the directional cone.
     */
    set directionalConeOuterAngle(value: number);
    /**
     * Sets the position of the emitter if spatial sound is enabled
     * @param newPosition Defines the new position
     */
    setPosition(newPosition: Vector3): void;
    /**
     * Sets the local direction of the emitter if spatial sound is enabled
     * @param newLocalDirection Defines the new local direction
     */
    setLocalDirectionToMesh(newLocalDirection: Vector3): void;
    private _updateDirection;
    private _initSpatial;
    /** @internal */
    updateDistanceFromListener(): void;
    /**
     * Sets a new custom attenuation function for the sound.
     * @param callback Defines the function used for the attenuation
     * @see https://doc.babylonjs.com/legacy/audio#creating-your-own-custom-attenuation-function
     */
    setAttenuationFunction(callback: (currentVolume: number, currentDistance: number, maxDistance: number, refDistance: number, rolloffFactor: number) => number): void;
    /**
     * Play the sound
     * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
     * @param offset (optional) Start the sound at a specific time in seconds
     * @param length (optional) Sound duration (in seconds)
     */
    play(time?: number, offset?: number, length?: number): void;
    private _onended;
    /**
     * Stop the sound
     * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
     */
    stop(time?: number): void;
    /**
     * Put the sound in pause
     */
    pause(): void;
    /**
     * Sets a dedicated volume for this sounds
     * @param newVolume Define the new volume of the sound
     * @param time Define time for gradual change to new volume
     */
    setVolume(newVolume: number, time?: number): void;
    /**
     * Set the sound play back rate
     * @param newPlaybackRate Define the playback rate the sound should be played at
     */
    setPlaybackRate(newPlaybackRate: number): void;
    /**
     * Gets the sound play back rate.
     * @returns the  play back rate of the sound
     */
    getPlaybackRate(): number;
    /**
     * Gets the volume of the sound.
     * @returns the volume of the sound
     */
    getVolume(): number;
    /**
     * Attach the sound to a dedicated mesh
     * @param transformNode The transform node to connect the sound with
     * @see https://doc.babylonjs.com/legacy/audio#attaching-a-sound-to-a-mesh
     */
    attachToMesh(transformNode: TransformNode): void;
    /**
     * Detach the sound from the previously attached mesh
     * @see https://doc.babylonjs.com/legacy/audio#attaching-a-sound-to-a-mesh
     */
    detachFromMesh(): void;
    private _onRegisterAfterWorldMatrixUpdate;
    /**
     * Clone the current sound in the scene.
     * @returns the new sound clone
     */
    clone(): Nullable<Sound>;
    /**
     * Gets the current underlying audio buffer containing the data
     * @returns the audio buffer
     */
    getAudioBuffer(): Nullable<AudioBuffer>;
    /**
     * Gets the WebAudio AudioBufferSourceNode, lets you keep track of and stop instances of this Sound.
     * @returns the source node
     */
    getSoundSource(): Nullable<AudioBufferSourceNode>;
    /**
     * Gets the WebAudio GainNode, gives you precise control over the gain of instances of this Sound.
     * @returns the gain node
     */
    getSoundGain(): Nullable<GainNode>;
    /**
     * Serializes the Sound in a JSON representation
     * @returns the JSON representation of the sound
     */
    serialize(): any;
    /**
     * Parse a JSON representation of a sound to instantiate in a given scene
     * @param parsedSound Define the JSON representation of the sound (usually coming from the serialize method)
     * @param scene Define the scene the new parsed sound should be created in
     * @param rootUrl Define the rooturl of the load in case we need to fetch relative dependencies
     * @param sourceSound Define a sound place holder if do not need to instantiate a new one
     * @returns the newly parsed sound
     */
    static Parse(parsedSound: any, scene: Scene, rootUrl: string, sourceSound?: Sound): Sound;
}
/**
 * Register side effects for sound.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSound(): void;

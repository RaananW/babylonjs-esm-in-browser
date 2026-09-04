/** This file must only contain pure code and pure imports */
import { type Sound } from "./sound.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type ISceneSerializableComponent } from "../sceneComponent.js";
import { Scene } from "../scene.pure.js";
import { type IAssetContainer } from "../IAssetContainer.js";
import { type Nullable } from "../types.js";
/**
 * Defines the sound scene component responsible to manage any sounds
 * in a given scene.
 * @deprecated please use AudioEngineV2 instead
 */
export declare class AudioSceneComponent implements ISceneSerializableComponent {
    private static _CameraDirection;
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "Audio";
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    private _audioEnabled;
    /**
     * Gets whether audio is enabled or not.
     * Please use related enable/disable method to switch state.
     */
    get audioEnabled(): boolean;
    private _headphone;
    /**
     * Gets whether audio is outputting to headphone or not.
     * Please use the according Switch methods to change output.
     */
    get headphone(): boolean;
    /**
     * Gets or sets a refresh rate when using 3D audio positioning
     */
    audioPositioningRefreshRate: number;
    /**
     * Gets or Sets a custom listener position for all sounds in the scene
     * By default, this is the position of the first active camera
     */
    audioListenerPositionProvider: Nullable<() => Vector3>;
    /**
     * Gets or Sets a custom listener rotation for all sounds in the scene
     * By default, this is the rotation of the first active camera
     */
    audioListenerRotationProvider: Nullable<() => Vector3>;
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene?: Nullable<Scene>);
    /**
     * Registers the component in a given scene
     */
    register(): void;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Serializes the component data to the specified json object
     * @param serializationObject The object to serialize to
     */
    serialize(serializationObject: any): void;
    /**
     * Adds all the elements from the container to the scene
     * @param container the container holding the elements
     */
    addFromContainer(container: IAssetContainer): void;
    /**
     * Removes all the elements in the container from the scene
     * @param container contains the elements to remove
     * @param dispose if the removed element should be disposed (default: false)
     */
    removeFromContainer(container: IAssetContainer, dispose?: boolean): void;
    /**
     * Disposes the component and the associated resources.
     */
    dispose(): void;
    /**
     * Disables audio in the associated scene.
     */
    disableAudio(): void;
    /**
     * Enables audio in the associated scene.
     */
    enableAudio(): void;
    /**
     * Switch audio to headphone output.
     */
    switchAudioModeForHeadphones(): void;
    /**
     * Switch audio to normal speakers.
     */
    switchAudioModeForNormalSpeakers(): void;
    private _cachedCameraDirection;
    private _cachedCameraPosition;
    private _lastCheck;
    private _invertMatrixTemp;
    private _cameraDirectionTemp;
    private _afterRender;
}
/**
 * Register side effects for audioSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param soundClass The Sound class to register the component for
 */
export declare function RegisterAudioSceneComponent(soundClass: typeof Sound): void;

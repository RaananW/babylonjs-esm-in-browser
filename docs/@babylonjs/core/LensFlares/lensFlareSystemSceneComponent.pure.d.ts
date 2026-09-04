/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneSerializableComponent } from "../sceneComponent.js";
import { type IAssetContainer } from "../IAssetContainer.js";
import { type LensFlareSystem } from "./lensFlareSystem.js";
/**
 * Defines the lens flare scene component responsible to manage any lens flares
 * in a given scene.
 */
export declare class LensFlareSystemSceneComponent implements ISceneSerializableComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "LensFlareSystem";
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene: Scene);
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
     * Serializes the component data to the specified json object
     * @param serializationObject The object to serialize to
     */
    serialize(serializationObject: any): void;
    /**
     * Disposes the component and the associated resources.
     */
    dispose(): void;
    private _draw;
}
/**
 * Register side effects for lensFlareSystemSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param lensFlareSystemClass The LensFlareSystem class to register the component for
 */
export declare function RegisterLensFlareSystemSceneComponent(lensFlareSystemClass: typeof LensFlareSystem): void;

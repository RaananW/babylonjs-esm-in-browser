/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneSerializableComponent } from "../sceneComponent.js";
import { type SubSurfaceConfiguration } from "./subSurfaceConfiguration.js";
/**
 * Defines the Geometry Buffer scene component responsible to manage a G-Buffer useful
 * in several rendering techniques.
 */
export declare class SubSurfaceSceneComponent implements ISceneSerializableComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "SubSurface";
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
     * Serializes the component data to the specified json object
     * @param serializationObject The object to serialize to
     */
    serialize(serializationObject: any): void;
    /**
     * Adds all the elements from the container to the scene
     */
    addFromContainer(): void;
    /**
     * Removes all the elements in the container from the scene
     */
    removeFromContainer(): void;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Disposes the component and the associated resources
     */
    dispose(): void;
}
/**
 * Register side effects for subSurfaceSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param subSurfaceConfigClass The SubSurfaceConfiguration class to register the component for
 */
export declare function RegisterSubSurfaceSceneComponent(subSurfaceConfigClass: typeof SubSurfaceConfiguration): void;

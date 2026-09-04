/** This file must only contain pure code and pure imports */
import { type ISceneComponent } from "../sceneComponent.js";
import { Scene } from "../scene.pure.js";
/**
 * Defines the physics engine scene component responsible to manage a physics engine
 */
export declare class PhysicsEngineSceneComponent implements ISceneComponent {
    /**
     * The component name helpful to identify the component in the list of scene components.
     */
    readonly name = "PhysicsEngine";
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
     * Disposes the component and the associated resources
     */
    dispose(): void;
}
/**
 * Register side effects for joinedPhysicsEngineComponent.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterJoinedPhysicsEngineComponent(): void;

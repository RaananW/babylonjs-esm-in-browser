/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type SimplificationQueue } from "./meshSimplification.js";
/**
 * Defines the simplification queue scene component responsible to help scheduling the various simplification task
 * created in a scene
 */
export declare class SimplicationQueueSceneComponent implements ISceneComponent {
    /**
     * The component name helpfull to identify the component in the list of scene components.
     */
    readonly name = "SimplificationQueue";
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
    private _beforeCameraUpdate;
}
/**
 * Register side effects for meshSimplificationSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param simplificationQueueClass The SimplificationQueue class to use for lazy instantiation
 */
export declare function RegisterMeshSimplificationSceneComponent(simplificationQueueClass: typeof SimplificationQueue): void;

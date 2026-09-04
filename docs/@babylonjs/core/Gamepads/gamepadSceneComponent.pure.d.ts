/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type GamepadManager } from "./gamepadManager.js";
/**
 * Defines the gamepad scene component responsible to manage gamepads in a given scene
 */
export declare class GamepadSystemSceneComponent implements ISceneComponent {
    /**
     * The component name helpfull to identify the component in the list of scene components.
     */
    readonly name = "Gamepad";
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
 * Register side effects for gamepadSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param gamepadManagerClass The GamepadManager class to use for lazy instantiation
 */
export declare function RegisterGamepadSceneComponent(gamepadManagerClass: typeof GamepadManager): void;

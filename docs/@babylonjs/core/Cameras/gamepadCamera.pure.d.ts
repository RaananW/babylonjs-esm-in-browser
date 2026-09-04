/** This file must only contain pure code and pure imports */
import { UniversalCamera } from "./universalCamera.pure.js";
import { type Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
/**
 * This represents a FPS type of camera. This is only here for back compat purpose.
 * Please use the UniversalCamera instead as both are identical.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
 */
export declare class GamepadCamera extends UniversalCamera {
    /**
     * Instantiates a new Gamepad Camera
     * This represents a FPS type of camera. This is only here for back compat purpose.
     * Please use the UniversalCamera instead as both are identical.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
     * @param name Define the name of the camera in the scene
     * @param position Define the start position of the camera in the scene
     * @param scene Define the scene the camera belongs to
     */
    constructor(name: string, position: Vector3, scene?: Scene);
    /**
     * Gets the current object class name.
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for gamepadCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGamepadCamera(): void;

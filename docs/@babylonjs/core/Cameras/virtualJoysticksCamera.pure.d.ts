/** This file must only contain pure code and pure imports */
import { FreeCamera } from "./freeCamera.pure.js";
import { type Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
/**
 * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
 * It is identical to the Free Camera and simply adds by default a virtual joystick.
 * Virtual Joysticks are on-screen 2D graphics that are used to control the camera or other scene items.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#virtual-joysticks-camera
 */
export declare class VirtualJoysticksCamera extends FreeCamera {
    /**
     * Instantiates a VirtualJoysticksCamera. It can be useful in First Person Shooter game for instance.
     * It is identical to the Free Camera and simply adds by default a virtual joystick.
     * Virtual Joysticks are on-screen 2D graphics that are used to control the camera or other scene items.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#virtual-joysticks-camera
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
 * Register side effects for virtualJoysticksCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVirtualJoysticksCamera(): void;

/** This file must only contain pure code and pure imports */
import { VirtualJoystick } from "../../Misc/virtualJoystick.js";
import { type ICameraInput } from "../../Cameras/cameraInputsManager.js";
import { type FreeCamera } from "../../Cameras/freeCamera.pure.js";
/**
 * Manage the Virtual Joystick inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class FreeCameraVirtualJoystickInput implements ICameraInput<FreeCamera> {
    /**
     * Defines the camera the input is attached to.
     */
    camera: FreeCamera;
    private _leftjoystick;
    private _rightjoystick;
    /**
     * Gets the left stick of the virtual joystick.
     * @returns The virtual Joystick
     */
    getLeftJoystick(): VirtualJoystick;
    /**
     * Gets the right stick of the virtual joystick.
     * @returns The virtual Joystick
     */
    getRightJoystick(): VirtualJoystick;
    /**
     * Update the current camera state depending on the inputs that have been used this frame.
     * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
     */
    checkInputs(): void;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     */
    attachControl(): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    getSimpleName(): string;
}
/**
 * Register side effects for freeCameraVirtualJoystickInput.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFreeCameraVirtualJoystickInput(): void;

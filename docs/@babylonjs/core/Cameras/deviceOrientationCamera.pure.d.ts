/** This file must only contain pure code and pure imports */
import { FreeCamera } from "./freeCamera.pure.js";
import { type Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Axis } from "../Maths/math.axis.js";
/**
 * This is a camera specifically designed to react to device orientation events such as a modern mobile device
 * being tilted forward or back and left or right.
 */
export declare class DeviceOrientationCamera extends FreeCamera {
    private _initialQuaternion;
    private _quaternionCache;
    private _tmpDragQuaternion;
    private _disablePointerInputWhenUsingDeviceOrientation;
    /**
     * Creates a new device orientation camera
     * @param name The name of the camera
     * @param position The start position camera
     * @param scene The scene the camera belongs to
     */
    constructor(name: string, position: Vector3, scene?: Scene);
    /**
     * Gets or sets a boolean indicating that pointer input must be disabled on first orientation sensor update (Default: true)
     */
    get disablePointerInputWhenUsingDeviceOrientation(): boolean;
    set disablePointerInputWhenUsingDeviceOrientation(value: boolean);
    private _dragFactor;
    /**
     * Enabled turning on the y axis when the orientation sensor is active
     * @param dragFactor the factor that controls the turn speed (default: 1/300)
     */
    enableHorizontalDragging(dragFactor?: number): void;
    /**
     * Gets the current instance class name ("DeviceOrientationCamera").
     * This helps avoiding instanceof at run time.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * @internal
     * Checks and applies the current values of the inputs to the camera. (Internal use only)
     */
    _checkInputs(): void;
    /**
     * Reset the camera to its default orientation on the specified axis only.
     * @param axis The axis to reset
     */
    resetToCurrentRotation(axis?: Axis): void;
}
/**
 * Register side effects for deviceOrientationCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDeviceOrientationCamera(): void;

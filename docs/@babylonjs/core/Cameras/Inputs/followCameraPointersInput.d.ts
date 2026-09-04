import { type Nullable } from "../../types.js";
import { type FollowCamera } from "../../Cameras/followCamera.js";
import { BaseCameraPointersInput } from "../../Cameras/Inputs/BaseCameraPointersInput.js";
import { type PointerTouch } from "../../Events/pointerEvents.js";
/**
 * Manage the pointers inputs to control an follow camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class FollowCameraPointersInput extends BaseCameraPointersInput {
    /**
     * Defines the camera the input is attached to.
     */
    camera: FollowCamera;
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Defines the pointer angular sensibility along the X axis or how fast is
     * the camera rotating.
     * A negative number will reverse the axis direction.
     */
    angularSensibilityX: number;
    /**
     * Defines the pointer angular sensibility along the Y axis or how fast is
     * the camera rotating.
     * A negative number will reverse the axis direction.
     */
    angularSensibilityY: number;
    /**
     * Defines the pointer pinch precision or how fast is the camera zooming.
     * A negative number will reverse the axis direction.
     */
    pinchPrecision: number;
    /**
     * pinchDeltaPercentage will be used instead of pinchPrecision if different
     * from 0.
     * It defines the percentage of current camera.radius to use as delta when
     * pinch zoom is used.
     */
    pinchDeltaPercentage: number;
    /**
     * Pointer X axis controls zoom. (X axis modifies camera.radius value.)
     */
    axisXControlRadius: boolean;
    /**
     * Pointer X axis controls height. (X axis modifies camera.heightOffset value.)
     */
    axisXControlHeight: boolean;
    /**
     * Pointer X axis controls angle. (X axis modifies camera.rotationOffset value.)
     */
    axisXControlRotation: boolean;
    /**
     * Pointer Y axis controls zoom. (Y axis modifies camera.radius value.)
     */
    axisYControlRadius: boolean;
    /**
     * Pointer Y axis controls height. (Y axis modifies camera.heightOffset value.)
     */
    axisYControlHeight: boolean;
    /**
     * Pointer Y axis controls angle. (Y axis modifies camera.rotationOffset value.)
     */
    axisYControlRotation: boolean;
    /**
     * Pinch controls zoom. (Pinch modifies camera.radius value.)
     */
    axisPinchControlRadius: boolean;
    /**
     * Pinch controls height. (Pinch modifies camera.heightOffset value.)
     */
    axisPinchControlHeight: boolean;
    /**
     * Pinch controls angle. (Pinch modifies camera.rotationOffset value.)
     */
    axisPinchControlRotation: boolean;
    /**
     * Log error messages if basic misconfiguration has occurred.
     */
    warningEnable: boolean;
    /**
     * Called on pointer POINTERMOVE event if only a single touch is active.
     * @param pointA The current position of the pointer
     * @param offsetX The offsetX of the pointer when the event occurred
     * @param offsetY The offsetY of the pointer when the event occurred
     */
    onTouch(pointA: Nullable<PointerTouch>, offsetX: number, offsetY: number): void;
    /**
     * Called on pointer POINTERMOVE event if multiple touches are active.
     * @param pointA First point in the pair
     * @param pointB Second point in the pair
     * @param previousPinchSquaredDistance Sqr Distance between the points the last time this event was fired (by this input)
     * @param pinchSquaredDistance Sqr Distance between the points this time
     * @param previousMultiTouchPanPosition Previous center point between the points
     * @param multiTouchPanPosition Current center point between the points
     */
    onMultiTouch(pointA: Nullable<PointerTouch>, pointB: Nullable<PointerTouch>, previousPinchSquaredDistance: number, pinchSquaredDistance: number, previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
    private _warningCounter;
    private _warning;
}

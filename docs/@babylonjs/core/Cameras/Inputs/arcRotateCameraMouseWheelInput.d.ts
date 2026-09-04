import { type Nullable } from "../../types.js";
import { type ArcRotateCamera } from "../../Cameras/arcRotateCamera.js";
import { type ICameraInput } from "../../Cameras/cameraInputsManager.js";
import { type IWheelEvent } from "../../Events/deviceInputEvents.js";
/**
 * Manage the mouse wheel inputs to control an arc rotate camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class ArcRotateCameraMouseWheelInput implements ICameraInput<ArcRotateCamera> {
    /**
     * Defines the camera the input is attached to.
     */
    camera: ArcRotateCamera;
    /**
     * Gets or Set the mouse wheel precision or how fast is the camera zooming.
     */
    wheelPrecision: number;
    /**
     * Gets or Set the boolean value that controls whether or not the mouse wheel
     * zooms to the location of the mouse pointer or not.  The default is false.
     */
    zoomToMouseLocation: boolean;
    /**
     * wheelDeltaPercentage will be used instead of wheelPrecision if different from 0.
     * It defines the percentage of current camera.radius to use as delta when wheel is used.
     */
    wheelDeltaPercentage: number;
    /**
     * If set, this function will be used to set the radius delta that will be added to the current camera radius
     */
    customComputeDeltaFromMouseWheel: Nullable<(wheelDelta: number, input: ArcRotateCameraMouseWheelInput, event: IWheelEvent) => number>;
    private _wheel;
    private _observer;
    private _hitPlane;
    private _viewOffset;
    private _globalOffset;
    protected _computeDeltaFromMouseWheelLegacyEvent(mouseWheelDelta: number, radius: number): number;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault?: boolean): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
    /**
     * Update the current camera state depending on the inputs that have been used this frame.
     * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
     */
    checkInputs(): void;
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
    private _updateHitPlane;
    private _getPosition;
    private _inertialPanning;
    /**
     * Decaying accumulator for radius motion in the `zoomToMouseLocation` path.
     *
     * Units: world-space radius units. On each frame, this value is *subtracted* from
     * `camera.radius` and then multiplied by a framerate-independent decay factor (via
     * `CameraMovement.getFrameIndependentDecay`). New input from `_zoomToMouse(delta)`
     * is added on top each frame, scaled by the matching framerate-independent input
     * factor so the steady-state and total-glide-distance match legacy at 60fps at any
     * actual refresh rate.
     *
     * Replaces the use of the legacy `camera.inertialRadiusOffset` for this code path
     * so the coupled radius + pan motion can be decayed with framerate-independent
     * semantics without disturbing the public `inertialRadiusOffset` back-compat surface.
     */
    private _zoomToMouseRadiusOffset;
    private _zoomToMouse;
    private _zeroIfClose;
}

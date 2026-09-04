import { type Nullable } from "../../types.js";
import { type ArcRotateCamera } from "../../Cameras/arcRotateCamera.js";
import { OrbitCameraPointersInput } from "../../Cameras/Inputs/orbitCameraPointersInput.js";
import { type PointerTouch } from "../../Events/pointerEvents.js";
import { type IPointerEvent } from "../../Events/deviceInputEvents.js";
/**
 * Manage the pointers inputs to control an arc rotate camera.
 * Uses the inputMap on the movement class to determine which button maps to which interaction.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class ArcRotateCameraPointersInput extends OrbitCameraPointersInput {
    /**
     * Defines the camera the input is attached to.
     */
    camera: ArcRotateCamera;
    /**
     * The minimum radius used for pinch, to avoid radius lock at 0
     */
    static MinimumRadiusForPinch: number;
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Defines the buttons associated with the input to handle camera move.
     */
    buttons: number[];
    /**
     * Defines the pointer angular sensibility  along the X axis or how fast is
     * the camera rotating.
     */
    angularSensibilityX: number;
    /**
     * Defines the pointer angular sensibility along the Y axis or how fast is
     * the camera rotating.
     */
    angularSensibilityY: number;
    /**
     * Defines the pointer pinch precision or how fast is the camera zooming.
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
     * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
     * that any object in the plane at the camera's target point will scale
     * perfectly with finger motion.
     * Overrides pinchDeltaPercentage and pinchPrecision.
     */
    useNaturalPinchZoom: boolean;
    /**
     * Defines the pointer panning sensibility or how fast is the camera moving.
     */
    panningSensibility: number;
    /**
     * Revers pinch action direction.
     */
    pinchInwards: boolean;
    /** Cached resolved inputMap entry for the current pointer gesture */
    private _activeEntry;
    /** Cached conditions object for pointer-lock fallback resolution to avoid per-event allocations */
    private _pointerLockConditions;
    /**
     * Modifier state stored separately from `_pointerConditions` so it can be typed as a
     * concrete (non-optional) object. This avoids non-null assertions when updating modifier
     * fields on every pointer-down, and the conditions object holds the same reference so
     * resolveInteraction sees the live state.
     */
    private _pointerModifiers;
    /** Cached conditions object for pointer-down resolution */
    private _pointerConditions;
    /**
     * Move camera from multi touch panning positions.
     * @param previousMultiTouchPanPosition
     * @param multiTouchPanPosition
     */
    protected _computeMultiTouchPanning(previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
    /**
     * Move camera from multitouch (pinch) zoom distances.
     * @param previousPinchSquaredDistance
     * @param pinchSquaredDistance
     */
    protected _computePinchZoom(previousPinchSquaredDistance: number, pinchSquaredDistance: number): void;
    /**
     * Called on pointer POINTERMOVE event if only a single touch is active.
     * @param point current touch point
     * @param offsetX offset on X
     * @param offsetY offset on Y
     */
    onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void;
    /**
     * Called on pointer POINTERDOUBLETAP event.
     */
    onDoubleTap(): void;
    /**
     * Called on pointer POINTERMOVE event if multiple touches are active.
     * @param pointA point A
     * @param pointB point B
     * @param previousPinchSquaredDistance distance between points in previous pinch
     * @param pinchSquaredDistance distance between points in current pinch
     * @param previousMultiTouchPanPosition multi-touch position in previous step
     * @param multiTouchPanPosition multi-touch position in current step
     */
    onMultiTouch(pointA: Nullable<PointerTouch>, pointB: Nullable<PointerTouch>, previousPinchSquaredDistance: number, pinchSquaredDistance: number, previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
    /**
     * Called each time a new POINTERDOWN event occurs. Ie, for each button
     * press.
     * @param evt Defines the event to track
     */
    onButtonDown(evt: IPointerEvent): void;
    /**
     * Called each time a new POINTERUP event occurs. Ie, for each button
     * release.
     * @param _evt Defines the event to track
     */
    onButtonUp(_evt: IPointerEvent): void;
    /**
     * Called when window becomes inactive.
     */
    onLostFocus(): void;
}

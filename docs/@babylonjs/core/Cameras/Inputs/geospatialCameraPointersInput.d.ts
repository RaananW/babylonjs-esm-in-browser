import { type GeospatialCamera } from "../../Cameras/geospatialCamera.js";
import { type EasingFunction } from "../../Animations/easing.js";
import { type IPointerEvent } from "../../Events/deviceInputEvents.js";
import { type PointerTouch } from "../../Events/pointerEvents.js";
import { type Nullable } from "../../types.js";
import { OrbitCameraPointersInput } from "./orbitCameraPointersInput.js";
/**
 * Geospatial camera inputs can simulate dragging the globe around or tilting the camera around some point on the globe
 * This class will update the GeospatialCameraMovement class's movementDeltaCurrentFrame, and the camera is responsible for using these updates to calculate viewMatrix appropriately
 *
 * Uses the inputMap on the movement class to determine which button maps to which interaction.
 * Default: Left mouse button = pan (drag globe), Middle/Right mouse button = rotate (tilt)
 *
 */
export declare class GeospatialCameraPointersInput extends OrbitCameraPointersInput {
    camera: GeospatialCamera;
    private _initialPinchSquaredDistance;
    private _pinchCentroid;
    /** Cached resolved inputMap entry for the current pointer gesture */
    private _activeEntry;
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
     * Defines the rotation sensitivity of the pointer when rotating camera around the x axis (pitch).
     * (Multiplied by the true pixel delta of pointer input, before rotation speed factor is applied by movement class)
     * @deprecated Use the `sensitivity` field on the pointer rotate entry in `camera.movement.input.inputMap` instead.
     */
    get pitchSensitivity(): number;
    set pitchSensitivity(value: number);
    /**
     * Defines the rotation sensitivity of the pointer when rotating the camera around the Y axis (yaw).
     * (Multiplied by the true pixel delta of pointer input, before rotation speed factor is applied by movement class)
     * @deprecated Use the `sensitivity` field on the pointer rotate entry in `camera.movement.input.inputMap` instead.
     */
    get yawSensitivity(): number;
    set yawSensitivity(value: number);
    /**
     * Defines the distance used to consider the camera in pan mode vs pinch/zoom.
     * Basically if your fingers moves away from more than this distance you will be considered
     * in pinch mode.
     */
    pinchToPanMax: number;
    /**
     * Duration (in milliseconds) of the fly-to animation triggered by a double tap.
     */
    doubleTapAnimationDurationMs: number;
    /**
     * Optional easing function applied to the double-tap fly-to animation.
     * An EasingFunction instance can be created once and reused across double taps.
     */
    doubleTapEasingFunction: Nullable<EasingFunction>;
    getClassName(): string;
    /**
     * Handles the pointer-down event. Captures the active button + modifier state, resolves which
     * inputMap entry should drive the gesture, and starts pan tracking if the resolved interaction is "pan".
     * @param evt - The pointer-down event.
     */
    onButtonDown(evt: IPointerEvent): void;
    onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void;
    /**
     * Move camera from multitouch (pinch) zoom distances.
     * Zooms towards the centroid (midpoint between the two fingers).
     * @param previousPinchSquaredDistance
     * @param pinchSquaredDistance
     */
    protected _computePinchZoom(previousPinchSquaredDistance: number, pinchSquaredDistance: number): void;
    /**
     * Move camera from multi touch panning positions.
     * In geospatialcamera, multi touch panning tilts the globe (whereas single touch will pan/drag it)
     * @param previousMultiTouchPanPosition
     * @param multiTouchPanPosition
     */
    protected _computeMultiTouchPanning(previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
    onDoubleTap(type: string, evt?: IPointerEvent): void;
    /**
     * Handles a multi-touch (pinch / two-finger pan) gesture. Detects whether the gesture should be
     * interpreted as a pinch zoom or a two-finger pan based on cumulative finger distance change,
     * and forwards the gesture to the parent class once a mode is decided.
     * @param pointA - First active touch point, or null if it just ended.
     * @param pointB - Second active touch point, or null if it just ended.
     * @param previousPinchSquaredDistance - Squared distance between the two touches on the previous frame.
     * @param pinchSquaredDistance - Squared distance between the two touches on the current frame.
     * @param previousMultiTouchPanPosition - Centroid of the two touches on the previous frame, or null if unavailable.
     * @param multiTouchPanPosition - Centroid of the two touches on the current frame, or null if the gesture ended.
     */
    onMultiTouch(pointA: Nullable<PointerTouch>, pointB: Nullable<PointerTouch>, previousPinchSquaredDistance: number, pinchSquaredDistance: number, previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
    onButtonUp(_evt: IPointerEvent): void;
    onLostFocus(): void;
}

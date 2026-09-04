import { type Nullable } from "../../types.js";
import { type PointerTouch } from "../../Events/pointerEvents.js";
import { type IPointerEvent } from "../../Events/deviceInputEvents.js";
import { BaseCameraPointersInput } from "./BaseCameraPointersInput.js";
/**
 * Used by both arcrotatecamera and geospatialcamera, OrbitCameraPointersInputs handle pinchToZoom and multiTouchPanning
 * as though you are orbiting around a target point
 */
export declare abstract class OrbitCameraPointersInput extends BaseCameraPointersInput {
    /**
     * Defines whether zoom (2 fingers pinch) is enabled through multitouch
     */
    pinchZoom: boolean;
    /**
     * Defines whether panning (2 fingers swipe) is enabled through multitouch.
     */
    multiTouchPanning: boolean;
    /**
     * Defines whether panning is enabled for both pan (2 fingers swipe) and
     * zoom (pinch) through multitouch.
     */
    multiTouchPanAndZoom: boolean;
    protected _isPinching: boolean;
    protected _twoFingerActivityCount: number;
    protected _shouldStartPinchZoom: boolean;
    protected _computePinchZoom(_previousPinchSquaredDistance: number, _pinchSquaredDistance: number): void;
    protected _computeMultiTouchPanning(_previousMultiTouchPanPosition: Nullable<PointerTouch>, _multiTouchPanPosition: Nullable<PointerTouch>): void;
    /**
     * Called on pointer POINTERMOVE event if multiple touches are active.
     * Override this method to provide functionality.
     * @param _pointA First point in the pair
     * @param _pointB Second point in the pair
     * @param previousPinchSquaredDistance Sqr Distance between the points the last time this event was fired (by this input)
     * @param pinchSquaredDistance Sqr Distance between the points this time
     * @param previousMultiTouchPanPosition Previous center point between the points
     * @param multiTouchPanPosition Current center point between the points
     */
    onMultiTouch(_pointA: Nullable<PointerTouch>, _pointB: Nullable<PointerTouch>, previousPinchSquaredDistance: number, pinchSquaredDistance: number, previousMultiTouchPanPosition: Nullable<PointerTouch>, multiTouchPanPosition: Nullable<PointerTouch>): void;
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

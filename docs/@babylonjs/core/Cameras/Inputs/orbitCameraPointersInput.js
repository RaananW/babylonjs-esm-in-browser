import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { BaseCameraPointersInput } from "./BaseCameraPointersInput.js";
/**
 * Used by both arcrotatecamera and geospatialcamera, OrbitCameraPointersInputs handle pinchToZoom and multiTouchPanning
 * as though you are orbiting around a target point
 */
let OrbitCameraPointersInput = (() => {
    var _a;
    let _classSuper = BaseCameraPointersInput;
    let _pinchZoom_decorators;
    let _pinchZoom_initializers = [];
    let _pinchZoom_extraInitializers = [];
    let _multiTouchPanning_decorators;
    let _multiTouchPanning_initializers = [];
    let _multiTouchPanning_extraInitializers = [];
    let _multiTouchPanAndZoom_decorators;
    let _multiTouchPanAndZoom_initializers = [];
    let _multiTouchPanAndZoom_extraInitializers = [];
    return _a = class OrbitCameraPointersInput extends _classSuper {
            constructor() {
                super(...arguments);
                /**
                 * Defines whether zoom (2 fingers pinch) is enabled through multitouch
                 */
                this.pinchZoom = __runInitializers(this, _pinchZoom_initializers, true);
                /**
                 * Defines whether panning (2 fingers swipe) is enabled through multitouch.
                 */
                this.multiTouchPanning = (__runInitializers(this, _pinchZoom_extraInitializers), __runInitializers(this, _multiTouchPanning_initializers, true));
                /**
                 * Defines whether panning is enabled for both pan (2 fingers swipe) and
                 * zoom (pinch) through multitouch.
                 */
                this.multiTouchPanAndZoom = (__runInitializers(this, _multiTouchPanning_extraInitializers), __runInitializers(this, _multiTouchPanAndZoom_initializers, true));
                this._isPinching = (__runInitializers(this, _multiTouchPanAndZoom_extraInitializers), false);
                this._twoFingerActivityCount = 0;
                this._shouldStartPinchZoom = false;
            }
            _computePinchZoom(_previousPinchSquaredDistance, _pinchSquaredDistance) { }
            _computeMultiTouchPanning(_previousMultiTouchPanPosition, _multiTouchPanPosition) { }
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
            onMultiTouch(_pointA, _pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
                if (previousPinchSquaredDistance === 0 && previousMultiTouchPanPosition === null) {
                    // First time this method is called for new pinch.
                    // Next time this is called there will be a
                    // previousPinchSquaredDistance and pinchSquaredDistance to compare.
                    return;
                }
                if (pinchSquaredDistance === 0 && multiTouchPanPosition === null) {
                    // Last time this method is called at the end of a pinch.
                    return;
                }
                // Zoom and panning enabled together
                if (this.multiTouchPanAndZoom) {
                    this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
                    this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
                    // Zoom and panning enabled but only one at a time
                }
                else if (this.multiTouchPanning && this.pinchZoom) {
                    this._twoFingerActivityCount++;
                    if (this._isPinching || this._shouldStartPinchZoom) {
                        // Since pinch has not been active long, assume we intend to zoom.
                        this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
                        // Since we are pinching, remain pinching on next iteration.
                        this._isPinching = true;
                    }
                    else {
                        // Pause between pinch starting and moving implies not a zoom event. Pan instead.
                        this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
                    }
                    // Panning enabled, zoom disabled
                }
                else if (this.multiTouchPanning) {
                    this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
                    // Zoom enabled, panning disabled
                }
                else if (this.pinchZoom) {
                    this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
                }
            }
            /**
             * Called each time a new POINTERUP event occurs. Ie, for each button
             * release.
             * @param _evt Defines the event to track
             */
            onButtonUp(_evt) {
                this._twoFingerActivityCount = 0;
                this._isPinching = false;
            }
            /**
             * Called when window becomes inactive.
             */
            onLostFocus() {
                this._twoFingerActivityCount = 0;
                this._isPinching = false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _pinchZoom_decorators = [serialize()];
            _multiTouchPanning_decorators = [serialize()];
            _multiTouchPanAndZoom_decorators = [serialize()];
            __esDecorate(null, null, _pinchZoom_decorators, { kind: "field", name: "pinchZoom", static: false, private: false, access: { has: obj => "pinchZoom" in obj, get: obj => obj.pinchZoom, set: (obj, value) => { obj.pinchZoom = value; } }, metadata: _metadata }, _pinchZoom_initializers, _pinchZoom_extraInitializers);
            __esDecorate(null, null, _multiTouchPanning_decorators, { kind: "field", name: "multiTouchPanning", static: false, private: false, access: { has: obj => "multiTouchPanning" in obj, get: obj => obj.multiTouchPanning, set: (obj, value) => { obj.multiTouchPanning = value; } }, metadata: _metadata }, _multiTouchPanning_initializers, _multiTouchPanning_extraInitializers);
            __esDecorate(null, null, _multiTouchPanAndZoom_decorators, { kind: "field", name: "multiTouchPanAndZoom", static: false, private: false, access: { has: obj => "multiTouchPanAndZoom" in obj, get: obj => obj.multiTouchPanAndZoom, set: (obj, value) => { obj.multiTouchPanAndZoom = value; } }, metadata: _metadata }, _multiTouchPanAndZoom_initializers, _multiTouchPanAndZoom_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { OrbitCameraPointersInput };
//# sourceMappingURL=orbitCameraPointersInput.js.map
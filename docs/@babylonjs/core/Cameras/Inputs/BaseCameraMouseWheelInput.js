import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { Observable } from "../../Misc/observable.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { EventConstants } from "../../Events/deviceInputEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Base class for mouse wheel input..
 * See FollowCameraMouseWheelInput in src/Cameras/Inputs/freeCameraMouseWheelInput.ts
 * for example usage.
 */
let BaseCameraMouseWheelInput = (() => {
    var _a;
    let _wheelPrecisionX_decorators;
    let _wheelPrecisionX_initializers = [];
    let _wheelPrecisionX_extraInitializers = [];
    let _wheelPrecisionY_decorators;
    let _wheelPrecisionY_initializers = [];
    let _wheelPrecisionY_extraInitializers = [];
    let _wheelPrecisionZ_decorators;
    let _wheelPrecisionZ_initializers = [];
    let _wheelPrecisionZ_extraInitializers = [];
    return _a = class BaseCameraMouseWheelInput {
            constructor() {
                /**
                 * How fast is the camera moves in relation to X axis mouseWheel events.
                 * Use negative value to reverse direction.
                 */
                this.wheelPrecisionX = __runInitializers(this, _wheelPrecisionX_initializers, 3.0);
                /**
                 * How fast is the camera moves in relation to Y axis mouseWheel events.
                 * Use negative value to reverse direction.
                 */
                this.wheelPrecisionY = (__runInitializers(this, _wheelPrecisionX_extraInitializers), __runInitializers(this, _wheelPrecisionY_initializers, 3.0));
                /**
                 * How fast is the camera moves in relation to Z axis mouseWheel events.
                 * Use negative value to reverse direction.
                 */
                this.wheelPrecisionZ = (__runInitializers(this, _wheelPrecisionY_extraInitializers), __runInitializers(this, _wheelPrecisionZ_initializers, 3.0));
                /**
                 * Observable for when a mouse wheel move event occurs.
                 */
                this.onChangedObservable = (__runInitializers(this, _wheelPrecisionZ_extraInitializers), new Observable());
                /**
                 * Incremental value of multiple mouse wheel movements of the X axis.
                 * Should be zero-ed when read.
                 */
                this._wheelDeltaX = 0;
                /**
                 * Incremental value of multiple mouse wheel movements of the Y axis.
                 * Should be zero-ed when read.
                 */
                this._wheelDeltaY = 0;
                /**
                 * Incremental value of multiple mouse wheel movements of the Z axis.
                 * Should be zero-ed when read.
                 */
                this._wheelDeltaZ = 0;
                /**
                 * Firefox uses a different scheme to report scroll distances to other
                 * browsers. Rather than use complicated methods to calculate the exact
                 * multiple we need to apply, let's just cheat and use a constant.
                 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
                 * https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
                 */
                this._ffMultiplier = 12;
                /**
                 * Different event attributes for wheel data fall into a few set ranges.
                 * Some relevant but dated date here:
                 * https://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
                 */
                this._normalize = 120;
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls
             *   should call preventdefault().
             *   (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                this._wheel = (pointer) => {
                    // sanity check - this should be a PointerWheel event.
                    if (pointer.type !== PointerEventTypes.POINTERWHEEL) {
                        return;
                    }
                    const event = pointer.event;
                    const platformScale = event.deltaMode === EventConstants.DOM_DELTA_LINE ? this._ffMultiplier : 1; // If this happens to be set to DOM_DELTA_LINE, adjust accordingly
                    this._wheelDeltaX += (this.wheelPrecisionX * platformScale * event.deltaX) / this._normalize;
                    this._wheelDeltaY -= (this.wheelPrecisionY * platformScale * event.deltaY) / this._normalize;
                    this._wheelDeltaZ += (this.wheelPrecisionZ * platformScale * event.deltaZ) / this._normalize;
                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };
                this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._wheel, PointerEventTypes.POINTERWHEEL);
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                if (this._observer) {
                    this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
                    this._observer = null;
                    this._wheel = null;
                }
                if (this.onChangedObservable) {
                    this.onChangedObservable.clear();
                }
            }
            /**
             * Called for each rendered frame.
             */
            checkInputs() {
                this.onChangedObservable.notifyObservers({
                    wheelDeltaX: this._wheelDeltaX,
                    wheelDeltaY: this._wheelDeltaY,
                    wheelDeltaZ: this._wheelDeltaZ,
                });
                // Clear deltas.
                this._wheelDeltaX = 0;
                this._wheelDeltaY = 0;
                this._wheelDeltaZ = 0;
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "BaseCameraMouseWheelInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "mousewheel";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _wheelPrecisionX_decorators = [serialize()];
            _wheelPrecisionY_decorators = [serialize()];
            _wheelPrecisionZ_decorators = [serialize()];
            __esDecorate(null, null, _wheelPrecisionX_decorators, { kind: "field", name: "wheelPrecisionX", static: false, private: false, access: { has: obj => "wheelPrecisionX" in obj, get: obj => obj.wheelPrecisionX, set: (obj, value) => { obj.wheelPrecisionX = value; } }, metadata: _metadata }, _wheelPrecisionX_initializers, _wheelPrecisionX_extraInitializers);
            __esDecorate(null, null, _wheelPrecisionY_decorators, { kind: "field", name: "wheelPrecisionY", static: false, private: false, access: { has: obj => "wheelPrecisionY" in obj, get: obj => obj.wheelPrecisionY, set: (obj, value) => { obj.wheelPrecisionY = value; } }, metadata: _metadata }, _wheelPrecisionY_initializers, _wheelPrecisionY_extraInitializers);
            __esDecorate(null, null, _wheelPrecisionZ_decorators, { kind: "field", name: "wheelPrecisionZ", static: false, private: false, access: { has: obj => "wheelPrecisionZ" in obj, get: obj => obj.wheelPrecisionZ, set: (obj, value) => { obj.wheelPrecisionZ = value; } }, metadata: _metadata }, _wheelPrecisionZ_initializers, _wheelPrecisionZ_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BaseCameraMouseWheelInput };
//# sourceMappingURL=BaseCameraMouseWheelInput.js.map
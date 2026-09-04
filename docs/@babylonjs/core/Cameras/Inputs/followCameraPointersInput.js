import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { BaseCameraPointersInput } from "../../Cameras/Inputs/BaseCameraPointersInput.js";
import { Logger } from "../../Misc/logger.js";
/**
 * Manage the pointers inputs to control an follow camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FollowCameraPointersInput = (() => {
    var _a;
    let _classSuper = BaseCameraPointersInput;
    let _angularSensibilityX_decorators;
    let _angularSensibilityX_initializers = [];
    let _angularSensibilityX_extraInitializers = [];
    let _angularSensibilityY_decorators;
    let _angularSensibilityY_initializers = [];
    let _angularSensibilityY_extraInitializers = [];
    let _pinchPrecision_decorators;
    let _pinchPrecision_initializers = [];
    let _pinchPrecision_extraInitializers = [];
    let _pinchDeltaPercentage_decorators;
    let _pinchDeltaPercentage_initializers = [];
    let _pinchDeltaPercentage_extraInitializers = [];
    let _axisXControlRadius_decorators;
    let _axisXControlRadius_initializers = [];
    let _axisXControlRadius_extraInitializers = [];
    let _axisXControlHeight_decorators;
    let _axisXControlHeight_initializers = [];
    let _axisXControlHeight_extraInitializers = [];
    let _axisXControlRotation_decorators;
    let _axisXControlRotation_initializers = [];
    let _axisXControlRotation_extraInitializers = [];
    let _axisYControlRadius_decorators;
    let _axisYControlRadius_initializers = [];
    let _axisYControlRadius_extraInitializers = [];
    let _axisYControlHeight_decorators;
    let _axisYControlHeight_initializers = [];
    let _axisYControlHeight_extraInitializers = [];
    let _axisYControlRotation_decorators;
    let _axisYControlRotation_initializers = [];
    let _axisYControlRotation_extraInitializers = [];
    let _axisPinchControlRadius_decorators;
    let _axisPinchControlRadius_initializers = [];
    let _axisPinchControlRadius_extraInitializers = [];
    let _axisPinchControlHeight_decorators;
    let _axisPinchControlHeight_initializers = [];
    let _axisPinchControlHeight_extraInitializers = [];
    let _axisPinchControlRotation_decorators;
    let _axisPinchControlRotation_initializers = [];
    let _axisPinchControlRotation_extraInitializers = [];
    return _a = class FollowCameraPointersInput extends _classSuper {
            constructor() {
                super(...arguments);
                /**
                 * Defines the pointer angular sensibility along the X axis or how fast is
                 * the camera rotating.
                 * A negative number will reverse the axis direction.
                 */
                this.angularSensibilityX = __runInitializers(this, _angularSensibilityX_initializers, 1);
                /**
                 * Defines the pointer angular sensibility along the Y axis or how fast is
                 * the camera rotating.
                 * A negative number will reverse the axis direction.
                 */
                this.angularSensibilityY = (__runInitializers(this, _angularSensibilityX_extraInitializers), __runInitializers(this, _angularSensibilityY_initializers, 1));
                /**
                 * Defines the pointer pinch precision or how fast is the camera zooming.
                 * A negative number will reverse the axis direction.
                 */
                this.pinchPrecision = (__runInitializers(this, _angularSensibilityY_extraInitializers), __runInitializers(this, _pinchPrecision_initializers, 10000.0));
                /**
                 * pinchDeltaPercentage will be used instead of pinchPrecision if different
                 * from 0.
                 * It defines the percentage of current camera.radius to use as delta when
                 * pinch zoom is used.
                 */
                this.pinchDeltaPercentage = (__runInitializers(this, _pinchPrecision_extraInitializers), __runInitializers(this, _pinchDeltaPercentage_initializers, 0));
                /**
                 * Pointer X axis controls zoom. (X axis modifies camera.radius value.)
                 */
                this.axisXControlRadius = (__runInitializers(this, _pinchDeltaPercentage_extraInitializers), __runInitializers(this, _axisXControlRadius_initializers, false));
                /**
                 * Pointer X axis controls height. (X axis modifies camera.heightOffset value.)
                 */
                this.axisXControlHeight = (__runInitializers(this, _axisXControlRadius_extraInitializers), __runInitializers(this, _axisXControlHeight_initializers, false));
                /**
                 * Pointer X axis controls angle. (X axis modifies camera.rotationOffset value.)
                 */
                this.axisXControlRotation = (__runInitializers(this, _axisXControlHeight_extraInitializers), __runInitializers(this, _axisXControlRotation_initializers, true));
                /**
                 * Pointer Y axis controls zoom. (Y axis modifies camera.radius value.)
                 */
                this.axisYControlRadius = (__runInitializers(this, _axisXControlRotation_extraInitializers), __runInitializers(this, _axisYControlRadius_initializers, false));
                /**
                 * Pointer Y axis controls height. (Y axis modifies camera.heightOffset value.)
                 */
                this.axisYControlHeight = (__runInitializers(this, _axisYControlRadius_extraInitializers), __runInitializers(this, _axisYControlHeight_initializers, true));
                /**
                 * Pointer Y axis controls angle. (Y axis modifies camera.rotationOffset value.)
                 */
                this.axisYControlRotation = (__runInitializers(this, _axisYControlHeight_extraInitializers), __runInitializers(this, _axisYControlRotation_initializers, false));
                /**
                 * Pinch controls zoom. (Pinch modifies camera.radius value.)
                 */
                this.axisPinchControlRadius = (__runInitializers(this, _axisYControlRotation_extraInitializers), __runInitializers(this, _axisPinchControlRadius_initializers, true));
                /**
                 * Pinch controls height. (Pinch modifies camera.heightOffset value.)
                 */
                this.axisPinchControlHeight = (__runInitializers(this, _axisPinchControlRadius_extraInitializers), __runInitializers(this, _axisPinchControlHeight_initializers, false));
                /**
                 * Pinch controls angle. (Pinch modifies camera.rotationOffset value.)
                 */
                this.axisPinchControlRotation = (__runInitializers(this, _axisPinchControlHeight_extraInitializers), __runInitializers(this, _axisPinchControlRotation_initializers, false));
                /**
                 * Log error messages if basic misconfiguration has occurred.
                 */
                this.warningEnable = (__runInitializers(this, _axisPinchControlRotation_extraInitializers), true);
                /* Check for obvious misconfiguration. */
                this._warningCounter = 0;
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FollowCameraPointersInput";
            }
            /**
             * Called on pointer POINTERMOVE event if only a single touch is active.
             * @param pointA The current position of the pointer
             * @param offsetX The offsetX of the pointer when the event occurred
             * @param offsetY The offsetY of the pointer when the event occurred
             */
            onTouch(pointA, offsetX, offsetY) {
                this._warning();
                if (this.axisXControlRotation) {
                    this.camera.rotationOffset += offsetX / this.angularSensibilityX;
                }
                else if (this.axisYControlRotation) {
                    this.camera.rotationOffset += offsetY / this.angularSensibilityX;
                }
                if (this.axisXControlHeight) {
                    this.camera.heightOffset += offsetX / this.angularSensibilityY;
                }
                else if (this.axisYControlHeight) {
                    this.camera.heightOffset += offsetY / this.angularSensibilityY;
                }
                if (this.axisXControlRadius) {
                    this.camera.radius -= offsetX / this.angularSensibilityY;
                }
                else if (this.axisYControlRadius) {
                    this.camera.radius -= offsetY / this.angularSensibilityY;
                }
            }
            /**
             * Called on pointer POINTERMOVE event if multiple touches are active.
             * @param pointA First point in the pair
             * @param pointB Second point in the pair
             * @param previousPinchSquaredDistance Sqr Distance between the points the last time this event was fired (by this input)
             * @param pinchSquaredDistance Sqr Distance between the points this time
             * @param previousMultiTouchPanPosition Previous center point between the points
             * @param multiTouchPanPosition Current center point between the points
             */
            onMultiTouch(pointA, pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
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
                let pinchDelta = (pinchSquaredDistance - previousPinchSquaredDistance) / ((this.pinchPrecision * (this.angularSensibilityX + this.angularSensibilityY)) / 2);
                if (this.pinchDeltaPercentage) {
                    pinchDelta *= 0.01 * this.pinchDeltaPercentage;
                    if (this.axisPinchControlRotation) {
                        this.camera.rotationOffset += pinchDelta * this.camera.rotationOffset;
                    }
                    if (this.axisPinchControlHeight) {
                        this.camera.heightOffset += pinchDelta * this.camera.heightOffset;
                    }
                    if (this.axisPinchControlRadius) {
                        this.camera.radius -= pinchDelta * this.camera.radius;
                    }
                }
                else {
                    if (this.axisPinchControlRotation) {
                        this.camera.rotationOffset += pinchDelta;
                    }
                    if (this.axisPinchControlHeight) {
                        this.camera.heightOffset += pinchDelta;
                    }
                    if (this.axisPinchControlRadius) {
                        this.camera.radius -= pinchDelta;
                    }
                }
            }
            _warning() {
                if (!this.warningEnable || this._warningCounter++ % 100 !== 0) {
                    return;
                }
                const warn = "It probably only makes sense to control ONE camera " + "property with each pointer axis. Set 'warningEnable = false' " + "if you are sure. Currently enabled: ";
                if (+this.axisXControlRotation + +this.axisXControlHeight + +this.axisXControlRadius > 1) {
                    Logger.Warn(warn +
                        "axisXControlRotation: " +
                        this.axisXControlRotation +
                        ", axisXControlHeight: " +
                        this.axisXControlHeight +
                        ", axisXControlRadius: " +
                        this.axisXControlRadius);
                }
                if (+this.axisYControlRotation + +this.axisYControlHeight + +this.axisYControlRadius > 1) {
                    Logger.Warn(warn +
                        "axisYControlRotation: " +
                        this.axisYControlRotation +
                        ", axisYControlHeight: " +
                        this.axisYControlHeight +
                        ", axisYControlRadius: " +
                        this.axisYControlRadius);
                }
                if (+this.axisPinchControlRotation + +this.axisPinchControlHeight + +this.axisPinchControlRadius > 1) {
                    Logger.Warn(warn +
                        "axisPinchControlRotation: " +
                        this.axisPinchControlRotation +
                        ", axisPinchControlHeight: " +
                        this.axisPinchControlHeight +
                        ", axisPinchControlRadius: " +
                        this.axisPinchControlRadius);
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _angularSensibilityX_decorators = [serialize()];
            _angularSensibilityY_decorators = [serialize()];
            _pinchPrecision_decorators = [serialize()];
            _pinchDeltaPercentage_decorators = [serialize()];
            _axisXControlRadius_decorators = [serialize()];
            _axisXControlHeight_decorators = [serialize()];
            _axisXControlRotation_decorators = [serialize()];
            _axisYControlRadius_decorators = [serialize()];
            _axisYControlHeight_decorators = [serialize()];
            _axisYControlRotation_decorators = [serialize()];
            _axisPinchControlRadius_decorators = [serialize()];
            _axisPinchControlHeight_decorators = [serialize()];
            _axisPinchControlRotation_decorators = [serialize()];
            __esDecorate(null, null, _angularSensibilityX_decorators, { kind: "field", name: "angularSensibilityX", static: false, private: false, access: { has: obj => "angularSensibilityX" in obj, get: obj => obj.angularSensibilityX, set: (obj, value) => { obj.angularSensibilityX = value; } }, metadata: _metadata }, _angularSensibilityX_initializers, _angularSensibilityX_extraInitializers);
            __esDecorate(null, null, _angularSensibilityY_decorators, { kind: "field", name: "angularSensibilityY", static: false, private: false, access: { has: obj => "angularSensibilityY" in obj, get: obj => obj.angularSensibilityY, set: (obj, value) => { obj.angularSensibilityY = value; } }, metadata: _metadata }, _angularSensibilityY_initializers, _angularSensibilityY_extraInitializers);
            __esDecorate(null, null, _pinchPrecision_decorators, { kind: "field", name: "pinchPrecision", static: false, private: false, access: { has: obj => "pinchPrecision" in obj, get: obj => obj.pinchPrecision, set: (obj, value) => { obj.pinchPrecision = value; } }, metadata: _metadata }, _pinchPrecision_initializers, _pinchPrecision_extraInitializers);
            __esDecorate(null, null, _pinchDeltaPercentage_decorators, { kind: "field", name: "pinchDeltaPercentage", static: false, private: false, access: { has: obj => "pinchDeltaPercentage" in obj, get: obj => obj.pinchDeltaPercentage, set: (obj, value) => { obj.pinchDeltaPercentage = value; } }, metadata: _metadata }, _pinchDeltaPercentage_initializers, _pinchDeltaPercentage_extraInitializers);
            __esDecorate(null, null, _axisXControlRadius_decorators, { kind: "field", name: "axisXControlRadius", static: false, private: false, access: { has: obj => "axisXControlRadius" in obj, get: obj => obj.axisXControlRadius, set: (obj, value) => { obj.axisXControlRadius = value; } }, metadata: _metadata }, _axisXControlRadius_initializers, _axisXControlRadius_extraInitializers);
            __esDecorate(null, null, _axisXControlHeight_decorators, { kind: "field", name: "axisXControlHeight", static: false, private: false, access: { has: obj => "axisXControlHeight" in obj, get: obj => obj.axisXControlHeight, set: (obj, value) => { obj.axisXControlHeight = value; } }, metadata: _metadata }, _axisXControlHeight_initializers, _axisXControlHeight_extraInitializers);
            __esDecorate(null, null, _axisXControlRotation_decorators, { kind: "field", name: "axisXControlRotation", static: false, private: false, access: { has: obj => "axisXControlRotation" in obj, get: obj => obj.axisXControlRotation, set: (obj, value) => { obj.axisXControlRotation = value; } }, metadata: _metadata }, _axisXControlRotation_initializers, _axisXControlRotation_extraInitializers);
            __esDecorate(null, null, _axisYControlRadius_decorators, { kind: "field", name: "axisYControlRadius", static: false, private: false, access: { has: obj => "axisYControlRadius" in obj, get: obj => obj.axisYControlRadius, set: (obj, value) => { obj.axisYControlRadius = value; } }, metadata: _metadata }, _axisYControlRadius_initializers, _axisYControlRadius_extraInitializers);
            __esDecorate(null, null, _axisYControlHeight_decorators, { kind: "field", name: "axisYControlHeight", static: false, private: false, access: { has: obj => "axisYControlHeight" in obj, get: obj => obj.axisYControlHeight, set: (obj, value) => { obj.axisYControlHeight = value; } }, metadata: _metadata }, _axisYControlHeight_initializers, _axisYControlHeight_extraInitializers);
            __esDecorate(null, null, _axisYControlRotation_decorators, { kind: "field", name: "axisYControlRotation", static: false, private: false, access: { has: obj => "axisYControlRotation" in obj, get: obj => obj.axisYControlRotation, set: (obj, value) => { obj.axisYControlRotation = value; } }, metadata: _metadata }, _axisYControlRotation_initializers, _axisYControlRotation_extraInitializers);
            __esDecorate(null, null, _axisPinchControlRadius_decorators, { kind: "field", name: "axisPinchControlRadius", static: false, private: false, access: { has: obj => "axisPinchControlRadius" in obj, get: obj => obj.axisPinchControlRadius, set: (obj, value) => { obj.axisPinchControlRadius = value; } }, metadata: _metadata }, _axisPinchControlRadius_initializers, _axisPinchControlRadius_extraInitializers);
            __esDecorate(null, null, _axisPinchControlHeight_decorators, { kind: "field", name: "axisPinchControlHeight", static: false, private: false, access: { has: obj => "axisPinchControlHeight" in obj, get: obj => obj.axisPinchControlHeight, set: (obj, value) => { obj.axisPinchControlHeight = value; } }, metadata: _metadata }, _axisPinchControlHeight_initializers, _axisPinchControlHeight_extraInitializers);
            __esDecorate(null, null, _axisPinchControlRotation_decorators, { kind: "field", name: "axisPinchControlRotation", static: false, private: false, access: { has: obj => "axisPinchControlRotation" in obj, get: obj => obj.axisPinchControlRotation, set: (obj, value) => { obj.axisPinchControlRotation = value; } }, metadata: _metadata }, _axisPinchControlRotation_initializers, _axisPinchControlRotation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FollowCameraPointersInput };
CameraInputTypes["FollowCameraPointersInput"] = FollowCameraPointersInput;
//# sourceMappingURL=followCameraPointersInput.js.map
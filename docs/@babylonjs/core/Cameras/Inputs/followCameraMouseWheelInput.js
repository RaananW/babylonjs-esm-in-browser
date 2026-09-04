import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
import { Logger } from "../../Misc/logger.js";
/**
 * Manage the mouse wheel inputs to control a follow camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FollowCameraMouseWheelInput = (() => {
    var _a;
    let _axisControlRadius_decorators;
    let _axisControlRadius_initializers = [];
    let _axisControlRadius_extraInitializers = [];
    let _axisControlHeight_decorators;
    let _axisControlHeight_initializers = [];
    let _axisControlHeight_extraInitializers = [];
    let _axisControlRotation_decorators;
    let _axisControlRotation_initializers = [];
    let _axisControlRotation_extraInitializers = [];
    let _wheelPrecision_decorators;
    let _wheelPrecision_initializers = [];
    let _wheelPrecision_extraInitializers = [];
    let _wheelDeltaPercentage_decorators;
    let _wheelDeltaPercentage_initializers = [];
    let _wheelDeltaPercentage_extraInitializers = [];
    return _a = class FollowCameraMouseWheelInput {
            constructor() {
                /**
                 * Moue wheel controls zoom. (Mouse wheel modifies camera.radius value.)
                 */
                this.axisControlRadius = __runInitializers(this, _axisControlRadius_initializers, true);
                /**
                 * Moue wheel controls height. (Mouse wheel modifies camera.heightOffset value.)
                 */
                this.axisControlHeight = (__runInitializers(this, _axisControlRadius_extraInitializers), __runInitializers(this, _axisControlHeight_initializers, false));
                /**
                 * Moue wheel controls angle. (Mouse wheel modifies camera.rotationOffset value.)
                 */
                this.axisControlRotation = (__runInitializers(this, _axisControlHeight_extraInitializers), __runInitializers(this, _axisControlRotation_initializers, false));
                /**
                 * Gets or Set the mouse wheel precision or how fast is the camera moves in
                 * relation to mouseWheel events.
                 */
                this.wheelPrecision = (__runInitializers(this, _axisControlRotation_extraInitializers), __runInitializers(this, _wheelPrecision_initializers, 3.0));
                /**
                 * wheelDeltaPercentage will be used instead of wheelPrecision if different from 0.
                 * It defines the percentage of current camera.radius to use as delta when wheel is used.
                 */
                this.wheelDeltaPercentage = (__runInitializers(this, _wheelPrecision_extraInitializers), __runInitializers(this, _wheelDeltaPercentage_initializers, 0));
                this._wheel = __runInitializers(this, _wheelDeltaPercentage_extraInitializers);
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                this._wheel = (p) => {
                    // sanity check - this should be a PointerWheel event.
                    if (p.type !== PointerEventTypes.POINTERWHEEL) {
                        return;
                    }
                    const event = p.event;
                    let delta = 0;
                    const wheelDelta = Math.max(-1, Math.min(1, event.deltaY));
                    if (this.wheelDeltaPercentage) {
                        if (+this.axisControlRadius + +this.axisControlHeight + +this.axisControlRotation > 1) {
                            Logger.Warn("wheelDeltaPercentage only usable when mouse wheel " +
                                "controls ONE axis. " +
                                "Currently enabled: " +
                                "axisControlRadius: " +
                                this.axisControlRadius +
                                ", axisControlHeightOffset: " +
                                this.axisControlHeight +
                                ", axisControlRotationOffset: " +
                                this.axisControlRotation);
                        }
                        if (this.axisControlRadius) {
                            delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.radius;
                        }
                        else if (this.axisControlHeight) {
                            delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.heightOffset;
                        }
                        else if (this.axisControlRotation) {
                            delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.rotationOffset;
                        }
                    }
                    else {
                        delta = wheelDelta * this.wheelPrecision;
                    }
                    if (delta) {
                        if (this.axisControlRadius) {
                            this.camera.radius += delta;
                        }
                        else if (this.axisControlHeight) {
                            this.camera.heightOffset -= delta;
                        }
                        else if (this.axisControlRotation) {
                            this.camera.rotationOffset -= delta;
                        }
                    }
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
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FollowCameraMouseWheelInput";
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
            _axisControlRadius_decorators = [serialize()];
            _axisControlHeight_decorators = [serialize()];
            _axisControlRotation_decorators = [serialize()];
            _wheelPrecision_decorators = [serialize()];
            _wheelDeltaPercentage_decorators = [serialize()];
            __esDecorate(null, null, _axisControlRadius_decorators, { kind: "field", name: "axisControlRadius", static: false, private: false, access: { has: obj => "axisControlRadius" in obj, get: obj => obj.axisControlRadius, set: (obj, value) => { obj.axisControlRadius = value; } }, metadata: _metadata }, _axisControlRadius_initializers, _axisControlRadius_extraInitializers);
            __esDecorate(null, null, _axisControlHeight_decorators, { kind: "field", name: "axisControlHeight", static: false, private: false, access: { has: obj => "axisControlHeight" in obj, get: obj => obj.axisControlHeight, set: (obj, value) => { obj.axisControlHeight = value; } }, metadata: _metadata }, _axisControlHeight_initializers, _axisControlHeight_extraInitializers);
            __esDecorate(null, null, _axisControlRotation_decorators, { kind: "field", name: "axisControlRotation", static: false, private: false, access: { has: obj => "axisControlRotation" in obj, get: obj => obj.axisControlRotation, set: (obj, value) => { obj.axisControlRotation = value; } }, metadata: _metadata }, _axisControlRotation_initializers, _axisControlRotation_extraInitializers);
            __esDecorate(null, null, _wheelPrecision_decorators, { kind: "field", name: "wheelPrecision", static: false, private: false, access: { has: obj => "wheelPrecision" in obj, get: obj => obj.wheelPrecision, set: (obj, value) => { obj.wheelPrecision = value; } }, metadata: _metadata }, _wheelPrecision_initializers, _wheelPrecision_extraInitializers);
            __esDecorate(null, null, _wheelDeltaPercentage_decorators, { kind: "field", name: "wheelDeltaPercentage", static: false, private: false, access: { has: obj => "wheelDeltaPercentage" in obj, get: obj => obj.wheelDeltaPercentage, set: (obj, value) => { obj.wheelDeltaPercentage = value; } }, metadata: _metadata }, _wheelDeltaPercentage_initializers, _wheelDeltaPercentage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FollowCameraMouseWheelInput };
CameraInputTypes["FollowCameraMouseWheelInput"] = FollowCameraMouseWheelInput;
//# sourceMappingURL=followCameraMouseWheelInput.js.map
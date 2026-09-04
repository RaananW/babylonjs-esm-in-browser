import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Matrix, TmpVectors, Vector3 } from "../../Maths/math.vector.pure.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Manage the touch inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FreeCameraTouchInput = (() => {
    var _a;
    let _touchAngularSensibility_decorators;
    let _touchAngularSensibility_initializers = [];
    let _touchAngularSensibility_extraInitializers = [];
    let _touchMoveSensibility_decorators;
    let _touchMoveSensibility_initializers = [];
    let _touchMoveSensibility_extraInitializers = [];
    return _a = class FreeCameraTouchInput {
            /**
             * Manage the touch inputs to control the movement of a free camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
             * @param allowMouse Defines if mouse events can be treated as touch events
             */
            constructor(
            /**
             * [false] Define if mouse events can be treated as touch events
             */
            allowMouse = false) {
                this.allowMouse = allowMouse;
                /**
                 * Defines the touch sensibility for rotation.
                 * The lower the faster.
                 */
                this.touchAngularSensibility = __runInitializers(this, _touchAngularSensibility_initializers, 200000.0);
                /**
                 * Defines the touch sensibility for move.
                 * The lower the faster.
                 */
                this.touchMoveSensibility = (__runInitializers(this, _touchAngularSensibility_extraInitializers), __runInitializers(this, _touchMoveSensibility_initializers, 250.0));
                /**
                 * Swap touch actions so that one touch is used for rotation and multiple for movement
                 */
                this.singleFingerRotate = (__runInitializers(this, _touchMoveSensibility_extraInitializers), false);
                this._offsetX = null;
                this._offsetY = null;
                this._pointerPressed = new Array();
                this._isSafari = Tools.IsSafari();
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                let previousPosition = null;
                if (this._pointerInput === undefined) {
                    this._onLostFocus = () => {
                        this._offsetX = null;
                        this._offsetY = null;
                    };
                    this._pointerInput = (p) => {
                        const evt = p.event;
                        const isMouseEvent = evt.pointerType === "mouse" || (this._isSafari && typeof evt.pointerType === "undefined");
                        if (!this.allowMouse && isMouseEvent) {
                            return;
                        }
                        if (p.type === PointerEventTypes.POINTERDOWN) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                            this._pointerPressed.push(evt.pointerId);
                            if (this._pointerPressed.length !== 1) {
                                return;
                            }
                            previousPosition = {
                                x: evt.clientX,
                                y: evt.clientY,
                            };
                        }
                        else if (p.type === PointerEventTypes.POINTERUP) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                            const index = this._pointerPressed.indexOf(evt.pointerId);
                            if (index === -1) {
                                return;
                            }
                            this._pointerPressed.splice(index, 1);
                            if (index != 0) {
                                return;
                            }
                            previousPosition = null;
                            this._offsetX = null;
                            this._offsetY = null;
                        }
                        else if (p.type === PointerEventTypes.POINTERMOVE) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                            if (!previousPosition) {
                                return;
                            }
                            const index = this._pointerPressed.indexOf(evt.pointerId);
                            if (index != 0) {
                                return;
                            }
                            this._offsetX = evt.clientX - previousPosition.x;
                            this._offsetY = -(evt.clientY - previousPosition.y);
                        }
                    };
                }
                this._observer = this.camera
                    .getScene()
                    ._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
                if (this._onLostFocus) {
                    const engine = this.camera.getEngine();
                    const element = engine.getInputElement();
                    if (element) {
                        element.addEventListener("blur", this._onLostFocus);
                    }
                }
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                if (this._pointerInput) {
                    if (this._observer) {
                        this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
                        this._observer = null;
                    }
                    if (this._onLostFocus) {
                        const engine = this.camera.getEngine();
                        const element = engine.getInputElement();
                        if (element) {
                            element.removeEventListener("blur", this._onLostFocus);
                        }
                        this._onLostFocus = null;
                    }
                    this._pointerPressed.length = 0;
                    this._offsetX = null;
                    this._offsetY = null;
                }
            }
            /**
             * Update the current camera state depending on the inputs that have been used this frame.
             * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
             */
            checkInputs() {
                if (this._offsetX === null || this._offsetY === null) {
                    return;
                }
                if (this._offsetX === 0 && this._offsetY === 0) {
                    return;
                }
                const camera = this.camera;
                // Touch look (yaw/pitch) is gated on touch→rotate and the forward drag-move on
                // touch→translate. Removing an entry disables that touch behavior. An entry's optional
                // `sensitivity` replaces the legacy 1/touchAngularSensibility (rotate) or
                // 1/touchMoveSensibility (translate) scale factor.
                const input = camera.movement.input;
                const rotateEntry = input.getEntry("touch", "rotate");
                const translateEntry = input.getEntry("touch", "translate");
                const handednessMultiplier = camera._calculateHandednessMultiplier();
                const rotateCamera = (this.singleFingerRotate && this._pointerPressed.length === 1) || (!this.singleFingerRotate && this._pointerPressed.length > 1);
                if (rotateEntry) {
                    const rotateSensitivity = rotateEntry.sensitivity ?? 1 / this.touchAngularSensibility;
                    camera.cameraRotation.y = this._offsetX * handednessMultiplier * rotateSensitivity;
                    if (rotateCamera) {
                        camera.cameraRotation.x = -(this._offsetY * handednessMultiplier) * rotateSensitivity;
                    }
                }
                if (!rotateCamera && translateEntry) {
                    const speed = camera._computeLocalCameraSpeed();
                    const moveSensitivity = translateEntry.sensitivity ?? (this.touchMoveSensibility !== 0 ? 1 / this.touchMoveSensibility : 0);
                    const direction = TmpVectors.Vector3[0];
                    direction.copyFromFloats(0, 0, speed * this._offsetY * moveSensitivity);
                    Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, camera._cameraRotationMatrix);
                    Vector3.TransformCoordinatesToRef(direction, camera._cameraRotationMatrix, direction);
                    camera.cameraDirection.addInPlace(direction);
                }
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FreeCameraTouchInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "touch";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _touchAngularSensibility_decorators = [serialize()];
            _touchMoveSensibility_decorators = [serialize()];
            __esDecorate(null, null, _touchAngularSensibility_decorators, { kind: "field", name: "touchAngularSensibility", static: false, private: false, access: { has: obj => "touchAngularSensibility" in obj, get: obj => obj.touchAngularSensibility, set: (obj, value) => { obj.touchAngularSensibility = value; } }, metadata: _metadata }, _touchAngularSensibility_initializers, _touchAngularSensibility_extraInitializers);
            __esDecorate(null, null, _touchMoveSensibility_decorators, { kind: "field", name: "touchMoveSensibility", static: false, private: false, access: { has: obj => "touchMoveSensibility" in obj, get: obj => obj.touchMoveSensibility, set: (obj, value) => { obj.touchMoveSensibility = value; } }, metadata: _metadata }, _touchMoveSensibility_initializers, _touchMoveSensibility_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FreeCameraTouchInput };
CameraInputTypes["FreeCameraTouchInput"] = FreeCameraTouchInput;
//# sourceMappingURL=freeCameraTouchInput.js.map
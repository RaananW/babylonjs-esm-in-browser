import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Quaternion } from "../../Maths/math.vector.pure.js";
import { Axis } from "../../Maths/math.axis.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Listen to mouse events to control the camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FlyCameraMouseInput = (() => {
    var _a;
    let _buttons_decorators;
    let _buttons_initializers = [];
    let _buttons_extraInitializers = [];
    let _angularSensibility_decorators;
    let _angularSensibility_initializers = [];
    let _angularSensibility_extraInitializers = [];
    return _a = class FlyCameraMouseInput {
            /**
             * Listen to mouse events to control the camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
             */
            constructor() {
                /**
                 * Defines the buttons associated with the input to handle camera rotation.
                 */
                this.buttons = __runInitializers(this, _buttons_initializers, [0, 1, 2]);
                /**
                 * Assign buttons for Yaw control.
                 */
                this.buttonsYaw = (__runInitializers(this, _buttons_extraInitializers), [-1, 0, 1]);
                /**
                 * Assign buttons for Pitch control.
                 */
                this.buttonsPitch = [-1, 0, 1];
                /**
                 * Assign buttons for Roll control.
                 */
                this.buttonsRoll = [2];
                /**
                 * Detect if any button is being pressed while mouse is moved.
                 * -1 = Mouse locked.
                 * 0 = Left button.
                 * 1 = Middle Button.
                 * 2 = Right Button.
                 */
                this.activeButton = -1;
                /**
                 * Defines the pointer's angular sensibility, to control the camera rotation speed.
                 * Higher values reduce its sensitivity.
                 */
                this.angularSensibility = __runInitializers(this, _angularSensibility_initializers, 1000.0);
                this._observer = __runInitializers(this, _angularSensibility_extraInitializers);
                this._previousPosition = null;
                /** Reused conditions object for `resolveInteraction` to avoid per-move allocations. */
                this._pointerConditions = {};
            }
            /**
             * Attach the mouse control to the HTML DOM element.
             * @param noPreventDefault Defines whether events caught by the controls should call preventdefault().
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                this._noPreventDefault = noPreventDefault;
                this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver((p) => {
                    this._pointerInput(p);
                }, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
                // Correct Roll by rate, if enabled.
                this._rollObserver = this.camera.getScene().onBeforeRenderObservable.add(() => {
                    if (this.camera.rollCorrect) {
                        this.camera.restoreRoll(this.camera.rollCorrect);
                    }
                });
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                if (this._observer) {
                    this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
                    this.camera.getScene().onBeforeRenderObservable.remove(this._rollObserver);
                    this._observer = null;
                    this._rollObserver = null;
                    this._previousPosition = null;
                    this._noPreventDefault = undefined;
                }
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name.
             */
            getClassName() {
                return "FlyCameraMouseInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input's friendly name.
             */
            getSimpleName() {
                return "mouse";
            }
            // Track mouse movement, when the pointer is not locked.
            _pointerInput(p) {
                const e = p.event;
                const camera = this.camera;
                const engine = camera.getEngine();
                if (!this.touchEnabled && e.pointerType === "touch") {
                    return;
                }
                // Mouse is moved but an unknown mouse button is pressed.
                if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(e.button) === -1) {
                    return;
                }
                const srcElement = e.target;
                // Mouse down.
                if (p.type === PointerEventTypes.POINTERDOWN) {
                    try {
                        srcElement?.setPointerCapture(e.pointerId);
                    }
                    catch (e) {
                        // Nothing to do with the error. Execution continues.
                    }
                    this._previousPosition = {
                        x: e.clientX,
                        y: e.clientY,
                    };
                    this.activeButton = e.button;
                    if (!this._noPreventDefault) {
                        e.preventDefault();
                    }
                    // This is required to move while pointer button is down
                    if (engine.isPointerLock) {
                        this._onMouseMove(p.event);
                    }
                }
                // Mouse up.
                else if (p.type === PointerEventTypes.POINTERUP) {
                    try {
                        srcElement?.releasePointerCapture(e.pointerId);
                    }
                    catch (e) {
                        // Nothing to do with the error. Execution continues.
                    }
                    this.activeButton = -1;
                    this._previousPosition = null;
                    if (!this._noPreventDefault) {
                        e.preventDefault();
                    }
                }
                // Mouse move.
                else if (p.type === PointerEventTypes.POINTERMOVE) {
                    if (!this._previousPosition) {
                        if (engine.isPointerLock) {
                            this._onMouseMove(p.event);
                        }
                        return;
                    }
                    const offsetX = e.clientX - this._previousPosition.x;
                    const offsetY = e.clientY - this._previousPosition.y;
                    this._rotateCamera(offsetX, offsetY);
                    this._previousPosition = {
                        x: e.clientX,
                        y: e.clientY,
                    };
                    if (!this._noPreventDefault) {
                        e.preventDefault();
                    }
                }
            }
            // Track mouse movement, when pointer is locked.
            _onMouseMove(e) {
                const camera = this.camera;
                const engine = camera.getEngine();
                if (!engine.isPointerLock) {
                    return;
                }
                const offsetX = e.movementX;
                const offsetY = e.movementY;
                this._rotateCamera(offsetX, offsetY);
                this._previousPosition = null;
                if (!this._noPreventDefault) {
                    e.preventDefault();
                }
            }
            /**
             * Rotate camera by mouse offset.
             * @param offsetX
             * @param offsetY
             */
            _rotateCamera(offsetX, offsetY) {
                const camera = this.camera;
                // Consult the configurable input map: only rotate when the active button resolves to the
                // "rotate" interaction, letting consumers remap or disable pointer-driven rotation. The
                // resolved entry's sensitivity overrides the legacy `angularSensibility` (used as fallback).
                this._pointerConditions.button = this.activeButton;
                const entry = camera.movement.input.resolveInteraction("pointer", this._pointerConditions);
                if (!entry || entry.interaction !== "rotate") {
                    return;
                }
                const handednessMultiplier = camera._calculateHandednessMultiplier();
                const sensitivityX = entry.sensitivityX ?? entry.sensitivity ?? 1 / this.angularSensibility;
                const sensitivityY = entry.sensitivityY ?? entry.sensitivity ?? 1 / this.angularSensibility;
                const x = offsetX * handednessMultiplier * sensitivityX;
                const y = offsetY * handednessMultiplier * sensitivityY;
                // Initialize to current rotation.
                const currentRotation = Quaternion.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, camera.rotation.z);
                let rotationChange;
                // Pitch.
                if (this.buttonsPitch.some((v) => {
                    return v === this.activeButton;
                })) {
                    // Apply change in Radians to vector Angle.
                    rotationChange = Quaternion.RotationAxis(Axis.X, y);
                    // Apply Pitch to quaternion.
                    currentRotation.multiplyInPlace(rotationChange);
                }
                // Yaw.
                if (this.buttonsYaw.some((v) => {
                    return v === this.activeButton;
                })) {
                    // Apply change in Radians to vector Angle.
                    rotationChange = Quaternion.RotationAxis(Axis.Y, x);
                    // Apply Yaw to quaternion.
                    currentRotation.multiplyInPlace(rotationChange);
                    // Add Roll, if banked turning is enabled, within Roll limit.
                    const limit = camera.bankedTurnLimit + camera._trackRoll; // Defaults to 90° plus manual roll.
                    if (camera.bankedTurn && -limit < camera.rotation.z && camera.rotation.z < limit) {
                        const bankingDelta = camera.bankedTurnMultiplier * -x;
                        // Apply change in Radians to vector Angle.
                        rotationChange = Quaternion.RotationAxis(Axis.Z, bankingDelta);
                        // Apply Yaw to quaternion.
                        currentRotation.multiplyInPlace(rotationChange);
                    }
                }
                // Roll.
                if (this.buttonsRoll.some((v) => {
                    return v === this.activeButton;
                })) {
                    // Apply change in Radians to vector Angle.
                    rotationChange = Quaternion.RotationAxis(Axis.Z, -x);
                    // Track Rolling.
                    camera._trackRoll -= x;
                    // Apply Pitch to quaternion.
                    currentRotation.multiplyInPlace(rotationChange);
                }
                // Apply rotationQuaternion to Euler camera.rotation.
                currentRotation.toEulerAnglesToRef(camera.rotation);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _buttons_decorators = [serialize()];
            _angularSensibility_decorators = [serialize()];
            __esDecorate(null, null, _buttons_decorators, { kind: "field", name: "buttons", static: false, private: false, access: { has: obj => "buttons" in obj, get: obj => obj.buttons, set: (obj, value) => { obj.buttons = value; } }, metadata: _metadata }, _buttons_initializers, _buttons_extraInitializers);
            __esDecorate(null, null, _angularSensibility_decorators, { kind: "field", name: "angularSensibility", static: false, private: false, access: { has: obj => "angularSensibility" in obj, get: obj => obj.angularSensibility, set: (obj, value) => { obj.angularSensibility = value; } }, metadata: _metadata }, _angularSensibility_initializers, _angularSensibility_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FlyCameraMouseInput };
CameraInputTypes["FlyCameraMouseInput"] = FlyCameraMouseInput;
//# sourceMappingURL=flyCameraMouseInput.js.map
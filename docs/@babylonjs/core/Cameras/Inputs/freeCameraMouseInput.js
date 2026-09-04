import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { Observable } from "../../Misc/observable.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Manage the mouse inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FreeCameraMouseInput = (() => {
    var _a;
    let _buttons_decorators;
    let _buttons_initializers = [];
    let _buttons_extraInitializers = [];
    let _angularSensibility_decorators;
    let _angularSensibility_initializers = [];
    let _angularSensibility_extraInitializers = [];
    return _a = class FreeCameraMouseInput {
            /**
             * Applies a pointer-drag delta as camera rotation, but only if the camera's configurable
             * input map resolves the current pointer interaction to "rotate". The map is consulted with
             * the currently active mouse button so consumers can remap or disable pointer-driven rotation.
             * The applied scale comes from the resolved entry's `sensitivity`/`sensitivityX`/`sensitivityY`,
             * falling back to the legacy `angularSensibility` for backward compatibility. The rotation is
             * still written to `camera.cameraRotation` (not the movement accumulators) so existing code that
             * reads `cameraRotation` immediately after a pointer event keeps working.
             * @param offsetX Horizontal pointer delta (already handedness-adjusted).
             * @param offsetY Vertical pointer delta (already handedness-adjusted).
             */
            _applyPointerRotation(offsetX, offsetY) {
                this._pointerConditions.button = this._currentActiveButton;
                const entry = this.camera.movement.input.resolveInteraction("pointer", this._pointerConditions);
                if (!entry || entry.interaction !== "rotate") {
                    return;
                }
                const sensitivityX = entry.sensitivityX ?? entry.sensitivity ?? 1 / this.angularSensibility;
                const sensitivityY = entry.sensitivityY ?? entry.sensitivity ?? 1 / this.angularSensibility;
                this.camera.cameraRotation.y += offsetX * sensitivityX;
                this.camera.cameraRotation.x += offsetY * sensitivityY;
            }
            /**
             * Manage the mouse inputs to control the movement of a free camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
             * @param touchEnabled Defines if touch is enabled or not
             */
            constructor(
            /**
             * [true] Define if touch is enabled in the mouse input
             */
            touchEnabled = true) {
                this.touchEnabled = touchEnabled;
                /**
                 * Defines the buttons associated with the input to handle camera move.
                 */
                this.buttons = __runInitializers(this, _buttons_initializers, [0, 1, 2]);
                /**
                 * Defines the pointer angular sensibility  along the X and Y axis or how fast is the camera rotating.
                 */
                this.angularSensibility = (__runInitializers(this, _buttons_extraInitializers), __runInitializers(this, _angularSensibility_initializers, 2000.0));
                this._pointerInput = __runInitializers(this, _angularSensibility_extraInitializers);
                this._previousPosition = null;
                /**
                 * Observable for when a pointer move event occurs containing the move offset
                 */
                this.onPointerMovedObservable = new Observable();
                /**
                 * @internal
                 * If the camera should be rotated automatically based on pointer movement
                 */
                this._allowCameraRotation = true;
                this._currentActiveButton = -1;
                this._activePointerId = -1;
                /** Reused conditions object for `resolveInteraction` to avoid per-move allocations. */
                this._pointerConditions = {};
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                const engine = this.camera.getEngine();
                const element = engine.getInputElement();
                if (!this._pointerInput) {
                    this._pointerInput = (p) => {
                        const evt = p.event;
                        const isTouch = evt.pointerType === "touch";
                        if (!this.touchEnabled && isTouch) {
                            return;
                        }
                        if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
                            return;
                        }
                        const srcElement = evt.target;
                        if (p.type === PointerEventTypes.POINTERDOWN) {
                            // If the input is touch with more than one touch OR if the input is mouse and there is already an active button, return
                            if ((isTouch && this._activePointerId !== -1) || (!isTouch && this._currentActiveButton !== -1)) {
                                return;
                            }
                            this._activePointerId = evt.pointerId;
                            try {
                                srcElement?.setPointerCapture(evt.pointerId);
                            }
                            catch (e) {
                                //Nothing to do with the error. Execution will continue.
                            }
                            if (this._currentActiveButton === -1) {
                                this._currentActiveButton = evt.button;
                            }
                            this._previousPosition = {
                                x: evt.clientX,
                                y: evt.clientY,
                            };
                            if (!noPreventDefault) {
                                evt.preventDefault();
                                if (element) {
                                    element.focus();
                                }
                            }
                            // This is required to move while pointer button is down
                            if (engine.isPointerLock && this._onMouseMove) {
                                this._onMouseMove(p.event);
                            }
                        }
                        else if (p.type === PointerEventTypes.POINTERUP) {
                            // If input is touch with a different touch id OR if input is mouse with a different button, return
                            if ((isTouch && this._activePointerId !== evt.pointerId) || (!isTouch && this._currentActiveButton !== evt.button)) {
                                return;
                            }
                            try {
                                srcElement?.releasePointerCapture(evt.pointerId);
                            }
                            catch (e) {
                                //Nothing to do with the error.
                            }
                            this._currentActiveButton = -1;
                            this._previousPosition = null;
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                            this._activePointerId = -1;
                        }
                        else if (p.type === PointerEventTypes.POINTERMOVE && (this._activePointerId === evt.pointerId || !isTouch)) {
                            if (engine.isPointerLock && this._onMouseMove) {
                                this._onMouseMove(p.event);
                            }
                            else if (this._previousPosition) {
                                const handednessMultiplier = this.camera._calculateHandednessMultiplier();
                                const offsetX = (evt.clientX - this._previousPosition.x) * handednessMultiplier;
                                const offsetY = (evt.clientY - this._previousPosition.y) * handednessMultiplier;
                                if (this._allowCameraRotation) {
                                    this._applyPointerRotation(offsetX, offsetY);
                                }
                                this.onPointerMovedObservable.notifyObservers({ offsetX: offsetX, offsetY: offsetY });
                                this._previousPosition = {
                                    x: evt.clientX,
                                    y: evt.clientY,
                                };
                                if (!noPreventDefault) {
                                    evt.preventDefault();
                                }
                            }
                        }
                    };
                }
                this._onMouseMove = (evt) => {
                    if (!engine.isPointerLock) {
                        return;
                    }
                    const handednessMultiplier = this.camera._calculateHandednessMultiplier();
                    this._applyPointerRotation(evt.movementX * handednessMultiplier, evt.movementY * handednessMultiplier);
                    this._previousPosition = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
                this._observer = this.camera
                    .getScene()
                    ._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
                if (element) {
                    this._contextMenuBind = (evt) => this.onContextMenu(evt);
                    element.addEventListener("contextmenu", this._contextMenuBind, false); // TODO: We need to figure out how to handle this for Native
                }
            }
            /**
             * Called on JS contextmenu event.
             * Override this method to provide functionality.
             * @param evt the context menu event
             */
            onContextMenu(evt) {
                evt.preventDefault();
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                if (this._observer) {
                    this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
                    if (this._contextMenuBind) {
                        const engine = this.camera.getEngine();
                        const element = engine.getInputElement();
                        if (element) {
                            element.removeEventListener("contextmenu", this._contextMenuBind);
                        }
                    }
                    if (this.onPointerMovedObservable) {
                        this.onPointerMovedObservable.clear();
                    }
                    this._observer = null;
                    this._onMouseMove = null;
                    this._previousPosition = null;
                }
                this._activePointerId = -1;
                this._currentActiveButton = -1;
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FreeCameraMouseInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "mouse";
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
export { FreeCameraMouseInput };
CameraInputTypes["FreeCameraMouseInput"] = FreeCameraMouseInput;
//# sourceMappingURL=freeCameraMouseInput.js.map
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { serialize } from "../../Misc/decorators.js";
import { KeyboardEventTypes } from "../../Events/keyboardEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Manage the keyboard inputs to control the movement of a follow camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FollowCameraKeyboardMoveInput = (() => {
    var _a;
    let _keysHeightOffsetIncr_decorators;
    let _keysHeightOffsetIncr_initializers = [];
    let _keysHeightOffsetIncr_extraInitializers = [];
    let _keysHeightOffsetDecr_decorators;
    let _keysHeightOffsetDecr_initializers = [];
    let _keysHeightOffsetDecr_extraInitializers = [];
    let _keysHeightOffsetModifierAlt_decorators;
    let _keysHeightOffsetModifierAlt_initializers = [];
    let _keysHeightOffsetModifierAlt_extraInitializers = [];
    let _keysHeightOffsetModifierCtrl_decorators;
    let _keysHeightOffsetModifierCtrl_initializers = [];
    let _keysHeightOffsetModifierCtrl_extraInitializers = [];
    let _keysHeightOffsetModifierShift_decorators;
    let _keysHeightOffsetModifierShift_initializers = [];
    let _keysHeightOffsetModifierShift_extraInitializers = [];
    let _keysRotationOffsetIncr_decorators;
    let _keysRotationOffsetIncr_initializers = [];
    let _keysRotationOffsetIncr_extraInitializers = [];
    let _keysRotationOffsetDecr_decorators;
    let _keysRotationOffsetDecr_initializers = [];
    let _keysRotationOffsetDecr_extraInitializers = [];
    let _keysRotationOffsetModifierAlt_decorators;
    let _keysRotationOffsetModifierAlt_initializers = [];
    let _keysRotationOffsetModifierAlt_extraInitializers = [];
    let _keysRotationOffsetModifierCtrl_decorators;
    let _keysRotationOffsetModifierCtrl_initializers = [];
    let _keysRotationOffsetModifierCtrl_extraInitializers = [];
    let _keysRotationOffsetModifierShift_decorators;
    let _keysRotationOffsetModifierShift_initializers = [];
    let _keysRotationOffsetModifierShift_extraInitializers = [];
    let _keysRadiusIncr_decorators;
    let _keysRadiusIncr_initializers = [];
    let _keysRadiusIncr_extraInitializers = [];
    let _keysRadiusDecr_decorators;
    let _keysRadiusDecr_initializers = [];
    let _keysRadiusDecr_extraInitializers = [];
    let _keysRadiusModifierAlt_decorators;
    let _keysRadiusModifierAlt_initializers = [];
    let _keysRadiusModifierAlt_extraInitializers = [];
    let _keysRadiusModifierCtrl_decorators;
    let _keysRadiusModifierCtrl_initializers = [];
    let _keysRadiusModifierCtrl_extraInitializers = [];
    let _keysRadiusModifierShift_decorators;
    let _keysRadiusModifierShift_initializers = [];
    let _keysRadiusModifierShift_extraInitializers = [];
    let _heightSensibility_decorators;
    let _heightSensibility_initializers = [];
    let _heightSensibility_extraInitializers = [];
    let _rotationSensibility_decorators;
    let _rotationSensibility_initializers = [];
    let _rotationSensibility_extraInitializers = [];
    let _radiusSensibility_decorators;
    let _radiusSensibility_initializers = [];
    let _radiusSensibility_extraInitializers = [];
    return _a = class FollowCameraKeyboardMoveInput {
            constructor() {
                /**
                 * Defines the list of key codes associated with the up action (increase heightOffset)
                 */
                this.keysHeightOffsetIncr = __runInitializers(this, _keysHeightOffsetIncr_initializers, [38]);
                /**
                 * Defines the list of key codes associated with the down action (decrease heightOffset)
                 */
                this.keysHeightOffsetDecr = (__runInitializers(this, _keysHeightOffsetIncr_extraInitializers), __runInitializers(this, _keysHeightOffsetDecr_initializers, [40]));
                /**
                 * Defines whether the Alt modifier key is required to move up/down (alter heightOffset)
                 */
                this.keysHeightOffsetModifierAlt = (__runInitializers(this, _keysHeightOffsetDecr_extraInitializers), __runInitializers(this, _keysHeightOffsetModifierAlt_initializers, false));
                /**
                 * Defines whether the Ctrl modifier key is required to move up/down (alter heightOffset)
                 */
                this.keysHeightOffsetModifierCtrl = (__runInitializers(this, _keysHeightOffsetModifierAlt_extraInitializers), __runInitializers(this, _keysHeightOffsetModifierCtrl_initializers, false));
                /**
                 * Defines whether the Shift modifier key is required to move up/down (alter heightOffset)
                 */
                this.keysHeightOffsetModifierShift = (__runInitializers(this, _keysHeightOffsetModifierCtrl_extraInitializers), __runInitializers(this, _keysHeightOffsetModifierShift_initializers, false));
                /**
                 * Defines the list of key codes associated with the left action (increase rotationOffset)
                 */
                this.keysRotationOffsetIncr = (__runInitializers(this, _keysHeightOffsetModifierShift_extraInitializers), __runInitializers(this, _keysRotationOffsetIncr_initializers, [37]));
                /**
                 * Defines the list of key codes associated with the right action (decrease rotationOffset)
                 */
                this.keysRotationOffsetDecr = (__runInitializers(this, _keysRotationOffsetIncr_extraInitializers), __runInitializers(this, _keysRotationOffsetDecr_initializers, [39]));
                /**
                 * Defines whether the Alt modifier key is required to move left/right (alter rotationOffset)
                 */
                this.keysRotationOffsetModifierAlt = (__runInitializers(this, _keysRotationOffsetDecr_extraInitializers), __runInitializers(this, _keysRotationOffsetModifierAlt_initializers, false));
                /**
                 * Defines whether the Ctrl modifier key is required to move left/right (alter rotationOffset)
                 */
                this.keysRotationOffsetModifierCtrl = (__runInitializers(this, _keysRotationOffsetModifierAlt_extraInitializers), __runInitializers(this, _keysRotationOffsetModifierCtrl_initializers, false));
                /**
                 * Defines whether the Shift modifier key is required to move left/right (alter rotationOffset)
                 */
                this.keysRotationOffsetModifierShift = (__runInitializers(this, _keysRotationOffsetModifierCtrl_extraInitializers), __runInitializers(this, _keysRotationOffsetModifierShift_initializers, false));
                /**
                 * Defines the list of key codes associated with the zoom-in action (decrease radius)
                 */
                this.keysRadiusIncr = (__runInitializers(this, _keysRotationOffsetModifierShift_extraInitializers), __runInitializers(this, _keysRadiusIncr_initializers, [40]));
                /**
                 * Defines the list of key codes associated with the zoom-out action (increase radius)
                 */
                this.keysRadiusDecr = (__runInitializers(this, _keysRadiusIncr_extraInitializers), __runInitializers(this, _keysRadiusDecr_initializers, [38]));
                /**
                 * Defines whether the Alt modifier key is required to zoom in/out (alter radius value)
                 */
                this.keysRadiusModifierAlt = (__runInitializers(this, _keysRadiusDecr_extraInitializers), __runInitializers(this, _keysRadiusModifierAlt_initializers, true));
                /**
                 * Defines whether the Ctrl modifier key is required to zoom in/out (alter radius value)
                 */
                this.keysRadiusModifierCtrl = (__runInitializers(this, _keysRadiusModifierAlt_extraInitializers), __runInitializers(this, _keysRadiusModifierCtrl_initializers, false));
                /**
                 * Defines whether the Shift modifier key is required to zoom in/out (alter radius value)
                 */
                this.keysRadiusModifierShift = (__runInitializers(this, _keysRadiusModifierCtrl_extraInitializers), __runInitializers(this, _keysRadiusModifierShift_initializers, false));
                /**
                 * Defines the rate of change of heightOffset.
                 */
                this.heightSensibility = (__runInitializers(this, _keysRadiusModifierShift_extraInitializers), __runInitializers(this, _heightSensibility_initializers, 1));
                /**
                 * Defines the rate of change of rotationOffset.
                 */
                this.rotationSensibility = (__runInitializers(this, _heightSensibility_extraInitializers), __runInitializers(this, _rotationSensibility_initializers, 1));
                /**
                 * Defines the rate of change of radius.
                 */
                this.radiusSensibility = (__runInitializers(this, _rotationSensibility_extraInitializers), __runInitializers(this, _radiusSensibility_initializers, 1));
                this._keys = (__runInitializers(this, _radiusSensibility_extraInitializers), new Array());
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                if (this._onCanvasBlurObserver) {
                    return;
                }
                this._scene = this.camera.getScene();
                this._engine = this._scene.getEngine();
                this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
                    this._keys.length = 0;
                });
                this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
                    const evt = info.event;
                    if (!evt.metaKey) {
                        if (info.type === KeyboardEventTypes.KEYDOWN) {
                            this._ctrlPressed = evt.ctrlKey;
                            this._altPressed = evt.altKey;
                            this._shiftPressed = evt.shiftKey;
                            if (this.keysHeightOffsetIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysHeightOffsetDecr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotationOffsetIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotationOffsetDecr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRadiusIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRadiusDecr.indexOf(evt.keyCode) !== -1) {
                                const index = this._keys.indexOf(evt.keyCode);
                                if (index === -1) {
                                    this._keys.push(evt.keyCode);
                                }
                                if (evt.preventDefault) {
                                    if (!noPreventDefault) {
                                        evt.preventDefault();
                                    }
                                }
                            }
                        }
                        else {
                            if (this.keysHeightOffsetIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysHeightOffsetDecr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotationOffsetIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotationOffsetDecr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRadiusIncr.indexOf(evt.keyCode) !== -1 ||
                                this.keysRadiusDecr.indexOf(evt.keyCode) !== -1) {
                                const index = this._keys.indexOf(evt.keyCode);
                                if (index >= 0) {
                                    this._keys.splice(index, 1);
                                }
                                if (evt.preventDefault) {
                                    if (!noPreventDefault) {
                                        evt.preventDefault();
                                    }
                                }
                            }
                        }
                    }
                });
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                if (this._scene) {
                    if (this._onKeyboardObserver) {
                        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
                    }
                    if (this._onCanvasBlurObserver) {
                        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
                    }
                    this._onKeyboardObserver = null;
                    this._onCanvasBlurObserver = null;
                }
                this._keys.length = 0;
            }
            /**
             * Update the current camera state depending on the inputs that have been used this frame.
             * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
             */
            checkInputs() {
                if (this._onKeyboardObserver) {
                    for (const keyCode of this._keys) {
                        if (this.keysHeightOffsetIncr.indexOf(keyCode) !== -1 && this._modifierHeightOffset()) {
                            this.camera.heightOffset += this.heightSensibility;
                        }
                        else if (this.keysHeightOffsetDecr.indexOf(keyCode) !== -1 && this._modifierHeightOffset()) {
                            this.camera.heightOffset -= this.heightSensibility;
                        }
                        else if (this.keysRotationOffsetIncr.indexOf(keyCode) !== -1 && this._modifierRotationOffset()) {
                            this.camera.rotationOffset += this.rotationSensibility;
                            this.camera.rotationOffset %= 360;
                        }
                        else if (this.keysRotationOffsetDecr.indexOf(keyCode) !== -1 && this._modifierRotationOffset()) {
                            this.camera.rotationOffset -= this.rotationSensibility;
                            this.camera.rotationOffset %= 360;
                        }
                        else if (this.keysRadiusIncr.indexOf(keyCode) !== -1 && this._modifierRadius()) {
                            this.camera.radius += this.radiusSensibility;
                        }
                        else if (this.keysRadiusDecr.indexOf(keyCode) !== -1 && this._modifierRadius()) {
                            this.camera.radius -= this.radiusSensibility;
                        }
                    }
                }
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FollowCameraKeyboardMoveInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "keyboard";
            }
            /**
             * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
             * allow modification of the heightOffset value.
             * @returns true if modifier keys match
             */
            _modifierHeightOffset() {
                return (this.keysHeightOffsetModifierAlt === this._altPressed &&
                    this.keysHeightOffsetModifierCtrl === this._ctrlPressed &&
                    this.keysHeightOffsetModifierShift === this._shiftPressed);
            }
            /**
             * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
             * allow modification of the rotationOffset value.
             * @returns true if modifier keys match
             */
            _modifierRotationOffset() {
                return (this.keysRotationOffsetModifierAlt === this._altPressed &&
                    this.keysRotationOffsetModifierCtrl === this._ctrlPressed &&
                    this.keysRotationOffsetModifierShift === this._shiftPressed);
            }
            /**
             * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
             * allow modification of the radius value.
             * @returns true if modifier keys match
             */
            _modifierRadius() {
                return this.keysRadiusModifierAlt === this._altPressed && this.keysRadiusModifierCtrl === this._ctrlPressed && this.keysRadiusModifierShift === this._shiftPressed;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _keysHeightOffsetIncr_decorators = [serialize()];
            _keysHeightOffsetDecr_decorators = [serialize()];
            _keysHeightOffsetModifierAlt_decorators = [serialize()];
            _keysHeightOffsetModifierCtrl_decorators = [serialize()];
            _keysHeightOffsetModifierShift_decorators = [serialize()];
            _keysRotationOffsetIncr_decorators = [serialize()];
            _keysRotationOffsetDecr_decorators = [serialize()];
            _keysRotationOffsetModifierAlt_decorators = [serialize()];
            _keysRotationOffsetModifierCtrl_decorators = [serialize()];
            _keysRotationOffsetModifierShift_decorators = [serialize()];
            _keysRadiusIncr_decorators = [serialize()];
            _keysRadiusDecr_decorators = [serialize()];
            _keysRadiusModifierAlt_decorators = [serialize()];
            _keysRadiusModifierCtrl_decorators = [serialize()];
            _keysRadiusModifierShift_decorators = [serialize()];
            _heightSensibility_decorators = [serialize()];
            _rotationSensibility_decorators = [serialize()];
            _radiusSensibility_decorators = [serialize()];
            __esDecorate(null, null, _keysHeightOffsetIncr_decorators, { kind: "field", name: "keysHeightOffsetIncr", static: false, private: false, access: { has: obj => "keysHeightOffsetIncr" in obj, get: obj => obj.keysHeightOffsetIncr, set: (obj, value) => { obj.keysHeightOffsetIncr = value; } }, metadata: _metadata }, _keysHeightOffsetIncr_initializers, _keysHeightOffsetIncr_extraInitializers);
            __esDecorate(null, null, _keysHeightOffsetDecr_decorators, { kind: "field", name: "keysHeightOffsetDecr", static: false, private: false, access: { has: obj => "keysHeightOffsetDecr" in obj, get: obj => obj.keysHeightOffsetDecr, set: (obj, value) => { obj.keysHeightOffsetDecr = value; } }, metadata: _metadata }, _keysHeightOffsetDecr_initializers, _keysHeightOffsetDecr_extraInitializers);
            __esDecorate(null, null, _keysHeightOffsetModifierAlt_decorators, { kind: "field", name: "keysHeightOffsetModifierAlt", static: false, private: false, access: { has: obj => "keysHeightOffsetModifierAlt" in obj, get: obj => obj.keysHeightOffsetModifierAlt, set: (obj, value) => { obj.keysHeightOffsetModifierAlt = value; } }, metadata: _metadata }, _keysHeightOffsetModifierAlt_initializers, _keysHeightOffsetModifierAlt_extraInitializers);
            __esDecorate(null, null, _keysHeightOffsetModifierCtrl_decorators, { kind: "field", name: "keysHeightOffsetModifierCtrl", static: false, private: false, access: { has: obj => "keysHeightOffsetModifierCtrl" in obj, get: obj => obj.keysHeightOffsetModifierCtrl, set: (obj, value) => { obj.keysHeightOffsetModifierCtrl = value; } }, metadata: _metadata }, _keysHeightOffsetModifierCtrl_initializers, _keysHeightOffsetModifierCtrl_extraInitializers);
            __esDecorate(null, null, _keysHeightOffsetModifierShift_decorators, { kind: "field", name: "keysHeightOffsetModifierShift", static: false, private: false, access: { has: obj => "keysHeightOffsetModifierShift" in obj, get: obj => obj.keysHeightOffsetModifierShift, set: (obj, value) => { obj.keysHeightOffsetModifierShift = value; } }, metadata: _metadata }, _keysHeightOffsetModifierShift_initializers, _keysHeightOffsetModifierShift_extraInitializers);
            __esDecorate(null, null, _keysRotationOffsetIncr_decorators, { kind: "field", name: "keysRotationOffsetIncr", static: false, private: false, access: { has: obj => "keysRotationOffsetIncr" in obj, get: obj => obj.keysRotationOffsetIncr, set: (obj, value) => { obj.keysRotationOffsetIncr = value; } }, metadata: _metadata }, _keysRotationOffsetIncr_initializers, _keysRotationOffsetIncr_extraInitializers);
            __esDecorate(null, null, _keysRotationOffsetDecr_decorators, { kind: "field", name: "keysRotationOffsetDecr", static: false, private: false, access: { has: obj => "keysRotationOffsetDecr" in obj, get: obj => obj.keysRotationOffsetDecr, set: (obj, value) => { obj.keysRotationOffsetDecr = value; } }, metadata: _metadata }, _keysRotationOffsetDecr_initializers, _keysRotationOffsetDecr_extraInitializers);
            __esDecorate(null, null, _keysRotationOffsetModifierAlt_decorators, { kind: "field", name: "keysRotationOffsetModifierAlt", static: false, private: false, access: { has: obj => "keysRotationOffsetModifierAlt" in obj, get: obj => obj.keysRotationOffsetModifierAlt, set: (obj, value) => { obj.keysRotationOffsetModifierAlt = value; } }, metadata: _metadata }, _keysRotationOffsetModifierAlt_initializers, _keysRotationOffsetModifierAlt_extraInitializers);
            __esDecorate(null, null, _keysRotationOffsetModifierCtrl_decorators, { kind: "field", name: "keysRotationOffsetModifierCtrl", static: false, private: false, access: { has: obj => "keysRotationOffsetModifierCtrl" in obj, get: obj => obj.keysRotationOffsetModifierCtrl, set: (obj, value) => { obj.keysRotationOffsetModifierCtrl = value; } }, metadata: _metadata }, _keysRotationOffsetModifierCtrl_initializers, _keysRotationOffsetModifierCtrl_extraInitializers);
            __esDecorate(null, null, _keysRotationOffsetModifierShift_decorators, { kind: "field", name: "keysRotationOffsetModifierShift", static: false, private: false, access: { has: obj => "keysRotationOffsetModifierShift" in obj, get: obj => obj.keysRotationOffsetModifierShift, set: (obj, value) => { obj.keysRotationOffsetModifierShift = value; } }, metadata: _metadata }, _keysRotationOffsetModifierShift_initializers, _keysRotationOffsetModifierShift_extraInitializers);
            __esDecorate(null, null, _keysRadiusIncr_decorators, { kind: "field", name: "keysRadiusIncr", static: false, private: false, access: { has: obj => "keysRadiusIncr" in obj, get: obj => obj.keysRadiusIncr, set: (obj, value) => { obj.keysRadiusIncr = value; } }, metadata: _metadata }, _keysRadiusIncr_initializers, _keysRadiusIncr_extraInitializers);
            __esDecorate(null, null, _keysRadiusDecr_decorators, { kind: "field", name: "keysRadiusDecr", static: false, private: false, access: { has: obj => "keysRadiusDecr" in obj, get: obj => obj.keysRadiusDecr, set: (obj, value) => { obj.keysRadiusDecr = value; } }, metadata: _metadata }, _keysRadiusDecr_initializers, _keysRadiusDecr_extraInitializers);
            __esDecorate(null, null, _keysRadiusModifierAlt_decorators, { kind: "field", name: "keysRadiusModifierAlt", static: false, private: false, access: { has: obj => "keysRadiusModifierAlt" in obj, get: obj => obj.keysRadiusModifierAlt, set: (obj, value) => { obj.keysRadiusModifierAlt = value; } }, metadata: _metadata }, _keysRadiusModifierAlt_initializers, _keysRadiusModifierAlt_extraInitializers);
            __esDecorate(null, null, _keysRadiusModifierCtrl_decorators, { kind: "field", name: "keysRadiusModifierCtrl", static: false, private: false, access: { has: obj => "keysRadiusModifierCtrl" in obj, get: obj => obj.keysRadiusModifierCtrl, set: (obj, value) => { obj.keysRadiusModifierCtrl = value; } }, metadata: _metadata }, _keysRadiusModifierCtrl_initializers, _keysRadiusModifierCtrl_extraInitializers);
            __esDecorate(null, null, _keysRadiusModifierShift_decorators, { kind: "field", name: "keysRadiusModifierShift", static: false, private: false, access: { has: obj => "keysRadiusModifierShift" in obj, get: obj => obj.keysRadiusModifierShift, set: (obj, value) => { obj.keysRadiusModifierShift = value; } }, metadata: _metadata }, _keysRadiusModifierShift_initializers, _keysRadiusModifierShift_extraInitializers);
            __esDecorate(null, null, _heightSensibility_decorators, { kind: "field", name: "heightSensibility", static: false, private: false, access: { has: obj => "heightSensibility" in obj, get: obj => obj.heightSensibility, set: (obj, value) => { obj.heightSensibility = value; } }, metadata: _metadata }, _heightSensibility_initializers, _heightSensibility_extraInitializers);
            __esDecorate(null, null, _rotationSensibility_decorators, { kind: "field", name: "rotationSensibility", static: false, private: false, access: { has: obj => "rotationSensibility" in obj, get: obj => obj.rotationSensibility, set: (obj, value) => { obj.rotationSensibility = value; } }, metadata: _metadata }, _rotationSensibility_initializers, _rotationSensibility_extraInitializers);
            __esDecorate(null, null, _radiusSensibility_decorators, { kind: "field", name: "radiusSensibility", static: false, private: false, access: { has: obj => "radiusSensibility" in obj, get: obj => obj.radiusSensibility, set: (obj, value) => { obj.radiusSensibility = value; } }, metadata: _metadata }, _radiusSensibility_initializers, _radiusSensibility_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FollowCameraKeyboardMoveInput };
CameraInputTypes["FollowCameraKeyboardMoveInput"] = FollowCameraKeyboardMoveInput;
//# sourceMappingURL=followCameraKeyboardMoveInput.js.map
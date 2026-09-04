import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { KeyboardEventTypes } from "../../Events/keyboardEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
import { Vector2 } from "../../Maths/math.vector.pure.js";
/**
 * Manage the keyboard inputs to control the movement of an arc rotate camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let ArcRotateCameraKeyboardMoveInput = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _keysUp_decorators;
    let _keysUp_initializers = [];
    let _keysUp_extraInitializers = [];
    let _keysDown_decorators;
    let _keysDown_initializers = [];
    let _keysDown_extraInitializers = [];
    let _keysLeft_decorators;
    let _keysLeft_initializers = [];
    let _keysLeft_extraInitializers = [];
    let _keysRight_decorators;
    let _keysRight_initializers = [];
    let _keysRight_extraInitializers = [];
    let _keysReset_decorators;
    let _keysReset_initializers = [];
    let _keysReset_extraInitializers = [];
    let _keysZoomIn_decorators;
    let _keysZoomIn_initializers = [];
    let _keysZoomIn_extraInitializers = [];
    let _keysZoomOut_decorators;
    let _keysZoomOut_initializers = [];
    let _keysZoomOut_extraInitializers = [];
    let _panningSensibility_decorators;
    let _panningSensibility_initializers = [];
    let _panningSensibility_extraInitializers = [];
    let _zoomingSensibility_decorators;
    let _zoomingSensibility_initializers = [];
    let _zoomingSensibility_extraInitializers = [];
    let _angularSpeed_decorators;
    let _angularSpeed_initializers = [];
    let _angularSpeed_extraInitializers = [];
    let _get_useAltToZoom_decorators;
    return _a = class ArcRotateCameraKeyboardMoveInput {
            constructor() {
                /**
                 * Defines the camera the input is attached to.
                 */
                this.camera = __runInitializers(this, _instanceExtraInitializers);
                /**
                 * Defines the list of key codes associated with the up action (increase alpha)
                 */
                this.keysUp = __runInitializers(this, _keysUp_initializers, [38]);
                /**
                 * Defines the list of key codes associated with the down action (decrease alpha)
                 */
                this.keysDown = (__runInitializers(this, _keysUp_extraInitializers), __runInitializers(this, _keysDown_initializers, [40]));
                /**
                 * Defines the list of key codes associated with the left action (increase beta)
                 */
                this.keysLeft = (__runInitializers(this, _keysDown_extraInitializers), __runInitializers(this, _keysLeft_initializers, [37]));
                /**
                 * Defines the list of key codes associated with the right action (decrease beta)
                 */
                this.keysRight = (__runInitializers(this, _keysLeft_extraInitializers), __runInitializers(this, _keysRight_initializers, [39]));
                /**
                 * Defines the list of key codes associated with the reset action.
                 * Those keys reset the camera to its last stored state (with the method camera.storeState())
                 */
                this.keysReset = (__runInitializers(this, _keysRight_extraInitializers), __runInitializers(this, _keysReset_initializers, [220]));
                /**
                 * Defines the list of key codes associated with the zoom in action.
                 * Only used when CameraMovement is active — these keys always trigger zoom regardless of modifiers.
                 */
                this.keysZoomIn = (__runInitializers(this, _keysReset_extraInitializers), __runInitializers(this, _keysZoomIn_initializers, [187, 107])); // 187 = +/= key, 107 = numpad +
                /**
                 * Defines the list of key codes associated with the zoom out action.
                 * Only used when CameraMovement is active — these keys always trigger zoom regardless of modifiers.
                 */
                this.keysZoomOut = (__runInitializers(this, _keysZoomIn_extraInitializers), __runInitializers(this, _keysZoomOut_initializers, [189, 109])); // 189 = -/_ key, 109 = numpad -
                /**
                 * Defines the panning sensibility of the inputs.
                 * (How fast is the camera panning)
                 */
                this.panningSensibility = (__runInitializers(this, _keysZoomOut_extraInitializers), __runInitializers(this, _panningSensibility_initializers, 50.0));
                /**
                 * Defines the zooming sensibility of the inputs.
                 * (How fast is the camera zooming)
                 */
                this.zoomingSensibility = (__runInitializers(this, _panningSensibility_extraInitializers), __runInitializers(this, _zoomingSensibility_initializers, 25.0));
                /**
                 * Rotation speed of the camera
                 */
                this.angularSpeed = (__runInitializers(this, _zoomingSensibility_extraInitializers), __runInitializers(this, _angularSpeed_initializers, 0.01));
                this._useAltToZoom = (__runInitializers(this, _angularSpeed_extraInitializers), true);
                this._keys = new Array();
                /**
                 * Modifier state stored separately from `_keyboardConditions` so it can be typed as a
                 * concrete (non-optional) object. This avoids non-null assertions when updating modifier
                 * fields each frame, and the conditions object holds the same reference so
                 * resolveInteraction sees the live state.
                 */
                this._keyboardModifiers = { ctrl: false, alt: false };
                /** Cached conditions object to avoid per-frame allocations in checkInputs */
                this._keyboardConditions = { modifiers: this._keyboardModifiers };
                /** Reused accumulators for the per-frame keyboard rotate/pan directions, to avoid per-frame allocations */
                this._rotateDirection = new Vector2();
                this._panDirection = new Vector2();
            }
            /**
             * Defines whether alt+arrows/wasd triggers zoom instead of rotation/pan.
             * When disabled, alt+keyboard events are ignored by the zoom inputMap entry.
             * Setting this updates the corresponding inputMap entry on the camera's movement system.
             * If set before the camera is attached, the value is cached and applied during `attachControl`.
             */
            get useAltToZoom() {
                return this._useAltToZoom;
            }
            set useAltToZoom(value) {
                this._useAltToZoom = value;
                this._applyUseAltToZoomToInputMap();
            }
            /**
             * Applies the cached `_useAltToZoom` value to the camera's inputMap.
             * Safe to call before the camera is attached: it is a no-op until `this.camera.movement` is available.
             * Idempotent — calling it when the inputMap already matches the cached value is a no-op.
             */
            _applyUseAltToZoomToInputMap() {
                if (!this.camera?.movement) {
                    return;
                }
                const input = this.camera.movement.input;
                const entry = input.getEntry("keyboard", "zoom", { modifiers: { alt: true } });
                if (!this._useAltToZoom && entry) {
                    input.inputMap.splice(input.inputMap.indexOf(entry), 1);
                }
                else if (this._useAltToZoom && !entry) {
                    input.addEntry({ source: "keyboard", modifiers: { alt: true }, interaction: "zoom" });
                }
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(noPreventDefault) {
                // was there a second variable defined?
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                if (this._onCanvasBlurObserver) {
                    return;
                }
                this._scene = this.camera.getScene();
                this._engine = this._scene.getEngine();
                this._applyUseAltToZoomToInputMap();
                this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
                    this._keys.length = 0;
                });
                this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
                    const evt = info.event;
                    if (!evt.metaKey) {
                        if (info.type === KeyboardEventTypes.KEYDOWN) {
                            this._ctrlPressed = evt.ctrlKey;
                            this._altPressed = evt.altKey;
                            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysReset.indexOf(evt.keyCode) !== -1 ||
                                this.keysZoomIn.indexOf(evt.keyCode) !== -1 ||
                                this.keysZoomOut.indexOf(evt.keyCode) !== -1) {
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
                            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysReset.indexOf(evt.keyCode) !== -1 ||
                                this.keysZoomIn.indexOf(evt.keyCode) !== -1 ||
                                this.keysZoomOut.indexOf(evt.keyCode) !== -1) {
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
                    const camera = this.camera;
                    const input = camera.movement.input;
                    this._keyboardModifiers.ctrl = this._ctrlPressed;
                    this._keyboardModifiers.alt = this._altPressed;
                    // Rotate and pan directions are accumulated across keys and applied once below (normalized), so
                    // holding two directions at once (e.g. up + left) moves along a normalized diagonal at the same
                    // speed as a single direction, instead of the ~1.41x boost (sqrt(2)) that results from applying
                    // each key independently. Zoom is one-dimensional and is applied per key.
                    const rotateDirection = this._rotateDirection.set(0, 0);
                    const panDirection = this._panDirection.set(0, 0);
                    let rotateSensitivity = 0;
                    let panSensitivity = 0;
                    for (let index = 0; index < this._keys.length; index++) {
                        const keyCode = this._keys[index];
                        this._keyboardConditions.key = keyCode;
                        // Skip resolveInteraction for the reset key — it has no inputMap entry of its own
                        // and would otherwise spuriously match the catch-all keyboard→rotate entry.
                        if (this.keysReset.indexOf(keyCode) === -1) {
                            const resolved = input.resolveInteraction("keyboard", this._keyboardConditions);
                            if (resolved) {
                                // Per-frame impulse magnitude. The inputMap entry's `sensitivity` takes precedence
                                // when set so consumers can tune feel declaratively (and so we can phase out the
                                // legacy sensibility/angularSpeed properties over time). When `sensitivity` is
                                // undefined, fall back to the legacy properties for backward compatibility.
                                if (resolved.interaction === "pan") {
                                    // Accumulate a unit direction per pan key; the combined vector is normalized after the loop.
                                    // Aggregate sensitivity with max so the pan speed is independent of key insertion order
                                    // when keys resolve to different per-key sensitivities.
                                    panSensitivity = Math.max(panSensitivity, resolved.sensitivity ?? 1 / this.panningSensibility);
                                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                                        panDirection.x -= 1;
                                    }
                                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                                        panDirection.x += 1;
                                    }
                                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                                        panDirection.y += 1;
                                    }
                                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                                        panDirection.y -= 1;
                                    }
                                }
                                else if (resolved.interaction === "zoom") {
                                    const zoomSens = resolved.sensitivity ?? 1 / this.zoomingSensibility;
                                    if (this.keysUp.indexOf(keyCode) !== -1 || this.keysZoomIn.indexOf(keyCode) !== -1) {
                                        input.handlers.zoom(zoomSens);
                                    }
                                    else if (this.keysDown.indexOf(keyCode) !== -1 || this.keysZoomOut.indexOf(keyCode) !== -1) {
                                        input.handlers.zoom(-zoomSens);
                                    }
                                }
                                else if (resolved.interaction === "rotate") {
                                    // Accumulate a unit direction per rotate key; the combined vector is normalized after the loop.
                                    // Aggregate sensitivity with max so the rotate speed is independent of key insertion order
                                    // when keys resolve to different per-key sensitivities.
                                    rotateSensitivity = Math.max(rotateSensitivity, resolved.sensitivity ?? this.angularSpeed);
                                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                                        rotateDirection.x -= 1;
                                    }
                                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                                        rotateDirection.x += 1;
                                    }
                                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                                        rotateDirection.y -= 1;
                                    }
                                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                                        rotateDirection.y += 1;
                                    }
                                }
                            }
                        }
                        if (this.keysReset.indexOf(keyCode) !== -1) {
                            if (camera.useInputToRestoreState) {
                                camera.restoreState();
                            }
                        }
                    }
                    // Apply the accumulated rotate/pan once, normalized so a diagonal isn't faster than an axis-aligned move.
                    if (rotateDirection.x !== 0 || rotateDirection.y !== 0) {
                        rotateDirection.normalize().scaleInPlace(rotateSensitivity);
                        input.handlers.rotate(rotateDirection.x, rotateDirection.y);
                    }
                    if (panDirection.x !== 0 || panDirection.y !== 0) {
                        panDirection.normalize().scaleInPlace(panSensitivity);
                        input.handlers.pan(panDirection.x, panDirection.y);
                    }
                }
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "ArcRotateCameraKeyboardMoveInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "keyboard";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _keysUp_decorators = [serialize()];
            _keysDown_decorators = [serialize()];
            _keysLeft_decorators = [serialize()];
            _keysRight_decorators = [serialize()];
            _keysReset_decorators = [serialize()];
            _keysZoomIn_decorators = [serialize()];
            _keysZoomOut_decorators = [serialize()];
            _panningSensibility_decorators = [serialize()];
            _zoomingSensibility_decorators = [serialize()];
            _angularSpeed_decorators = [serialize()];
            _get_useAltToZoom_decorators = [serialize()];
            __esDecorate(_a, null, _get_useAltToZoom_decorators, { kind: "getter", name: "useAltToZoom", static: false, private: false, access: { has: obj => "useAltToZoom" in obj, get: obj => obj.useAltToZoom }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _keysUp_decorators, { kind: "field", name: "keysUp", static: false, private: false, access: { has: obj => "keysUp" in obj, get: obj => obj.keysUp, set: (obj, value) => { obj.keysUp = value; } }, metadata: _metadata }, _keysUp_initializers, _keysUp_extraInitializers);
            __esDecorate(null, null, _keysDown_decorators, { kind: "field", name: "keysDown", static: false, private: false, access: { has: obj => "keysDown" in obj, get: obj => obj.keysDown, set: (obj, value) => { obj.keysDown = value; } }, metadata: _metadata }, _keysDown_initializers, _keysDown_extraInitializers);
            __esDecorate(null, null, _keysLeft_decorators, { kind: "field", name: "keysLeft", static: false, private: false, access: { has: obj => "keysLeft" in obj, get: obj => obj.keysLeft, set: (obj, value) => { obj.keysLeft = value; } }, metadata: _metadata }, _keysLeft_initializers, _keysLeft_extraInitializers);
            __esDecorate(null, null, _keysRight_decorators, { kind: "field", name: "keysRight", static: false, private: false, access: { has: obj => "keysRight" in obj, get: obj => obj.keysRight, set: (obj, value) => { obj.keysRight = value; } }, metadata: _metadata }, _keysRight_initializers, _keysRight_extraInitializers);
            __esDecorate(null, null, _keysReset_decorators, { kind: "field", name: "keysReset", static: false, private: false, access: { has: obj => "keysReset" in obj, get: obj => obj.keysReset, set: (obj, value) => { obj.keysReset = value; } }, metadata: _metadata }, _keysReset_initializers, _keysReset_extraInitializers);
            __esDecorate(null, null, _keysZoomIn_decorators, { kind: "field", name: "keysZoomIn", static: false, private: false, access: { has: obj => "keysZoomIn" in obj, get: obj => obj.keysZoomIn, set: (obj, value) => { obj.keysZoomIn = value; } }, metadata: _metadata }, _keysZoomIn_initializers, _keysZoomIn_extraInitializers);
            __esDecorate(null, null, _keysZoomOut_decorators, { kind: "field", name: "keysZoomOut", static: false, private: false, access: { has: obj => "keysZoomOut" in obj, get: obj => obj.keysZoomOut, set: (obj, value) => { obj.keysZoomOut = value; } }, metadata: _metadata }, _keysZoomOut_initializers, _keysZoomOut_extraInitializers);
            __esDecorate(null, null, _panningSensibility_decorators, { kind: "field", name: "panningSensibility", static: false, private: false, access: { has: obj => "panningSensibility" in obj, get: obj => obj.panningSensibility, set: (obj, value) => { obj.panningSensibility = value; } }, metadata: _metadata }, _panningSensibility_initializers, _panningSensibility_extraInitializers);
            __esDecorate(null, null, _zoomingSensibility_decorators, { kind: "field", name: "zoomingSensibility", static: false, private: false, access: { has: obj => "zoomingSensibility" in obj, get: obj => obj.zoomingSensibility, set: (obj, value) => { obj.zoomingSensibility = value; } }, metadata: _metadata }, _zoomingSensibility_initializers, _zoomingSensibility_extraInitializers);
            __esDecorate(null, null, _angularSpeed_decorators, { kind: "field", name: "angularSpeed", static: false, private: false, access: { has: obj => "angularSpeed" in obj, get: obj => obj.angularSpeed, set: (obj, value) => { obj.angularSpeed = value; } }, metadata: _metadata }, _angularSpeed_initializers, _angularSpeed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ArcRotateCameraKeyboardMoveInput };
CameraInputTypes["ArcRotateCameraKeyboardMoveInput"] = ArcRotateCameraKeyboardMoveInput;
//# sourceMappingURL=arcRotateCameraKeyboardMoveInput.js.map
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../cameraInputsManager.js";
import { KeyboardEventTypes } from "../../Events/keyboardEvents.js";
import { Tools } from "../../Misc/tools.pure.js";
import { Vector2 } from "../../Maths/math.vector.pure.js";
/**
 * Manage the keyboard inputs to control the movement of a geospatial camera.
 * Arrow keys + Modifier key (ctrl/alt/option on mac): rotate
 * Arrow keys alone: pan
 * + / - keys: zoom in/out
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let GeospatialCameraKeyboardInput = (() => {
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
    let _keysZoomIn_decorators;
    let _keysZoomIn_initializers = [];
    let _keysZoomIn_extraInitializers = [];
    let _keysZoomOut_decorators;
    let _keysZoomOut_initializers = [];
    let _keysZoomOut_extraInitializers = [];
    let _get_rotationSensitivity_decorators;
    let _get_panSensitivity_decorators;
    let _get_zoomSensitivity_decorators;
    return _a = class GeospatialCameraKeyboardInput {
            constructor() {
                /**
                 * Defines the camera the input is attached to.
                 */
                this.camera = __runInitializers(this, _instanceExtraInitializers);
                /**
                 * Defines the list of key codes associated with the up action (pan up)
                 */
                this.keysUp = __runInitializers(this, _keysUp_initializers, [38]);
                /**
                 * Defines the list of key codes associated with the down action (pan down)
                 */
                this.keysDown = (__runInitializers(this, _keysUp_extraInitializers), __runInitializers(this, _keysDown_initializers, [40]));
                /**
                 * Defines the list of key codes associated with the left action (pan left)
                 */
                this.keysLeft = (__runInitializers(this, _keysDown_extraInitializers), __runInitializers(this, _keysLeft_initializers, [37]));
                /**
                 * Defines the list of key codes associated with the right action (pan right)
                 */
                this.keysRight = (__runInitializers(this, _keysLeft_extraInitializers), __runInitializers(this, _keysRight_initializers, [39]));
                /**
                 * Defines the list of key codes associated with zoom in (+ or =)
                 */
                this.keysZoomIn = (__runInitializers(this, _keysRight_extraInitializers), __runInitializers(this, _keysZoomIn_initializers, [187, 107])); // 187 = + key, 107 = numpad +
                /**
                 * Defines the list of key codes associated with zoom out (-)
                 */
                this.keysZoomOut = (__runInitializers(this, _keysZoomIn_extraInitializers), __runInitializers(this, _keysZoomOut_initializers, [189, 109])); // 189 = - key, 109 = numpad -
                this._keys = (__runInitializers(this, _keysZoomOut_extraInitializers), new Array());
                /**
                 * Modifier state stored separately from `_keyboardConditions` so it can be typed as a
                 * concrete (non-optional) object. This avoids non-null assertions when updating modifier
                 * fields each frame, and the conditions object holds the same reference so
                 * resolveInteraction sees the live state.
                 */
                this._keyboardModifiers = { ctrl: false, alt: false, shift: false };
                /** Cached conditions object to avoid per-frame allocations in checkInputs */
                this._keyboardConditions = { modifiers: this._keyboardModifiers };
                /** Reused accumulator for the per-frame keyboard pan direction, to avoid per-frame allocations */
                this._panDirection = new Vector2();
            }
            /**
             * Defines the rotation sensitivity of the inputs.
             * (How many pixels of pointer input to apply per keypress, before rotation speed factor is applied by movement class)
             * @deprecated Use the `sensitivity` field on the keyboard rotate entry in `camera.movement.input.inputMap` instead.
             */
            get rotationSensitivity() {
                const entry = this.camera?.movement.input.getEntry("keyboard", "rotate");
                return entry?.sensitivity ?? 1;
            }
            set rotationSensitivity(value) {
                for (const entry of this.camera?.movement.input.getEntries("keyboard", "rotate") ?? []) {
                    entry.sensitivity = value;
                }
            }
            /**
             * Defines the panning sensitivity of the inputs.
             * (How many pixels of pointer input to apply per keypress, before pan speed factor is applied by movement class)
             * @deprecated Use the `sensitivity` field on the keyboard pan entry in `camera.movement.input.inputMap` instead.
             */
            get panSensitivity() {
                const entry = this.camera?.movement.input.getEntry("keyboard", "pan");
                return entry?.sensitivity ?? 1;
            }
            set panSensitivity(value) {
                for (const entry of this.camera?.movement.input.getEntries("keyboard", "pan") ?? []) {
                    entry.sensitivity = value;
                }
            }
            /**
             * Defines the zooming sensitivity of the inputs.
             * (How many pixels of pointer input to apply per keypress, before zoom speed factor is applied by movement class)
             * @deprecated Use the `sensitivity` field on the keyboard zoom entry in `camera.movement.input.inputMap` instead.
             */
            get zoomSensitivity() {
                const entry = this.camera?.movement.input.getEntry("keyboard", "zoom");
                return entry?.sensitivity ?? 1;
            }
            set zoomSensitivity(value) {
                for (const entry of this.camera?.movement.input.getEntries("keyboard", "zoom") ?? []) {
                    entry.sensitivity = value;
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
                this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
                    this._keys.length = 0;
                });
                this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
                    const evt = info.event;
                    const isArrowKey = this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1;
                    // Allow metaKey (Cmd on Mac) through for arrow keys so Cmd+Arrow
                    // works as the Mac equivalent of Ctrl+Arrow for rotation.
                    // Block metaKey for other keys to avoid capturing browser shortcuts (e.g., Cmd+=/Cmd+-).
                    if (!evt.metaKey || isArrowKey) {
                        if (info.type === KeyboardEventTypes.KEYDOWN) {
                            this._ctrlPressed = evt.ctrlKey;
                            this._altPressed = evt.altKey;
                            this._shiftPressed = evt.shiftKey;
                            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRight.indexOf(evt.keyCode) !== -1 ||
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
                    this._onKeyboardObserver?.remove();
                    this._onKeyboardObserver = null;
                    this._onCanvasBlurObserver?.remove();
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
                    // Update cached modifier state
                    this._keyboardModifiers.ctrl = this._ctrlPressed;
                    this._keyboardModifiers.alt = this._altPressed;
                    this._keyboardModifiers.shift = this._shiftPressed;
                    // Pan keys are accumulated into a single direction vector and applied once below, so that
                    // holding two directions at once (e.g. up + left) pans along a normalized diagonal at the
                    // same speed as a single direction, instead of the ~1.41x boost (sqrt(2)) that results from
                    // applying each pan key independently.
                    const panDirection = this._panDirection.set(0, 0);
                    let panSensitivity = 0;
                    for (let index = 0; index < this._keys.length; index++) {
                        const keyCode = this._keys[index];
                        // Resolve per key — allows different keys to map to different interactions
                        this._keyboardConditions.key = keyCode;
                        const resolved = input.resolveInteraction("keyboard", this._keyboardConditions);
                        if (resolved) {
                            const sens = resolved.sensitivity ?? 1;
                            if (resolved.interaction === "zoom") {
                                if (this.keysZoomIn.indexOf(keyCode) !== -1 || this.keysUp.indexOf(keyCode) !== -1) {
                                    input.handlers.zoom(sens, false);
                                }
                                else if (this.keysZoomOut.indexOf(keyCode) !== -1 || this.keysDown.indexOf(keyCode) !== -1) {
                                    input.handlers.zoom(-sens, false);
                                }
                            }
                            else if (resolved.interaction === "rotate") {
                                if (this.keysLeft.indexOf(keyCode) !== -1) {
                                    input.handlers.rotate(-sens, 0);
                                }
                                else if (this.keysRight.indexOf(keyCode) !== -1) {
                                    input.handlers.rotate(sens, 0);
                                }
                                else if (this.keysUp.indexOf(keyCode) !== -1) {
                                    input.handlers.rotate(0, -sens);
                                }
                                else if (this.keysDown.indexOf(keyCode) !== -1) {
                                    input.handlers.rotate(0, sens);
                                }
                            }
                            else if (resolved.interaction === "pan") {
                                // Accumulate a unit direction per pan key; the combined vector is normalized after the loop.
                                // Aggregate sensitivity with max so the pan speed is independent of key insertion order
                                // when keys resolve to different per-key sensitivities.
                                panSensitivity = Math.max(panSensitivity, sens);
                                if (this.keysLeft.indexOf(keyCode) !== -1) {
                                    panDirection.x += 1;
                                }
                                else if (this.keysRight.indexOf(keyCode) !== -1) {
                                    panDirection.x -= 1;
                                }
                                else if (this.keysUp.indexOf(keyCode) !== -1) {
                                    panDirection.y += 1;
                                }
                                else if (this.keysDown.indexOf(keyCode) !== -1) {
                                    panDirection.y -= 1;
                                }
                            }
                        }
                    }
                    // Apply a single, normalized pan once all pan keys for this frame have been accumulated.
                    if (panDirection.x !== 0 || panDirection.y !== 0) {
                        // Normalize so a diagonal isn't faster than an axis-aligned pan (normalize() is a no-op on a zero-length vector).
                        panDirection.normalize().scaleInPlace(panSensitivity);
                        // Call into movement class handleDrag so that behavior matches that of pointer input, simulating drag from center of screen.
                        // getRenderWidth/Height return render buffer pixels (scaled by hardwareScalingLevel relative to CSS pixels),
                        // but the picking logic (scene.pick via CreatePickingRayToRef) expects CSS pixels (it divides by hardwareScalingLevel internally).
                        const hardwareScaling = this._engine.getHardwareScalingLevel();
                        const centerX = (this._engine.getRenderWidth() / 2) * hardwareScaling;
                        const centerY = (this._engine.getRenderHeight() / 2) * hardwareScaling;
                        input.handlers.pan.start(centerX, centerY);
                        input.handlers.pan.update(centerX + panDirection.x, centerY + panDirection.y);
                        input.handlers.pan.stop();
                    }
                }
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "GeospatialCameraKeyboardInput";
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
            _keysZoomIn_decorators = [serialize()];
            _keysZoomOut_decorators = [serialize()];
            _get_rotationSensitivity_decorators = [serialize()];
            _get_panSensitivity_decorators = [serialize()];
            _get_zoomSensitivity_decorators = [serialize()];
            __esDecorate(_a, null, _get_rotationSensitivity_decorators, { kind: "getter", name: "rotationSensitivity", static: false, private: false, access: { has: obj => "rotationSensitivity" in obj, get: obj => obj.rotationSensitivity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_panSensitivity_decorators, { kind: "getter", name: "panSensitivity", static: false, private: false, access: { has: obj => "panSensitivity" in obj, get: obj => obj.panSensitivity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_zoomSensitivity_decorators, { kind: "getter", name: "zoomSensitivity", static: false, private: false, access: { has: obj => "zoomSensitivity" in obj, get: obj => obj.zoomSensitivity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _keysUp_decorators, { kind: "field", name: "keysUp", static: false, private: false, access: { has: obj => "keysUp" in obj, get: obj => obj.keysUp, set: (obj, value) => { obj.keysUp = value; } }, metadata: _metadata }, _keysUp_initializers, _keysUp_extraInitializers);
            __esDecorate(null, null, _keysDown_decorators, { kind: "field", name: "keysDown", static: false, private: false, access: { has: obj => "keysDown" in obj, get: obj => obj.keysDown, set: (obj, value) => { obj.keysDown = value; } }, metadata: _metadata }, _keysDown_initializers, _keysDown_extraInitializers);
            __esDecorate(null, null, _keysLeft_decorators, { kind: "field", name: "keysLeft", static: false, private: false, access: { has: obj => "keysLeft" in obj, get: obj => obj.keysLeft, set: (obj, value) => { obj.keysLeft = value; } }, metadata: _metadata }, _keysLeft_initializers, _keysLeft_extraInitializers);
            __esDecorate(null, null, _keysRight_decorators, { kind: "field", name: "keysRight", static: false, private: false, access: { has: obj => "keysRight" in obj, get: obj => obj.keysRight, set: (obj, value) => { obj.keysRight = value; } }, metadata: _metadata }, _keysRight_initializers, _keysRight_extraInitializers);
            __esDecorate(null, null, _keysZoomIn_decorators, { kind: "field", name: "keysZoomIn", static: false, private: false, access: { has: obj => "keysZoomIn" in obj, get: obj => obj.keysZoomIn, set: (obj, value) => { obj.keysZoomIn = value; } }, metadata: _metadata }, _keysZoomIn_initializers, _keysZoomIn_extraInitializers);
            __esDecorate(null, null, _keysZoomOut_decorators, { kind: "field", name: "keysZoomOut", static: false, private: false, access: { has: obj => "keysZoomOut" in obj, get: obj => obj.keysZoomOut, set: (obj, value) => { obj.keysZoomOut = value; } }, metadata: _metadata }, _keysZoomOut_initializers, _keysZoomOut_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GeospatialCameraKeyboardInput };
CameraInputTypes["GeospatialCameraKeyboardInput"] = GeospatialCameraKeyboardInput;
//# sourceMappingURL=geospatialCameraKeyboardInput.js.map
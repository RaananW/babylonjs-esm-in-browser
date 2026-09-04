import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { KeyboardEventTypes } from "../../Events/keyboardEvents.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Listen to keyboard events to control the camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FlyCameraKeyboardInput = (() => {
    var _a;
    let _keysForward_decorators;
    let _keysForward_initializers = [];
    let _keysForward_extraInitializers = [];
    let _keysBackward_decorators;
    let _keysBackward_initializers = [];
    let _keysBackward_extraInitializers = [];
    let _keysUp_decorators;
    let _keysUp_initializers = [];
    let _keysUp_extraInitializers = [];
    let _keysDown_decorators;
    let _keysDown_initializers = [];
    let _keysDown_extraInitializers = [];
    let _keysRight_decorators;
    let _keysRight_initializers = [];
    let _keysRight_extraInitializers = [];
    let _keysLeft_decorators;
    let _keysLeft_initializers = [];
    let _keysLeft_extraInitializers = [];
    return _a = class FlyCameraKeyboardInput {
            constructor() {
                /**
                 * The list of keyboard keys used to control the forward move of the camera.
                 */
                this.keysForward = __runInitializers(this, _keysForward_initializers, [87]);
                /**
                 * The list of keyboard keys used to control the backward move of the camera.
                 */
                this.keysBackward = (__runInitializers(this, _keysForward_extraInitializers), __runInitializers(this, _keysBackward_initializers, [83]));
                /**
                 * The list of keyboard keys used to control the forward move of the camera.
                 */
                this.keysUp = (__runInitializers(this, _keysBackward_extraInitializers), __runInitializers(this, _keysUp_initializers, [69]));
                /**
                 * The list of keyboard keys used to control the backward move of the camera.
                 */
                this.keysDown = (__runInitializers(this, _keysUp_extraInitializers), __runInitializers(this, _keysDown_initializers, [81]));
                /**
                 * The list of keyboard keys used to control the right strafe move of the camera.
                 */
                this.keysRight = (__runInitializers(this, _keysDown_extraInitializers), __runInitializers(this, _keysRight_initializers, [68]));
                /**
                 * The list of keyboard keys used to control the left strafe move of the camera.
                 */
                this.keysLeft = (__runInitializers(this, _keysRight_extraInitializers), __runInitializers(this, _keysLeft_initializers, [65]));
                this._keys = (__runInitializers(this, _keysLeft_extraInitializers), new Array());
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
                    if (info.type === KeyboardEventTypes.KEYDOWN) {
                        if (this.keysForward.indexOf(evt.keyCode) !== -1 ||
                            this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                            this.keysUp.indexOf(evt.keyCode) !== -1 ||
                            this.keysDown.indexOf(evt.keyCode) !== -1 ||
                            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                            this.keysRight.indexOf(evt.keyCode) !== -1) {
                            const index = this._keys.indexOf(evt.keyCode);
                            if (index === -1) {
                                this._keys.push(evt.keyCode);
                            }
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                    else {
                        if (this.keysForward.indexOf(evt.keyCode) !== -1 ||
                            this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                            this.keysUp.indexOf(evt.keyCode) !== -1 ||
                            this.keysDown.indexOf(evt.keyCode) !== -1 ||
                            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                            this.keysRight.indexOf(evt.keyCode) !== -1) {
                            const index = this._keys.indexOf(evt.keyCode);
                            if (index >= 0) {
                                this._keys.splice(index, 1);
                            }
                            if (!noPreventDefault) {
                                evt.preventDefault();
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
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FlyCameraKeyboardInput";
            }
            /**
             * @internal
             */
            _onLostFocus() {
                this._keys.length = 0;
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "keyboard";
            }
            /**
             * Update the current camera state depending on the inputs that have been used this frame.
             * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
             */
            checkInputs() {
                if (this._onKeyboardObserver) {
                    const camera = this.camera;
                    // All fly-keyboard keys move the camera, so they are gated on the keyboard→translate
                    // mapping. Removing that entry disables keyboard movement; an entry `sensitivity`
                    // acts as a gain (default 1) over the legacy local-camera speed.
                    const translateEntry = camera.movement.input.getEntry("keyboard", "translate");
                    if (!translateEntry) {
                        return;
                    }
                    const translateGain = translateEntry.sensitivity ?? 1;
                    // Movement keys are accumulated into a single local direction and applied once below, so that
                    // holding two directions at once (e.g. forward + left) moves along a normalized diagonal at the
                    // same speed as a single direction, instead of the ~1.41x boost (sqrt(2)) that results from
                    // applying each movement key independently.
                    const localDirection = camera._localDirection.copyFromFloats(0, 0, 0);
                    // Keyboard
                    for (let index = 0; index < this._keys.length; index++) {
                        const keyCode = this._keys[index];
                        if (this.keysForward.indexOf(keyCode) !== -1) {
                            localDirection.z += 1;
                        }
                        else if (this.keysBackward.indexOf(keyCode) !== -1) {
                            localDirection.z -= 1;
                        }
                        else if (this.keysUp.indexOf(keyCode) !== -1) {
                            localDirection.y += 1;
                        }
                        else if (this.keysDown.indexOf(keyCode) !== -1) {
                            localDirection.y -= 1;
                        }
                        else if (this.keysRight.indexOf(keyCode) !== -1) {
                            localDirection.x += 1;
                        }
                        else if (this.keysLeft.indexOf(keyCode) !== -1) {
                            localDirection.x -= 1;
                        }
                    }
                    // Apply a single, normalized movement once all keys for this frame have been accumulated.
                    if (localDirection.x !== 0 || localDirection.y !== 0 || localDirection.z !== 0) {
                        const speed = camera._computeLocalCameraSpeed() * translateGain;
                        // Normalize so a diagonal isn't faster than an axis-aligned move, then scale to the per-frame speed.
                        localDirection.normalize().scaleInPlace(speed);
                        if (camera.getScene().useRightHandedSystem) {
                            localDirection.z *= -1;
                        }
                        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                        Vector3.TransformNormalToRef(localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
                        camera.cameraDirection.addInPlace(camera._transformedDirection);
                    }
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _keysForward_decorators = [serialize()];
            _keysBackward_decorators = [serialize()];
            _keysUp_decorators = [serialize()];
            _keysDown_decorators = [serialize()];
            _keysRight_decorators = [serialize()];
            _keysLeft_decorators = [serialize()];
            __esDecorate(null, null, _keysForward_decorators, { kind: "field", name: "keysForward", static: false, private: false, access: { has: obj => "keysForward" in obj, get: obj => obj.keysForward, set: (obj, value) => { obj.keysForward = value; } }, metadata: _metadata }, _keysForward_initializers, _keysForward_extraInitializers);
            __esDecorate(null, null, _keysBackward_decorators, { kind: "field", name: "keysBackward", static: false, private: false, access: { has: obj => "keysBackward" in obj, get: obj => obj.keysBackward, set: (obj, value) => { obj.keysBackward = value; } }, metadata: _metadata }, _keysBackward_initializers, _keysBackward_extraInitializers);
            __esDecorate(null, null, _keysUp_decorators, { kind: "field", name: "keysUp", static: false, private: false, access: { has: obj => "keysUp" in obj, get: obj => obj.keysUp, set: (obj, value) => { obj.keysUp = value; } }, metadata: _metadata }, _keysUp_initializers, _keysUp_extraInitializers);
            __esDecorate(null, null, _keysDown_decorators, { kind: "field", name: "keysDown", static: false, private: false, access: { has: obj => "keysDown" in obj, get: obj => obj.keysDown, set: (obj, value) => { obj.keysDown = value; } }, metadata: _metadata }, _keysDown_initializers, _keysDown_extraInitializers);
            __esDecorate(null, null, _keysRight_decorators, { kind: "field", name: "keysRight", static: false, private: false, access: { has: obj => "keysRight" in obj, get: obj => obj.keysRight, set: (obj, value) => { obj.keysRight = value; } }, metadata: _metadata }, _keysRight_initializers, _keysRight_extraInitializers);
            __esDecorate(null, null, _keysLeft_decorators, { kind: "field", name: "keysLeft", static: false, private: false, access: { has: obj => "keysLeft" in obj, get: obj => obj.keysLeft, set: (obj, value) => { obj.keysLeft = value; } }, metadata: _metadata }, _keysLeft_initializers, _keysLeft_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FlyCameraKeyboardInput };
CameraInputTypes["FlyCameraKeyboardInput"] = FlyCameraKeyboardInput;
//# sourceMappingURL=flyCameraKeyboardInput.js.map
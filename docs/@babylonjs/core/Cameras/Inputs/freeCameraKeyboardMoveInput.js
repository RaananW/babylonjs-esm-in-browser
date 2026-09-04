import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { KeyboardEventTypes } from "../../Events/keyboardEvents.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { Tools } from "../../Misc/tools.pure.js";
/**
 * Manage the keyboard inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FreeCameraKeyboardMoveInput = (() => {
    var _a;
    let _keysUp_decorators;
    let _keysUp_initializers = [];
    let _keysUp_extraInitializers = [];
    let _keysUpward_decorators;
    let _keysUpward_initializers = [];
    let _keysUpward_extraInitializers = [];
    let _keysDown_decorators;
    let _keysDown_initializers = [];
    let _keysDown_extraInitializers = [];
    let _keysDownward_decorators;
    let _keysDownward_initializers = [];
    let _keysDownward_extraInitializers = [];
    let _keysLeft_decorators;
    let _keysLeft_initializers = [];
    let _keysLeft_extraInitializers = [];
    let _keysRight_decorators;
    let _keysRight_initializers = [];
    let _keysRight_extraInitializers = [];
    let _rotationSpeed_decorators;
    let _rotationSpeed_initializers = [];
    let _rotationSpeed_extraInitializers = [];
    let _keysRotateLeft_decorators;
    let _keysRotateLeft_initializers = [];
    let _keysRotateLeft_extraInitializers = [];
    let _keysRotateRight_decorators;
    let _keysRotateRight_initializers = [];
    let _keysRotateRight_extraInitializers = [];
    let _keysRotateUp_decorators;
    let _keysRotateUp_initializers = [];
    let _keysRotateUp_extraInitializers = [];
    let _keysRotateDown_decorators;
    let _keysRotateDown_initializers = [];
    let _keysRotateDown_extraInitializers = [];
    return _a = class FreeCameraKeyboardMoveInput {
            constructor() {
                /**
                 * Gets or Set the list of keyboard keys used to control the forward move of the camera.
                 */
                this.keysUp = __runInitializers(this, _keysUp_initializers, [38]);
                /**
                 * Gets or Set the list of keyboard keys used to control the upward move of the camera.
                 */
                this.keysUpward = (__runInitializers(this, _keysUp_extraInitializers), __runInitializers(this, _keysUpward_initializers, [33]));
                /**
                 * Gets or Set the list of keyboard keys used to control the backward move of the camera.
                 */
                this.keysDown = (__runInitializers(this, _keysUpward_extraInitializers), __runInitializers(this, _keysDown_initializers, [40]));
                /**
                 * Gets or Set the list of keyboard keys used to control the downward move of the camera.
                 */
                this.keysDownward = (__runInitializers(this, _keysDown_extraInitializers), __runInitializers(this, _keysDownward_initializers, [34]));
                /**
                 * Gets or Set the list of keyboard keys used to control the left strafe move of the camera.
                 */
                this.keysLeft = (__runInitializers(this, _keysDownward_extraInitializers), __runInitializers(this, _keysLeft_initializers, [37]));
                /**
                 * Gets or Set the list of keyboard keys used to control the right strafe move of the camera.
                 */
                this.keysRight = (__runInitializers(this, _keysLeft_extraInitializers), __runInitializers(this, _keysRight_initializers, [39]));
                /**
                 * Defines the pointer angular sensibility  along the X and Y axis or how fast is the camera rotating.
                 */
                this.rotationSpeed = (__runInitializers(this, _keysRight_extraInitializers), __runInitializers(this, _rotationSpeed_initializers, 0.5));
                /**
                 * Gets or Set the list of keyboard keys used to control the left rotation move of the camera.
                 */
                this.keysRotateLeft = (__runInitializers(this, _rotationSpeed_extraInitializers), __runInitializers(this, _keysRotateLeft_initializers, []));
                /**
                 * Gets or Set the list of keyboard keys used to control the right rotation move of the camera.
                 */
                this.keysRotateRight = (__runInitializers(this, _keysRotateLeft_extraInitializers), __runInitializers(this, _keysRotateRight_initializers, []));
                /**
                 * Gets or Set the list of keyboard keys used to control the up rotation move of the camera.
                 */
                this.keysRotateUp = (__runInitializers(this, _keysRotateRight_extraInitializers), __runInitializers(this, _keysRotateUp_initializers, []));
                /**
                 * Gets or Set the list of keyboard keys used to control the down rotation move of the camera.
                 */
                this.keysRotateDown = (__runInitializers(this, _keysRotateUp_extraInitializers), __runInitializers(this, _keysRotateDown_initializers, []));
                this._keys = (__runInitializers(this, _keysRotateDown_extraInitializers), new Array());
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
                            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysUpward.indexOf(evt.keyCode) !== -1 ||
                                this.keysDownward.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateDown.indexOf(evt.keyCode) !== -1) {
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
                            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysUpward.indexOf(evt.keyCode) !== -1 ||
                                this.keysDownward.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateLeft.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateRight.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateUp.indexOf(evt.keyCode) !== -1 ||
                                this.keysRotateDown.indexOf(evt.keyCode) !== -1) {
                                const index = this._keys.indexOf(evt.keyCode);
                                if (index >= 0) {
                                    this._keys.splice(index, 1);
                                }
                                if (!noPreventDefault) {
                                    evt.preventDefault();
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
                    // Movement keys are gated on the keyboard→translate mapping and rotation keys on
                    // keyboard→rotate. Removing the corresponding entry disables that family of keys.
                    // An entry's optional `sensitivity` acts as a gain (default 1) over the legacy scaling.
                    const input = camera.movement.input;
                    const translateEntry = input.getEntry("keyboard", "translate");
                    const rotateEntry = input.getEntry("keyboard", "rotate");
                    const rotateGain = rotateEntry?.sensitivity ?? 1;
                    // Movement keys are accumulated into a single local direction and applied once below, so that
                    // holding two directions at once (e.g. forward + left) moves along a normalized diagonal at the
                    // same speed as a single direction, instead of the ~1.41x boost (sqrt(2)) that results from
                    // applying each movement key independently. Rotation keys act on separate angular axes and are
                    // applied directly as before.
                    const localDirection = camera._localDirection.copyFromFloats(0, 0, 0);
                    // Keyboard
                    for (let index = 0; index < this._keys.length; index++) {
                        const keyCode = this._keys[index];
                        if (this.keysLeft.indexOf(keyCode) !== -1) {
                            localDirection.x -= 1;
                        }
                        else if (this.keysUp.indexOf(keyCode) !== -1) {
                            localDirection.z += 1;
                        }
                        else if (this.keysRight.indexOf(keyCode) !== -1) {
                            localDirection.x += 1;
                        }
                        else if (this.keysDown.indexOf(keyCode) !== -1) {
                            localDirection.z -= 1;
                        }
                        else if (this.keysUpward.indexOf(keyCode) !== -1) {
                            localDirection.y += 1;
                        }
                        else if (this.keysDownward.indexOf(keyCode) !== -1) {
                            localDirection.y -= 1;
                        }
                        else if (this.keysRotateLeft.indexOf(keyCode) !== -1) {
                            if (rotateEntry) {
                                camera.cameraRotation.y -= this._getLocalRotation() * rotateGain;
                            }
                        }
                        else if (this.keysRotateRight.indexOf(keyCode) !== -1) {
                            if (rotateEntry) {
                                camera.cameraRotation.y += this._getLocalRotation() * rotateGain;
                            }
                        }
                        else if (this.keysRotateUp.indexOf(keyCode) !== -1) {
                            if (rotateEntry) {
                                camera.cameraRotation.x -= this._getLocalRotation() * rotateGain;
                            }
                        }
                        else if (this.keysRotateDown.indexOf(keyCode) !== -1) {
                            if (rotateEntry) {
                                camera.cameraRotation.x += this._getLocalRotation() * rotateGain;
                            }
                        }
                    }
                    // Apply a single, normalized movement once all keys for this frame have been accumulated.
                    // Translation is suppressed when the keyboard→translate mapping is removed.
                    if (translateEntry && (localDirection.x !== 0 || localDirection.y !== 0 || localDirection.z !== 0)) {
                        const speed = camera._computeLocalCameraSpeed() * (translateEntry.sensitivity ?? 1);
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
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FreeCameraKeyboardMoveInput";
            }
            /** @internal */
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
            _getLocalRotation() {
                const handednessMultiplier = this.camera._calculateHandednessMultiplier();
                const rotation = ((this.rotationSpeed * this._engine.getDeltaTime()) / 1000) * handednessMultiplier;
                return rotation;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _keysUp_decorators = [serialize()];
            _keysUpward_decorators = [serialize()];
            _keysDown_decorators = [serialize()];
            _keysDownward_decorators = [serialize()];
            _keysLeft_decorators = [serialize()];
            _keysRight_decorators = [serialize()];
            _rotationSpeed_decorators = [serialize()];
            _keysRotateLeft_decorators = [serialize()];
            _keysRotateRight_decorators = [serialize()];
            _keysRotateUp_decorators = [serialize()];
            _keysRotateDown_decorators = [serialize()];
            __esDecorate(null, null, _keysUp_decorators, { kind: "field", name: "keysUp", static: false, private: false, access: { has: obj => "keysUp" in obj, get: obj => obj.keysUp, set: (obj, value) => { obj.keysUp = value; } }, metadata: _metadata }, _keysUp_initializers, _keysUp_extraInitializers);
            __esDecorate(null, null, _keysUpward_decorators, { kind: "field", name: "keysUpward", static: false, private: false, access: { has: obj => "keysUpward" in obj, get: obj => obj.keysUpward, set: (obj, value) => { obj.keysUpward = value; } }, metadata: _metadata }, _keysUpward_initializers, _keysUpward_extraInitializers);
            __esDecorate(null, null, _keysDown_decorators, { kind: "field", name: "keysDown", static: false, private: false, access: { has: obj => "keysDown" in obj, get: obj => obj.keysDown, set: (obj, value) => { obj.keysDown = value; } }, metadata: _metadata }, _keysDown_initializers, _keysDown_extraInitializers);
            __esDecorate(null, null, _keysDownward_decorators, { kind: "field", name: "keysDownward", static: false, private: false, access: { has: obj => "keysDownward" in obj, get: obj => obj.keysDownward, set: (obj, value) => { obj.keysDownward = value; } }, metadata: _metadata }, _keysDownward_initializers, _keysDownward_extraInitializers);
            __esDecorate(null, null, _keysLeft_decorators, { kind: "field", name: "keysLeft", static: false, private: false, access: { has: obj => "keysLeft" in obj, get: obj => obj.keysLeft, set: (obj, value) => { obj.keysLeft = value; } }, metadata: _metadata }, _keysLeft_initializers, _keysLeft_extraInitializers);
            __esDecorate(null, null, _keysRight_decorators, { kind: "field", name: "keysRight", static: false, private: false, access: { has: obj => "keysRight" in obj, get: obj => obj.keysRight, set: (obj, value) => { obj.keysRight = value; } }, metadata: _metadata }, _keysRight_initializers, _keysRight_extraInitializers);
            __esDecorate(null, null, _rotationSpeed_decorators, { kind: "field", name: "rotationSpeed", static: false, private: false, access: { has: obj => "rotationSpeed" in obj, get: obj => obj.rotationSpeed, set: (obj, value) => { obj.rotationSpeed = value; } }, metadata: _metadata }, _rotationSpeed_initializers, _rotationSpeed_extraInitializers);
            __esDecorate(null, null, _keysRotateLeft_decorators, { kind: "field", name: "keysRotateLeft", static: false, private: false, access: { has: obj => "keysRotateLeft" in obj, get: obj => obj.keysRotateLeft, set: (obj, value) => { obj.keysRotateLeft = value; } }, metadata: _metadata }, _keysRotateLeft_initializers, _keysRotateLeft_extraInitializers);
            __esDecorate(null, null, _keysRotateRight_decorators, { kind: "field", name: "keysRotateRight", static: false, private: false, access: { has: obj => "keysRotateRight" in obj, get: obj => obj.keysRotateRight, set: (obj, value) => { obj.keysRotateRight = value; } }, metadata: _metadata }, _keysRotateRight_initializers, _keysRotateRight_extraInitializers);
            __esDecorate(null, null, _keysRotateUp_decorators, { kind: "field", name: "keysRotateUp", static: false, private: false, access: { has: obj => "keysRotateUp" in obj, get: obj => obj.keysRotateUp, set: (obj, value) => { obj.keysRotateUp = value; } }, metadata: _metadata }, _keysRotateUp_initializers, _keysRotateUp_extraInitializers);
            __esDecorate(null, null, _keysRotateDown_decorators, { kind: "field", name: "keysRotateDown", static: false, private: false, access: { has: obj => "keysRotateDown" in obj, get: obj => obj.keysRotateDown, set: (obj, value) => { obj.keysRotateDown = value; } }, metadata: _metadata }, _keysRotateDown_initializers, _keysRotateDown_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FreeCameraKeyboardMoveInput };
CameraInputTypes["FreeCameraKeyboardMoveInput"] = FreeCameraKeyboardMoveInput;
//# sourceMappingURL=freeCameraKeyboardMoveInput.js.map
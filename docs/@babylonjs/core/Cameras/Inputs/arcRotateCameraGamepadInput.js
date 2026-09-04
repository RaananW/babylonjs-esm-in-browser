import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { Gamepad } from "../../Gamepads/gamepad.js";
/**
 * Manage the gamepad inputs to control an arc rotate camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let ArcRotateCameraGamepadInput = (() => {
    var _a;
    let _gamepadRotationSensibility_decorators;
    let _gamepadRotationSensibility_initializers = [];
    let _gamepadRotationSensibility_extraInitializers = [];
    let _gamepadMoveSensibility_decorators;
    let _gamepadMoveSensibility_initializers = [];
    let _gamepadMoveSensibility_extraInitializers = [];
    return _a = class ArcRotateCameraGamepadInput {
            constructor() {
                /**
                 * Defines the gamepad rotation sensibility.
                 * This is the threshold from when rotation starts to be accounted for to prevent jittering.
                 */
                this.gamepadRotationSensibility = __runInitializers(this, _gamepadRotationSensibility_initializers, 80);
                /**
                 * Defines the gamepad move sensibility.
                 * This is the threshold from when moving starts to be accounted for for to prevent jittering.
                 */
                this.gamepadMoveSensibility = (__runInitializers(this, _gamepadRotationSensibility_extraInitializers), __runInitializers(this, _gamepadMoveSensibility_initializers, 40));
                this._yAxisScale = (__runInitializers(this, _gamepadMoveSensibility_extraInitializers), 1.0);
            }
            /**
             * Gets or sets a boolean indicating that Yaxis (for right stick) should be inverted
             */
            get invertYAxis() {
                return this._yAxisScale !== 1.0;
            }
            set invertYAxis(value) {
                this._yAxisScale = value ? -1.0 : 1.0;
            }
            /**
             * Attach the input controls to a specific dom element to get the input from.
             */
            attachControl() {
                const manager = this.camera.getScene().gamepadManager;
                this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add((gamepad) => {
                    if (gamepad.type !== Gamepad.POSE_ENABLED) {
                        // prioritize XBOX gamepads.
                        if (!this.gamepad || gamepad.type === Gamepad.XBOX) {
                            this.gamepad = gamepad;
                        }
                    }
                });
                this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add((gamepad) => {
                    if (this.gamepad === gamepad) {
                        this.gamepad = null;
                    }
                });
                this.gamepad = manager.getGamepadByType(Gamepad.XBOX);
                // if no xbox controller was found, but there are gamepad controllers, take the first one
                if (!this.gamepad && manager.gamepads.length) {
                    this.gamepad = manager.gamepads[0];
                }
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                this.camera.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
                this.camera.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
                this.gamepad = null;
            }
            /**
             * Update the current camera state depending on the inputs that have been used this frame.
             * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
             */
            checkInputs() {
                if (this.gamepad) {
                    const camera = this.camera;
                    const rsValues = this.gamepad.rightStick;
                    if (rsValues) {
                        if (rsValues.x != 0) {
                            const normalizedRX = rsValues.x / this.gamepadRotationSensibility;
                            if (normalizedRX != 0 && Math.abs(normalizedRX) > 0.005) {
                                camera.movement.activeInput = true;
                                camera.movement.rotationAccumulatedPixels.x += normalizedRX;
                            }
                        }
                        if (rsValues.y != 0) {
                            const normalizedRY = (rsValues.y / this.gamepadRotationSensibility) * this._yAxisScale;
                            if (normalizedRY != 0 && Math.abs(normalizedRY) > 0.005) {
                                camera.movement.activeInput = true;
                                camera.movement.rotationAccumulatedPixels.y += normalizedRY;
                            }
                        }
                    }
                    const lsValues = this.gamepad.leftStick;
                    if (lsValues && lsValues.y != 0) {
                        const normalizedLY = lsValues.y / this.gamepadMoveSensibility;
                        if (normalizedLY != 0 && Math.abs(normalizedLY) > 0.005) {
                            camera.movement.activeInput = true;
                            camera.movement.zoomAccumulatedPixels -= normalizedLY;
                        }
                    }
                }
            }
            /**
             * Gets the class name of the current intput.
             * @returns the class name
             */
            getClassName() {
                return "ArcRotateCameraGamepadInput";
            }
            /**
             * Get the friendly name associated with the input class.
             * @returns the input friendly name
             */
            getSimpleName() {
                return "gamepad";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _gamepadRotationSensibility_decorators = [serialize()];
            _gamepadMoveSensibility_decorators = [serialize()];
            __esDecorate(null, null, _gamepadRotationSensibility_decorators, { kind: "field", name: "gamepadRotationSensibility", static: false, private: false, access: { has: obj => "gamepadRotationSensibility" in obj, get: obj => obj.gamepadRotationSensibility, set: (obj, value) => { obj.gamepadRotationSensibility = value; } }, metadata: _metadata }, _gamepadRotationSensibility_initializers, _gamepadRotationSensibility_extraInitializers);
            __esDecorate(null, null, _gamepadMoveSensibility_decorators, { kind: "field", name: "gamepadMoveSensibility", static: false, private: false, access: { has: obj => "gamepadMoveSensibility" in obj, get: obj => obj.gamepadMoveSensibility, set: (obj, value) => { obj.gamepadMoveSensibility = value; } }, metadata: _metadata }, _gamepadMoveSensibility_initializers, _gamepadMoveSensibility_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ArcRotateCameraGamepadInput };
CameraInputTypes["ArcRotateCameraGamepadInput"] = ArcRotateCameraGamepadInput;
//# sourceMappingURL=arcRotateCameraGamepadInput.js.map
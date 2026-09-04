import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { BaseCameraMouseWheelInput } from "../../Cameras/Inputs/BaseCameraMouseWheelInput.js";
import { Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
// eslint-disable-next-line @typescript-eslint/naming-convention
var _CameraProperty;
(function (_CameraProperty) {
    _CameraProperty[_CameraProperty["MoveRelative"] = 0] = "MoveRelative";
    _CameraProperty[_CameraProperty["RotateRelative"] = 1] = "RotateRelative";
    _CameraProperty[_CameraProperty["MoveScene"] = 2] = "MoveScene";
})(_CameraProperty || (_CameraProperty = {}));
/**
 * Manage the mouse wheel inputs to control a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
let FreeCameraMouseWheelInput = (() => {
    var _a;
    let _classSuper = BaseCameraMouseWheelInput;
    let _instanceExtraInitializers = [];
    let _set_wheelXMoveRelative_decorators;
    let _set_wheelYMoveRelative_decorators;
    let _set_wheelZMoveRelative_decorators;
    let _set_wheelXRotateRelative_decorators;
    let _set_wheelYRotateRelative_decorators;
    let _set_wheelZRotateRelative_decorators;
    let _set_wheelXMoveScene_decorators;
    let _set_wheelYMoveScene_decorators;
    let _set_wheelZMoveScene_decorators;
    return _a = class FreeCameraMouseWheelInput extends _classSuper {
            constructor() {
                super(...arguments);
                /**
                 * Defines the camera the input is attached to.
                 */
                this.camera = __runInitializers(this, _instanceExtraInitializers);
                this._moveRelative = Vector3.Zero();
                this._rotateRelative = Vector3.Zero();
                this._moveScene = Vector3.Zero();
                /**
                 * These are set to the desired default behaviour.
                 */
                this._wheelXAction = _CameraProperty.MoveRelative;
                this._wheelXActionCoordinate = 0 /* Coordinate.X */;
                this._wheelYAction = _CameraProperty.MoveRelative;
                this._wheelYActionCoordinate = 2 /* Coordinate.Z */;
                this._wheelZAction = null;
                this._wheelZActionCoordinate = null;
            }
            /**
             * Gets the class name of the current input.
             * @returns the class name
             */
            getClassName() {
                return "FreeCameraMouseWheelInput";
            }
            /**
             * Set which movement axis (relative to camera's orientation) the mouse
             * wheel's X axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelXMoveRelative(axis) {
                if (axis === null && this._wheelXAction !== _CameraProperty.MoveRelative) {
                    // Attempting to clear different _wheelXAction.
                    return;
                }
                this._wheelXAction = _CameraProperty.MoveRelative;
                this._wheelXActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to camera's orientation) the
             * mouse wheel's X axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelXMoveRelative() {
                if (this._wheelXAction !== _CameraProperty.MoveRelative) {
                    return null;
                }
                return this._wheelXActionCoordinate;
            }
            /**
             * Set which movement axis (relative to camera's orientation) the mouse
             * wheel's Y axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelYMoveRelative(axis) {
                if (axis === null && this._wheelYAction !== _CameraProperty.MoveRelative) {
                    // Attempting to clear different _wheelYAction.
                    return;
                }
                this._wheelYAction = _CameraProperty.MoveRelative;
                this._wheelYActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to camera's orientation) the
             * mouse wheel's Y axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelYMoveRelative() {
                if (this._wheelYAction !== _CameraProperty.MoveRelative) {
                    return null;
                }
                return this._wheelYActionCoordinate;
            }
            /**
             * Set which movement axis (relative to camera's orientation) the mouse
             * wheel's Z axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelZMoveRelative(axis) {
                if (axis === null && this._wheelZAction !== _CameraProperty.MoveRelative) {
                    // Attempting to clear different _wheelZAction.
                    return;
                }
                this._wheelZAction = _CameraProperty.MoveRelative;
                this._wheelZActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to camera's orientation) the
             * mouse wheel's Z axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelZMoveRelative() {
                if (this._wheelZAction !== _CameraProperty.MoveRelative) {
                    return null;
                }
                return this._wheelZActionCoordinate;
            }
            /**
             * Set which rotation axis (relative to camera's orientation) the mouse
             * wheel's X axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelXRotateRelative(axis) {
                if (axis === null && this._wheelXAction !== _CameraProperty.RotateRelative) {
                    // Attempting to clear different _wheelXAction.
                    return;
                }
                this._wheelXAction = _CameraProperty.RotateRelative;
                this._wheelXActionCoordinate = axis;
            }
            /**
             * Get the configured rotation axis (relative to camera's orientation) the
             * mouse wheel's X axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelXRotateRelative() {
                if (this._wheelXAction !== _CameraProperty.RotateRelative) {
                    return null;
                }
                return this._wheelXActionCoordinate;
            }
            /**
             * Set which rotation axis (relative to camera's orientation) the mouse
             * wheel's Y axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelYRotateRelative(axis) {
                if (axis === null && this._wheelYAction !== _CameraProperty.RotateRelative) {
                    // Attempting to clear different _wheelYAction.
                    return;
                }
                this._wheelYAction = _CameraProperty.RotateRelative;
                this._wheelYActionCoordinate = axis;
            }
            /**
             * Get the configured rotation axis (relative to camera's orientation) the
             * mouse wheel's Y axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelYRotateRelative() {
                if (this._wheelYAction !== _CameraProperty.RotateRelative) {
                    return null;
                }
                return this._wheelYActionCoordinate;
            }
            /**
             * Set which rotation axis (relative to camera's orientation) the mouse
             * wheel's Z axis controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelZRotateRelative(axis) {
                if (axis === null && this._wheelZAction !== _CameraProperty.RotateRelative) {
                    // Attempting to clear different _wheelZAction.
                    return;
                }
                this._wheelZAction = _CameraProperty.RotateRelative;
                this._wheelZActionCoordinate = axis;
            }
            /**
             * Get the configured rotation axis (relative to camera's orientation) the
             * mouse wheel's Z axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelZRotateRelative() {
                if (this._wheelZAction !== _CameraProperty.RotateRelative) {
                    return null;
                }
                return this._wheelZActionCoordinate;
            }
            /**
             * Set which movement axis (relative to the scene) the mouse wheel's X axis
             * controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelXMoveScene(axis) {
                if (axis === null && this._wheelXAction !== _CameraProperty.MoveScene) {
                    // Attempting to clear different _wheelXAction.
                    return;
                }
                this._wheelXAction = _CameraProperty.MoveScene;
                this._wheelXActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to the scene) the mouse wheel's
             * X axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelXMoveScene() {
                if (this._wheelXAction !== _CameraProperty.MoveScene) {
                    return null;
                }
                return this._wheelXActionCoordinate;
            }
            /**
             * Set which movement axis (relative to the scene) the mouse wheel's Y axis
             * controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelYMoveScene(axis) {
                if (axis === null && this._wheelYAction !== _CameraProperty.MoveScene) {
                    // Attempting to clear different _wheelYAction.
                    return;
                }
                this._wheelYAction = _CameraProperty.MoveScene;
                this._wheelYActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to the scene) the mouse wheel's
             * Y axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelYMoveScene() {
                if (this._wheelYAction !== _CameraProperty.MoveScene) {
                    return null;
                }
                return this._wheelYActionCoordinate;
            }
            /**
             * Set which movement axis (relative to the scene) the mouse wheel's Z axis
             * controls.
             * @param axis The axis to be moved. Set null to clear.
             */
            set wheelZMoveScene(axis) {
                if (axis === null && this._wheelZAction !== _CameraProperty.MoveScene) {
                    // Attempting to clear different _wheelZAction.
                    return;
                }
                this._wheelZAction = _CameraProperty.MoveScene;
                this._wheelZActionCoordinate = axis;
            }
            /**
             * Get the configured movement axis (relative to the scene) the mouse wheel's
             * Z axis controls.
             * @returns The configured axis or null if none.
             */
            get wheelZMoveScene() {
                if (this._wheelZAction !== _CameraProperty.MoveScene) {
                    return null;
                }
                return this._wheelZActionCoordinate;
            }
            /**
             * Called for each rendered frame.
             */
            checkInputs() {
                if (this._wheelDeltaX === 0 && this._wheelDeltaY === 0 && this._wheelDeltaZ == 0) {
                    return;
                }
                // Clear the camera properties that we might be updating.
                this._moveRelative.setAll(0);
                this._rotateRelative.setAll(0);
                this._moveScene.setAll(0);
                // Set the camera properties that are to be updated.
                this._updateCamera();
                if (this.camera.getScene().useRightHandedSystem) {
                    // TODO: Does this need done for worldUpdate too?
                    this._moveRelative.z *= -1;
                }
                // Convert updates relative to camera to world position update.
                const cameraTransformMatrix = Matrix.Zero();
                this.camera.getViewMatrix().invertToRef(cameraTransformMatrix);
                const transformedDirection = Vector3.Zero();
                Vector3.TransformNormalToRef(this._moveRelative, cameraTransformMatrix, transformedDirection);
                // Apply updates to camera position.
                this.camera.cameraRotation.x += this._rotateRelative.x / 200;
                this.camera.cameraRotation.y += this._rotateRelative.y / 200;
                this.camera.cameraDirection.addInPlace(transformedDirection);
                this.camera.cameraDirection.addInPlace(this._moveScene);
                // Call the base class implementation to handle observers and do cleanup.
                super.checkInputs();
            }
            /**
             * Update the camera according to any configured properties for the 3
             * mouse-wheel axis.
             */
            _updateCamera() {
                // Do the camera updates for each of the 3 touch-wheel axis.
                this._updateCameraProperty(this._wheelDeltaX, this._wheelXAction, this._wheelXActionCoordinate);
                this._updateCameraProperty(this._wheelDeltaY, this._wheelYAction, this._wheelYActionCoordinate);
                this._updateCameraProperty(this._wheelDeltaZ, this._wheelZAction, this._wheelZActionCoordinate);
            }
            /**
             * Update one property of the camera.
             * @param value
             * @param cameraProperty
             * @param coordinate
             */
            _updateCameraProperty(
            /* Mouse-wheel delta. */
            value, 
            /* Camera property to be changed. */
            cameraProperty, 
            /* Axis of Camera property to be changed. */
            coordinate) {
                if (value === 0) {
                    // Mouse wheel has not moved.
                    return;
                }
                if (cameraProperty === null || coordinate === null) {
                    // Mouse wheel axis not configured.
                    return;
                }
                let action = null;
                switch (cameraProperty) {
                    case _CameraProperty.MoveRelative:
                        action = this._moveRelative;
                        break;
                    case _CameraProperty.RotateRelative:
                        action = this._rotateRelative;
                        break;
                    case _CameraProperty.MoveScene:
                        action = this._moveScene;
                        break;
                }
                switch (coordinate) {
                    case 0 /* Coordinate.X */:
                        action.set(value, 0, 0);
                        break;
                    case 1 /* Coordinate.Y */:
                        action.set(0, value, 0);
                        break;
                    case 2 /* Coordinate.Z */:
                        action.set(0, 0, value);
                        break;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_wheelXMoveRelative_decorators = [serialize()];
            _set_wheelYMoveRelative_decorators = [serialize()];
            _set_wheelZMoveRelative_decorators = [serialize()];
            _set_wheelXRotateRelative_decorators = [serialize()];
            _set_wheelYRotateRelative_decorators = [serialize()];
            _set_wheelZRotateRelative_decorators = [serialize()];
            _set_wheelXMoveScene_decorators = [serialize()];
            _set_wheelYMoveScene_decorators = [serialize()];
            _set_wheelZMoveScene_decorators = [serialize()];
            __esDecorate(_a, null, _set_wheelXMoveRelative_decorators, { kind: "setter", name: "wheelXMoveRelative", static: false, private: false, access: { has: obj => "wheelXMoveRelative" in obj, set: (obj, value) => { obj.wheelXMoveRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelYMoveRelative_decorators, { kind: "setter", name: "wheelYMoveRelative", static: false, private: false, access: { has: obj => "wheelYMoveRelative" in obj, set: (obj, value) => { obj.wheelYMoveRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelZMoveRelative_decorators, { kind: "setter", name: "wheelZMoveRelative", static: false, private: false, access: { has: obj => "wheelZMoveRelative" in obj, set: (obj, value) => { obj.wheelZMoveRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelXRotateRelative_decorators, { kind: "setter", name: "wheelXRotateRelative", static: false, private: false, access: { has: obj => "wheelXRotateRelative" in obj, set: (obj, value) => { obj.wheelXRotateRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelYRotateRelative_decorators, { kind: "setter", name: "wheelYRotateRelative", static: false, private: false, access: { has: obj => "wheelYRotateRelative" in obj, set: (obj, value) => { obj.wheelYRotateRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelZRotateRelative_decorators, { kind: "setter", name: "wheelZRotateRelative", static: false, private: false, access: { has: obj => "wheelZRotateRelative" in obj, set: (obj, value) => { obj.wheelZRotateRelative = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelXMoveScene_decorators, { kind: "setter", name: "wheelXMoveScene", static: false, private: false, access: { has: obj => "wheelXMoveScene" in obj, set: (obj, value) => { obj.wheelXMoveScene = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelYMoveScene_decorators, { kind: "setter", name: "wheelYMoveScene", static: false, private: false, access: { has: obj => "wheelYMoveScene" in obj, set: (obj, value) => { obj.wheelYMoveScene = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_wheelZMoveScene_decorators, { kind: "setter", name: "wheelZMoveScene", static: false, private: false, access: { has: obj => "wheelZMoveScene" in obj, set: (obj, value) => { obj.wheelZMoveScene = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FreeCameraMouseWheelInput };
CameraInputTypes["FreeCameraMouseWheelInput"] = FreeCameraMouseWheelInput;
//# sourceMappingURL=freeCameraMouseWheelInput.js.map
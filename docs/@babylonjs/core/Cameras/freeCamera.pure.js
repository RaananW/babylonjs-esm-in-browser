/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serializeAsVector3, serialize } from "../Misc/decorators.js";
import { Vector3, Vector2 } from "../Maths/math.vector.pure.js";
import { TargetCamera } from "./targetCamera.pure.js";
import { FreeCameraInputsManager } from "./freeCameraInputsManager.pure.js";
import { Tools } from "../Misc/tools.pure.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
 * Please consider using the new UniversalCamera instead as it adds more functionality like the gamepad.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
 */
let FreeCamera = (() => {
    var _a;
    let _classSuper = TargetCamera;
    let _ellipsoid_decorators;
    let _ellipsoid_initializers = [];
    let _ellipsoid_extraInitializers = [];
    let _ellipsoidOffset_decorators;
    let _ellipsoidOffset_initializers = [];
    let _ellipsoidOffset_extraInitializers = [];
    let _checkCollisions_decorators;
    let _checkCollisions_initializers = [];
    let _checkCollisions_extraInitializers = [];
    let _applyGravity_decorators;
    let _applyGravity_initializers = [];
    let _applyGravity_extraInitializers = [];
    return _a = class FreeCamera extends _classSuper {
            /**
             * Gets the input sensibility for a mouse input. (default is 2000.0)
             * Higher values reduce sensitivity.
             */
            get angularSensibility() {
                const mouse = this.inputs.attached["mouse"];
                if (mouse) {
                    return mouse.angularSensibility;
                }
                return 0;
            }
            /**
             * Sets the input sensibility for a mouse input. (default is 2000.0)
             * Higher values reduce sensitivity.
             */
            set angularSensibility(value) {
                const mouse = this.inputs.attached["mouse"];
                if (mouse) {
                    mouse.angularSensibility = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the forward move of the camera.
             */
            get keysUp() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysUp;
                }
                return [];
            }
            set keysUp(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysUp = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the upward move of the camera.
             */
            get keysUpward() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysUpward;
                }
                return [];
            }
            set keysUpward(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysUpward = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the backward move of the camera.
             */
            get keysDown() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysDown;
                }
                return [];
            }
            set keysDown(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysDown = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the downward move of the camera.
             */
            get keysDownward() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysDownward;
                }
                return [];
            }
            set keysDownward(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysDownward = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the left strafe move of the camera.
             */
            get keysLeft() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysLeft;
                }
                return [];
            }
            set keysLeft(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysLeft = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the right strafe move of the camera.
             */
            get keysRight() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRight;
                }
                return [];
            }
            set keysRight(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRight = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the left rotation move of the camera.
             */
            get keysRotateLeft() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRotateLeft;
                }
                return [];
            }
            set keysRotateLeft(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRotateLeft = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the right rotation move of the camera.
             */
            get keysRotateRight() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRotateRight;
                }
                return [];
            }
            set keysRotateRight(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRotateRight = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the up rotation move of the camera.
             */
            get keysRotateUp() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRotateUp;
                }
                return [];
            }
            set keysRotateUp(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRotateUp = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control the down rotation move of the camera.
             */
            get keysRotateDown() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRotateDown;
                }
                return [];
            }
            set keysRotateDown(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRotateDown = value;
                }
            }
            /**
             * Instantiates a Free Camera.
             * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
             * Please consider using the new UniversalCamera instead as it adds more functionality like touch to this camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
             * @param name Define the name of the camera in the scene
             * @param position Define the start position of the camera in the scene
             * @param scene Define the scene the camera belongs to
             * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
             */
            constructor(name, position, scene, setActiveOnSceneIfNoneActive = true) {
                super(name, position, scene, setActiveOnSceneIfNoneActive);
                /**
                 * Define the collision ellipsoid of the camera.
                 * This is helpful to simulate a camera body like the player body around the camera
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#arcrotatecamera
                 */
                this.ellipsoid = __runInitializers(this, _ellipsoid_initializers, new Vector3(0.5, 1, 0.5));
                /**
                 * Define an offset for the position of the ellipsoid around the camera.
                 * This can be helpful to determine the center of the body near the gravity center of the body
                 * instead of its head.
                 */
                this.ellipsoidOffset = (__runInitializers(this, _ellipsoid_extraInitializers), __runInitializers(this, _ellipsoidOffset_initializers, new Vector3(0, 0, 0)));
                /**
                 * Enable or disable collisions of the camera with the rest of the scene objects.
                 */
                this.checkCollisions = (__runInitializers(this, _ellipsoidOffset_extraInitializers), __runInitializers(this, _checkCollisions_initializers, false));
                /**
                 * Enable or disable gravity on the camera.
                 */
                this.applyGravity = (__runInitializers(this, _checkCollisions_extraInitializers), __runInitializers(this, _applyGravity_initializers, false));
                /**
                 * Define the input manager associated to the camera.
                 */
                this.inputs = __runInitializers(this, _applyGravity_extraInitializers);
                this._needMoveForGravity = false;
                this._oldPosition = Vector3.Zero();
                this._diffPosition = Vector3.Zero();
                this._newPosition = Vector3.Zero();
                // Collisions
                this._collisionMask = -1;
                this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
                    this._newPosition.copyFrom(newPosition);
                    this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
                    if (this._diffPosition.length() > AbstractEngine.CollisionsEpsilon) {
                        this.position.addToRef(this._diffPosition, this._deferredPositionUpdate);
                        if (!this._deferOnly) {
                            this.position.copyFrom(this._deferredPositionUpdate);
                        }
                        else {
                            this._deferredUpdated = true;
                        }
                        // call onCollide, if defined. Note that in case of deferred update, the actual position change might happen in the next frame.
                        if (this.onCollide && collidedMesh) {
                            this.onCollide(collidedMesh);
                        }
                    }
                };
                this.inputs = new FreeCameraInputsManager(this);
                this.inputs.addKeyboard().addMouse();
            }
            /**
             * Attached controls to the current camera.
             * @param ignored defines an ignored parameter kept for backward compatibility.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(ignored, noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                this.inputs.attachElement(noPreventDefault);
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                this.inputs.detachElement();
                this.cameraDirection = new Vector3(0, 0, 0);
                this.cameraRotation = new Vector2(0, 0);
            }
            /**
             * Define a collision mask to limit the list of object the camera can collide with
             */
            get collisionMask() {
                return this._collisionMask;
            }
            set collisionMask(mask) {
                this._collisionMask = !isNaN(mask) ? mask : -1;
            }
            /**
             * @internal
             */
            _collideWithWorld(displacement) {
                let globalPosition;
                if (this.parent) {
                    globalPosition = Vector3.TransformCoordinates(this.position, this.parent.getWorldMatrix());
                }
                else {
                    globalPosition = this.position;
                }
                globalPosition.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
                this._oldPosition.addInPlace(this.ellipsoidOffset);
                const coordinator = this.getScene().collisionCoordinator;
                if (!this._collider) {
                    this._collider = coordinator.createCollider();
                }
                this._collider._radius = this.ellipsoid;
                this._collider.collisionMask = this._collisionMask;
                //no need for clone, as long as gravity is not on.
                let actualDisplacement = displacement;
                //add gravity to the direction to prevent the dual-collision checking
                if (this.applyGravity) {
                    //this prevents mending with cameraDirection, a global variable of the free camera class.
                    actualDisplacement = displacement.add(this.getScene().gravity);
                }
                coordinator.getNewPosition(this._oldPosition, actualDisplacement, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
            }
            /** @internal */
            _checkInputs() {
                if (!this._localDirection) {
                    this._localDirection = Vector3.Zero();
                    this._transformedDirection = Vector3.Zero();
                }
                this.inputs.checkInputs();
                super._checkInputs();
            }
            /**
             * Enable movement without a user input. This allows gravity to always be applied.
             */
            set needMoveForGravity(value) {
                this._needMoveForGravity = value;
            }
            /**
             * When true, gravity is applied whether there is user input or not.
             */
            get needMoveForGravity() {
                return this._needMoveForGravity;
            }
            /** @internal */
            _decideIfNeedsToMove() {
                return this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
            }
            /** @internal */
            _updatePosition() {
                if (this.checkCollisions && this.getScene().collisionsEnabled) {
                    this._collideWithWorld(this.cameraDirection);
                }
                else {
                    super._updatePosition();
                }
            }
            /**
             * Destroy the camera and release the current resources hold by it.
             */
            dispose() {
                this.inputs.clear();
                super.dispose();
            }
            /**
             * Gets the current object class name.
             * @returns the class name
             */
            getClassName() {
                return "FreeCamera";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _ellipsoid_decorators = [serializeAsVector3()];
            _ellipsoidOffset_decorators = [serializeAsVector3()];
            _checkCollisions_decorators = [serialize()];
            _applyGravity_decorators = [serialize()];
            __esDecorate(null, null, _ellipsoid_decorators, { kind: "field", name: "ellipsoid", static: false, private: false, access: { has: obj => "ellipsoid" in obj, get: obj => obj.ellipsoid, set: (obj, value) => { obj.ellipsoid = value; } }, metadata: _metadata }, _ellipsoid_initializers, _ellipsoid_extraInitializers);
            __esDecorate(null, null, _ellipsoidOffset_decorators, { kind: "field", name: "ellipsoidOffset", static: false, private: false, access: { has: obj => "ellipsoidOffset" in obj, get: obj => obj.ellipsoidOffset, set: (obj, value) => { obj.ellipsoidOffset = value; } }, metadata: _metadata }, _ellipsoidOffset_initializers, _ellipsoidOffset_extraInitializers);
            __esDecorate(null, null, _checkCollisions_decorators, { kind: "field", name: "checkCollisions", static: false, private: false, access: { has: obj => "checkCollisions" in obj, get: obj => obj.checkCollisions, set: (obj, value) => { obj.checkCollisions = value; } }, metadata: _metadata }, _checkCollisions_initializers, _checkCollisions_extraInitializers);
            __esDecorate(null, null, _applyGravity_decorators, { kind: "field", name: "applyGravity", static: false, private: false, access: { has: obj => "applyGravity" in obj, get: obj => obj.applyGravity, set: (obj, value) => { obj.applyGravity = value; } }, metadata: _metadata }, _applyGravity_initializers, _applyGravity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FreeCamera };
// Register Class Name
let _Registered = false;
/**
 * Register side effects for freeCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFreeCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.FreeCamera", FreeCamera);
}
//# sourceMappingURL=freeCamera.pure.js.map
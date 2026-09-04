/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsMeshReference } from "../Misc/decorators.js";
import { Tools } from "../Misc/tools.pure.js";
import { TargetCamera } from "./targetCamera.pure.js";
import { TmpVectors, Vector3 } from "../Maths/math.vector.pure.js";
import { FollowCameraInputsManager } from "./followCameraInputsManager.js";
import { Node } from "../node.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * A follow camera takes a mesh as a target and follows it as it moves. Both a free camera version followCamera and
 * an arc rotate version arcFollowCamera are available.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
 */
let FollowCamera = (() => {
    var _a;
    let _classSuper = TargetCamera;
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _lowerRadiusLimit_decorators;
    let _lowerRadiusLimit_initializers = [];
    let _lowerRadiusLimit_extraInitializers = [];
    let _upperRadiusLimit_decorators;
    let _upperRadiusLimit_initializers = [];
    let _upperRadiusLimit_extraInitializers = [];
    let _rotationOffset_decorators;
    let _rotationOffset_initializers = [];
    let _rotationOffset_extraInitializers = [];
    let _lowerRotationOffsetLimit_decorators;
    let _lowerRotationOffsetLimit_initializers = [];
    let _lowerRotationOffsetLimit_extraInitializers = [];
    let _upperRotationOffsetLimit_decorators;
    let _upperRotationOffsetLimit_initializers = [];
    let _upperRotationOffsetLimit_extraInitializers = [];
    let _heightOffset_decorators;
    let _heightOffset_initializers = [];
    let _heightOffset_extraInitializers = [];
    let _lowerHeightOffsetLimit_decorators;
    let _lowerHeightOffsetLimit_initializers = [];
    let _lowerHeightOffsetLimit_extraInitializers = [];
    let _upperHeightOffsetLimit_decorators;
    let _upperHeightOffsetLimit_initializers = [];
    let _upperHeightOffsetLimit_extraInitializers = [];
    let _cameraAcceleration_decorators;
    let _cameraAcceleration_initializers = [];
    let _cameraAcceleration_extraInitializers = [];
    let _maxCameraSpeed_decorators;
    let _maxCameraSpeed_initializers = [];
    let _maxCameraSpeed_extraInitializers = [];
    let _lockedTarget_decorators;
    let _lockedTarget_initializers = [];
    let _lockedTarget_extraInitializers = [];
    return _a = class FollowCamera extends _classSuper {
            /**
             * Instantiates the follow camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
             * @param name Define the name of the camera in the scene
             * @param position Define the position of the camera
             * @param scene Define the scene the camera belong to
             * @param lockedTarget Define the target of the camera
             */
            constructor(name, position, scene, lockedTarget = null) {
                super(name, position, scene);
                /**
                 * Distance the follow camera should follow an object at
                 */
                this.radius = __runInitializers(this, _radius_initializers, 12);
                /**
                 * Minimum allowed distance of the camera to the axis of rotation
                 * (The camera can not get closer).
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerRadiusLimit = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _lowerRadiusLimit_initializers, null));
                /**
                 * Maximum allowed distance of the camera to the axis of rotation
                 * (The camera can not get further).
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperRadiusLimit = (__runInitializers(this, _lowerRadiusLimit_extraInitializers), __runInitializers(this, _upperRadiusLimit_initializers, null));
                /**
                 * Define a rotation offset between the camera and the object it follows
                 */
                this.rotationOffset = (__runInitializers(this, _upperRadiusLimit_extraInitializers), __runInitializers(this, _rotationOffset_initializers, 0));
                /**
                 * Minimum allowed angle to camera position relative to target object.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerRotationOffsetLimit = (__runInitializers(this, _rotationOffset_extraInitializers), __runInitializers(this, _lowerRotationOffsetLimit_initializers, null));
                /**
                 * Maximum allowed angle to camera position relative to target object.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperRotationOffsetLimit = (__runInitializers(this, _lowerRotationOffsetLimit_extraInitializers), __runInitializers(this, _upperRotationOffsetLimit_initializers, null));
                /**
                 * Define a height offset between the camera and the object it follows.
                 * It can help following an object from the top (like a car chasing a plane)
                 */
                this.heightOffset = (__runInitializers(this, _upperRotationOffsetLimit_extraInitializers), __runInitializers(this, _heightOffset_initializers, 4));
                /**
                 * Minimum allowed height of camera position relative to target object.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerHeightOffsetLimit = (__runInitializers(this, _heightOffset_extraInitializers), __runInitializers(this, _lowerHeightOffsetLimit_initializers, null));
                /**
                 * Maximum allowed height of camera position relative to target object.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperHeightOffsetLimit = (__runInitializers(this, _lowerHeightOffsetLimit_extraInitializers), __runInitializers(this, _upperHeightOffsetLimit_initializers, null));
                /**
                 * Define how fast the camera can accelerate to follow it s target.
                 */
                this.cameraAcceleration = (__runInitializers(this, _upperHeightOffsetLimit_extraInitializers), __runInitializers(this, _cameraAcceleration_initializers, 0.05));
                /**
                 * Define the speed limit of the camera following an object.
                 */
                this.maxCameraSpeed = (__runInitializers(this, _cameraAcceleration_extraInitializers), __runInitializers(this, _maxCameraSpeed_initializers, 20));
                /**
                 * Define the target of the camera.
                 */
                this.lockedTarget = (__runInitializers(this, _maxCameraSpeed_extraInitializers), __runInitializers(this, _lockedTarget_initializers, null));
                __runInitializers(this, _lockedTarget_extraInitializers);
                this.lockedTarget = lockedTarget;
                this.inputs = new FollowCameraInputsManager(this);
                this.inputs.addKeyboard().addMouseWheel().addPointers();
            }
            _follow(cameraTarget) {
                if (!cameraTarget) {
                    return;
                }
                const rotMatrix = TmpVectors.Matrix[0];
                cameraTarget.absoluteRotationQuaternion.toRotationMatrix(rotMatrix);
                const yRotation = Math.atan2(rotMatrix.m[8], rotMatrix.m[10]);
                const radians = this.rotationOffset * (Math.PI / 180) + yRotation;
                const targetPosition = cameraTarget.getAbsolutePosition();
                const targetX = targetPosition.x + Math.sin(radians) * this.radius;
                const targetZ = targetPosition.z + Math.cos(radians) * this.radius;
                const dx = targetX - this.position.x;
                const dy = targetPosition.y + this.heightOffset - this.position.y;
                const dz = targetZ - this.position.z;
                let vx = dx * this.cameraAcceleration * 2; //this is set to .05
                let vy = dy * this.cameraAcceleration;
                let vz = dz * this.cameraAcceleration * 2;
                if (vx > this.maxCameraSpeed || vx < -this.maxCameraSpeed) {
                    vx = vx < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
                }
                if (vy > this.maxCameraSpeed || vy < -this.maxCameraSpeed) {
                    vy = vy < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
                }
                if (vz > this.maxCameraSpeed || vz < -this.maxCameraSpeed) {
                    vz = vz < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
                }
                this.position.addInPlaceFromFloats(vx, vy, vz);
                this.setTarget(targetPosition);
            }
            /**
             * Attached controls to the current camera.
             * @param ignored defines an ignored parameter kept for backward compatibility.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             */
            attachControl(ignored, noPreventDefault) {
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
                this.inputs.attachElement(noPreventDefault);
                this._reset = () => { };
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                this.inputs.detachElement();
                if (this._reset) {
                    this._reset();
                }
            }
            /** @internal */
            _checkInputs() {
                this.inputs.checkInputs();
                this._checkLimits();
                super._checkInputs();
                if (this.lockedTarget) {
                    this._follow(this.lockedTarget);
                }
            }
            _checkLimits() {
                if (this.lowerRadiusLimit !== null && this.radius < this.lowerRadiusLimit) {
                    this.radius = this.lowerRadiusLimit;
                }
                if (this.upperRadiusLimit !== null && this.radius > this.upperRadiusLimit) {
                    this.radius = this.upperRadiusLimit;
                }
                if (this.lowerHeightOffsetLimit !== null && this.heightOffset < this.lowerHeightOffsetLimit) {
                    this.heightOffset = this.lowerHeightOffsetLimit;
                }
                if (this.upperHeightOffsetLimit !== null && this.heightOffset > this.upperHeightOffsetLimit) {
                    this.heightOffset = this.upperHeightOffsetLimit;
                }
                if (this.lowerRotationOffsetLimit !== null && this.rotationOffset < this.lowerRotationOffsetLimit) {
                    this.rotationOffset = this.lowerRotationOffsetLimit;
                }
                if (this.upperRotationOffsetLimit !== null && this.rotationOffset > this.upperRotationOffsetLimit) {
                    this.rotationOffset = this.upperRotationOffsetLimit;
                }
            }
            /**
             * Gets the camera class name.
             * @returns the class name
             */
            getClassName() {
                return "FollowCamera";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _radius_decorators = [serialize()];
            _lowerRadiusLimit_decorators = [serialize()];
            _upperRadiusLimit_decorators = [serialize()];
            _rotationOffset_decorators = [serialize()];
            _lowerRotationOffsetLimit_decorators = [serialize()];
            _upperRotationOffsetLimit_decorators = [serialize()];
            _heightOffset_decorators = [serialize()];
            _lowerHeightOffsetLimit_decorators = [serialize()];
            _upperHeightOffsetLimit_decorators = [serialize()];
            _cameraAcceleration_decorators = [serialize()];
            _maxCameraSpeed_decorators = [serialize()];
            _lockedTarget_decorators = [serializeAsMeshReference("lockedTargetId")];
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            __esDecorate(null, null, _lowerRadiusLimit_decorators, { kind: "field", name: "lowerRadiusLimit", static: false, private: false, access: { has: obj => "lowerRadiusLimit" in obj, get: obj => obj.lowerRadiusLimit, set: (obj, value) => { obj.lowerRadiusLimit = value; } }, metadata: _metadata }, _lowerRadiusLimit_initializers, _lowerRadiusLimit_extraInitializers);
            __esDecorate(null, null, _upperRadiusLimit_decorators, { kind: "field", name: "upperRadiusLimit", static: false, private: false, access: { has: obj => "upperRadiusLimit" in obj, get: obj => obj.upperRadiusLimit, set: (obj, value) => { obj.upperRadiusLimit = value; } }, metadata: _metadata }, _upperRadiusLimit_initializers, _upperRadiusLimit_extraInitializers);
            __esDecorate(null, null, _rotationOffset_decorators, { kind: "field", name: "rotationOffset", static: false, private: false, access: { has: obj => "rotationOffset" in obj, get: obj => obj.rotationOffset, set: (obj, value) => { obj.rotationOffset = value; } }, metadata: _metadata }, _rotationOffset_initializers, _rotationOffset_extraInitializers);
            __esDecorate(null, null, _lowerRotationOffsetLimit_decorators, { kind: "field", name: "lowerRotationOffsetLimit", static: false, private: false, access: { has: obj => "lowerRotationOffsetLimit" in obj, get: obj => obj.lowerRotationOffsetLimit, set: (obj, value) => { obj.lowerRotationOffsetLimit = value; } }, metadata: _metadata }, _lowerRotationOffsetLimit_initializers, _lowerRotationOffsetLimit_extraInitializers);
            __esDecorate(null, null, _upperRotationOffsetLimit_decorators, { kind: "field", name: "upperRotationOffsetLimit", static: false, private: false, access: { has: obj => "upperRotationOffsetLimit" in obj, get: obj => obj.upperRotationOffsetLimit, set: (obj, value) => { obj.upperRotationOffsetLimit = value; } }, metadata: _metadata }, _upperRotationOffsetLimit_initializers, _upperRotationOffsetLimit_extraInitializers);
            __esDecorate(null, null, _heightOffset_decorators, { kind: "field", name: "heightOffset", static: false, private: false, access: { has: obj => "heightOffset" in obj, get: obj => obj.heightOffset, set: (obj, value) => { obj.heightOffset = value; } }, metadata: _metadata }, _heightOffset_initializers, _heightOffset_extraInitializers);
            __esDecorate(null, null, _lowerHeightOffsetLimit_decorators, { kind: "field", name: "lowerHeightOffsetLimit", static: false, private: false, access: { has: obj => "lowerHeightOffsetLimit" in obj, get: obj => obj.lowerHeightOffsetLimit, set: (obj, value) => { obj.lowerHeightOffsetLimit = value; } }, metadata: _metadata }, _lowerHeightOffsetLimit_initializers, _lowerHeightOffsetLimit_extraInitializers);
            __esDecorate(null, null, _upperHeightOffsetLimit_decorators, { kind: "field", name: "upperHeightOffsetLimit", static: false, private: false, access: { has: obj => "upperHeightOffsetLimit" in obj, get: obj => obj.upperHeightOffsetLimit, set: (obj, value) => { obj.upperHeightOffsetLimit = value; } }, metadata: _metadata }, _upperHeightOffsetLimit_initializers, _upperHeightOffsetLimit_extraInitializers);
            __esDecorate(null, null, _cameraAcceleration_decorators, { kind: "field", name: "cameraAcceleration", static: false, private: false, access: { has: obj => "cameraAcceleration" in obj, get: obj => obj.cameraAcceleration, set: (obj, value) => { obj.cameraAcceleration = value; } }, metadata: _metadata }, _cameraAcceleration_initializers, _cameraAcceleration_extraInitializers);
            __esDecorate(null, null, _maxCameraSpeed_decorators, { kind: "field", name: "maxCameraSpeed", static: false, private: false, access: { has: obj => "maxCameraSpeed" in obj, get: obj => obj.maxCameraSpeed, set: (obj, value) => { obj.maxCameraSpeed = value; } }, metadata: _metadata }, _maxCameraSpeed_initializers, _maxCameraSpeed_extraInitializers);
            __esDecorate(null, null, _lockedTarget_decorators, { kind: "field", name: "lockedTarget", static: false, private: false, access: { has: obj => "lockedTarget" in obj, get: obj => obj.lockedTarget, set: (obj, value) => { obj.lockedTarget = value; } }, metadata: _metadata }, _lockedTarget_initializers, _lockedTarget_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FollowCamera };
/**
 * Arc Rotate version of the follow camera.
 * It still follows a Defined mesh but in an Arc Rotate Camera fashion.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
 */
export class ArcFollowCamera extends TargetCamera {
    /**
     * Instantiates a new ArcFollowCamera
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
     * @param name Define the name of the camera
     * @param alpha Define the rotation angle of the camera around the longitudinal axis
     * @param beta Define the rotation angle of the camera around the elevation axis
     * @param radius Define the radius of the camera from its target point
     * @param target Define the target of the camera
     * @param scene Define the scene the camera belongs to
     */
    constructor(name, 
    /** The longitudinal angle of the camera */
    alpha, 
    /** The latitudinal angle of the camera */
    beta, 
    /** The radius of the camera from its target */
    radius, 
    /** Define the camera target (the mesh it should follow) */
    target, scene) {
        super(name, Vector3.Zero(), scene);
        this.alpha = alpha;
        this.beta = beta;
        this.radius = radius;
        this._cartesianCoordinates = Vector3.Zero();
        this.setMeshTarget(target);
    }
    /**
     * Sets the mesh to follow with this camera.
     * @param target the target to follow
     */
    setMeshTarget(target) {
        this._meshTarget = target;
        this._follow();
    }
    _follow() {
        if (!this._meshTarget) {
            return;
        }
        this._cartesianCoordinates.x = this.radius * Math.cos(this.alpha) * Math.cos(this.beta);
        this._cartesianCoordinates.y = this.radius * Math.sin(this.beta);
        this._cartesianCoordinates.z = this.radius * Math.sin(this.alpha) * Math.cos(this.beta);
        const targetPosition = this._meshTarget.getAbsolutePosition();
        this.position = targetPosition.add(this._cartesianCoordinates);
        this.setTarget(targetPosition);
    }
    /** @internal */
    _checkInputs() {
        super._checkInputs();
        this._follow();
    }
    /**
     * Returns the class name of the object.
     * It is mostly used internally for serialization purposes.
     * @returns the class name
     */
    getClassName() {
        return "ArcFollowCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for followCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFollowCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("FollowCamera", (name, scene) => {
        return () => new FollowCamera(name, Vector3.Zero(), scene);
    });
    Node.AddNodeConstructor("ArcFollowCamera", (name, scene) => {
        return () => new ArcFollowCamera(name, 0, 0, 1.0, null, scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.FollowCamera", FollowCamera);
    RegisterClass("BABYLON.ArcFollowCamera", ArcFollowCamera);
}
//# sourceMappingURL=followCamera.pure.js.map
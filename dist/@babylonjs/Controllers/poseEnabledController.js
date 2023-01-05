import { Observable } from "../../Misc/observable.js";
import { Quaternion, Matrix, Vector3, TmpVectors } from "../../Maths/math.vector.js";
import { Ray } from "../../Culling/ray.js";
import { EngineStore } from "../../Engines/engineStore.js";
import { Gamepad } from "../../Gamepads/gamepad.js";
/**
 * Defines the types of pose enabled controllers that are supported
 */
export var PoseEnabledControllerType;
(function (PoseEnabledControllerType) {
    /**
     * HTC Vive
     */
    PoseEnabledControllerType[PoseEnabledControllerType["VIVE"] = 0] = "VIVE";
    /**
     * Oculus Rift
     */
    PoseEnabledControllerType[PoseEnabledControllerType["OCULUS"] = 1] = "OCULUS";
    /**
     * Windows mixed reality
     */
    PoseEnabledControllerType[PoseEnabledControllerType["WINDOWS"] = 2] = "WINDOWS";
    /**
     * Samsung gear VR
     */
    PoseEnabledControllerType[PoseEnabledControllerType["GEAR_VR"] = 3] = "GEAR_VR";
    /**
     * Google Daydream
     */
    PoseEnabledControllerType[PoseEnabledControllerType["DAYDREAM"] = 4] = "DAYDREAM";
    /**
     * Generic
     */
    PoseEnabledControllerType[PoseEnabledControllerType["GENERIC"] = 5] = "GENERIC";
})(PoseEnabledControllerType || (PoseEnabledControllerType = {}));
/**
 * Defines the PoseEnabledControllerHelper object that is used initialize a gamepad as the controller type it is specified as (eg. windows mixed reality controller)
 */
export class PoseEnabledControllerHelper {
    /**
     * Initializes a gamepad as the controller type it is specified as (eg. windows mixed reality controller)
     * @param vrGamepad the gamepad to initialized
     * @returns a vr controller of the type the gamepad identified as
     */
    static InitiateController(vrGamepad) {
        for (const factory of this._ControllerFactories) {
            if (factory.canCreate(vrGamepad)) {
                return factory.create(vrGamepad);
            }
        }
        if (this._DefaultControllerFactory) {
            return this._DefaultControllerFactory(vrGamepad);
        }
        throw "The type of gamepad you are trying to load needs to be imported first or is not supported.";
    }
}
/** @internal */
PoseEnabledControllerHelper._ControllerFactories = [];
/** @internal */
PoseEnabledControllerHelper._DefaultControllerFactory = null;
/**
 * Defines the PoseEnabledController object that contains state of a vr capable controller
 */
export class PoseEnabledController extends Gamepad {
    /**
     * Creates a new PoseEnabledController from a gamepad
     * @param browserGamepad the gamepad that the PoseEnabledController should be created from
     */
    constructor(browserGamepad) {
        super(browserGamepad.id, browserGamepad.index, browserGamepad);
        /**
         * If the controller is used in a webXR session
         */
        this.isXR = false;
        // Represents device position and rotation in room space. Should only be used to help calculate babylon space values
        this._deviceRoomPosition = Vector3.Zero();
        this._deviceRoomRotationQuaternion = new Quaternion();
        /**
         * The device position in babylon space
         */
        this.devicePosition = Vector3.Zero();
        /**
         * The device rotation in babylon space
         */
        this.deviceRotationQuaternion = new Quaternion();
        /**
         * The scale factor of the device in babylon space
         */
        this.deviceScaleFactor = 1;
        // Used to convert 6dof controllers to 3dof
        this._trackPosition = true;
        this._maxRotationDistFromHeadset = Math.PI / 5;
        this._draggedRoomRotation = 0;
        this._leftHandSystemQuaternion = new Quaternion();
        /**
         * Internal, matrix used to convert room space to babylon space
         * @internal
         */
        this._deviceToWorld = Matrix.Identity();
        /**
         * Node to be used when casting a ray from the controller
         * @internal
         */
        this._pointingPoseNode = null;
        this._workingMatrix = Matrix.Identity();
        /**
         * @internal
         */
        this._meshAttachedObservable = new Observable();
        this.type = Gamepad.POSE_ENABLED;
        this.controllerType = PoseEnabledControllerType.GENERIC;
        this.position = Vector3.Zero();
        this.rotationQuaternion = new Quaternion();
        this._calculatedPosition = Vector3.Zero();
        this._calculatedRotation = new Quaternion();
        Quaternion.RotationYawPitchRollToRef(Math.PI, 0, 0, this._leftHandSystemQuaternion);
    }
    /**
     * @internal
     */
    _disableTrackPosition(fixedPosition) {
        if (this._trackPosition) {
            this._calculatedPosition.copyFrom(fixedPosition);
            this._trackPosition = false;
        }
    }
    /**
     * Updates the state of the pose enabled controller and mesh based on the current position and rotation of the controller
     */
    update() {
        super.update();
        this._updatePoseAndMesh();
    }
    /**
     * Updates only the pose device and mesh without doing any button event checking
     */
    _updatePoseAndMesh() {
        if (this.isXR) {
            return;
        }
        const pose = this.browserGamepad.pose;
        this.updateFromDevice(pose);
        if (!this._trackPosition &&
            EngineStore.LastCreatedScene &&
            EngineStore.LastCreatedScene.activeCamera &&
            EngineStore.LastCreatedScene.activeCamera.devicePosition) {
            const camera = EngineStore.LastCreatedScene.activeCamera;
            camera._computeDevicePosition();
            this._deviceToWorld.setTranslation(camera.devicePosition);
            if (camera.deviceRotationQuaternion) {
                camera._deviceRoomRotationQuaternion.toEulerAnglesToRef(TmpVectors.Vector3[0]);
                // Find the radian distance away that the headset is from the controllers rotation
                const distanceAway = Math.atan2(Math.sin(TmpVectors.Vector3[0].y - this._draggedRoomRotation), Math.cos(TmpVectors.Vector3[0].y - this._draggedRoomRotation));
                if (Math.abs(distanceAway) > this._maxRotationDistFromHeadset) {
                    // Only rotate enouph to be within the _maxRotationDistFromHeadset
                    const rotationAmount = distanceAway - (distanceAway < 0 ? -this._maxRotationDistFromHeadset : this._maxRotationDistFromHeadset);
                    this._draggedRoomRotation += rotationAmount;
                    // Rotate controller around headset
                    const sin = Math.sin(-rotationAmount);
                    const cos = Math.cos(-rotationAmount);
                    this._calculatedPosition.x = this._calculatedPosition.x * cos - this._calculatedPosition.z * sin;
                    this._calculatedPosition.z = this._calculatedPosition.x * sin + this._calculatedPosition.z * cos;
                }
            }
        }
        Vector3.TransformCoordinatesToRef(this._calculatedPosition, this._deviceToWorld, this.devicePosition);
        this._deviceToWorld.getRotationMatrixToRef(this._workingMatrix);
        Quaternion.FromRotationMatrixToRef(this._workingMatrix, this.deviceRotationQuaternion);
        this.deviceRotationQuaternion.multiplyInPlace(this._calculatedRotation);
        if (this._mesh) {
            this._mesh.position.copyFrom(this.devicePosition);
            if (this._mesh.rotationQuaternion) {
                this._mesh.rotationQuaternion.copyFrom(this.deviceRotationQuaternion);
            }
        }
    }
    /**
     * Updates the state of the pose enbaled controller based on the raw pose data from the device
     * @param poseData raw pose fromthe device
     */
    updateFromDevice(poseData) {
        if (this.isXR) {
            return;
        }
        if (poseData) {
            this.rawPose = poseData;
            if (poseData.position) {
                this._deviceRoomPosition.copyFromFloats(poseData.position[0], poseData.position[1], -poseData.position[2]);
                if (this._mesh && this._mesh.getScene().useRightHandedSystem) {
                    this._deviceRoomPosition.z *= -1;
                }
                if (this._trackPosition) {
                    this._deviceRoomPosition.scaleToRef(this.deviceScaleFactor, this._calculatedPosition);
                }
                this._calculatedPosition.addInPlace(this.position);
            }
            const pose = this.rawPose;
            if (poseData.orientation && pose.orientation && pose.orientation.length === 4) {
                this._deviceRoomRotationQuaternion.copyFromFloats(pose.orientation[0], pose.orientation[1], -pose.orientation[2], -pose.orientation[3]);
                if (this._mesh) {
                    if (this._mesh.getScene().useRightHandedSystem) {
                        this._deviceRoomRotationQuaternion.z *= -1;
                        this._deviceRoomRotationQuaternion.w *= -1;
                    }
                    else {
                        this._deviceRoomRotationQuaternion.multiplyToRef(this._leftHandSystemQuaternion, this._deviceRoomRotationQuaternion);
                    }
                }
                // if the camera is set, rotate to the camera's rotation
                this._deviceRoomRotationQuaternion.multiplyToRef(this.rotationQuaternion, this._calculatedRotation);
            }
        }
    }
    /**
     * Attaches a mesh to the controller
     * @param mesh the mesh to be attached
     */
    attachToMesh(mesh) {
        if (this._mesh) {
            this._mesh.parent = null;
        }
        this._mesh = mesh;
        if (this._poseControlledCamera) {
            this._mesh.parent = this._poseControlledCamera;
        }
        if (!this._mesh.rotationQuaternion) {
            this._mesh.rotationQuaternion = new Quaternion();
        }
        // Sync controller mesh and pointing pose node's state with controller, this is done to avoid a frame where position is 0,0,0 when attaching mesh
        if (!this.isXR) {
            this._updatePoseAndMesh();
            if (this._pointingPoseNode) {
                const parents = [];
                let obj = this._pointingPoseNode;
                while (obj.parent) {
                    parents.push(obj.parent);
                    obj = obj.parent;
                }
                parents.reverse().forEach((p) => {
                    p.computeWorldMatrix(true);
                });
            }
        }
        this._meshAttachedObservable.notifyObservers(mesh);
    }
    /**
     * Attaches the controllers mesh to a camera
     * @param camera the camera the mesh should be attached to
     */
    attachToPoseControlledCamera(camera) {
        this._poseControlledCamera = camera;
        if (this._mesh) {
            this._mesh.parent = this._poseControlledCamera;
        }
    }
    /**
     * Disposes of the controller
     */
    dispose() {
        if (this._mesh) {
            this._mesh.dispose();
        }
        this._mesh = null;
        super.dispose();
    }
    /**
     * The mesh that is attached to the controller
     */
    get mesh() {
        return this._mesh;
    }
    /**
     * Gets the ray of the controller in the direction the controller is pointing
     * @param length the length the resulting ray should be
     * @returns a ray in the direction the controller is pointing
     */
    getForwardRay(length = 100) {
        if (!this.mesh) {
            return new Ray(Vector3.Zero(), new Vector3(0, 0, 1), length);
        }
        const m = this._pointingPoseNode ? this._pointingPoseNode.getWorldMatrix() : this.mesh.getWorldMatrix();
        const origin = m.getTranslation();
        const forward = new Vector3(0, 0, -1);
        const forwardWorld = Vector3.TransformNormal(forward, m);
        const direction = Vector3.Normalize(forwardWorld);
        return new Ray(origin, direction, length);
    }
}
/**
 * Name of the child mesh that can be used to cast a ray from the controller
 */
PoseEnabledController.POINTING_POSE = "POINTING_POSE";
//# sourceMappingURL=poseEnabledController.js.map
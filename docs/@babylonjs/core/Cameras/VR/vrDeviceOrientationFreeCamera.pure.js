/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { DeviceOrientationCamera } from "../../Cameras/deviceOrientationCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetVrRigMode } from "../RigModes/vrRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate VR rendering (based on FreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export class VRDeviceOrientationFreeCamera extends DeviceOrientationCamera {
    /**
     * Creates a new VRDeviceOrientationFreeCamera
     * @param name defines camera name
     * @param position defines the start position of the camera
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name, position, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
        super(name, position, scene);
        this._setRigMode = (rigParams) => _SetVrRigMode(this, rigParams);
        vrCameraMetrics.compensateDistortion = compensateDistortion;
        this.setCameraRigMode(Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
    }
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationFreeCamera
     */
    getClassName() {
        return "VRDeviceOrientationFreeCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for vrDeviceOrientationFreeCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVrDeviceOrientationFreeCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("VRDeviceOrientationFreeCamera", (name, scene) => {
        return () => new VRDeviceOrientationFreeCamera(name, Vector3.Zero(), scene);
    });
}
//# sourceMappingURL=vrDeviceOrientationFreeCamera.pure.js.map
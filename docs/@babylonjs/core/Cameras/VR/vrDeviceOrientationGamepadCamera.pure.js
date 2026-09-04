/** This file must only contain pure code and pure imports */
import { VRDeviceOrientationFreeCamera } from "./vrDeviceOrientationFreeCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetVrRigMode } from "../RigModes/vrRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate VR rendering (based on VRDeviceOrientationFreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export class VRDeviceOrientationGamepadCamera extends VRDeviceOrientationFreeCamera {
    /**
     * Creates a new VRDeviceOrientationGamepadCamera
     * @param name defines camera name
     * @param position defines the start position of the camera
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name, position, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
        super(name, position, scene, compensateDistortion, vrCameraMetrics);
        this._setRigMode = (rigParams) => _SetVrRigMode(this, rigParams);
        this.inputs.addGamepad();
    }
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationGamepadCamera
     */
    getClassName() {
        return "VRDeviceOrientationGamepadCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for vrDeviceOrientationGamepadCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVrDeviceOrientationGamepadCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("VRDeviceOrientationGamepadCamera", (name, scene) => {
        return () => new VRDeviceOrientationGamepadCamera(name, Vector3.Zero(), scene);
    });
}
//# sourceMappingURL=vrDeviceOrientationGamepadCamera.pure.js.map
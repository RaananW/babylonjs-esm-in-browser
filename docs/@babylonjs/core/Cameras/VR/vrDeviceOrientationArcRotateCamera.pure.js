/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { ArcRotateCamera } from "../../Cameras/arcRotateCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetVrRigMode } from "../RigModes/vrRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate VR rendering (based on ArcRotateCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export class VRDeviceOrientationArcRotateCamera extends ArcRotateCamera {
    /**
     * Creates a new VRDeviceOrientationArcRotateCamera
     * @param name defines camera name
     * @param alpha defines the camera rotation along the longitudinal axis
     * @param beta defines the camera rotation along the latitudinal axis
     * @param radius defines the camera distance from its target
     * @param target defines the camera target
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name, alpha, beta, radius, target, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
        super(name, alpha, beta, radius, target, scene);
        this._setRigMode = (rigParams) => _SetVrRigMode(this, rigParams);
        vrCameraMetrics.compensateDistortion = compensateDistortion;
        this.setCameraRigMode(Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
        this.inputs.addVRDeviceOrientation();
    }
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationArcRotateCamera
     */
    getClassName() {
        return "VRDeviceOrientationArcRotateCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for vrDeviceOrientationArcRotateCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVrDeviceOrientationArcRotateCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("VRDeviceOrientationArcRotateCamera", (name, scene) => {
        return () => new VRDeviceOrientationArcRotateCamera(name, 0, 0, 1.0, Vector3.Zero(), scene);
    });
}
//# sourceMappingURL=vrDeviceOrientationArcRotateCamera.pure.js.map
/** This file must only contain pure code and pure imports */
import { VRDeviceOrientationFreeCamera } from "./vrDeviceOrientationFreeCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate VR rendering (based on VRDeviceOrientationFreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export declare class VRDeviceOrientationGamepadCamera extends VRDeviceOrientationFreeCamera {
    /**
     * Creates a new VRDeviceOrientationGamepadCamera
     * @param name defines camera name
     * @param position defines the start position of the camera
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name: string, position: Vector3, scene?: Scene, compensateDistortion?: boolean, vrCameraMetrics?: VRCameraMetrics);
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationGamepadCamera
     */
    getClassName(): string;
    protected _setRigMode: (rigParams: any) => void;
}
/**
 * Register side effects for vrDeviceOrientationGamepadCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVrDeviceOrientationGamepadCamera(): void;

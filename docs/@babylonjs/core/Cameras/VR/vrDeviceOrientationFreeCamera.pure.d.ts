/** This file must only contain pure code and pure imports */
import { DeviceOrientationCamera } from "../../Cameras/deviceOrientationCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate VR rendering (based on FreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export declare class VRDeviceOrientationFreeCamera extends DeviceOrientationCamera {
    /**
     * Creates a new VRDeviceOrientationFreeCamera
     * @param name defines camera name
     * @param position defines the start position of the camera
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name: string, position: Vector3, scene?: Scene, compensateDistortion?: boolean, vrCameraMetrics?: VRCameraMetrics);
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationFreeCamera
     */
    getClassName(): string;
    protected _setRigMode: (rigParams: any) => void;
}
/**
 * Register side effects for vrDeviceOrientationFreeCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVrDeviceOrientationFreeCamera(): void;

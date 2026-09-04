/** This file must only contain pure code and pure imports */
import { ArcRotateCamera } from "../../Cameras/arcRotateCamera.pure.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate VR rendering (based on ArcRotateCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export declare class VRDeviceOrientationArcRotateCamera extends ArcRotateCamera {
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
    constructor(name: string, alpha: number, beta: number, radius: number, target: Vector3, scene?: Scene, compensateDistortion?: boolean, vrCameraMetrics?: VRCameraMetrics);
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationArcRotateCamera
     */
    getClassName(): string;
    protected _setRigMode: (rigParams: any) => void;
}
/**
 * Register side effects for vrDeviceOrientationArcRotateCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVrDeviceOrientationArcRotateCamera(): void;

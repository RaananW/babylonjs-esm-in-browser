/** This file must only contain pure code and pure imports */
import { FreeCamera } from "../../Cameras/freeCamera.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate anaglyphic rendering (based on FreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#anaglyph-cameras
 */
export declare class AnaglyphFreeCamera extends FreeCamera {
    /**
     * Creates a new AnaglyphFreeCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param scene defines the hosting scene
     */
    constructor(name: string, position: Vector3, interaxialDistance: number, scene?: Scene);
    /**
     * Gets camera class name
     * @returns AnaglyphFreeCamera
     */
    getClassName(): string;
    protected _setRigMode: () => void;
}
/**
 * Register side effects for anaglyphFreeCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnaglyphFreeCamera(): void;

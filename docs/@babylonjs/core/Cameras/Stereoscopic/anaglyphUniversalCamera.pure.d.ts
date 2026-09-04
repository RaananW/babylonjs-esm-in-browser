/** This file must only contain pure code and pure imports */
import { UniversalCamera } from "../../Cameras/universalCamera.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate anaglyphic rendering (based on UniversalCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#anaglyph-cameras
 */
export declare class AnaglyphUniversalCamera extends UniversalCamera {
    /**
     * Creates a new AnaglyphUniversalCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param scene defines the hosting scene
     */
    constructor(name: string, position: Vector3, interaxialDistance: number, scene?: Scene);
    /**
     * Gets camera class name
     * @returns AnaglyphUniversalCamera
     */
    getClassName(): string;
    protected _setRigMode: () => void;
}
/**
 * Register side effects for anaglyphUniversalCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnaglyphUniversalCamera(): void;

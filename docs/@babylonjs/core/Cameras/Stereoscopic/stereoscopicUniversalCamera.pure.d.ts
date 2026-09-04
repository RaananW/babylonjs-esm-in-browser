/** This file must only contain pure code and pure imports */
import { UniversalCamera } from "../../Cameras/universalCamera.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate stereoscopic rendering (based on UniversalCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
export declare class StereoscopicUniversalCamera extends UniversalCamera {
    /**
     * Creates a new StereoscopicUniversalCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
     * @param scene defines the hosting scene
     */
    constructor(name: string, position: Vector3, interaxialDistance: number, isStereoscopicSideBySide: boolean, scene?: Scene);
    /**
     * Gets camera class name
     * @returns StereoscopicUniversalCamera
     */
    getClassName(): string;
    protected _setRigMode: () => void;
}
/**
 * Register side effects for stereoscopicUniversalCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterStereoscopicUniversalCamera(): void;

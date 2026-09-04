/** This file must only contain pure code and pure imports */
import { GamepadCamera } from "../../Cameras/gamepadCamera.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Camera used to simulate stereoscopic rendering (based on GamepadCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
export declare class StereoscopicGamepadCamera extends GamepadCamera {
    /**
     * Creates a new StereoscopicGamepadCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
     * @param scene defines the hosting scene
     */
    constructor(name: string, position: Vector3, interaxialDistance: number, isStereoscopicSideBySide: boolean, scene?: Scene);
    /**
     * Gets camera class name
     * @returns StereoscopicGamepadCamera
     */
    getClassName(): string;
    protected _setRigMode: () => void;
}
/**
 * Register side effects for stereoscopicGamepadCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterStereoscopicGamepadCamera(): void;

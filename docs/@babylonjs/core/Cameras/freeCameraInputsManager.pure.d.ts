/** This file must only contain pure code and pure imports */
import { type FreeCamera } from "./freeCamera.pure.js";
import { CameraInputsManager } from "./cameraInputsManager.js";
import { FreeCameraMouseInput } from "../Cameras/Inputs/freeCameraMouseInput.js";
import { FreeCameraMouseWheelInput } from "../Cameras/Inputs/freeCameraMouseWheelInput.js";
import { type Nullable } from "../types.js";
/**
 * Default Inputs manager for the FreeCamera.
 * It groups all the default supported inputs for ease of use.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class FreeCameraInputsManager extends CameraInputsManager<FreeCamera> {
    /**
     * @internal
     */
    _mouseInput: Nullable<FreeCameraMouseInput>;
    /**
     * @internal
     */
    _mouseWheelInput: Nullable<FreeCameraMouseWheelInput>;
    /**
     * Instantiates a new FreeCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    constructor(camera: FreeCamera);
    /**
     * Add keyboard input support to the input manager.
     * @returns the current input manager
     */
    addKeyboard(): FreeCameraInputsManager;
    /**
     * Add mouse input support to the input manager.
     * @param touchEnabled if the FreeCameraMouseInput should support touch (default: true)
     * @returns the current input manager
     */
    addMouse(touchEnabled?: boolean): FreeCameraInputsManager;
    /**
     * Removes the mouse input support from the manager
     * @returns the current input manager
     */
    removeMouse(): FreeCameraInputsManager;
    /**
     * Add mouse wheel input support to the input manager.
     * @returns the current input manager
     */
    addMouseWheel(): FreeCameraInputsManager;
    /**
     * Removes the mouse wheel input support from the manager
     * @returns the current input manager
     */
    removeMouseWheel(): FreeCameraInputsManager;
    /**
     * Add touch input support to the input manager.
     * @returns the current input manager
     */
    addTouch(): FreeCameraInputsManager;
    /**
     * Remove all attached input methods from a camera
     */
    clear(): void;
}

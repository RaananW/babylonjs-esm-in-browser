import { type FlyCamera } from "./flyCamera.js";
import { CameraInputsManager } from "./cameraInputsManager.js";
/**
 * Default Inputs manager for the FlyCamera.
 * It groups all the default supported inputs for ease of use.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class FlyCameraInputsManager extends CameraInputsManager<FlyCamera> {
    /**
     * Instantiates a new FlyCameraInputsManager.
     * @param camera Defines the camera the inputs belong to.
     */
    constructor(camera: FlyCamera);
    /**
     * Add keyboard input support to the input manager.
     * @returns the new FlyCameraKeyboardMoveInput().
     */
    addKeyboard(): FlyCameraInputsManager;
    /**
     * Add mouse input support to the input manager.
     * @returns the new FlyCameraMouseInput().
     */
    addMouse(): FlyCameraInputsManager;
}

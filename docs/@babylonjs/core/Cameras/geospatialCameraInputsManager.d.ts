import { CameraInputsManager } from "./cameraInputsManager.js";
import { type GeospatialCamera } from "./geospatialCamera.js";
/**
 * Default Inputs manager for the GeospatialCamera.
 * It groups all the default supported inputs for ease of use.
 */
export declare class GeospatialCameraInputsManager extends CameraInputsManager<GeospatialCamera> {
    /**
     * Instantiates a new GeospatialCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    constructor(camera: GeospatialCamera);
    /**
     * Add mouse input support to the input manager
     * @returns the current input manager
     */
    addMouse(): GeospatialCameraInputsManager;
    /**
     * Add mouse wheel input support to the input manager
     * @returns the current input manager
     */
    addMouseWheel(): GeospatialCameraInputsManager;
    /**
     * Add mouse wheel input support to the input manager
     * @returns the current input manager
     */
    addKeyboard(): GeospatialCameraInputsManager;
}

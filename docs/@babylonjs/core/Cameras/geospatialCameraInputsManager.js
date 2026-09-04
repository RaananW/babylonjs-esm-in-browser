import { CameraInputsManager } from "./cameraInputsManager.js";
import { GeospatialCameraPointersInput } from "./Inputs/geospatialCameraPointersInput.js";
import { GeospatialCameraMouseWheelInput } from "./Inputs/geospatialCameraMouseWheelInput.js";
import { GeospatialCameraKeyboardInput } from "./Inputs/geospatialCameraKeyboardInput.js";
/**
 * Default Inputs manager for the GeospatialCamera.
 * It groups all the default supported inputs for ease of use.
 */
export class GeospatialCameraInputsManager extends CameraInputsManager {
    /**
     * Instantiates a new GeospatialCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    constructor(camera) {
        super(camera);
    }
    /**
     * Add mouse input support to the input manager
     * @returns the current input manager
     */
    addMouse() {
        this.add(new GeospatialCameraPointersInput());
        return this;
    }
    /**
     * Add mouse wheel input support to the input manager
     * @returns the current input manager
     */
    addMouseWheel() {
        this.add(new GeospatialCameraMouseWheelInput());
        return this;
    }
    /**
     * Add mouse wheel input support to the input manager
     * @returns the current input manager
     */
    addKeyboard() {
        this.add(new GeospatialCameraKeyboardInput());
        return this;
    }
}
//# sourceMappingURL=geospatialCameraInputsManager.js.map
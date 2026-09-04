import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { BaseCameraMouseWheelInput } from "./BaseCameraMouseWheelInput.js";
/**
 * Manage the mouse wheel inputs to control a geospatial camera.
 */
export class GeospatialCameraMouseWheelInput extends BaseCameraMouseWheelInput {
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName() {
        return "GeospatialCameraMouseWheelInput";
    }
    checkInputs() {
        this.camera.movement.input.handlers.zoom(this._wheelDeltaY, true);
        super.checkInputs();
    }
}
CameraInputTypes["GeospatialCameraMouseWheelInput"] = GeospatialCameraMouseWheelInput;
//# sourceMappingURL=geospatialCameraMouseWheelInput.js.map
import { type GeospatialCamera } from "../../Cameras/geospatialCamera.js";
import { BaseCameraMouseWheelInput } from "./BaseCameraMouseWheelInput.js";
/**
 * Manage the mouse wheel inputs to control a geospatial camera.
 */
export declare class GeospatialCameraMouseWheelInput extends BaseCameraMouseWheelInput {
    /**
     * Defines the camera the input is attached to.
     */
    camera: GeospatialCamera;
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName(): string;
    checkInputs(): void;
}

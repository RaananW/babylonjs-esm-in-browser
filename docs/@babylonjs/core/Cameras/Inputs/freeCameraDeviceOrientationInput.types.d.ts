import { type Nullable } from "../../types.js";
import { type FreeCameraDeviceOrientationInput } from "./freeCameraDeviceOrientationInput.pure.js";
declare module "../../Cameras/freeCameraInputsManager.pure.js" {
    interface FreeCameraInputsManager {
        /**
         * @internal
         */
        _deviceOrientationInput: Nullable<FreeCameraDeviceOrientationInput>;
        /**
         * Add orientation input support to the input manager.
         * @param smoothFactor deviceOrientation smoothing. 0: no smoothing, 1: new data ignored, 0.9 recommended for smoothing
         * @returns the current input manager
         */
        addDeviceOrientation(smoothFactor?: number): FreeCameraInputsManager;
    }
}

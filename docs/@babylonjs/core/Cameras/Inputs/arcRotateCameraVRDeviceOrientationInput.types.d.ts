export {};
declare module "../../Cameras/arcRotateCameraInputsManager.pure.js" {
    interface ArcRotateCameraInputsManager {
        /**
         * Add orientation input support to the input manager.
         * @returns the current input manager
         */
        addVRDeviceOrientation(): ArcRotateCameraInputsManager;
    }
}

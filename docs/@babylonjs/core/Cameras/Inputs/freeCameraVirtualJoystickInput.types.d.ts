export {};
declare module "../../Cameras/freeCameraInputsManager.pure.js" {
    interface FreeCameraInputsManager {
        /**
         * Add virtual joystick input support to the input manager.
         * @returns the current input manager
         */
        addVirtualJoystick(): FreeCameraInputsManager;
    }
}

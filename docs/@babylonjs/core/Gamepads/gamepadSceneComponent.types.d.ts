import { type Nullable } from "../types.js";
import { type GamepadManager } from "./gamepadManager.js";
declare module "../scene.pure.js" {
    interface Scene {
        /** @internal */
        _gamepadManager: Nullable<GamepadManager>;
        /**
         * Gets the gamepad manager associated with the scene
         * @see https://doc.babylonjs.com/features/featuresDeepDive/input/gamepads
         */
        gamepadManager: GamepadManager;
    }
}
declare module "../Cameras/freeCameraInputsManager.pure.js" {
    /**
     * Interface representing a free camera inputs manager
     */
    interface FreeCameraInputsManager {
        /**
         * Adds gamepad input support to the FreeCameraInputsManager.
         * @returns the FreeCameraInputsManager
         */
        addGamepad(): FreeCameraInputsManager;
    }
}
declare module "../Cameras/arcRotateCameraInputsManager.pure.js" {
    /**
     * Interface representing an arc rotate camera inputs manager
     */
    interface ArcRotateCameraInputsManager {
        /**
         * Adds gamepad input support to the ArcRotateCamera InputManager.
         * @returns the camera inputs manager
         */
        addGamepad(): ArcRotateCameraInputsManager;
    }
}

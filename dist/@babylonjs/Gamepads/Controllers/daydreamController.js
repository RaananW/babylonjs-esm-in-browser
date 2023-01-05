import { Logger } from "../../Misc/logger.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { PoseEnabledControllerType, PoseEnabledControllerHelper } from "./poseEnabledController.js";
/**
 * Google Daydream controller
 */
export class DaydreamController extends WebVRController {
    /**
     * Creates a new DaydreamController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        this.controllerType = PoseEnabledControllerType.DAYDREAM;
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene, meshLoaded) {
        SceneLoader.ImportMesh("", DaydreamController.MODEL_BASE_URL, DaydreamController.MODEL_FILENAME, scene, (newMeshes) => {
            this._defaultModel = newMeshes[1];
            this.attachToMesh(this._defaultModel);
            if (meshLoaded) {
                meshLoaded(this._defaultModel);
            }
        });
    }
    /**
     * Called once for each button that changed state since the last frame
     * @param buttonIdx Which button index changed
     * @param state New state of the button
     */
    _handleButtonChange(buttonIdx, state) {
        // Daydream controller only has 1 GamepadButton (on the trackpad).
        if (buttonIdx === 0) {
            const observable = this.onTriggerStateChangedObservable;
            if (observable) {
                observable.notifyObservers(state);
            }
        }
        else {
            // If the app or home buttons are ever made available
            Logger.Warn(`Unrecognized Daydream button index: ${buttonIdx}`);
        }
    }
}
/**
 * Base Url for the controller model.
 */
DaydreamController.MODEL_BASE_URL = "https://controllers.babylonjs.com/generic/";
/**
 * File name for the controller model.
 */
DaydreamController.MODEL_FILENAME = "generic.babylon";
/**
 * Gamepad Id prefix used to identify Daydream Controller.
 */
DaydreamController.GAMEPAD_ID_PREFIX = "Daydream"; // id is 'Daydream Controller'
PoseEnabledControllerHelper._ControllerFactories.push({
    canCreate: (gamepadInfo) => {
        return gamepadInfo.id.indexOf(DaydreamController.GAMEPAD_ID_PREFIX) === 0;
    },
    create: (gamepadInfo) => {
        return new DaydreamController(gamepadInfo);
    },
});
//# sourceMappingURL=daydreamController.js.map
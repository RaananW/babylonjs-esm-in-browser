import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { PoseEnabledControllerHelper } from "./poseEnabledController.js";
/**
 * Generic Controller
 */
export class GenericController extends WebVRController {
    /**
     * Creates a new GenericController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene, meshLoaded) {
        SceneLoader.ImportMesh("", GenericController.MODEL_BASE_URL, GenericController.MODEL_FILENAME, scene, (newMeshes) => {
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
        console.log("Button id: " + buttonIdx + "state: ");
        console.dir(state);
    }
}
/**
 * Base Url for the controller model.
 */
GenericController.MODEL_BASE_URL = "https://controllers.babylonjs.com/generic/";
/**
 * File name for the controller model.
 */
GenericController.MODEL_FILENAME = "generic.babylon";
PoseEnabledControllerHelper._DefaultControllerFactory = (gamepadInfo) => new GenericController(gamepadInfo);
//# sourceMappingURL=genericController.js.map
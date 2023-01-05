import { Vector3 } from "../../Maths/math.vector.js";
import { Mesh } from "../../Meshes/mesh.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { PoseEnabledControllerType, PoseEnabledControllerHelper } from "./poseEnabledController.js";
/**
 * Gear VR Controller
 */
export class GearVRController extends WebVRController {
    /**
     * Creates a new GearVRController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        this._buttonIndexToObservableNameMap = [
            "onPadStateChangedObservable",
            "onTriggerStateChangedObservable", // Trigger
        ];
        this.controllerType = PoseEnabledControllerType.GEAR_VR;
        // Initial starting position defaults to where hand would be (incase of only 3dof controller)
        this._calculatedPosition = new Vector3(this.hand == "left" ? -0.15 : 0.15, -0.5, 0.25);
        this._disableTrackPosition(this._calculatedPosition);
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene, meshLoaded) {
        SceneLoader.ImportMesh("", GearVRController.MODEL_BASE_URL, GearVRController.MODEL_FILENAME, scene, (newMeshes) => {
            // Offset the controller so it will rotate around the users wrist
            const mesh = new Mesh("", scene);
            newMeshes[1].parent = mesh;
            newMeshes[1].position.z = -0.15;
            this._defaultModel = mesh;
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
        if (buttonIdx < this._buttonIndexToObservableNameMap.length) {
            const observableName = this._buttonIndexToObservableNameMap[buttonIdx];
            // Only emit events for buttons that we know how to map from index to observable
            const observable = this[observableName];
            if (observable) {
                observable.notifyObservers(state);
            }
        }
    }
}
/**
 * Base Url for the controller model.
 */
GearVRController.MODEL_BASE_URL = "https://controllers.babylonjs.com/generic/";
/**
 * File name for the controller model.
 */
GearVRController.MODEL_FILENAME = "generic.babylon";
/**
 * Gamepad Id prefix used to identify this controller.
 */
GearVRController.GAMEPAD_ID_PREFIX = "Gear VR"; // id is 'Gear VR Controller'
PoseEnabledControllerHelper._ControllerFactories.push({
    canCreate: (gamepadInfo) => {
        return gamepadInfo.id.indexOf(GearVRController.GAMEPAD_ID_PREFIX) === 0 || gamepadInfo.id.indexOf("Oculus Go") !== -1 || gamepadInfo.id.indexOf("Vive Focus") !== -1;
    },
    create: (gamepadInfo) => {
        return new GearVRController(gamepadInfo);
    },
});
//# sourceMappingURL=gearVRController.js.map
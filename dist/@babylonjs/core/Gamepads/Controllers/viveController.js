import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { PoseEnabledControllerType, PoseEnabledControllerHelper } from "./poseEnabledController.js";
/**
 * Vive Controller
 */
export class ViveController extends WebVRController {
    /**
     * Creates a new ViveController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        this.controllerType = PoseEnabledControllerType.VIVE;
        this._invertLeftStickY = true;
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene, meshLoaded) {
        SceneLoader.ImportMesh("", ViveController.MODEL_BASE_URL, ViveController.MODEL_FILENAME, scene, (newMeshes) => {
            /*
            Parent Mesh name: ViveWand
            - body
            - r_gripper
            - l_gripper
            - menu_button
            - system_button
            - trackpad
            - trigger
            - LED
            */
            this._defaultModel = newMeshes[1];
            this.attachToMesh(this._defaultModel);
            if (meshLoaded) {
                meshLoaded(this._defaultModel);
            }
        });
    }
    /**
     * Fired when the left button on this controller is modified
     */
    get onLeftButtonStateChangedObservable() {
        return this.onMainButtonStateChangedObservable;
    }
    /**
     * Fired when the right button on this controller is modified
     */
    get onRightButtonStateChangedObservable() {
        return this.onMainButtonStateChangedObservable;
    }
    /**
     * Fired when the menu button on this controller is modified
     */
    get onMenuButtonStateChangedObservable() {
        return this.onSecondaryButtonStateChangedObservable;
    }
    /**
     * Called once for each button that changed state since the last frame
     * Vive mapping:
     * 0: touchpad
     * 1: trigger
     * 2: left AND right buttons
     * 3: menu button
     * @param buttonIdx Which button index changed
     * @param state New state of the button
     */
    _handleButtonChange(buttonIdx, state) {
        const notifyObject = state; //{ state: state, changes: changes };
        switch (buttonIdx) {
            case 0:
                this.onPadStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 1: // index trigger
                if (this._defaultModel) {
                    this._defaultModel.getChildren()[6].rotation.x = -notifyObject.value * 0.15;
                }
                this.onTriggerStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 2: // left AND right button
                this.onMainButtonStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 3:
                if (this._defaultModel) {
                    if (notifyObject.pressed) {
                        this._defaultModel.getChildren()[2].position.y = -0.001;
                    }
                    else {
                        this._defaultModel.getChildren()[2].position.y = 0;
                    }
                }
                this.onSecondaryButtonStateChangedObservable.notifyObservers(notifyObject);
                return;
        }
    }
}
/**
 * Base Url for the controller model.
 */
ViveController.MODEL_BASE_URL = "https://controllers.babylonjs.com/vive/";
/**
 * File name for the controller model.
 */
ViveController.MODEL_FILENAME = "wand.babylon";
PoseEnabledControllerHelper._ControllerFactories.push({
    canCreate: (gamepadInfo) => {
        return gamepadInfo.id.toLowerCase().indexOf("openvr") !== -1;
    },
    create: (gamepadInfo) => {
        return new ViveController(gamepadInfo);
    },
});
//# sourceMappingURL=viveController.js.map
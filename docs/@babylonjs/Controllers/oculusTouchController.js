import { Observable } from "../../Misc/observable.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { PoseEnabledControllerType, PoseEnabledControllerHelper } from "./poseEnabledController.js";
import { EngineStore } from "../../Engines/engineStore.js";
/**
 * Oculus Touch Controller
 */
export class OculusTouchController extends WebVRController {
    /**
     * Creates a new OculusTouchController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        /**
         * Fired when the secondary trigger on this controller is modified
         */
        this.onSecondaryTriggerStateChangedObservable = new Observable();
        /**
         * Fired when the thumb rest on this controller is modified
         */
        this.onThumbRestChangedObservable = new Observable();
        this.controllerType = PoseEnabledControllerType.OCULUS;
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene, meshLoaded) {
        let meshName;
        // Hand
        if (this.hand === "left") {
            meshName = OculusTouchController.MODEL_LEFT_FILENAME;
        }
        else {
            // Right is the default if no hand is specified
            meshName = OculusTouchController.MODEL_RIGHT_FILENAME;
        }
        SceneLoader.ImportMesh("", OculusTouchController._IsQuest ? OculusTouchController.QUEST_MODEL_BASE_URL : OculusTouchController.MODEL_BASE_URL, meshName, scene, (newMeshes) => {
            /*
        Parent Mesh name: oculus_touch_left
        - body
        - trigger
        - thumbstick
        - grip
        - button_y
        - button_x
        - button_enter
        */
            this._defaultModel = OculusTouchController._IsQuest ? newMeshes[0] : newMeshes[1];
            this.attachToMesh(this._defaultModel);
            if (meshLoaded) {
                meshLoaded(this._defaultModel);
            }
        });
    }
    /**
     * Fired when the A button on this controller is modified
     */
    get onAButtonStateChangedObservable() {
        if (this.hand === "right") {
            return this.onMainButtonStateChangedObservable;
        }
        else {
            throw new Error("No A button on left hand");
        }
    }
    /**
     * Fired when the B button on this controller is modified
     */
    get onBButtonStateChangedObservable() {
        if (this.hand === "right") {
            return this.onSecondaryButtonStateChangedObservable;
        }
        else {
            throw new Error("No B button on left hand");
        }
    }
    /**
     * Fired when the X button on this controller is modified
     */
    get onXButtonStateChangedObservable() {
        if (this.hand === "left") {
            return this.onMainButtonStateChangedObservable;
        }
        else {
            throw new Error("No X button on right hand");
        }
    }
    /**
     * Fired when the Y button on this controller is modified
     */
    get onYButtonStateChangedObservable() {
        if (this.hand === "left") {
            return this.onSecondaryButtonStateChangedObservable;
        }
        else {
            throw new Error("No Y button on right hand");
        }
    }
    /**
     * Called once for each button that changed state since the last frame
     * 0) thumb stick (touch, press, value = pressed (0,1)). value is in this.leftStick
     * 1) index trigger (touch (?), press (only when value > 0.1), value 0 to 1)
     * 2) secondary trigger (same)
     * 3) A (right) X (left), touch, pressed = value
     * 4) B / Y
     * 5) thumb rest
     * @param buttonIdx Which button index changed
     * @param state New state of the button
     */
    _handleButtonChange(buttonIdx, state) {
        const notifyObject = state; //{ state: state, changes: changes };
        const triggerDirection = this.hand === "right" ? -1 : 1;
        switch (buttonIdx) {
            case 0:
                this.onPadStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 1: // index trigger
                if (!OculusTouchController._IsQuest && this._defaultModel) {
                    this._defaultModel.getChildren()[3].rotation.x = -notifyObject.value * 0.2;
                    this._defaultModel.getChildren()[3].position.y = -notifyObject.value * 0.005;
                    this._defaultModel.getChildren()[3].position.z = -notifyObject.value * 0.005;
                }
                this.onTriggerStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 2: // secondary trigger
                if (!OculusTouchController._IsQuest && this._defaultModel) {
                    this._defaultModel.getChildren()[4].position.x = triggerDirection * notifyObject.value * 0.0035;
                }
                this.onSecondaryTriggerStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 3:
                if (!OculusTouchController._IsQuest && this._defaultModel) {
                    if (notifyObject.pressed) {
                        this._defaultModel.getChildren()[1].position.y = -0.001;
                    }
                    else {
                        this._defaultModel.getChildren()[1].position.y = 0;
                    }
                }
                this.onMainButtonStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 4:
                if (!OculusTouchController._IsQuest && this._defaultModel) {
                    if (notifyObject.pressed) {
                        this._defaultModel.getChildren()[2].position.y = -0.001;
                    }
                    else {
                        this._defaultModel.getChildren()[2].position.y = 0;
                    }
                }
                this.onSecondaryButtonStateChangedObservable.notifyObservers(notifyObject);
                return;
            case 5:
                this.onThumbRestChangedObservable.notifyObservers(notifyObject);
                return;
        }
    }
}
/**
 * Base Url for the controller model.
 */
OculusTouchController.MODEL_BASE_URL = "https://controllers.babylonjs.com/oculus/";
/**
 * File name for the left controller model.
 */
OculusTouchController.MODEL_LEFT_FILENAME = "left.babylon";
/**
 * File name for the right controller model.
 */
OculusTouchController.MODEL_RIGHT_FILENAME = "right.babylon";
/**
 * Base Url for the Quest controller model.
 */
OculusTouchController.QUEST_MODEL_BASE_URL = "https://controllers.babylonjs.com/oculusQuest/";
/**
 * @internal
 * If the controllers are running on a device that needs the updated Quest controller models
 */
OculusTouchController._IsQuest = false;
PoseEnabledControllerHelper._ControllerFactories.push({
    canCreate: (gamepadInfo) => {
        // If the headset reports being an Oculus Quest, use the Quest controller models
        if (EngineStore.LastCreatedEngine && EngineStore.LastCreatedEngine._vrDisplay && EngineStore.LastCreatedEngine._vrDisplay.displayName === "Oculus Quest") {
            OculusTouchController._IsQuest = true;
        }
        return gamepadInfo.id.indexOf("Oculus Touch") !== -1;
    },
    create: (gamepadInfo) => {
        return new OculusTouchController(gamepadInfo);
    },
});
//# sourceMappingURL=oculusTouchController.js.map
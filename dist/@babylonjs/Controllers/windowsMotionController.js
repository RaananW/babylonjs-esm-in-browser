import { Logger } from "../../Misc/logger.js";
import { Observable } from "../../Misc/observable.js";
import { Quaternion, Vector3 } from "../../Maths/math.vector.js";
import { Mesh } from "../../Meshes/mesh.js";
import { Ray } from "../../Culling/ray.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { WebVRController } from "./webVRController.js";
import { GenericController } from "./genericController.js";
import { PoseEnabledController, PoseEnabledControllerType, PoseEnabledControllerHelper } from "./poseEnabledController.js";
/**
 * Defines the LoadedMeshInfo object that describes information about the loaded webVR controller mesh
 */
class LoadedMeshInfo {
    constructor() {
        /**
         * Map of the button meshes contained in the controller
         */
        this.buttonMeshes = {};
        /**
         * Map of the axis meshes contained in the controller
         */
        this.axisMeshes = {};
    }
}
/**
 * Defines the WindowsMotionController object that the state of the windows motion controller
 */
export class WindowsMotionController extends WebVRController {
    /**
     * Creates a new WindowsMotionController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        this._mapping = {
            // Semantic button names
            buttons: ["thumbstick", "trigger", "grip", "menu", "trackpad"],
            // trigger, grip, trackpad, thumbstick, menu
            // A mapping of the button name to glTF model node name
            // that should be transformed by button value.
            buttonMeshNames: {
                trigger: "SELECT",
                menu: "MENU",
                grip: "GRASP",
                thumbstick: "THUMBSTICK_PRESS",
                trackpad: "TOUCHPAD_PRESS",
            },
            // This mapping is used to translate from the Motion Controller to Babylon semantics
            buttonObservableNames: {
                trigger: "onTriggerStateChangedObservable",
                menu: "onSecondaryButtonStateChangedObservable",
                grip: "onMainButtonStateChangedObservable",
                thumbstick: "onPadStateChangedObservable",
                trackpad: "onTrackpadChangedObservable",
            },
            // A mapping of the axis name to glTF model node name
            // that should be transformed by axis value.
            // This array mirrors the browserGamepad.axes array, such that
            // the mesh corresponding to axis 0 is in this array index 0.
            axisMeshNames: ["THUMBSTICK_X", "THUMBSTICK_Y", "TOUCHPAD_TOUCH_X", "TOUCHPAD_TOUCH_Y"],
            // upside down in webxr
            pointingPoseMeshName: PoseEnabledController.POINTING_POSE,
        };
        /**
         * Fired when the trackpad on this controller is clicked
         */
        this.onTrackpadChangedObservable = new Observable();
        /**
         * Fired when the trackpad on this controller is modified
         */
        this.onTrackpadValuesChangedObservable = new Observable();
        /**
         * The current x and y values of this controller's trackpad
         */
        this.trackpad = { x: 0, y: 0 };
        this.controllerType = PoseEnabledControllerType.WINDOWS;
        this._loadedMeshInfo = null;
    }
    /**
     * Fired when the trigger on this controller is modified
     */
    get onTriggerButtonStateChangedObservable() {
        return this.onTriggerStateChangedObservable;
    }
    /**
     * Fired when the menu button on this controller is modified
     */
    get onMenuButtonStateChangedObservable() {
        return this.onSecondaryButtonStateChangedObservable;
    }
    /**
     * Fired when the grip button on this controller is modified
     */
    get onGripButtonStateChangedObservable() {
        return this.onMainButtonStateChangedObservable;
    }
    /**
     * Fired when the thumbstick button on this controller is modified
     */
    get onThumbstickButtonStateChangedObservable() {
        return this.onPadStateChangedObservable;
    }
    /**
     * Fired when the touchpad button on this controller is modified
     */
    get onTouchpadButtonStateChangedObservable() {
        return this.onTrackpadChangedObservable;
    }
    /**
     * Fired when the touchpad values on this controller are modified
     */
    get onTouchpadValuesChangedObservable() {
        return this.onTrackpadValuesChangedObservable;
    }
    _updateTrackpad() {
        if (this.browserGamepad.axes && (this.browserGamepad.axes[2] != this.trackpad.x || this.browserGamepad.axes[3] != this.trackpad.y)) {
            this.trackpad.x = this.browserGamepad["axes"][this._mapping.axisMeshNames.indexOf("TOUCHPAD_TOUCH_X")];
            this.trackpad.y = this.browserGamepad["axes"][this._mapping.axisMeshNames.indexOf("TOUCHPAD_TOUCH_Y")];
            this.onTrackpadValuesChangedObservable.notifyObservers(this.trackpad);
        }
    }
    /**
     * Called once per frame by the engine.
     */
    update() {
        super.update();
        if (this.browserGamepad.axes) {
            this._updateTrackpad();
            // Only need to animate axes if there is a loaded mesh
            if (this._loadedMeshInfo) {
                for (let axis = 0; axis < this._mapping.axisMeshNames.length; axis++) {
                    this._lerpAxisTransform(axis, this.browserGamepad.axes[axis]);
                }
            }
        }
    }
    /**
     * Called once for each button that changed state since the last frame
     * @param buttonIdx Which button index changed
     * @param state New state of the button
     */
    _handleButtonChange(buttonIdx, state) {
        const buttonName = this._mapping.buttons[buttonIdx];
        if (!buttonName) {
            return;
        }
        // Update the trackpad to ensure trackpad.x/y are accurate during button events between frames
        this._updateTrackpad();
        // Only emit events for buttons that we know how to map from index to name
        const observable = this[this._mapping.buttonObservableNames[buttonName]];
        if (observable) {
            observable.notifyObservers(state);
        }
        this._lerpButtonTransform(buttonName, state.value);
    }
    /**
     * Moves the buttons on the controller mesh based on their current state
     * @param buttonName the name of the button to move
     * @param buttonValue the value of the button which determines the buttons new position
     */
    _lerpButtonTransform(buttonName, buttonValue) {
        // If there is no loaded mesh, there is nothing to transform.
        if (!this._loadedMeshInfo) {
            return;
        }
        const meshInfo = this._loadedMeshInfo.buttonMeshes[buttonName];
        if (!meshInfo || !meshInfo.unpressed.rotationQuaternion || !meshInfo.pressed.rotationQuaternion || !meshInfo.value.rotationQuaternion) {
            return;
        }
        Quaternion.SlerpToRef(meshInfo.unpressed.rotationQuaternion, meshInfo.pressed.rotationQuaternion, buttonValue, meshInfo.value.rotationQuaternion);
        Vector3.LerpToRef(meshInfo.unpressed.position, meshInfo.pressed.position, buttonValue, meshInfo.value.position);
    }
    /**
     * Moves the axis on the controller mesh based on its current state
     * @param axis the index of the axis
     * @param axisValue the value of the axis which determines the meshes new position
     * @internal
     */
    _lerpAxisTransform(axis, axisValue) {
        if (!this._loadedMeshInfo) {
            return;
        }
        const meshInfo = this._loadedMeshInfo.axisMeshes[axis];
        if (!meshInfo) {
            return;
        }
        if (!meshInfo.min.rotationQuaternion || !meshInfo.max.rotationQuaternion || !meshInfo.value.rotationQuaternion) {
            return;
        }
        // Convert from gamepad value range (-1 to +1) to lerp range (0 to 1)
        const lerpValue = axisValue * 0.5 + 0.5;
        Quaternion.SlerpToRef(meshInfo.min.rotationQuaternion, meshInfo.max.rotationQuaternion, lerpValue, meshInfo.value.rotationQuaternion);
        Vector3.LerpToRef(meshInfo.min.position, meshInfo.max.position, lerpValue, meshInfo.value.position);
    }
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     * @param forceDefault
     */
    initControllerMesh(scene, meshLoaded, forceDefault = false) {
        let path;
        let filename;
        // Checking if GLB loader is present
        if (SceneLoader.IsPluginForExtensionAvailable(".glb")) {
            // Determine the device specific folder based on the ID suffix
            let device = "default";
            if (this.id && !forceDefault) {
                const match = this.id.match(WindowsMotionController.GAMEPAD_ID_PATTERN);
                device = (match && match[0]) || device;
            }
            // Hand
            if (this.hand === "left") {
                filename = WindowsMotionController.MODEL_LEFT_FILENAME;
            }
            else {
                // Right is the default if no hand is specified
                filename = WindowsMotionController.MODEL_RIGHT_FILENAME;
            }
            path = WindowsMotionController.MODEL_BASE_URL + device + "/";
        }
        else {
            Logger.Warn("You need to reference GLTF loader to load Windows Motion Controllers model. Falling back to generic models");
            path = GenericController.MODEL_BASE_URL;
            filename = GenericController.MODEL_FILENAME;
        }
        SceneLoader.ImportMesh("", path, filename, scene, (meshes) => {
            // glTF files successfully loaded from the remote server, now process them to ensure they are in the right format.
            this._loadedMeshInfo = this._processModel(scene, meshes);
            if (!this._loadedMeshInfo) {
                return;
            }
            this._defaultModel = this._loadedMeshInfo.rootNode;
            this.attachToMesh(this._defaultModel);
            if (meshLoaded) {
                meshLoaded(this._defaultModel);
            }
        }, null, (scene, message) => {
            Logger.Log(message);
            Logger.Warn("Failed to retrieve controller model from the remote server: " + path + filename);
            if (!forceDefault) {
                this.initControllerMesh(scene, meshLoaded, true);
            }
        });
    }
    /**
     * Takes a list of meshes (as loaded from the glTF file) and finds the root node, as well as nodes that
     * can be transformed by button presses and axes values, based on this._mapping.
     *
     * @param scene scene in which the meshes exist
     * @param meshes list of meshes that make up the controller model to process
     * @returns structured view of the given meshes, with mapping of buttons and axes to meshes that can be transformed.
     */
    _processModel(scene, meshes) {
        let loadedMeshInfo = null;
        // Create a new mesh to contain the glTF hierarchy
        const parentMesh = new Mesh(this.id + " " + this.hand, scene);
        // Find the root node in the loaded glTF scene, and attach it as a child of 'parentMesh'
        let childMesh = null;
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            if (!mesh.parent) {
                // Exclude controller meshes from picking results
                mesh.isPickable = false;
                // Handle root node, attach to the new parentMesh
                childMesh = mesh;
                break;
            }
        }
        if (childMesh) {
            childMesh.setParent(parentMesh);
            // Create our mesh info. Note that this method will always return non-null.
            loadedMeshInfo = this._createMeshInfo(parentMesh);
        }
        else {
            Logger.Warn("Could not find root node in model file.");
        }
        return loadedMeshInfo;
    }
    _createMeshInfo(rootNode) {
        const loadedMeshInfo = new LoadedMeshInfo();
        let i;
        loadedMeshInfo.rootNode = rootNode;
        // Reset the caches
        loadedMeshInfo.buttonMeshes = {};
        loadedMeshInfo.axisMeshes = {};
        // Button Meshes
        for (i = 0; i < this._mapping.buttons.length; i++) {
            const buttonMeshName = this._mapping.buttonMeshNames[this._mapping.buttons[i]];
            if (!buttonMeshName) {
                Logger.Log("Skipping unknown button at index: " + i + " with mapped name: " + this._mapping.buttons[i]);
                continue;
            }
            const buttonMesh = getChildByName(rootNode, buttonMeshName);
            if (!buttonMesh) {
                Logger.Warn("Missing button mesh with name: " + buttonMeshName);
                continue;
            }
            const buttonMeshInfo = {
                index: i,
                value: getImmediateChildByName(buttonMesh, "VALUE"),
                pressed: getImmediateChildByName(buttonMesh, "PRESSED"),
                unpressed: getImmediateChildByName(buttonMesh, "UNPRESSED"),
            };
            if (buttonMeshInfo.value && buttonMeshInfo.pressed && buttonMeshInfo.unpressed) {
                loadedMeshInfo.buttonMeshes[this._mapping.buttons[i]] = buttonMeshInfo;
            }
            else {
                // If we didn't find the mesh, it simply means this button won't have transforms applied as mapped button value changes.
                Logger.Warn("Missing button submesh under mesh with name: " +
                    buttonMeshName +
                    "(VALUE: " +
                    !!buttonMeshInfo.value +
                    ", PRESSED: " +
                    !!buttonMeshInfo.pressed +
                    ", UNPRESSED:" +
                    !!buttonMeshInfo.unpressed +
                    ")");
            }
        }
        // Axis Meshes
        for (i = 0; i < this._mapping.axisMeshNames.length; i++) {
            const axisMeshName = this._mapping.axisMeshNames[i];
            if (!axisMeshName) {
                Logger.Log("Skipping unknown axis at index: " + i);
                continue;
            }
            const axisMesh = getChildByName(rootNode, axisMeshName);
            if (!axisMesh) {
                Logger.Warn("Missing axis mesh with name: " + axisMeshName);
                continue;
            }
            const axisMeshInfo = {
                index: i,
                value: getImmediateChildByName(axisMesh, "VALUE"),
                min: getImmediateChildByName(axisMesh, "MIN"),
                max: getImmediateChildByName(axisMesh, "MAX"),
            };
            if (axisMeshInfo.value && axisMeshInfo.min && axisMeshInfo.max) {
                loadedMeshInfo.axisMeshes[i] = axisMeshInfo;
            }
            else {
                // If we didn't find the mesh, it simply means thit axis won't have transforms applied as mapped axis values change.
                Logger.Warn("Missing axis submesh under mesh with name: " +
                    axisMeshName +
                    "(VALUE: " +
                    !!axisMeshInfo.value +
                    ", MIN: " +
                    !!axisMeshInfo.min +
                    ", MAX:" +
                    !!axisMeshInfo.max +
                    ")");
            }
        }
        // Pointing Ray
        loadedMeshInfo.pointingPoseNode = getChildByName(rootNode, this._mapping.pointingPoseMeshName);
        if (!loadedMeshInfo.pointingPoseNode) {
            Logger.Warn("Missing pointing pose mesh with name: " + this._mapping.pointingPoseMeshName);
        }
        else {
            this._pointingPoseNode = loadedMeshInfo.pointingPoseNode;
        }
        return loadedMeshInfo;
        // Look through all children recursively. This will return null if no mesh exists with the given name.
        function getChildByName(node, name) {
            return node.getChildren((n) => n.name === name, false)[0];
        }
        // Look through only immediate children. This will return null if no mesh exists with the given name.
        function getImmediateChildByName(node, name) {
            return node.getChildren((n) => n.name == name, true)[0];
        }
    }
    /**
     * Gets the ray of the controller in the direction the controller is pointing
     * @param length the length the resulting ray should be
     * @returns a ray in the direction the controller is pointing
     */
    getForwardRay(length = 100) {
        if (!(this._loadedMeshInfo && this._loadedMeshInfo.pointingPoseNode)) {
            return super.getForwardRay(length);
        }
        const m = this._loadedMeshInfo.pointingPoseNode.getWorldMatrix();
        const origin = m.getTranslation();
        const forward = new Vector3(0, 0, -1);
        const forwardWorld = Vector3.TransformNormal(forward, m);
        const direction = Vector3.Normalize(forwardWorld);
        return new Ray(origin, direction, length);
    }
    /**
     * Disposes of the controller
     */
    dispose() {
        super.dispose();
        this.onTrackpadChangedObservable.clear();
        this.onTrackpadValuesChangedObservable.clear();
    }
}
/**
 * The base url used to load the left and right controller models
 */
WindowsMotionController.MODEL_BASE_URL = "https://controllers.babylonjs.com/microsoft/";
/**
 * The name of the left controller model file
 */
WindowsMotionController.MODEL_LEFT_FILENAME = "left.glb";
/**
 * The name of the right controller model file
 */
WindowsMotionController.MODEL_RIGHT_FILENAME = "right.glb";
/**
 * The controller name prefix for this controller type
 */
WindowsMotionController.GAMEPAD_ID_PREFIX = "Spatial Controller (Spatial Interaction Source) ";
/**
 * The controller id pattern for this controller type
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
WindowsMotionController.GAMEPAD_ID_PATTERN = /([0-9a-zA-Z]+-[0-9a-zA-Z]+)$/;
/**
 * This class represents a new windows motion controller in XR.
 */
export class XRWindowsMotionController extends WindowsMotionController {
    /**
     * Construct a new XR-Based windows motion controller
     *
     * @param gamepadInfo the gamepad object from the browser
     */
    constructor(gamepadInfo) {
        super(gamepadInfo);
        /**
         * Changing the original WIndowsMotionController mapping to fir the new mapping
         */
        this._mapping = {
            // Semantic button names
            buttons: ["trigger", "grip", "trackpad", "thumbstick", "menu"],
            // trigger, grip, trackpad, thumbstick, menu
            // A mapping of the button name to glTF model node name
            // that should be transformed by button value.
            buttonMeshNames: {
                trigger: "SELECT",
                menu: "MENU",
                grip: "GRASP",
                thumbstick: "THUMBSTICK_PRESS",
                trackpad: "TOUCHPAD_PRESS",
            },
            // This mapping is used to translate from the Motion Controller to Babylon semantics
            buttonObservableNames: {
                trigger: "onTriggerStateChangedObservable",
                menu: "onSecondaryButtonStateChangedObservable",
                grip: "onMainButtonStateChangedObservable",
                thumbstick: "onThumbstickStateChangedObservable",
                trackpad: "onTrackpadChangedObservable",
            },
            // A mapping of the axis name to glTF model node name
            // that should be transformed by axis value.
            // This array mirrors the browserGamepad.axes array, such that
            // the mesh corresponding to axis 0 is in this array index 0.
            axisMeshNames: ["TOUCHPAD_TOUCH_X", "TOUCHPAD_TOUCH_Y", "THUMBSTICK_X", "THUMBSTICK_Y"],
            // upside down in webxr
            pointingPoseMeshName: PoseEnabledController.POINTING_POSE,
        };
        /**
         * holds the thumbstick values (X,Y)
         */
        this.thumbstickValues = { x: 0, y: 0 };
        /**
         * Fired when the thumbstick on this controller is clicked
         */
        this.onThumbstickStateChangedObservable = new Observable();
        /**
         * Fired when the thumbstick on this controller is modified
         */
        this.onThumbstickValuesChangedObservable = new Observable();
        /**
         * Fired when the touchpad button on this controller is modified
         */
        this.onTrackpadChangedObservable = this.onPadStateChangedObservable;
        /**
         * Fired when the touchpad values on this controller are modified
         */
        this.onTrackpadValuesChangedObservable = this.onPadValuesChangedObservable;
    }
    /**
     * Fired when the thumbstick button on this controller is modified
     * here to prevent breaking changes
     */
    get onThumbstickButtonStateChangedObservable() {
        return this.onThumbstickStateChangedObservable;
    }
    /**
     * updating the thumbstick(!) and not the trackpad.
     * This is named this way due to the difference between WebVR and XR and to avoid
     * changing the parent class.
     */
    _updateTrackpad() {
        if (this.browserGamepad.axes && (this.browserGamepad.axes[2] != this.thumbstickValues.x || this.browserGamepad.axes[3] != this.thumbstickValues.y)) {
            this.trackpad.x = this.browserGamepad["axes"][2];
            this.trackpad.y = this.browserGamepad["axes"][3];
            this.onThumbstickValuesChangedObservable.notifyObservers(this.trackpad);
        }
    }
    /**
     * Disposes the class with joy
     */
    dispose() {
        super.dispose();
        this.onThumbstickStateChangedObservable.clear();
        this.onThumbstickValuesChangedObservable.clear();
    }
}
PoseEnabledControllerHelper._ControllerFactories.push({
    canCreate: (gamepadInfo) => {
        return gamepadInfo.id.indexOf(WindowsMotionController.GAMEPAD_ID_PREFIX) === 0;
    },
    create: (gamepadInfo) => {
        return new WindowsMotionController(gamepadInfo);
    },
});
//# sourceMappingURL=windowsMotionController.js.map
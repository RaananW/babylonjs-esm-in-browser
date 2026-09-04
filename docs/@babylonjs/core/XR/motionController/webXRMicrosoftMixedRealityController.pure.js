/** This file must only contain pure code and pure imports */
import { WebXRAbstractMotionController, } from "./webXRAbstractMotionController.js";
import { Mesh } from "../../Meshes/mesh.pure.js";
import { Quaternion } from "../../Maths/math.vector.pure.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { Logger } from "../../Misc/logger.js";
import { WebXRMotionControllerManager } from "./webXRMotionControllerManager.pure.js";
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * The motion controller class for all microsoft mixed reality controllers
 */
export class WebXRMicrosoftMixedRealityController extends WebXRAbstractMotionController {
    constructor(scene, gamepadObject, handedness) {
        super(scene, MixedRealityProfile[handedness], gamepadObject, handedness);
        // use this in the future - https://github.com/immersive-web/webxr-input-profiles/tree/master/packages/assets/profiles/microsoft
        this._mapping = {
            defaultButton: {
                valueNodeName: "VALUE",
                unpressedNodeName: "UNPRESSED",
                pressedNodeName: "PRESSED",
            },
            defaultAxis: {
                valueNodeName: "VALUE",
                minNodeName: "MIN",
                maxNodeName: "MAX",
            },
            buttons: {
                "xr-standard-trigger": {
                    rootNodeName: "SELECT",
                    componentProperty: "button",
                    states: ["default", "touched", "pressed"],
                },
                "xr-standard-squeeze": {
                    rootNodeName: "GRASP",
                    componentProperty: "state",
                    states: ["pressed"],
                },
                "xr-standard-touchpad": {
                    rootNodeName: "TOUCHPAD_PRESS",
                    labelAnchorNodeName: "squeeze-label",
                    touchPointNodeName: "TOUCH", // TODO - use this for visual feedback
                },
                "xr-standard-thumbstick": {
                    rootNodeName: "THUMBSTICK_PRESS",
                    componentProperty: "state",
                    states: ["pressed"],
                },
            },
            axes: {
                "xr-standard-touchpad": {
                    "x-axis": {
                        rootNodeName: "TOUCHPAD_TOUCH_X",
                    },
                    "y-axis": {
                        rootNodeName: "TOUCHPAD_TOUCH_Y",
                    },
                },
                "xr-standard-thumbstick": {
                    "x-axis": {
                        rootNodeName: "THUMBSTICK_X",
                    },
                    "y-axis": {
                        rootNodeName: "THUMBSTICK_Y",
                    },
                },
            },
        };
        this.profileId = "microsoft-mixed-reality";
    }
    _getFilenameAndPath() {
        let filename;
        if (this.handedness === "left") {
            filename = WebXRMicrosoftMixedRealityController.MODEL_LEFT_FILENAME;
        }
        else {
            // Right is the default if no hand is specified
            filename = WebXRMicrosoftMixedRealityController.MODEL_RIGHT_FILENAME;
        }
        const device = "default";
        const path = WebXRMicrosoftMixedRealityController.MODEL_BASE_URL + device + "/";
        return {
            filename,
            path,
        };
    }
    _getModelLoadingConstraints() {
        const glbLoaded = SceneLoader.IsPluginForExtensionAvailable(".glb");
        if (!glbLoaded) {
            Logger.Warn("glTF / glb loaded was not registered, using generic controller instead");
        }
        return glbLoaded;
    }
    _processLoadedModel(_meshes) {
        if (!this.rootMesh) {
            return;
        }
        // Button Meshes
        const ids = this.getComponentIds();
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (this.disableAnimation) {
                continue;
            }
            if (id && this.rootMesh) {
                const buttonMap = this._mapping.buttons[id];
                const buttonMeshName = buttonMap.rootNodeName;
                if (!buttonMeshName) {
                    Logger.Log("Skipping unknown button at index: " + i + " with mapped name: " + id);
                    continue;
                }
                const buttonMesh = this._getChildByName(this.rootMesh, buttonMeshName);
                if (!buttonMesh) {
                    Logger.Warn("Missing button mesh with name: " + buttonMeshName);
                    continue;
                }
                buttonMap.valueMesh = this._getImmediateChildByName(buttonMesh, this._mapping.defaultButton.valueNodeName);
                buttonMap.pressedMesh = this._getImmediateChildByName(buttonMesh, this._mapping.defaultButton.pressedNodeName);
                buttonMap.unpressedMesh = this._getImmediateChildByName(buttonMesh, this._mapping.defaultButton.unpressedNodeName);
                if (buttonMap.valueMesh && buttonMap.pressedMesh && buttonMap.unpressedMesh) {
                    const comp = this.getComponent(id);
                    if (comp) {
                        comp.onButtonStateChangedObservable.add((component) => {
                            this._lerpTransform(buttonMap, component.value);
                        }, undefined, true);
                    }
                }
                else {
                    // If we didn't find the mesh, it simply means this button won't have transforms applied as mapped button value changes.
                    Logger.Warn("Missing button submesh under mesh with name: " + buttonMeshName);
                }
            }
        }
        // Axis Meshes
        for (const id of ids) {
            const comp = this.getComponent(id);
            if (!comp.isAxes()) {
                continue;
            }
            const axisArray = ["x-axis", "y-axis"];
            for (const axis of axisArray) {
                if (!this.rootMesh) {
                    continue;
                }
                const axisMap = this._mapping.axes[id][axis];
                const axisMesh = this._getChildByName(this.rootMesh, axisMap.rootNodeName);
                if (!axisMesh) {
                    Logger.Warn("Missing axis mesh with name: " + axisMap.rootNodeName);
                    continue;
                }
                axisMap.valueMesh = this._getImmediateChildByName(axisMesh, this._mapping.defaultAxis.valueNodeName);
                axisMap.minMesh = this._getImmediateChildByName(axisMesh, this._mapping.defaultAxis.minNodeName);
                axisMap.maxMesh = this._getImmediateChildByName(axisMesh, this._mapping.defaultAxis.maxNodeName);
                if (axisMap.valueMesh && axisMap.minMesh && axisMap.maxMesh) {
                    if (comp) {
                        comp.onAxisValueChangedObservable.add((axisValues) => {
                            const value = axis === "x-axis" ? axisValues.x : axisValues.y;
                            this._lerpTransform(axisMap, value, true);
                        }, undefined, true);
                    }
                }
                else {
                    // If we didn't find the mesh, it simply means this button won't have transforms applied as mapped button value changes.
                    Logger.Warn("Missing axis submesh under mesh with name: " + axisMap.rootNodeName);
                }
            }
        }
    }
    _setRootMesh(meshes) {
        this.rootMesh = new Mesh(this.profileId + " " + this.handedness, this.scene);
        this.rootMesh.isPickable = false;
        let rootMesh;
        // Find the root node in the loaded glTF scene, and attach it as a child of 'parentMesh'
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            mesh.isPickable = false;
            if (!mesh.parent) {
                // Handle root node, attach to the new parentMesh
                rootMesh = mesh;
            }
        }
        if (rootMesh) {
            rootMesh.setParent(this.rootMesh);
        }
        if (!this.scene.useRightHandedSystem) {
            this.rootMesh.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);
        }
    }
    _updateModel() {
        // no-op. model is updated using observables.
    }
}
/**
 * The base url used to load the left and right controller models
 */
WebXRMicrosoftMixedRealityController.MODEL_BASE_URL = "https://controllers.babylonjs.com/microsoft/";
/**
 * The name of the left controller model file
 */
WebXRMicrosoftMixedRealityController.MODEL_LEFT_FILENAME = "left.glb";
/**
 * The name of the right controller model file
 */
WebXRMicrosoftMixedRealityController.MODEL_RIGHT_FILENAME = "right.glb";
// https://github.com/immersive-web/webxr-input-profiles/blob/master/packages/registry/profiles/microsoft/microsoft-mixed-reality.json
const MixedRealityProfile = {
    left: {
        selectComponentId: "xr-standard-trigger",
        components: {
            "xr-standard-trigger": {
                type: "trigger",
                gamepadIndices: {
                    button: 0,
                },
                rootNodeName: "xr_standard_trigger",
                visualResponses: {
                    xr_standard_trigger_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_trigger_pressed_value",
                        minNodeName: "xr_standard_trigger_pressed_min",
                        maxNodeName: "xr_standard_trigger_pressed_max",
                    },
                },
            },
            "xr-standard-squeeze": {
                type: "squeeze",
                gamepadIndices: {
                    button: 1,
                },
                rootNodeName: "xr_standard_squeeze",
                visualResponses: {
                    xr_standard_squeeze_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_squeeze_pressed_value",
                        minNodeName: "xr_standard_squeeze_pressed_min",
                        maxNodeName: "xr_standard_squeeze_pressed_max",
                    },
                },
            },
            "xr-standard-touchpad": {
                type: "touchpad",
                gamepadIndices: {
                    button: 2,
                    xAxis: 0,
                    yAxis: 1,
                },
                rootNodeName: "xr_standard_touchpad",
                visualResponses: {
                    xr_standard_touchpad_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_pressed_value",
                        minNodeName: "xr_standard_touchpad_pressed_min",
                        maxNodeName: "xr_standard_touchpad_pressed_max",
                    },
                    xr_standard_touchpad_xaxis_pressed: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_xaxis_pressed_value",
                        minNodeName: "xr_standard_touchpad_xaxis_pressed_min",
                        maxNodeName: "xr_standard_touchpad_xaxis_pressed_max",
                    },
                    xr_standard_touchpad_yaxis_pressed: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_yaxis_pressed_value",
                        minNodeName: "xr_standard_touchpad_yaxis_pressed_min",
                        maxNodeName: "xr_standard_touchpad_yaxis_pressed_max",
                    },
                    xr_standard_touchpad_xaxis_touched: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_xaxis_touched_value",
                        minNodeName: "xr_standard_touchpad_xaxis_touched_min",
                        maxNodeName: "xr_standard_touchpad_xaxis_touched_max",
                    },
                    xr_standard_touchpad_yaxis_touched: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_yaxis_touched_value",
                        minNodeName: "xr_standard_touchpad_yaxis_touched_min",
                        maxNodeName: "xr_standard_touchpad_yaxis_touched_max",
                    },
                    xr_standard_touchpad_axes_touched: {
                        componentProperty: "state",
                        states: ["touched", "pressed"],
                        valueNodeProperty: "visibility",
                        valueNodeName: "xr_standard_touchpad_axes_touched_value",
                    },
                },
                touchPointNodeName: "xr_standard_touchpad_axes_touched_value",
            },
            "xr-standard-thumbstick": {
                type: "thumbstick",
                gamepadIndices: {
                    button: 3,
                    xAxis: 2,
                    yAxis: 3,
                },
                rootNodeName: "xr_standard_thumbstick",
                visualResponses: {
                    xr_standard_thumbstick_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_pressed_value",
                        minNodeName: "xr_standard_thumbstick_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_pressed_max",
                    },
                    xr_standard_thumbstick_xaxis_pressed: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_xaxis_pressed_value",
                        minNodeName: "xr_standard_thumbstick_xaxis_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_xaxis_pressed_max",
                    },
                    xr_standard_thumbstick_yaxis_pressed: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_yaxis_pressed_value",
                        minNodeName: "xr_standard_thumbstick_yaxis_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_yaxis_pressed_max",
                    },
                },
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "microsoft-mixed-reality-left",
        assetPath: "left.glb",
    },
    right: {
        selectComponentId: "xr-standard-trigger",
        components: {
            "xr-standard-trigger": {
                type: "trigger",
                gamepadIndices: {
                    button: 0,
                },
                rootNodeName: "xr_standard_trigger",
                visualResponses: {
                    xr_standard_trigger_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_trigger_pressed_value",
                        minNodeName: "xr_standard_trigger_pressed_min",
                        maxNodeName: "xr_standard_trigger_pressed_max",
                    },
                },
            },
            "xr-standard-squeeze": {
                type: "squeeze",
                gamepadIndices: {
                    button: 1,
                },
                rootNodeName: "xr_standard_squeeze",
                visualResponses: {
                    xr_standard_squeeze_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_squeeze_pressed_value",
                        minNodeName: "xr_standard_squeeze_pressed_min",
                        maxNodeName: "xr_standard_squeeze_pressed_max",
                    },
                },
            },
            "xr-standard-touchpad": {
                type: "touchpad",
                gamepadIndices: {
                    button: 2,
                    xAxis: 0,
                    yAxis: 1,
                },
                rootNodeName: "xr_standard_touchpad",
                visualResponses: {
                    xr_standard_touchpad_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_pressed_value",
                        minNodeName: "xr_standard_touchpad_pressed_min",
                        maxNodeName: "xr_standard_touchpad_pressed_max",
                    },
                    xr_standard_touchpad_xaxis_pressed: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_xaxis_pressed_value",
                        minNodeName: "xr_standard_touchpad_xaxis_pressed_min",
                        maxNodeName: "xr_standard_touchpad_xaxis_pressed_max",
                    },
                    xr_standard_touchpad_yaxis_pressed: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_yaxis_pressed_value",
                        minNodeName: "xr_standard_touchpad_yaxis_pressed_min",
                        maxNodeName: "xr_standard_touchpad_yaxis_pressed_max",
                    },
                    xr_standard_touchpad_xaxis_touched: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_xaxis_touched_value",
                        minNodeName: "xr_standard_touchpad_xaxis_touched_min",
                        maxNodeName: "xr_standard_touchpad_xaxis_touched_max",
                    },
                    xr_standard_touchpad_yaxis_touched: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_touchpad_yaxis_touched_value",
                        minNodeName: "xr_standard_touchpad_yaxis_touched_min",
                        maxNodeName: "xr_standard_touchpad_yaxis_touched_max",
                    },
                    xr_standard_touchpad_axes_touched: {
                        componentProperty: "state",
                        states: ["touched", "pressed"],
                        valueNodeProperty: "visibility",
                        valueNodeName: "xr_standard_touchpad_axes_touched_value",
                    },
                },
                touchPointNodeName: "xr_standard_touchpad_axes_touched_value",
            },
            "xr-standard-thumbstick": {
                type: "thumbstick",
                gamepadIndices: {
                    button: 3,
                    xAxis: 2,
                    yAxis: 3,
                },
                rootNodeName: "xr_standard_thumbstick",
                visualResponses: {
                    xr_standard_thumbstick_pressed: {
                        componentProperty: "button",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_pressed_value",
                        minNodeName: "xr_standard_thumbstick_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_pressed_max",
                    },
                    xr_standard_thumbstick_xaxis_pressed: {
                        componentProperty: "xAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_xaxis_pressed_value",
                        minNodeName: "xr_standard_thumbstick_xaxis_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_xaxis_pressed_max",
                    },
                    xr_standard_thumbstick_yaxis_pressed: {
                        componentProperty: "yAxis",
                        states: ["default", "touched", "pressed"],
                        valueNodeProperty: "transform",
                        valueNodeName: "xr_standard_thumbstick_yaxis_pressed_value",
                        minNodeName: "xr_standard_thumbstick_yaxis_pressed_min",
                        maxNodeName: "xr_standard_thumbstick_yaxis_pressed_max",
                    },
                },
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "microsoft-mixed-reality-right",
        assetPath: "right.glb",
    },
};
let _Registered = false;
/**
 * Register side effects for webXRMicrosoftMixedRealityController.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRMicrosoftMixedRealityController() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // register the profile
    WebXRMotionControllerManager.RegisterController("windows-mixed-reality", (xrInput, scene) => {
        return new WebXRMicrosoftMixedRealityController(scene, xrInput.gamepad, xrInput.handedness);
    });
}
//# sourceMappingURL=webXRMicrosoftMixedRealityController.pure.js.map
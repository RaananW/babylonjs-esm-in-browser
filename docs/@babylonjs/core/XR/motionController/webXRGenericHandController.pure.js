/** This file must only contain pure code and pure imports */
import { WebXRAbstractMotionController, } from "./webXRAbstractMotionController.js";
import { WebXRMotionControllerManager } from "./webXRMotionControllerManager.pure.js";
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * A generic hand controller class that supports select and a secondary grasp
 */
export class WebXRGenericHandController extends WebXRAbstractMotionController {
    /**
     * Create a new hand controller object, without loading a controller model
     * @param scene the scene to use to create this controller
     * @param gamepadObject the corresponding gamepad object
     * @param handedness the handedness of the controller
     */
    constructor(scene, gamepadObject, handedness) {
        // Don't load the controller model - for now, hands have no real model.
        super(scene, GenericHandSelectGraspProfile[handedness], gamepadObject, handedness, true);
        this.profileId = "generic-hand-select-grasp";
    }
    _getFilenameAndPath() {
        return {
            filename: "generic.babylon",
            path: "https://controllers.babylonjs.com/generic/",
        };
    }
    _getModelLoadingConstraints() {
        return true;
    }
    _processLoadedModel(_meshes) {
        // no-op
    }
    _setRootMesh(meshes) {
        // no-op
    }
    _updateModel() {
        // no-op
    }
}
// https://github.com/immersive-web/webxr-input-profiles/blob/main/packages/registry/profiles/generic/generic-hand-select-grasp.json
const GenericHandSelectGraspProfile = {
    left: {
        selectComponentId: "xr-standard-trigger",
        components: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "xr-standard-trigger": {
                type: "trigger",
                gamepadIndices: {
                    button: 0,
                },
                rootNodeName: "xr-standard-trigger",
                visualResponses: {},
            },
            grasp: {
                type: "trigger",
                gamepadIndices: {
                    button: 4,
                },
                rootNodeName: "grasp",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "generic-hand-select-grasp-left",
        assetPath: "left.glb",
    },
    right: {
        selectComponentId: "xr-standard-trigger",
        components: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "xr-standard-trigger": {
                type: "trigger",
                gamepadIndices: {
                    button: 0,
                },
                rootNodeName: "xr-standard-trigger",
                visualResponses: {},
            },
            grasp: {
                type: "trigger",
                gamepadIndices: {
                    button: 4,
                },
                rootNodeName: "grasp",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "generic-hand-select-grasp-right",
        assetPath: "right.glb",
    },
    none: {
        selectComponentId: "xr-standard-trigger",
        components: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "xr-standard-trigger": {
                type: "trigger",
                gamepadIndices: {
                    button: 0,
                },
                rootNodeName: "xr-standard-trigger",
                visualResponses: {},
            },
            grasp: {
                type: "trigger",
                gamepadIndices: {
                    button: 4,
                },
                rootNodeName: "grasp",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "generic-hand-select-grasp-none",
        assetPath: "none.glb",
    },
};
let _Registered = false;
/**
 * Register side effects for webXRGenericHandController.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRGenericHandController() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // register the profiles
    WebXRMotionControllerManager.RegisterController("generic-hand-select-grasp", (xrInput, scene) => {
        return new WebXRGenericHandController(scene, xrInput.gamepad, xrInput.handedness);
    });
}
//# sourceMappingURL=webXRGenericHandController.pure.js.map
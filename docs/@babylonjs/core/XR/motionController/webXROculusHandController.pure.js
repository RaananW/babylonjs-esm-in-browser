/** This file must only contain pure code and pure imports */
import { WebXRAbstractMotionController, } from "./webXRAbstractMotionController.js";
import { WebXRMotionControllerManager } from "./webXRMotionControllerManager.pure.js";
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Oculus hand controller class that supports microgestures
 */
export class WebXROculusHandController extends WebXRAbstractMotionController {
    /**
     * Create a new hand controller object, without loading a controller model
     * @param scene the scene to use to create this controller
     * @param gamepadObject the corresponding gamepad object
     * @param handedness the handedness of the controller
     */
    constructor(scene, gamepadObject, handedness) {
        // Don't load the controller model - for now, hands have no real model.
        super(scene, OculusHandProfile[handedness], gamepadObject, handedness, true);
        this.profileId = "oculus-hand";
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
// https://github.com/immersive-web/webxr-input-profiles/blob/main/packages/registry/profiles/oculus/oculus-hand.json
const OculusHandProfile = {
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
            menu: {
                type: "button",
                gamepadIndices: {
                    button: 4,
                },
                rootNodeName: "menu",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-left": {
                type: "button",
                gamepadIndices: {
                    button: 5,
                },
                rootNodeName: "swipe-left",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-right": {
                type: "button",
                gamepadIndices: {
                    button: 6,
                },
                rootNodeName: "swipe-right",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-forward": {
                type: "button",
                gamepadIndices: {
                    button: 7,
                },
                rootNodeName: "swipe-forward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-backward": {
                type: "button",
                gamepadIndices: {
                    button: 8,
                },
                rootNodeName: "swipe-backward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "tap-thumb": {
                type: "button",
                gamepadIndices: {
                    button: 9,
                },
                rootNodeName: "tap-thumb",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "oculus-hand-left",
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-left": {
                type: "button",
                gamepadIndices: {
                    button: 5,
                },
                rootNodeName: "swipe-left",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-right": {
                type: "button",
                gamepadIndices: {
                    button: 6,
                },
                rootNodeName: "swipe-right",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-forward": {
                type: "button",
                gamepadIndices: {
                    button: 7,
                },
                rootNodeName: "swipe-forward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-backward": {
                type: "button",
                gamepadIndices: {
                    button: 8,
                },
                rootNodeName: "swipe-backward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "tap-thumb": {
                type: "button",
                gamepadIndices: {
                    button: 9,
                },
                rootNodeName: "tap-thumb",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "oculus-hand-right",
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
            menu: {
                type: "button",
                gamepadIndices: {
                    button: 4,
                },
                rootNodeName: "menu",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-left": {
                type: "button",
                gamepadIndices: {
                    button: 5,
                },
                rootNodeName: "swipe-left",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-right": {
                type: "button",
                gamepadIndices: {
                    button: 6,
                },
                rootNodeName: "swipe-right",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-forward": {
                type: "button",
                gamepadIndices: {
                    button: 7,
                },
                rootNodeName: "swipe-forward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "swipe-backward": {
                type: "button",
                gamepadIndices: {
                    button: 8,
                },
                rootNodeName: "swipe-backward",
                visualResponses: {},
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "tap-thumb": {
                type: "button",
                gamepadIndices: {
                    button: 9,
                },
                rootNodeName: "tap-thumb",
                visualResponses: {},
            },
        },
        gamepadMapping: "xr-standard",
        rootNodeName: "oculus-hand-none",
        assetPath: "none.glb",
    },
};
let _Registered = false;
/**
 * Register side effects for webXROculusHandController.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXROculusHandController() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // register the profiles
    WebXRMotionControllerManager.RegisterController("oculus-hand", (xrInput, scene) => {
        return new WebXROculusHandController(scene, xrInput.gamepad, xrInput.handedness);
    });
}
//# sourceMappingURL=webXROculusHandController.pure.js.map
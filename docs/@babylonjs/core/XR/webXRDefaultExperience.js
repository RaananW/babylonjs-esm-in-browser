import { WebXRExperienceHelper } from "./webXRExperienceHelper.js";
import { WebXRInput } from "./webXRInput.js";
import { RegisterWebXRControllerPointerSelection, WebXRControllerPointerSelection, } from "./features/WebXRControllerPointerSelection.pure.js";
import { RegisterWebXRNearInteraction, WebXRNearInteraction } from "./features/WebXRNearInteraction.pure.js";
import { WebXREnterExitUI } from "./webXREnterExitUI.js";
import { RegisterWebXRControllerTeleportation, WebXRMotionControllerTeleportation } from "./features/WebXRControllerTeleportation.pure.js";
import { RegisterWebXRHandTracking, WebXRHandTracking } from "./features/WebXRHandTracking.pure.js";
import { Logger } from "../Misc/logger.js";
/**
 * Options for the default xr helper
 */
export class WebXRDefaultExperienceOptions {
}
/**
 * Default experience for webxr
 */
export class WebXRDefaultExperience {
    constructor() { }
    /**
     * Creates the default xr experience
     * @param scene scene
     * @param options options for basic configuration
     * @returns resulting WebXRDefaultExperience
     */
    static async CreateAsync(scene, options = {}) {
        RegisterWebXRControllerPointerSelection();
        RegisterWebXRControllerTeleportation();
        RegisterWebXRNearInteraction();
        RegisterWebXRHandTracking();
        const result = new WebXRDefaultExperience();
        scene.onDisposeObservable.addOnce(() => {
            result.dispose();
        });
        // init the UI right after construction
        if (!options.disableDefaultUI) {
            const uiOptions = {
                renderTarget: result.renderTarget,
                ...(options.uiOptions || {}),
            };
            if (options.optionalFeatures) {
                if (typeof options.optionalFeatures === "boolean") {
                    uiOptions.optionalFeatures = ["hit-test", "anchors", "plane-detection", "hand-tracking"];
                }
                else {
                    uiOptions.optionalFeatures = options.optionalFeatures;
                }
            }
            result.enterExitUI = new WebXREnterExitUI(scene, uiOptions);
        }
        try {
            // Create base experience
            const xrHelper = await WebXRExperienceHelper.CreateAsync(scene);
            // eslint-disable-next-line require-atomic-updates
            result.baseExperience = xrHelper;
            if (options.ignoreNativeCameraTransformation) {
                // eslint-disable-next-line require-atomic-updates
                result.baseExperience.camera.compensateOnFirstFrame = false;
            }
            // Add controller support
            // eslint-disable-next-line require-atomic-updates
            result.input = new WebXRInput(xrHelper.sessionManager, xrHelper.camera, {
                controllerOptions: {
                    renderingGroupId: options.renderingGroupId,
                },
                ...(options.inputOptions || {}),
            });
            if (!options.disablePointerSelection) {
                // Add default pointer selection
                const pointerSelectionOptions = {
                    ...options.pointerSelectionOptions,
                    xrInput: result.input,
                    renderingGroupId: options.renderingGroupId,
                };
                result.pointerSelection = result.baseExperience.featuresManager.enableFeature(WebXRControllerPointerSelection.Name, options.useStablePlugins ? "stable" : "latest", pointerSelectionOptions);
                if (!options.disableTeleportation) {
                    // Add default teleportation, including rotation
                    result.teleportation = result.baseExperience.featuresManager.enableFeature(WebXRMotionControllerTeleportation.Name, options.useStablePlugins ? "stable" : "latest", {
                        floorMeshes: options.floorMeshes,
                        xrInput: result.input,
                        renderingGroupId: options.renderingGroupId,
                        ...options.teleportationOptions,
                    });
                    result.teleportation.setSelectionFeature(result.pointerSelection);
                }
            }
            if (!options.disableNearInteraction) {
                // Add default pointer selection
                result.nearInteraction = result.baseExperience.featuresManager.enableFeature(WebXRNearInteraction.Name, options.useStablePlugins ? "stable" : "latest", {
                    xrInput: result.input,
                    farInteractionFeature: result.pointerSelection,
                    renderingGroupId: options.renderingGroupId,
                    useUtilityLayer: true,
                    enableNearInteractionOnAllControllers: true,
                    ...options.nearInteractionOptions,
                });
            }
            if (!options.disableHandTracking) {
                // Add default hand tracking
                result.baseExperience.featuresManager.enableFeature(WebXRHandTracking.Name, options.useStablePlugins ? "stable" : "latest", {
                    xrInput: result.input,
                    ...options.handSupportOptions,
                }, undefined, false);
            }
            // Create the WebXR output target
            result.renderTarget = result.baseExperience.sessionManager.getWebXRRenderTarget(options.outputCanvasOptions);
            if (!options.disableDefaultUI) {
                // Create ui for entering/exiting xr
                await result.enterExitUI.setHelperAsync(result.baseExperience, result.renderTarget);
            }
            return result;
        }
        catch (error) {
            Logger.Error("Error initializing XR");
            Logger.Error(error);
            return result;
        }
    }
    /**
     * Disposes of the experience helper
     */
    dispose() {
        if (this.baseExperience) {
            this.baseExperience.dispose();
        }
        if (this.input) {
            this.input.dispose();
        }
        if (this.enterExitUI) {
            this.enterExitUI.dispose();
        }
        if (this.renderTarget) {
            this.renderTarget.dispose();
        }
    }
}
//# sourceMappingURL=webXRDefaultExperience.js.map
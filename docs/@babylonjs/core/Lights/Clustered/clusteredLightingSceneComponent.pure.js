/** This file must only contain pure code and pure imports */
import { SceneComponentConstants } from "../../sceneComponent.js";
import { LightConstants } from "../lightConstants.js";
/**
 * A scene component required for running the clustering step in clustered lights
 */
export class ClusteredLightingSceneComponent {
    /**
     * Creates a new scene component.
     * @param scene The scene the component belongs to
     */
    constructor(scene) {
        /**
         * The name of the component. Each component must have a unique name.
         */
        this.name = SceneComponentConstants.NAME_CLUSTEREDLIGHTING;
        this._gatherActiveCameraRenderTargets = (renderTargets) => {
            for (const light of this.scene.lights) {
                if (light.getTypeID() === LightConstants.LIGHTTYPEID_CLUSTERED_CONTAINER && light.isSupported) {
                    renderTargets.push(light._updateBatches());
                }
            }
        };
        this.scene = scene;
    }
    /**
     * Disposes the component and the associated resources.
     */
    dispose() { }
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild() { }
    /**
     * Register the component to one instance of a scene.
     */
    register() {
        this.scene._gatherActiveCameraRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERACTIVECAMERARENDERTARGETS_CLUSTEREDLIGHTING, this, this._gatherActiveCameraRenderTargets);
    }
}
let _Registered = false;
/**
 * Register side effects for clusteredLightingSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param clusteredLightContainerClass The ClusteredLightContainer class to register the component for
 */
export function RegisterClusteredLightingSceneComponent(clusteredLightContainerClass) {
    if (_Registered) {
        return;
    }
    _Registered = true;
    clusteredLightContainerClass._SceneComponentInitialization = (scene) => {
        if (!scene._getComponent(SceneComponentConstants.NAME_CLUSTEREDLIGHTING)) {
            scene._addComponent(new ClusteredLightingSceneComponent(scene));
        }
    };
}
//# sourceMappingURL=clusteredLightingSceneComponent.pure.js.map
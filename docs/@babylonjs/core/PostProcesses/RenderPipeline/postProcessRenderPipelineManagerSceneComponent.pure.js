/** This file must only contain pure code and pure imports */
import { SceneComponentConstants } from "../../sceneComponent.js";
import { Scene } from "../../scene.pure.js";
let _PostProcessRenderPipelineManagerClass;
/**
 * Defines the Render Pipeline scene component responsible to rendering pipelines
 */
export class PostProcessRenderPipelineManagerSceneComponent {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene) {
        /**
         * The component name helpful to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_POSTPROCESSRENDERPIPELINEMANAGER;
        this.scene = scene;
    }
    /**
     * Registers the component in a given scene
     */
    register() {
        this.scene._gatherRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERRENDERTARGETS_POSTPROCESSRENDERPIPELINEMANAGER, this, this._gatherRenderTargets);
    }
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild() {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager._rebuild();
        }
    }
    /**
     * Disposes the component and the associated resources
     */
    dispose() {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager.dispose();
        }
    }
    _gatherRenderTargets() {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager.update();
        }
    }
}
let _Registered = false;
/**
 * Register side effects for postProcessRenderPipelineManagerSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param pipelineManagerClass The PostProcessRenderPipelineManager class to use for lazy instantiation
 */
export function RegisterPostProcessRenderPipelineManagerSceneComponent(pipelineManagerClass) {
    if (pipelineManagerClass) {
        _PostProcessRenderPipelineManagerClass = pipelineManagerClass;
    }
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(Scene.prototype, "postProcessRenderPipelineManager", {
        get: function () {
            if (!this._postProcessRenderPipelineManager) {
                // Register the G Buffer component to the scene.
                let component = this._getComponent(SceneComponentConstants.NAME_POSTPROCESSRENDERPIPELINEMANAGER);
                if (!component) {
                    component = new PostProcessRenderPipelineManagerSceneComponent(this);
                    this._addComponent(component);
                }
                this._postProcessRenderPipelineManager = new _PostProcessRenderPipelineManagerClass();
            }
            return this._postProcessRenderPipelineManager;
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=postProcessRenderPipelineManagerSceneComponent.pure.js.map
/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { SceneComponentConstants } from "../sceneComponent.js";

/**
 * Defines the Geometry Buffer scene component responsible to manage a G-Buffer useful
 * in several rendering techniques.
 */
export class GeometryBufferRendererSceneComponent {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene) {
        /**
         * The component name helpful to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_GEOMETRYBUFFERRENDERER;
        this.scene = scene;
    }
    /**
     * Registers the component in a given scene
     */
    register() {
        this.scene._gatherRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERRENDERTARGETS_GEOMETRYBUFFERRENDERER, this, this._gatherRenderTargets);
    }
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild() {
        // Nothing to do for this component
    }
    /**
     * Disposes the component and the associated resources
     */
    dispose() {
        // Nothing to do for this component
    }
    _gatherRenderTargets(renderTargets) {
        if (this.scene._geometryBufferRenderer) {
            renderTargets.push(this.scene._geometryBufferRenderer.getGBuffer());
        }
    }
}
let _Registered = false;
/**
 * Register side effects for geometryBufferRendererSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param geometryBufferRendererClass The GeometryBufferRenderer class to register the component for
 */
export function RegisterGeometryBufferRendererSceneComponent(geometryBufferRendererClass) {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Object.defineProperty(Scene.prototype, "geometryBufferRenderer", {
        get: function () {
            return this._geometryBufferRenderer;
        },
        set: function (value) {
            if (value && value.isSupported) {
                this._geometryBufferRenderer = value;
            }
        },
        enumerable: true,
        configurable: true,
    });
    Scene.prototype.enableGeometryBufferRenderer = function (ratio = 1, depthFormat = 15, textureTypesAndFormats) {
        if (this._geometryBufferRenderer) {
            return this._geometryBufferRenderer;
        }
        this._geometryBufferRenderer = new geometryBufferRendererClass(this, ratio, depthFormat, textureTypesAndFormats);
        if (!this._geometryBufferRenderer.isSupported) {
            this._geometryBufferRenderer = null;
        }
        return this._geometryBufferRenderer;
    };
    Scene.prototype.disableGeometryBufferRenderer = function () {
        if (!this._geometryBufferRenderer) {
            return;
        }
        this._geometryBufferRenderer.dispose();
        this._geometryBufferRenderer = null;
    };
    geometryBufferRendererClass._SceneComponentInitialization = (scene) => {
        // Register the G Buffer component to the scene.
        let component = scene._getComponent(SceneComponentConstants.NAME_GEOMETRYBUFFERRENDERER);
        if (!component) {
            component = new GeometryBufferRendererSceneComponent(scene);
            scene._addComponent(component);
        }
    };
}
//# sourceMappingURL=geometryBufferRendererSceneComponent.pure.js.map
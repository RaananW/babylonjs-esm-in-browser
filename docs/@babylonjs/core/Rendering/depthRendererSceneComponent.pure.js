/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { SceneComponentConstants } from "../sceneComponent.js";

/**
 * Defines the Depth Renderer scene component responsible to manage a depth buffer useful
 * in several rendering techniques.
 */
export class DepthRendererSceneComponent {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene) {
        /**
         * The component name helpful to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_DEPTHRENDERER;
        this.scene = scene;
    }
    /**
     * Registers the component in a given scene
     */
    register() {
        this.scene._gatherRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERRENDERTARGETS_DEPTHRENDERER, this, this._gatherRenderTargets);
        this.scene._gatherActiveCameraRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERACTIVECAMERARENDERTARGETS_DEPTHRENDERER, this, this._gatherActiveCameraRenderTargets);
        this.scene._isReadyForMeshStage.registerStep(SceneComponentConstants.STEP_ISREADYFORMESH_DEPTHRENDERER, this, this._isReadyForMesh);
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
        for (const key in this.scene._depthRenderer) {
            this.scene._depthRenderer[key].dispose();
        }
    }
    _gatherRenderTargets(renderTargets) {
        if (this.scene._depthRenderer) {
            for (const key in this.scene._depthRenderer) {
                const depthRenderer = this.scene._depthRenderer[key];
                if (depthRenderer.enabled && !depthRenderer.useOnlyInActiveCamera) {
                    renderTargets.push(depthRenderer.getDepthMap());
                }
            }
        }
    }
    _isReadyForMesh(mesh, hardwareInstancedRendering) {
        if (!this.scene._depthRenderer) {
            return true;
        }
        for (const key in this.scene._depthRenderer) {
            const depthRenderer = this.scene._depthRenderer[key];
            if (!depthRenderer.enabled) {
                continue;
            }
            if (mesh.subMeshes) {
                for (let i = 0; i < mesh.subMeshes.length; ++i) {
                    const subMesh = mesh.subMeshes[i];
                    const material = subMesh.getMaterial();
                    // Skip submeshes that the depth renderer would never render
                    if (!material || material.disableDepthWrite || subMesh.verticesCount === 0) {
                        continue;
                    }
                    if (!depthRenderer.isReady(subMesh, hardwareInstancedRendering)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    _gatherActiveCameraRenderTargets(renderTargets) {
        if (this.scene._depthRenderer) {
            for (const key in this.scene._depthRenderer) {
                const depthRenderer = this.scene._depthRenderer[key];
                if (depthRenderer.enabled && depthRenderer.useOnlyInActiveCamera && `${this.scene.activeCamera.uniqueId}` === key) {
                    renderTargets.push(depthRenderer.getDepthMap());
                }
            }
        }
    }
}
let _Registered = false;
/**
 * Register side effects for depthRendererSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 * @param depthRendererClass The DepthRenderer class to register the component for
 */
export function RegisterDepthRendererSceneComponent(depthRendererClass) {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Scene.prototype.enableDepthRenderer = function (camera, storeNonLinearDepth = false, force32bitsFloat = false, samplingMode = 3, storeCameraSpaceZ = false, existingRenderTargetTexture) {
        camera = camera || this.activeCamera;
        if (!camera) {
            // eslint-disable-next-line no-throw-literal
            throw "No camera available to enable depth renderer";
        }
        if (!this._depthRenderer) {
            this._depthRenderer = {};
        }
        if (!this._depthRenderer[camera.uniqueId]) {
            const supportFullfloat = !!this.getEngine().getCaps().textureFloatRender;
            let textureType;
            if (this.getEngine().getCaps().textureHalfFloatRender && (!force32bitsFloat || !supportFullfloat)) {
                textureType = 2;
            }
            else if (supportFullfloat) {
                textureType = 1;
            }
            else {
                textureType = 0;
            }
            this._depthRenderer[camera.uniqueId] = new depthRendererClass(this, textureType, camera, storeNonLinearDepth, samplingMode, storeCameraSpaceZ, undefined, existingRenderTargetTexture);
        }
        return this._depthRenderer[camera.uniqueId];
    };
    Scene.prototype.disableDepthRenderer = function (camera) {
        camera = camera || this.activeCamera;
        if (!camera || !this._depthRenderer || !this._depthRenderer[camera.uniqueId]) {
            return;
        }
        this._depthRenderer[camera.uniqueId].dispose();
    };
    depthRendererClass._SceneComponentInitialization = (scene) => {
        // Register the G Buffer component to the scene.
        let component = scene._getComponent(SceneComponentConstants.NAME_DEPTHRENDERER);
        if (!component) {
            component = new DepthRendererSceneComponent(scene);
            scene._addComponent(component);
        }
    };
}
//# sourceMappingURL=depthRendererSceneComponent.pure.js.map
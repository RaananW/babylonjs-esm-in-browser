
import { DepthRenderer } from "../Rendering/depthRenderer.js";
import { MinMaxReducer } from "./minMaxReducer.js";
/**
 * This class is a small wrapper around the MinMaxReducer class to compute the min/max values of a depth texture
 */
export class DepthReducer extends MinMaxReducer {
    /**
     * Creates a depth reducer
     * @param camera The camera used to render the depth texture
     */
    constructor(camera) {
        super(camera);
    }
    /**
     * Gets the depth renderer used for the computation.
     * Note that the result is null if you provide your own renderer when calling setDepthRenderer.
     */
    get depthRenderer() {
        return this._depthRenderer;
    }
    /**
     * Sets the depth renderer to use to generate the depth map
     * @param depthRenderer The depth renderer to use. If not provided, a new one will be created automatically
     * @param type The texture type of the depth map (default: TEXTURETYPE_HALF_FLOAT)
     * @param forceFullscreenViewport Forces the post processes used for the reduction to be applied without taking into account viewport (defaults to true)
     */
    setDepthRenderer(depthRenderer = null, type = 2, forceFullscreenViewport = true) {
        const scene = this._camera.getScene();
        if (this._depthRenderer) {
            delete scene._depthRenderer[this._depthRendererId];
            this._depthRenderer.dispose();
            this._depthRenderer = null;
        }
        if (depthRenderer === null) {
            if (!scene._depthRenderer) {
                scene._depthRenderer = {};
            }
            depthRenderer = this._depthRenderer = new DepthRenderer(scene, type, this._camera, false, 1);
            depthRenderer.enabled = false;
            this._depthRendererId = "minmax" + this._camera.id;
            scene._depthRenderer[this._depthRendererId] = depthRenderer;
        }
        super.setSourceTexture(depthRenderer.getDepthMap(), true, type, forceFullscreenViewport);
    }
    /**
     * @internal
     */
    setSourceTexture(sourceTexture, depthRedux, type = 2, forceFullscreenViewport = true) {
        super.setSourceTexture(sourceTexture, depthRedux, type, forceFullscreenViewport);
    }
    /**
     * Activates the reduction computation.
     * When activated, the observers registered in onAfterReductionPerformed are
     * called after the computation is performed
     */
    activate() {
        if (this._depthRenderer) {
            this._depthRenderer.enabled = true;
        }
        super.activate();
    }
    /**
     * Deactivates the reduction computation.
     */
    deactivate() {
        super.deactivate();
        if (this._depthRenderer) {
            this._depthRenderer.enabled = false;
        }
    }
    /**
     * Disposes the depth reducer
     * @param disposeAll true to dispose all the resources. You should always call this function with true as the parameter (or without any parameter as it is the default one). This flag is meant to be used internally.
     */
    dispose(disposeAll = true) {
        super.dispose(disposeAll);
        if (this._depthRenderer && disposeAll) {
            const scene = this._depthRenderer.getDepthMap().getScene();
            if (scene) {
                delete scene._depthRenderer[this._depthRendererId];
            }
            this._depthRenderer.dispose();
            this._depthRenderer = null;
        }
    }
}
//# sourceMappingURL=depthReducer.js.map
import { ThinSelectionOutlineLayer } from "../../../Layers/thinSelectionOutlineLayer.js";
import { FrameGraphBaseLayerTask } from "./baseLayerTask.js";
/**
 * Task which applies a selection outline effect to a texture.
 */
export class FrameGraphSelectionOutlineLayerTask extends FrameGraphBaseLayerTask {
    /**
     * Constructs a new selection outline layer task.
     * @param name Name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param scene The scene to render the selection outline layer in.
     * @param options Options for the selection outline layer.
     */
    constructor(name, frameGraph, scene, options) {
        super(name, frameGraph, scene, new ThinSelectionOutlineLayer(name, scene, options, true), 0, "none" /* FrameGraphBaseLayerBlurType.None */, false, false, false);
        this._objectRendererForLayerTask.objectList = {
            meshes: this.layer._selection || [],
            particleSystems: [],
        };
    }
    getClassName() {
        return "FrameGraphSelectionOutlineLayerTask";
    }
    record() {
        const useDepthOcclusion = this.layer.useDepthOcclusion && this.layer.occlusionStrength > 0;
        if (useDepthOcclusion && this.depthTexture === undefined) {
            throw new Error(`FrameGraphSelectionOutlineLayerTask "${this.name}": depthTexture is required`);
        }
        super.record(false, (context, effect) => {
            context.bindTextureHandle(effect, "maskSampler", this._objectRendererForLayerTask.outputTexture);
            if (useDepthOcclusion) {
                context.bindTextureHandle(effect, "depthSampler", this.depthTexture);
            }
        });
        this.layer.textureWidth = this._layerTextureDimensions.width;
        this.layer.textureHeight = this._layerTextureDimensions.height;
    }
}
//# sourceMappingURL=selectionOutlineTask.js.map
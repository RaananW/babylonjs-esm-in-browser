import { type FrameGraph, type Scene, type IThinSelectionOutlineLayerOptions, type FrameGraphTextureHandle } from "../../../index.js";
import { ThinSelectionOutlineLayer } from "../../../Layers/thinSelectionOutlineLayer.js";
import { FrameGraphBaseLayerTask } from "./baseLayerTask.js";
/**
 * Task which applies a selection outline effect to a texture.
 */
export declare class FrameGraphSelectionOutlineLayerTask extends FrameGraphBaseLayerTask {
    /**
     * The selection outline layer object. Use this object to update the selection outline layer properties (e.g. intensity, blur kernel size).
     */
    readonly layer: ThinSelectionOutlineLayer;
    /**
     * The depth texture to use when rendering the selection outline layer.
     * It must store the scene depth in camera view space Z, normalized or not.
     * If not normalized, the storeCameraSpaceZ option must be passed to the constructor.
     * Required only when layer.useDepthOcclusion is true and layer.occlusionStrength is greater than zero.
     */
    depthTexture: FrameGraphTextureHandle | undefined;
    /**
     * Constructs a new selection outline layer task.
     * @param name Name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param scene The scene to render the selection outline layer in.
     * @param options Options for the selection outline layer.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, options?: IThinSelectionOutlineLayerOptions);
    getClassName(): string;
    record(): void;
}

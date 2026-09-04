import { type FrameGraph, type Scene, type IThinGlowLayerOptions } from "../../../index.js";
import { ThinGlowLayer } from "../../../Layers/thinGlowLayer.js";
import { FrameGraphBaseLayerTask } from "./baseLayerTask.js";
/**
 * Task which applies a glowing effect to a texture.
 */
export declare class FrameGraphGlowLayerTask extends FrameGraphBaseLayerTask {
    /**
     * The glow layer object. Use this object to update the glow layer properties (e.g. intensity, blur kernel size).
     */
    readonly layer: ThinGlowLayer;
    /**
     * Constructs a new glow layer task.
     * @param name Name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param scene The scene to render the glow layer in.
     * @param options Options for the glow layer.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, options?: IThinGlowLayerOptions);
    getClassName(): string;
}

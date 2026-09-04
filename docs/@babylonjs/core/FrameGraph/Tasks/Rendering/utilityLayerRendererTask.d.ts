import { type Camera, type FrameGraph, type FrameGraphTextureHandle, type Scene } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
import { UtilityLayerRenderer } from "../../../Rendering/utilityLayerRenderer.js";
/**
 * Task used to render an utility layer.
 */
export declare class FrameGraphUtilityLayerRendererTask extends FrameGraphTask {
    /**
     * The target texture of the task.
     */
    targetTexture: FrameGraphTextureHandle;
    private _camera;
    /**
     * The camera used to render the utility layer.
     */
    get camera(): Camera;
    set camera(value: Camera);
    /**
     * The output texture of the task.
     * This is the same texture as the target texture, but the handles are different!
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * The utility layer renderer.
     */
    readonly layer: UtilityLayerRenderer;
    /**
     * Creates a new utility layer renderer task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param scene The scene the task belongs to.
     * @param handleEvents If the utility layer should handle events.
     */
    constructor(name: string, frameGraph: FrameGraph, scene: Scene, handleEvents?: boolean);
    getClassName(): string;
    record(): void;
    dispose(): void;
}

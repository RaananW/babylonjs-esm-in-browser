import { type FrameGraph, type FrameGraphTextureHandle, type IViewportLike, type Nullable } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task used to copy a texture to another texture.
 */
export declare class FrameGraphCopyToTextureTask extends FrameGraphTask {
    /**
     * The source texture to copy from.
     */
    sourceTexture: FrameGraphTextureHandle;
    /**
     * The target texture to copy to.
     */
    targetTexture: FrameGraphTextureHandle;
    /**
     * The viewport to use when doing the copy.
     * If set to null, the currently active viewport is used.
     * If undefined (default), the viewport is reset to a full screen viewport before performing the copy.
     */
    viewport?: Nullable<IViewportLike>;
    /**
     * The LOD level to copy from the source texture (default: 0).
     */
    lodLevel: number;
    /**
     * The output texture (same as targetTexture, but the handle may be different).
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * Constructs a new FrameGraphCopyToTextureTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    record(): void;
}

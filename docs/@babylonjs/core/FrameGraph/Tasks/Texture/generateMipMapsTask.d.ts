import { type FrameGraph, type FrameGraphTextureHandle } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task which generates mipmaps for a texture.
 */
export declare class FrameGraphGenerateMipMapsTask extends FrameGraphTask {
    /**
     * The texture to generate mipmaps for.
     */
    targetTexture: FrameGraphTextureHandle;
    /**
     * The output texture (same as targetTexture, but the handle may be different).
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * Constructs a new FrameGraphGenerateMipMapsTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    record(): void;
}

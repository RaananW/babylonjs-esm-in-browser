import { type FrameGraphTextureHandle } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task which copies a texture to the backbuffer color texture.
 */
export declare class FrameGraphCopyToBackbufferColorTask extends FrameGraphTask {
    /**
     * The source texture to copy to the backbuffer color texture.
     */
    sourceTexture: FrameGraphTextureHandle;
    getClassName(): string;
    record(): void;
}

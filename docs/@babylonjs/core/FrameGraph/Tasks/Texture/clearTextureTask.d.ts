import { type FrameGraph, type FrameGraphTextureHandle, type FrameGraphRenderPass } from "../../../index.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { FrameGraphTaskMultiRenderTarget } from "../../frameGraphTaskMultiRenderTarget.js";
/**
 * Task used to clear a texture.
 */
export declare class FrameGraphClearTextureTask extends FrameGraphTaskMultiRenderTarget {
    /**
     * The color to clear the texture with.
     */
    color: Color4;
    /**
     * If the color should be cleared.
     */
    clearColor: boolean;
    /**
     * If the color should be converted to linear space (default: false).
     */
    convertColorToLinearSpace: boolean;
    /**
     * If the depth should be cleared.
     */
    clearDepth: boolean;
    /**
     * If the stencil should be cleared.
     */
    clearStencil: boolean;
    /**
     * The value to use to clear the stencil buffer (default: 0).
     */
    stencilValue: number;
    /**
     * The color texture to clear.
     */
    targetTexture?: FrameGraphTextureHandle | FrameGraphTextureHandle[];
    /**
     * The depth attachment texture to clear.
     */
    depthTexture?: FrameGraphTextureHandle;
    /**
     * The output texture (same as targetTexture, but the handle will be different).
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * The output depth texture (same as depthTexture, but the handle will be different).
     */
    readonly outputDepthTexture: FrameGraphTextureHandle;
    /**
     * Constructs a new clear task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}

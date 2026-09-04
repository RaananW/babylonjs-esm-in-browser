import { type Nullable } from "../../../types.js";
import { type RenderTargetTexture } from "../../../Materials/Textures/renderTargetTexture.js";
declare module "../../abstractEngine.pure.js" {
    interface AbstractEngine {
        /**
         * Sets a depth stencil texture from a render target to the according uniform.
         * @param channel The texture channel
         * @param uniform The uniform to set
         * @param texture The render target texture containing the depth stencil texture to apply
         * @param name The texture name
         */
        setDepthStencilTexture(channel: number, uniform: Nullable<WebGLUniformLocation>, texture: Nullable<RenderTargetTexture>, name?: string): void;
    }
}

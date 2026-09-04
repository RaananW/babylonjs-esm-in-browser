import { type Nullable } from "../../types.js";
import { type RenderTargetTexture } from "./renderTargetTexture.pure.js";
declare module "../effect.pure.js" {
    interface Effect {
        /**
         * Sets a depth stencil texture from a render target on the engine to be used in the shader.
         * @param channel Name of the sampler variable.
         * @param texture Texture to set.
         */
        setDepthStencilTexture(channel: string, texture: Nullable<RenderTargetTexture>): void;
    }
}

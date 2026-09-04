import { type InternalTexture } from "../../../Materials/Textures/internalTexture.js";
import { type Nullable } from "../../../types.js";
import { type ExternalTexture } from "../../../Materials/Textures/externalTexture.js";
declare module "../../abstractEngine.pure.js" {
    interface AbstractEngine {
        /**
         * Update a video texture
         * @param texture defines the texture to update
         * @param video defines the video element to use
         * @param invertY defines if data must be stored with Y axis inverted
         */
        updateVideoTexture(texture: Nullable<InternalTexture>, video: HTMLVideoElement | Nullable<ExternalTexture>, invertY: boolean): void;
    }
}

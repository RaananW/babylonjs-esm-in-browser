export {};
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
declare module "../../glTFFileLoader.js" {
    interface GLTFLoaderExtensionOptions {
        /**
         * Defines options for the EXT_lights_image_based extension.
         */
        ["EXT_lights_image_based"]: {};
    }
}
declare module "babylonjs-gltf2interface" {
    /** @internal */
    interface IEXTLightsImageBased_LightImageBased {
        _babylonTexture?: BaseTexture;
        _loaded?: Promise<void>;
    }
}

export {};
import { type BVHLoadingOptions } from "./bvhLoadingOptions.js";
import { type BVHFileLoaderMetadata } from "./bvhFileLoader.metadata.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the bvh loader.
         */
        [BVHFileLoaderMetadata.name]: Partial<BVHLoadingOptions>;
    }
}

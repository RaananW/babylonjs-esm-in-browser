export {};
import { type FBXFileLoaderMetadata } from "./fbxFileLoader.metadata.js";
import { type FBXFileLoaderOptions } from "./fbxFileLoader.pure.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the FBX loader.
         */
        [FBXFileLoaderMetadata.name]: Partial<FBXFileLoaderOptions>;
    }
}

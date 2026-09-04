export {};
import { type OBJFileLoaderMetadata } from "./objFileLoader.metadata.js";
import { type OBJLoadingOptions } from "./objLoadingOptions.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the obj loader.
         */
        [OBJFileLoaderMetadata.name]: Partial<OBJLoadingOptions>;
    }
}

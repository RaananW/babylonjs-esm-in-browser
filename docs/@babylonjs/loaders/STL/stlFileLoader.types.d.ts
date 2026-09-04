export {};
import { type STLFileLoaderMetadata } from "./stlFileLoader.metadata.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the stl loader.
         */
        [STLFileLoaderMetadata.name]: {};
    }
}

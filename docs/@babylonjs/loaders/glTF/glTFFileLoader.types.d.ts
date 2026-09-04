export {};
import { type GLTFFileLoaderMetadata } from "./glTFFileLoader.metadata.js";
import { type GLTFLoaderOptions } from "./glTFFileLoader.pure.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the glTF loader.
         */
        [GLTFFileLoaderMetadata.name]: Partial<GLTFLoaderOptions>;
    }
}

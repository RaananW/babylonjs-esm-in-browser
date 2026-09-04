export {};
import { type SPLATFileLoaderMetadata } from "./splatFileLoader.metadata.js";
import { type SPLATLoadingOptions } from "./splatLoadingOptions.js";
declare module "@babylonjs/core/Loading/sceneLoader.js" {
    interface SceneLoaderPluginOptions {
        /**
         * Defines options for the splat loader.
         */
        [SPLATFileLoaderMetadata.name]: Partial<SPLATLoadingOptions>;
    }
}

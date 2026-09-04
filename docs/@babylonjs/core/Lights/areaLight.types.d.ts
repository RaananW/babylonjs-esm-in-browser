import { type ILTCTextures } from "./LTC/ltcTextureTool.js";
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * @internal
         */
        _ltcTextures?: ILTCTextures;
    }
}

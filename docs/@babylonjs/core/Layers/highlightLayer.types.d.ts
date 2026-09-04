import { type Nullable } from "../types.js";
import { type HighlightLayer } from "./highlightLayer.pure.js";
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * Return a the first highlight layer of the scene with a given name.
         * @param name The name of the highlight layer to look for.
         * @returns The highlight layer if found otherwise null.
         */
        getHighlightLayerByName(name: string): Nullable<HighlightLayer>;
    }
}

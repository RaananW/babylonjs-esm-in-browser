import { type Nullable } from "../types.js";
import { type GlowLayer } from "./glowLayer.pure.js";
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * Return the first glow layer of the scene with a given name.
         * @param name The name of the glow layer to look for.
         * @returns The glow layer if found otherwise null.
         */
        getGlowLayerByName(name: string): Nullable<GlowLayer>;
    }
}

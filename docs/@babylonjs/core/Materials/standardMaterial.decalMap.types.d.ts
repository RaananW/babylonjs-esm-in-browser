import { type Nullable } from "../types.js";
import { type DecalMapConfiguration } from "./material.decalMapConfiguration.js";
declare module "./standardMaterial.pure.js" {
    interface StandardMaterial {
        /** @internal */
        _decalMap: Nullable<DecalMapConfiguration>;
        /**
         * Defines the decal map parameters for the material.
         */
        decalMap: Nullable<DecalMapConfiguration>;
    }
}

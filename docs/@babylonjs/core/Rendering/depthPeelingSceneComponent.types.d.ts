import { type Nullable } from "../types.js";
import { type ThinDepthPeelingRenderer } from "./thinDepthPeelingRenderer.js";
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * The depth peeling renderer
         */
        depthPeelingRenderer: Nullable<ThinDepthPeelingRenderer>;
        /** @internal (Backing field) */
        _depthPeelingRenderer: Nullable<ThinDepthPeelingRenderer>;
        /**
         * Flag to indicate if we want to use order independent transparency, despite the performance hit
         */
        useOrderIndependentTransparency: boolean;
        /** @internal */
        _useOrderIndependentTransparency: boolean;
    }
}

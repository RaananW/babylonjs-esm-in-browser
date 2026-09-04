import { type DebugLayer } from "./debugLayer.pure.js";
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * @internal
         * Backing field
         */
        _debugLayer?: DebugLayer;
        /**
         * Gets the debug layer (aka Inspector) associated with the scene
         * @see https://doc.babylonjs.com/toolsAndResources/inspector
         */
        debugLayer: DebugLayer;
    }
}

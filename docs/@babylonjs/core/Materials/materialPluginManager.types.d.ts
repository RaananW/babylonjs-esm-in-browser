import { type MaterialPluginManager } from "./materialPluginManager.pure.js";
declare module "./material.pure.js" {
    interface Material {
        /**
         * Plugin manager for this material
         */
        pluginManager?: MaterialPluginManager;
    }
}

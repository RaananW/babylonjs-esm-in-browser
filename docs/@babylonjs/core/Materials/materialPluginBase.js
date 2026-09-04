/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import materialPluginBase.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./materialPluginBase.pure.js";
import { RegisterMaterialPluginBase } from "./materialPluginBase.pure.js";
RegisterMaterialPluginBase();
//# sourceMappingURL=materialPluginBase.js.map
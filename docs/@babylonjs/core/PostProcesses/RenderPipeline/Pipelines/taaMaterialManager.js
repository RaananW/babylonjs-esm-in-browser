/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import taaMaterialManager.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./taaMaterialManager.pure.js";
import { RegisterTaaMaterialManager } from "./taaMaterialManager.pure.js";
RegisterTaaMaterialManager();
//# sourceMappingURL=taaMaterialManager.js.map
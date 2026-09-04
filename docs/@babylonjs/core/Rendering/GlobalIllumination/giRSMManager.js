/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import giRSMManager.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./giRSMManager.pure.js";
import { RegisterGiRSMManager } from "./giRSMManager.pure.js";
RegisterGiRSMManager();
//# sourceMappingURL=giRSMManager.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ribbonBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ribbonBuilder.pure.js";
import { RegisterRibbonBuilder } from "./ribbonBuilder.pure.js";
RegisterRibbonBuilder();
//# sourceMappingURL=ribbonBuilder.js.map
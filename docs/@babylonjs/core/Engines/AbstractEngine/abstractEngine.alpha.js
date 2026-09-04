export * from "./abstractEngine.alpha.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.alpha.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.alpha.pure.js";
import { RegisterAbstractEngineAlpha } from "./abstractEngine.alpha.pure.js";
RegisterAbstractEngineAlpha();
//# sourceMappingURL=abstractEngine.alpha.js.map
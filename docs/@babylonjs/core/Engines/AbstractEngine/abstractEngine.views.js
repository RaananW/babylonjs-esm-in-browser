export * from "./abstractEngine.views.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.views.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.views.pure.js";
import { RegisterAbstractEngineViews } from "./abstractEngine.views.pure.js";
RegisterAbstractEngineViews();
//# sourceMappingURL=abstractEngine.views.js.map
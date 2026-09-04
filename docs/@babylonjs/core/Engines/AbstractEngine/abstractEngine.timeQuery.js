export * from "./abstractEngine.timeQuery.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.timeQuery.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.timeQuery.pure.js";
import { RegisterAbstractEngineTimeQuery } from "./abstractEngine.timeQuery.pure.js";
RegisterAbstractEngineTimeQuery();
//# sourceMappingURL=abstractEngine.timeQuery.js.map
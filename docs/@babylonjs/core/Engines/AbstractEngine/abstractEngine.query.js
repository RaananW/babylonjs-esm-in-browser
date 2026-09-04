export * from "./abstractEngine.query.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.query.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.query.pure.js";
import { RegisterAbstractEngineQuery } from "./abstractEngine.query.pure.js";
RegisterAbstractEngineQuery();
//# sourceMappingURL=abstractEngine.query.js.map
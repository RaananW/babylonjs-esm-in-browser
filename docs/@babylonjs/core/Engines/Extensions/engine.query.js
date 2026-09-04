export * from "./engine.query.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.query.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.query.pure.js";
import { RegisterEnginesExtensionsEngineQuery } from "./engine.query.pure.js";
RegisterEnginesExtensionsEngineQuery();
//# sourceMappingURL=engine.query.js.map
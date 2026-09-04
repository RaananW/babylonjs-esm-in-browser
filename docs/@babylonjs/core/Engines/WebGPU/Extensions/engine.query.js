/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.query.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.query.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineQuery } from "./engine.query.pure.js";
RegisterEnginesWebGPUExtensionsEngineQuery();
//# sourceMappingURL=engine.query.js.map
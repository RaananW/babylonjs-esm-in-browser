export * from "./engine.debugging.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.debugging.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.debugging.pure.js";
import { RegisterEngineDebugging } from "./engine.debugging.pure.js";
RegisterEngineDebugging();
//# sourceMappingURL=engine.debugging.js.map
export * from "./engine.alpha.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.alpha.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.alpha.pure.js";
import { RegisterEnginesExtensionsEngineAlpha } from "./engine.alpha.pure.js";
RegisterEnginesExtensionsEngineAlpha();
//# sourceMappingURL=engine.alpha.js.map
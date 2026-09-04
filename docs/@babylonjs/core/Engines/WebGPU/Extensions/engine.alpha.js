export * from "./engine.alpha.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.alpha.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.alpha.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineAlpha } from "./engine.alpha.pure.js";
RegisterEnginesWebGPUExtensionsEngineAlpha();
//# sourceMappingURL=engine.alpha.js.map
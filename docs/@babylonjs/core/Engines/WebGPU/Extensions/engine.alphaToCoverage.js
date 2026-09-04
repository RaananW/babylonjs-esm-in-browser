export * from "./engine.alphaToCoverage.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.alphaToCoverage.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.alphaToCoverage.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineAlphaToCoverage } from "./engine.alphaToCoverage.pure.js";
RegisterEnginesWebGPUExtensionsEngineAlphaToCoverage();
//# sourceMappingURL=engine.alphaToCoverage.js.map
export * from "./engine.computeShader.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.computeShader.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.computeShader.pure.js";
import { RegisterEnginesExtensionsEngineComputeShader } from "./engine.computeShader.pure.js";
RegisterEnginesExtensionsEngineComputeShader();
//# sourceMappingURL=engine.computeShader.js.map
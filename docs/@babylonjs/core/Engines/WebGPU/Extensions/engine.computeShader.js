export * from "./engine.computeShader.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.computeShader.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.computeShader.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineComputeShader } from "./engine.computeShader.pure.js";
RegisterEnginesWebGPUExtensionsEngineComputeShader();
//# sourceMappingURL=engine.computeShader.js.map
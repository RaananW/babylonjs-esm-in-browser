/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import computeShader.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./computeShader.pure.js";
export * from "./computeShader.types.js";
import { RegisterComputeShader } from "./computeShader.pure.js";
RegisterComputeShader();
//# sourceMappingURL=computeShader.js.map
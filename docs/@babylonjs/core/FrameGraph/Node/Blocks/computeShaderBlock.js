/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import computeShaderBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./computeShaderBlock.pure.js";
import { RegisterComputeShaderBlock } from "./computeShaderBlock.pure.js";
RegisterComputeShaderBlock();
//# sourceMappingURL=computeShaderBlock.js.map
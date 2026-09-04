/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import simplexPerlin3DBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./simplexPerlin3DBlock.pure.js";
import { RegisterSimplexPerlin3DBlock } from "./simplexPerlin3DBlock.pure.js";
RegisterSimplexPerlin3DBlock();
//# sourceMappingURL=simplexPerlin3DBlock.js.map
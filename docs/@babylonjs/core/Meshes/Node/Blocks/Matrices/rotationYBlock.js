/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import rotationYBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./rotationYBlock.pure.js";
import { RegisterRotationYBlock } from "./rotationYBlock.pure.js";
RegisterRotationYBlock();
//# sourceMappingURL=rotationYBlock.js.map
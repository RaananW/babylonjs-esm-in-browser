/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import screenSpaceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./screenSpaceBlock.pure.js";
import { RegisterScreenSpaceBlock } from "./screenSpaceBlock.pure.js";
RegisterScreenSpaceBlock();
//# sourceMappingURL=screenSpaceBlock.js.map
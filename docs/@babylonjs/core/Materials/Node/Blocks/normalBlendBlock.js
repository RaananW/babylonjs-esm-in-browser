/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import normalBlendBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./normalBlendBlock.pure.js";
import { RegisterNormalBlendBlock } from "./normalBlendBlock.pure.js";
RegisterNormalBlendBlock();
//# sourceMappingURL=normalBlendBlock.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import normalizeVectorBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./normalizeVectorBlock.pure.js";
import { RegisterNormalizeVectorBlock } from "./normalizeVectorBlock.pure.js";
RegisterNormalizeVectorBlock();
//# sourceMappingURL=normalizeVectorBlock.js.map
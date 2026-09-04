/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import normalizeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./normalizeBlock.pure.js";
import { RegisterNormalizeBlock } from "./normalizeBlock.pure.js";
RegisterNormalizeBlock();
//# sourceMappingURL=normalizeBlock.js.map
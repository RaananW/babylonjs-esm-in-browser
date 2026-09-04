/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import crossBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./crossBlock.pure.js";
import { RegisterCrossBlock } from "./crossBlock.pure.js";
RegisterCrossBlock();
//# sourceMappingURL=crossBlock.js.map
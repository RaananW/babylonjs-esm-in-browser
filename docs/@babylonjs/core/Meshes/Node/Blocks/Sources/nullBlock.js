/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nullBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nullBlock.pure.js";
import { RegisterNullBlock } from "./nullBlock.pure.js";
RegisterNullBlock();
//# sourceMappingURL=nullBlock.js.map
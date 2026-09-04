/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import bevelBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./bevelBlock.pure.js";
import { RegisterBevelBlock } from "./bevelBlock.pure.js";
RegisterBevelBlock();
//# sourceMappingURL=bevelBlock.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import subtractBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./subtractBlock.pure.js";
import { RegisterSubtractBlock } from "./subtractBlock.pure.js";
RegisterSubtractBlock();
//# sourceMappingURL=subtractBlock.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lerpBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lerpBlock.pure.js";
import { RegisterLerpBlock } from "./lerpBlock.pure.js";
RegisterLerpBlock();
//# sourceMappingURL=lerpBlock.js.map
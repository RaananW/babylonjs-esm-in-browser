/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import pointListBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./pointListBlock.pure.js";
import { RegisterPointListBlock } from "./pointListBlock.pure.js";
RegisterPointListBlock();
//# sourceMappingURL=pointListBlock.js.map
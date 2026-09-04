/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fragCoordBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fragCoordBlock.pure.js";
import { RegisterFragCoordBlock } from "./fragCoordBlock.pure.js";
RegisterFragCoordBlock();
//# sourceMappingURL=fragCoordBlock.js.map
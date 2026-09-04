/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import blackAndWhitePostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./blackAndWhitePostProcessBlock.pure.js";
import { RegisterBlackAndWhitePostProcessBlock } from "./blackAndWhitePostProcessBlock.pure.js";
RegisterBlackAndWhitePostProcessBlock();
//# sourceMappingURL=blackAndWhitePostProcessBlock.js.map
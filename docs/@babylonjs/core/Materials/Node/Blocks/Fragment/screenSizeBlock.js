/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import screenSizeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./screenSizeBlock.pure.js";
import { RegisterScreenSizeBlock } from "./screenSizeBlock.pure.js";
RegisterScreenSizeBlock();
//# sourceMappingURL=screenSizeBlock.js.map
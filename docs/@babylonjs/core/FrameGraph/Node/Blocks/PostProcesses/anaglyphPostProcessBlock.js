/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import anaglyphPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./anaglyphPostProcessBlock.pure.js";
import { RegisterAnaglyphPostProcessBlock } from "./anaglyphPostProcessBlock.pure.js";
RegisterAnaglyphPostProcessBlock();
//# sourceMappingURL=anaglyphPostProcessBlock.js.map
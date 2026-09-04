/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import copyTextureBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./copyTextureBlock.pure.js";
import { RegisterCopyTextureBlock } from "./copyTextureBlock.pure.js";
RegisterCopyTextureBlock();
//# sourceMappingURL=copyTextureBlock.js.map
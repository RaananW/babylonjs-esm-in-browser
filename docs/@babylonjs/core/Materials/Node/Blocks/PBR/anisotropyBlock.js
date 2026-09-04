/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import anisotropyBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./anisotropyBlock.pure.js";
import { RegisterAnisotropyBlock } from "./anisotropyBlock.pure.js";
RegisterAnisotropyBlock();
//# sourceMappingURL=anisotropyBlock.js.map
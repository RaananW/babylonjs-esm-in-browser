/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import generateMipmapsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./generateMipmapsBlock.pure.js";
import { RegisterGenerateMipmapsBlock } from "./generateMipmapsBlock.pure.js";
RegisterGenerateMipmapsBlock();
//# sourceMappingURL=generateMipmapsBlock.js.map
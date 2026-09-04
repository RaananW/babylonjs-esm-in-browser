/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cloudBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cloudBlock.pure.js";
import { RegisterCloudBlock } from "./cloudBlock.pure.js";
RegisterCloudBlock();
//# sourceMappingURL=cloudBlock.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import torusBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./torusBlock.pure.js";
import { RegisterTorusBlock } from "./torusBlock.pure.js";
RegisterTorusBlock();
//# sourceMappingURL=torusBlock.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import meshBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./meshBlock.pure.js";
import { RegisterMeshBlock } from "./meshBlock.pure.js";
RegisterMeshBlock();
//# sourceMappingURL=meshBlock.js.map
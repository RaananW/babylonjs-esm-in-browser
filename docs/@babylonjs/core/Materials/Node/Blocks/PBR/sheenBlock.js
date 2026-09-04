/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sheenBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sheenBlock.pure.js";
import { RegisterSheenBlock } from "./sheenBlock.pure.js";
RegisterSheenBlock();
//# sourceMappingURL=sheenBlock.js.map
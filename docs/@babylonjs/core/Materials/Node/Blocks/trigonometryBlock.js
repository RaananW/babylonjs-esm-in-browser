/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import trigonometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./trigonometryBlock.pure.js";
import { RegisterTrigonometryBlock } from "./trigonometryBlock.pure.js";
RegisterTrigonometryBlock();
//# sourceMappingURL=trigonometryBlock.js.map
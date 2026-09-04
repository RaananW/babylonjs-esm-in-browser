/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import stepBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./stepBlock.pure.js";
import { RegisterStepBlock } from "./stepBlock.pure.js";
RegisterStepBlock();
//# sourceMappingURL=stepBlock.js.map
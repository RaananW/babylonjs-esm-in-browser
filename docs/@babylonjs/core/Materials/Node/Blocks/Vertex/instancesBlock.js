/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import instancesBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./instancesBlock.pure.js";
import { RegisterInstancesBlock } from "./instancesBlock.pure.js";
RegisterInstancesBlock();
//# sourceMappingURL=instancesBlock.js.map
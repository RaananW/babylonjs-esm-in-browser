/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import modBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./modBlock.pure.js";
import { RegisterModBlock } from "./modBlock.pure.js";
RegisterModBlock();
//# sourceMappingURL=modBlock.js.map
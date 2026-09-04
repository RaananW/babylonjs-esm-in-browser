/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import twirlBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./twirlBlock.pure.js";
import { RegisterTwirlBlock } from "./twirlBlock.pure.js";
RegisterTwirlBlock();
//# sourceMappingURL=twirlBlock.js.map
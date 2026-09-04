/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import currentScreenBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./currentScreenBlock.pure.js";
import { RegisterCurrentScreenBlock } from "./currentScreenBlock.pure.js";
RegisterCurrentScreenBlock();
//# sourceMappingURL=currentScreenBlock.js.map
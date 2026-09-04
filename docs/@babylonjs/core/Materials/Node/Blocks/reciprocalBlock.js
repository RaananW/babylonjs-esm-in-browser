/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import reciprocalBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./reciprocalBlock.pure.js";
import { RegisterReciprocalBlock } from "./reciprocalBlock.pure.js";
RegisterReciprocalBlock();
//# sourceMappingURL=reciprocalBlock.js.map
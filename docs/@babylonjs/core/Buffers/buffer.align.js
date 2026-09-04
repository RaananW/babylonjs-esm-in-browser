export * from "./buffer.align.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import buffer.align.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./buffer.align.pure.js";
import { RegisterBufferAlign } from "./buffer.align.pure.js";
RegisterBufferAlign();
//# sourceMappingURL=buffer.align.js.map
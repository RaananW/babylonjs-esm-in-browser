export * from "./postProcess.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import postProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./postProcess.pure.js";
import { RegisterPostProcess } from "./postProcess.pure.js";
RegisterPostProcess();
//# sourceMappingURL=postProcess.js.map
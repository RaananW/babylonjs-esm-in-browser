/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import passPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./passPostProcess.pure.js";
import { RegisterPassPostProcess } from "./passPostProcess.pure.js";
RegisterPassPostProcess();
//# sourceMappingURL=passPostProcess.js.map
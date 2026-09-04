/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import filterPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./filterPostProcess.pure.js";
import { RegisterFilterPostProcess } from "./filterPostProcess.pure.js";
RegisterFilterPostProcess();
//# sourceMappingURL=filterPostProcess.js.map
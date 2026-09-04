/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import displayPassPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./displayPassPostProcess.pure.js";
import { RegisterDisplayPassPostProcess } from "./displayPassPostProcess.pure.js";
RegisterDisplayPassPostProcess();
//# sourceMappingURL=displayPassPostProcess.js.map
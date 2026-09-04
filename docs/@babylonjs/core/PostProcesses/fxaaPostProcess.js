/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fxaaPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fxaaPostProcess.pure.js";
import { RegisterFxaaPostProcess } from "./fxaaPostProcess.pure.js";
RegisterFxaaPostProcess();
//# sourceMappingURL=fxaaPostProcess.js.map
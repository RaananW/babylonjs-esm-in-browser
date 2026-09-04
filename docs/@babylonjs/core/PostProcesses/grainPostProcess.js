/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import grainPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./grainPostProcess.pure.js";
import { RegisterGrainPostProcess } from "./grainPostProcess.pure.js";
RegisterGrainPostProcess();
//# sourceMappingURL=grainPostProcess.js.map
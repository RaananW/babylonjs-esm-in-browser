/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import tonemapPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./tonemapPostProcess.pure.js";
import { RegisterTonemapPostProcess } from "./tonemapPostProcess.pure.js";
RegisterTonemapPostProcess();
//# sourceMappingURL=tonemapPostProcess.js.map
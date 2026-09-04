/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import bloomMergePostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./bloomMergePostProcess.pure.js";
import { RegisterBloomMergePostProcess } from "./bloomMergePostProcess.pure.js";
RegisterBloomMergePostProcess();
//# sourceMappingURL=bloomMergePostProcess.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import extractHighlightsPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./extractHighlightsPostProcess.pure.js";
import { RegisterExtractHighlightsPostProcess } from "./extractHighlightsPostProcess.pure.js";
RegisterExtractHighlightsPostProcess();
//# sourceMappingURL=extractHighlightsPostProcess.js.map
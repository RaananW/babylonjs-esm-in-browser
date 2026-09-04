/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import chromaticAberrationPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./chromaticAberrationPostProcess.pure.js";
import { RegisterChromaticAberrationPostProcess } from "./chromaticAberrationPostProcess.pure.js";
RegisterChromaticAberrationPostProcess();
//# sourceMappingURL=chromaticAberrationPostProcess.js.map
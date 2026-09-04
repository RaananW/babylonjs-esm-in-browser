/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import screenSpaceCurvaturePostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./screenSpaceCurvaturePostProcess.pure.js";
import "../Shaders/screenSpaceCurvature.fragment.js";
import { RegisterScreenSpaceCurvaturePostProcess } from "./screenSpaceCurvaturePostProcess.pure.js";
RegisterScreenSpaceCurvaturePostProcess();
//# sourceMappingURL=screenSpaceCurvaturePostProcess.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sharpenPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sharpenPostProcess.pure.js";
import "../Shaders/sharpen.fragment.js";
import { RegisterSharpenPostProcess } from "./sharpenPostProcess.pure.js";
RegisterSharpenPostProcess();
//# sourceMappingURL=sharpenPostProcess.js.map
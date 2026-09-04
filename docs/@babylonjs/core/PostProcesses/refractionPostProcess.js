/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import refractionPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./refractionPostProcess.pure.js";
import "../Shaders/refraction.fragment.js";
import { RegisterRefractionPostProcess } from "./refractionPostProcess.pure.js";
RegisterRefractionPostProcess();
//# sourceMappingURL=refractionPostProcess.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import blackAndWhitePostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./blackAndWhitePostProcess.pure.js";
import { RegisterBlackAndWhitePostProcess } from "./blackAndWhitePostProcess.pure.js";
RegisterBlackAndWhitePostProcess();
//# sourceMappingURL=blackAndWhitePostProcess.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import anaglyphPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./anaglyphPostProcess.pure.js";
import { RegisterAnaglyphPostProcess } from "./anaglyphPostProcess.pure.js";
RegisterAnaglyphPostProcess();
//# sourceMappingURL=anaglyphPostProcess.js.map
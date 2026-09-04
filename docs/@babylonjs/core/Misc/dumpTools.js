/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import dumpTools.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./dumpTools.pure.js";
import { RegisterDumpTools } from "./dumpTools.pure.js";
RegisterDumpTools();
//# sourceMappingURL=dumpTools.js.map
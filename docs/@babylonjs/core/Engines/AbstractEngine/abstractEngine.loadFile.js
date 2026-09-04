export * from "./abstractEngine.loadFile.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.loadFile.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.loadFile.pure.js";
import { RegisterAbstractEngineLoadFile } from "./abstractEngine.loadFile.pure.js";
RegisterAbstractEngineLoadFile();
//# sourceMappingURL=abstractEngine.loadFile.js.map
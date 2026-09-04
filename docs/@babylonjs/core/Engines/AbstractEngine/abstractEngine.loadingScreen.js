export * from "./abstractEngine.loadingScreen.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.loadingScreen.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.loadingScreen.pure.js";
import { RegisterAbstractEngineLoadingScreen } from "./abstractEngine.loadingScreen.pure.js";
RegisterAbstractEngineLoadingScreen();
//# sourceMappingURL=abstractEngine.loadingScreen.js.map
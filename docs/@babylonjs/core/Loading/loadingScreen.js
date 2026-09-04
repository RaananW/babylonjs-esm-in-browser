/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import loadingScreen.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./loadingScreen.pure.js";
import { RegisterLoadingScreen } from "./loadingScreen.pure.js";
RegisterLoadingScreen();
//# sourceMappingURL=loadingScreen.js.map
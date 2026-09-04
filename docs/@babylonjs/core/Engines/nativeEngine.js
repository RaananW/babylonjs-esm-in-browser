/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nativeEngine.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nativeEngine.pure.js";
import { RegisterNativeEngine } from "./nativeEngine.pure.js";
RegisterNativeEngine();
//# sourceMappingURL=nativeEngine.js.map
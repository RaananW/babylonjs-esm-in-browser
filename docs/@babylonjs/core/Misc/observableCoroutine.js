export * from "./observableCoroutine.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import observableCoroutine.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./observableCoroutine.pure.js";
import { RegisterObservableCoroutine } from "./observableCoroutine.pure.js";
RegisterObservableCoroutine();
//# sourceMappingURL=observableCoroutine.js.map
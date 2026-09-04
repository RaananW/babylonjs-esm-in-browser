/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import directionalLight.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./directionalLight.pure.js";
import { RegisterDirectionalLight } from "./directionalLight.pure.js";
RegisterDirectionalLight();
//# sourceMappingURL=directionalLight.js.map
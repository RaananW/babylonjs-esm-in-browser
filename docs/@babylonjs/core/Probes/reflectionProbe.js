/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import reflectionProbe.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./reflectionProbe.pure.js";
export * from "./reflectionProbe.types.js";
import { RegisterReflectionProbe } from "./reflectionProbe.pure.js";
RegisterReflectionProbe();
//# sourceMappingURL=reflectionProbe.js.map
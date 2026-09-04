/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import reflectiveShadowMap.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./reflectiveShadowMap.pure.js";
import { RegisterReflectiveShadowMap } from "./reflectiveShadowMap.pure.js";
RegisterReflectiveShadowMap();
//# sourceMappingURL=reflectiveShadowMap.js.map
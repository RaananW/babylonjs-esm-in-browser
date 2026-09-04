/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fresnelParameters.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fresnelParameters.pure.js";
export * from "./fresnelParameters.types.js";
import { RegisterFresnelParameters } from "./fresnelParameters.pure.js";
RegisterFresnelParameters();
//# sourceMappingURL=fresnelParameters.js.map
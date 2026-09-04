/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import shaderMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./shaderMaterial.pure.js";
export * from "./shaderMaterial.types.js";
import { RegisterShaderMaterial } from "./shaderMaterial.pure.js";
RegisterShaderMaterial();
//# sourceMappingURL=shaderMaterial.js.map
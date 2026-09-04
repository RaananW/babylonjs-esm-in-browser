/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_mesh_quantization.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_mesh_quantization.types.js";
export * from "./KHR_mesh_quantization.pure.js";
import { RegisterKHR_mesh_quantization } from "./KHR_mesh_quantization.pure.js";
RegisterKHR_mesh_quantization();
//# sourceMappingURL=KHR_mesh_quantization.js.map
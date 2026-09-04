/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_draco_mesh_compression.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_draco_mesh_compression.types.js";
export * from "./KHR_draco_mesh_compression.pure.js";
import { RegisterKHR_draco_mesh_compression } from "./KHR_draco_mesh_compression.pure.js";
RegisterKHR_draco_mesh_compression();
//# sourceMappingURL=KHR_draco_mesh_compression.js.map
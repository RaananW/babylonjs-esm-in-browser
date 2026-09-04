/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./EXT_mesh_gpu_instancing.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./EXT_mesh_gpu_instancing.types.js";
export * from "./EXT_mesh_gpu_instancing.pure.js";
import "@babylonjs/core/Meshes/thinInstanceMesh.js";

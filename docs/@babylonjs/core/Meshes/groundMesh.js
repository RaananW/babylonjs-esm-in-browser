/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import groundMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./groundMesh.pure.js";
import { RegisterGroundMesh } from "./groundMesh.pure.js";
RegisterGroundMesh();
//# sourceMappingURL=groundMesh.js.map
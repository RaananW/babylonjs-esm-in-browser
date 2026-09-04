/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import mesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./mesh.pure.js";
import { RegisterMesh } from "./mesh.pure.js";
RegisterMesh();
//# sourceMappingURL=mesh.js.map
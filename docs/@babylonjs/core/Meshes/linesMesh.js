/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import linesMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./linesMesh.pure.js";
import { RegisterLinesMesh } from "./linesMesh.pure.js";
RegisterLinesMesh();
//# sourceMappingURL=linesMesh.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianSplattingMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianSplattingMesh.pure.js";
import "../thinInstanceMesh.js";
import "./gaussianSplattingPartProxyMesh.js";

/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./glTFBinaryExtension.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./glTFBinaryExtension.pure.js";
import "./glTFLoader.js";
import { RegisterGLTFBinaryExtension } from "./glTFBinaryExtension.pure.js";
RegisterGLTFBinaryExtension();
//# sourceMappingURL=glTFBinaryExtension.js.map
/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./glTFLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./glTFLoader.pure.js";
import { RegisterGLTF1Loader } from "./glTFLoader.pure.js";
import { RegisterGLTFFileLoader } from "../glTFFileLoader.pure.js";
RegisterGLTF1Loader();
RegisterGLTFFileLoader();
//# sourceMappingURL=glTFLoader.js.map
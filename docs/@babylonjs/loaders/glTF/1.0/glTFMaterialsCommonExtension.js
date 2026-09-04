/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./glTFMaterialsCommonExtension.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./glTFMaterialsCommonExtension.pure.js";
import "./glTFLoader.js";
import { RegisterGLTFMaterialsCommonExtension } from "./glTFMaterialsCommonExtension.pure.js";
RegisterGLTFMaterialsCommonExtension();
//# sourceMappingURL=glTFMaterialsCommonExtension.js.map
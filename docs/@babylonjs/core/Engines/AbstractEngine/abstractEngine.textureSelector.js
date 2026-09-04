export * from "./abstractEngine.textureSelector.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.textureSelector.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.textureSelector.pure.js";
import { RegisterAbstractEngineTextureSelector } from "./abstractEngine.textureSelector.pure.js";
RegisterAbstractEngineTextureSelector();
//# sourceMappingURL=abstractEngine.textureSelector.js.map
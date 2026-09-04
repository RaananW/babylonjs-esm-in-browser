export * from "./nativeEngine.cubeTexture.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nativeEngine.cubeTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nativeEngine.cubeTexture.pure.js";
import { RegisterNativeEngineCubeTexture } from "./nativeEngine.cubeTexture.pure.js";
RegisterNativeEngineCubeTexture();
//# sourceMappingURL=nativeEngine.cubeTexture.js.map
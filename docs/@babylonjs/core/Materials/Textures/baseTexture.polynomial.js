export * from "./baseTexture.polynomial.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import baseTexture.polynomial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./baseTexture.polynomial.pure.js";
import { RegisterBaseTexturePolynomial } from "./baseTexture.polynomial.pure.js";
RegisterBaseTexturePolynomial();
//# sourceMappingURL=baseTexture.polynomial.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import validatedNativeDataStream.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./validatedNativeDataStream.pure.js";
import { RegisterValidatedNativeDataStream } from "./validatedNativeDataStream.pure.js";
RegisterValidatedNativeDataStream();
//# sourceMappingURL=validatedNativeDataStream.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nativeXRFrame.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nativeXRFrame.pure.js";
import { RegisterNativeXRFrame } from "./nativeXRFrame.pure.js";
RegisterNativeXRFrame();
//# sourceMappingURL=nativeXRFrame.js.map
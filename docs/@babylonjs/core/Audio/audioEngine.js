/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import audioEngine.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./audioEngine.pure.js";
import { RegisterAudioEngine } from "./audioEngine.pure.js";
RegisterAudioEngine();
//# sourceMappingURL=audioEngine.js.map
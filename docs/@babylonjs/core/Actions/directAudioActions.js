/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import directAudioActions.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./directAudioActions.pure.js";
import { RegisterDirectAudioActions } from "./directAudioActions.pure.js";
RegisterDirectAudioActions();
//# sourceMappingURL=directAudioActions.js.map
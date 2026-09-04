/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./MSFT_audio_emitter.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./MSFT_audio_emitter.types.js";
export * from "./MSFT_audio_emitter.pure.js";
import "@babylonjs/core/Audio/audioSceneComponent.js";

export * from "./sog.pure.js";
// updateDynamicTexture is a prototype-augmented engine extension; import its side effect so the ImageBitmap
// fast path in LoadSogTextureDirectAsync doesn't hit an undefined method under tree-shaken/pure engine builds.
import "@babylonjs/core/Engines/Extensions/engine.dynamicTexture.js";
//# sourceMappingURL=sog.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import effectLayerSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./effectLayerSceneComponent.pure.js";
import { EffectLayer } from "./effectLayer.js";
import { RegisterEffectLayerSceneComponent } from "./effectLayerSceneComponent.pure.js";
RegisterEffectLayerSceneComponent(EffectLayer);
//# sourceMappingURL=effectLayerSceneComponent.js.map
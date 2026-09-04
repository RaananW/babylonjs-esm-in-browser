export * from "./geometryBufferRendererSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryBufferRendererSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryBufferRendererSceneComponent.pure.js";
import { GeometryBufferRenderer } from "./geometryBufferRenderer.pure.js";
import { RegisterGeometryBufferRendererSceneComponent } from "./geometryBufferRendererSceneComponent.pure.js";
RegisterGeometryBufferRendererSceneComponent(GeometryBufferRenderer);
//# sourceMappingURL=geometryBufferRendererSceneComponent.js.map
export * from "./iblCdfGeneratorSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import iblCdfGeneratorSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./iblCdfGeneratorSceneComponent.pure.js";
import { IblCdfGenerator } from "./iblCdfGenerator.js";
import { RegisterIblCdfGeneratorSceneComponent } from "./iblCdfGeneratorSceneComponent.pure.js";
RegisterIblCdfGeneratorSceneComponent(IblCdfGenerator);
//# sourceMappingURL=iblCdfGeneratorSceneComponent.js.map
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import babylonFileLoader.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./babylonFileLoader.pure.js";
import { RegisterBabylonFileLoader } from "./babylonFileLoader.pure.js";
RegisterBabylonFileLoader();
// The .babylon loader resolves concrete camera / light / material types by name
// through the type store, and falls back to a UniversalCamera / StandardMaterial for
// untyped entries. Before the tree-shaking split these built-ins were registered
// transitively, so importing the loader was enough to load a standard scene. Now each
// concrete class only self-registers when its own side-effect wrapper is imported, so
// pull in the standard built-ins here to preserve that contract. Consumers who want a
// fully tree-shaken loader can import babylonFileLoader.pure and register only the
// types their scenes actually use.
import "../../Cameras/universalCamera.js";
import "../../Cameras/arcRotateCamera.js";
import "../../Lights/hemisphericLight.js";
import "../../Lights/pointLight.js";
import "../../Lights/directionalLight.js";
import "../../Lights/spotLight.js";
import "../../Materials/standardMaterial.js";
import "../../Materials/PBR/pbrMaterial.js";
import "../../Materials/Background/backgroundMaterial.js";
import "../../Materials/multiMaterial.js";
//# sourceMappingURL=babylonFileLoader.js.map
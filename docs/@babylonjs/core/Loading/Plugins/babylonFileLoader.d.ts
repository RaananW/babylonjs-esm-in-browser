/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import babylonFileLoader.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./babylonFileLoader.pure.js";
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

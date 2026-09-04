export * from "./glTFLoader.pure.js";
import "@babylonjs/core/Meshes/instancedMesh.js";
import { RegisterGLTF2Loader } from "./glTFLoader.pure.js";
import { RegisterGLTFFileLoader } from "../glTFFileLoader.pure.js";
RegisterGLTF2Loader();
// Auto-register the .gltf/.glb SceneLoader plugin so that importing
// "@babylonjs/loaders/glTF/2.0" restores the pre-9.15 behavior of making
// SceneLoader able to load glTF 2.0 assets. This registers the version-aware
// GLTFFileLoader plugin only; it does not pull in the legacy glTF 1.0 loader.
RegisterGLTFFileLoader();
//# sourceMappingURL=glTFLoader.js.map
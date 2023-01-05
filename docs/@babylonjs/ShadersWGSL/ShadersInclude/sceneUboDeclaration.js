// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "sceneUboDeclaration";
const shader = `struct Scene {
viewProjectionR : mat4x4<f32>,
view : mat4x4<f32>,
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const sceneUboDeclaration = { name, shader };
//# sourceMappingURL=sceneUboDeclaration.js.map
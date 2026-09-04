// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "sceneUboDeclaration";
const shader = `layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;mat4 inverseProjection;};
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const sceneUboDeclaration = { name, shader };
//# sourceMappingURL=sceneUboDeclaration.js.map
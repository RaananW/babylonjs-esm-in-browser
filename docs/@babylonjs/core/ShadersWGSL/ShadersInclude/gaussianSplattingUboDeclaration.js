// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
import "./meshUboDeclaration.js";
const name = "gaussianSplattingUboDeclaration";
const shader = `#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position: vec3f;attribute splatIndex0: vec4f;attribute splatIndex1: vec4f;attribute splatIndex2: vec4f;attribute splatIndex3: vec4f;
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const gaussianSplattingUboDeclarationWGSL = { name, shader };
//# sourceMappingURL=gaussianSplattingUboDeclaration.js.map
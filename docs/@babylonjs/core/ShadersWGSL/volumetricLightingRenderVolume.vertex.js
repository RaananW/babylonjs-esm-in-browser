// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { sceneUboDeclarationWGSL } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclarationWGSL } from "./ShadersInclude/meshUboDeclaration.js";
const name = "volumetricLightingRenderVolumeVertexShader";
const shader = `#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [sceneUboDeclarationWGSL, meshUboDeclarationWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const volumetricLightingRenderVolumeVertexShaderWGSL = { name, shader };
//# sourceMappingURL=volumetricLightingRenderVolume.vertex.js.map
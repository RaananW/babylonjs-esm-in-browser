// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { sceneVertexDeclaration } from "./ShadersInclude/sceneVertexDeclaration.js";
import { sceneUboDeclaration } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshVertexDeclaration } from "./ShadersInclude/meshVertexDeclaration.js";
import { meshUboDeclaration } from "./ShadersInclude/meshUboDeclaration.js";
const name = "volumetricLightingRenderVolumeVertexShader";
const shader = `#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [sceneVertexDeclaration, sceneUboDeclaration, meshVertexDeclaration, meshUboDeclaration];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const volumetricLightingRenderVolumeVertexShader = { name, shader };
//# sourceMappingURL=volumetricLightingRenderVolume.vertex.js.map
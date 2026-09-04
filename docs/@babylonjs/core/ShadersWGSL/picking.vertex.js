// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclarationWGSL } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclarationWGSL } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { morphTargetsVertexGlobalDeclarationWGSL } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclarationWGSL } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { instancesDeclarationWGSL } from "./ShadersInclude/instancesDeclaration.js";
import { morphTargetsVertexGlobalWGSL } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertexWGSL } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertexWGSL } from "./ShadersInclude/instancesVertex.js";
import { bonesVertexWGSL } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimationWGSL } from "./ShadersInclude/bakedVertexAnimation.js";
const name = "pickingVertexShader";
const shader = `attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=vertexInputs.instanceMeshID;
#endif
}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [bonesDeclarationWGSL, bakedVertexAnimationDeclarationWGSL, morphTargetsVertexGlobalDeclarationWGSL, morphTargetsVertexDeclarationWGSL, instancesDeclarationWGSL, morphTargetsVertexGlobalWGSL, morphTargetsVertexWGSL, instancesVertexWGSL, bonesVertexWGSL, bakedVertexAnimationWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const pickingVertexShaderWGSL = { name, shader };
//# sourceMappingURL=picking.vertex.js.map
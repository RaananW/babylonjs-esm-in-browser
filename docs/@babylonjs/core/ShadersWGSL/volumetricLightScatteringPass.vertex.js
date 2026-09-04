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
const name = "volumetricLightScatteringPassVertexShader";
const shader = `attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;uniform depthValues: vec2f;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV1)
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV2)
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vertexOutputs.position=uniforms.viewProjection*finalWorld*vec4f(positionUpdated,1.0);
#if defined(ALPHATEST) || defined(NEED_UV)
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
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
export const volumetricLightScatteringPassVertexShaderWGSL = { name, shader };
//# sourceMappingURL=volumetricLightScatteringPass.vertex.js.map
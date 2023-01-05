// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/bonesDeclaration.js";
import "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import "./ShadersInclude/morphTargetsVertexDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/shadowMapVertexDeclaration.js";
import "./ShadersInclude/shadowMapUboDeclaration.js";
import "./ShadersInclude/shadowMapVertexExtraDeclaration.js";
import "./ShadersInclude/clipPlaneVertexDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobal.js";
import "./ShadersInclude/morphTargetsVertex.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/bonesVertex.js";
import "./ShadersInclude/bakedVertexAnimation.js";
import "./ShadersInclude/shadowMapVertexNormalBias.js";
import "./ShadersInclude/shadowMapVertexMetric.js";
import "./ShadersInclude/clipPlaneVertex.js";
const name = "shadowMapVertexShader";
const shader = `attribute vec3 position;
attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;
attribute vec2 uv;
#ifdef UV2
attribute vec2 uv2;
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
vec2 uvUpdated=uv;
#ifdef NORMAL
vec3 normalUpdated=normal;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
mat3 normWorldSM=mat3(finalWorld);
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
#endif
#include<clipPlaneVertex>
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const shadowMapVertexShader = { name, shader };
//# sourceMappingURL=shadowMap.vertex.js.map
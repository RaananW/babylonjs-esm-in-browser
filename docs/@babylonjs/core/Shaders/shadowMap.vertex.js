// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclaration } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclaration } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { morphTargetsVertexGlobalDeclaration } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclaration } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { sceneVertexDeclaration } from "./ShadersInclude/sceneVertexDeclaration.js";
import { meshVertexDeclaration } from "./ShadersInclude/meshVertexDeclaration.js";
import { shadowMapVertexDeclaration } from "./ShadersInclude/shadowMapVertexDeclaration.js";
import { sceneUboDeclaration } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclaration } from "./ShadersInclude/meshUboDeclaration.js";
import { shadowMapUboDeclaration } from "./ShadersInclude/shadowMapUboDeclaration.js";
import { shadowMapVertexExtraDeclaration } from "./ShadersInclude/shadowMapVertexExtraDeclaration.js";
import { clipPlaneVertexDeclaration } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { morphTargetsVertexGlobal } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertex } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { bonesVertex } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimation } from "./ShadersInclude/bakedVertexAnimation.js";
import { shadowMapVertexNormalBias } from "./ShadersInclude/shadowMapVertexNormalBias.js";
import { shadowMapVertexMetric } from "./ShadersInclude/shadowMapVertexMetric.js";
import { clipPlaneVertex } from "./ShadersInclude/clipPlaneVertex.js";
const name = "shadowMapVertexShader";
const shader = `attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [bonesDeclaration, bakedVertexAnimationDeclaration, morphTargetsVertexGlobalDeclaration, morphTargetsVertexDeclaration, helperFunctions, sceneVertexDeclaration, meshVertexDeclaration, shadowMapVertexDeclaration, sceneUboDeclaration, meshUboDeclaration, shadowMapUboDeclaration, shadowMapVertexExtraDeclaration, clipPlaneVertexDeclaration, morphTargetsVertexGlobal, morphTargetsVertex, instancesVertex, bonesVertex, bakedVertexAnimation, shadowMapVertexNormalBias, shadowMapVertexMetric, clipPlaneVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const shadowMapVertexShader = { name, shader };
//# sourceMappingURL=shadowMap.vertex.js.map
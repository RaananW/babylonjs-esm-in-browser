// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclaration } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclaration } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { morphTargetsVertexGlobalDeclaration } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclaration } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { clipPlaneVertexDeclaration } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { instancesDeclaration } from "./ShadersInclude/instancesDeclaration.js";
import { morphTargetsVertexGlobal } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertex } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { bonesVertex } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimation } from "./ShadersInclude/bakedVertexAnimation.js";
import { clipPlaneVertex } from "./ShadersInclude/clipPlaneVertex.js";
const name = "glowMapGenerationVertexShader";
const shader = `attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;varying vec4 vPosition;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef DIFFUSE
varying vec2 vUVDiffuse;uniform mat4 diffuseMatrix;
#endif
#ifdef OPACITY
varying vec2 vUVOpacity;uniform mat4 opacityMatrix;
#endif
#ifdef EMISSIVE
varying vec2 vUVEmissive;uniform mat4 emissiveMatrix;
#endif
#ifdef VERTEXALPHA
attribute vec4 color;varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef CUBEMAP
vPosition=worldPos;gl_Position=viewProjection*finalWorld*vec4(position,1.0);
#else
vPosition=viewProjection*worldPos;gl_Position=vPosition;
#endif
#ifdef DIFFUSE
#ifdef DIFFUSEUV1
vUVDiffuse=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef DIFFUSEUV2
vUVDiffuse=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef OPACITY
#ifdef OPACITYUV1
vUVOpacity=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef OPACITYUV2
vUVOpacity=vec2(opacityMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef EMISSIVE
#ifdef EMISSIVEUV1
vUVEmissive=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef EMISSIVEUV2
vUVEmissive=vec2(emissiveMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef VERTEXALPHA
vColor=color;
#endif
#include<clipPlaneVertex>
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [bonesDeclaration, bakedVertexAnimationDeclaration, morphTargetsVertexGlobalDeclaration, morphTargetsVertexDeclaration, clipPlaneVertexDeclaration, instancesDeclaration, morphTargetsVertexGlobal, morphTargetsVertex, instancesVertex, bonesVertex, bakedVertexAnimation, clipPlaneVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const glowMapGenerationVertexShader = { name, shader };
//# sourceMappingURL=glowMapGeneration.vertex.js.map
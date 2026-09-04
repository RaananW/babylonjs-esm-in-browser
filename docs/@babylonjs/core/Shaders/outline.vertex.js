// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclaration } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclaration } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { morphTargetsVertexGlobalDeclaration } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclaration } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { clipPlaneVertexDeclaration } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { instancesDeclaration } from "./ShadersInclude/instancesDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { morphTargetsVertexGlobal } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertex } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { bonesVertex } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimation } from "./ShadersInclude/bakedVertexAnimation.js";
import { clipPlaneVertex } from "./ShadersInclude/clipPlaneVertex.js";
import { logDepthVertex } from "./ShadersInclude/logDepthVertex.js";
const name = "outlineVertexShader";
const shader = `attribute vec3 position;attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform float offset;
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;vec3 normalUpdated=normal;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
vec3 offsetPosition=positionUpdated+(normalUpdated*offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [bonesDeclaration, bakedVertexAnimationDeclaration, morphTargetsVertexGlobalDeclaration, morphTargetsVertexDeclaration, clipPlaneVertexDeclaration, instancesDeclaration, logDepthDeclaration, morphTargetsVertexGlobal, morphTargetsVertex, instancesVertex, bonesVertex, bakedVertexAnimation, clipPlaneVertex, logDepthVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const outlineVertexShader = { name, shader };
//# sourceMappingURL=outline.vertex.js.map
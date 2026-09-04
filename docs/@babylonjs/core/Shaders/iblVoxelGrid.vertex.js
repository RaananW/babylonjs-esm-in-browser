// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclaration } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclaration } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { instancesDeclaration } from "./ShadersInclude/instancesDeclaration.js";
import { morphTargetsVertexGlobalDeclaration } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclaration } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { morphTargetsVertexGlobal } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertex } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { bonesVertex } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimation } from "./ShadersInclude/bakedVertexAnimation.js";
const name = "iblVoxelGridVertexShader";
const shader = `attribute vec3 position;varying vec3 vNormalizedPosition;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
uniform mat4 invWorldScale;uniform mat4 viewMatrix;void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewMatrix*invWorldScale*worldPos;vNormalizedPosition.xyz=gl_Position.xyz*0.5+0.5;
#ifdef IS_NDC_HALF_ZRANGE
gl_Position.z=gl_Position.z*0.5+0.5;
#endif
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [bonesDeclaration, bakedVertexAnimationDeclaration, instancesDeclaration, morphTargetsVertexGlobalDeclaration, morphTargetsVertexDeclaration, morphTargetsVertexGlobal, morphTargetsVertex, instancesVertex, bonesVertex, bakedVertexAnimation];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const iblVoxelGridVertexShader = { name, shader };
//# sourceMappingURL=iblVoxelGrid.vertex.js.map
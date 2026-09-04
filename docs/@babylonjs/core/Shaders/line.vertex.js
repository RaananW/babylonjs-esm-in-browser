// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { lineVertexDeclaration } from "./ShadersInclude/lineVertexDeclaration.js";
import { sceneUboDeclaration } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclaration } from "./ShadersInclude/meshUboDeclaration.js";
import { lineUboDeclaration } from "./ShadersInclude/lineUboDeclaration.js";
import { instancesDeclaration } from "./ShadersInclude/instancesDeclaration.js";
import { clipPlaneVertexDeclaration } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { clipPlaneVertex } from "./ShadersInclude/clipPlaneVertex.js";
import { logDepthVertex } from "./ShadersInclude/logDepthVertex.js";
const name = "lineVertexShader";
const shader = `#include<__decl__lineVertex>
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;attribute vec4 normal;uniform float width;uniform float aspectRatio;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;vec4 viewPosition=worldViewProjection*vec4(position,1.0);vec4 viewPositionNext=worldViewProjection*vec4(normal.xyz,1.0);vec2 currentScreen=viewPosition.xy/viewPosition.w;vec2 nextScreen=viewPositionNext.xy/viewPositionNext.w;currentScreen.x*=aspectRatio;nextScreen.x*=aspectRatio;vec2 dir=normalize(nextScreen-currentScreen);vec2 normalDir=vec2(-dir.y,dir.x);normalDir*=width/2.0;normalDir.x/=aspectRatio;vec4 offset=vec4(normalDir*normal.w,0.0,0.0);gl_Position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [lineVertexDeclaration, sceneUboDeclaration, meshUboDeclaration, lineUboDeclaration, instancesDeclaration, clipPlaneVertexDeclaration, logDepthDeclaration, instancesVertex, clipPlaneVertex, logDepthVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const lineVertexShader = { name, shader };
//# sourceMappingURL=line.vertex.js.map
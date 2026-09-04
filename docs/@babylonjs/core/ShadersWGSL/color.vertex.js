// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { bonesDeclarationWGSL } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclarationWGSL } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { clipPlaneVertexDeclarationWGSL } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { fogVertexDeclarationWGSL } from "./ShadersInclude/fogVertexDeclaration.js";
import { instancesDeclarationWGSL } from "./ShadersInclude/instancesDeclaration.js";
import { instancesVertexWGSL } from "./ShadersInclude/instancesVertex.js";
import { bonesVertexWGSL } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimationWGSL } from "./ShadersInclude/bakedVertexAnimation.js";
import { clipPlaneVertexWGSL } from "./ShadersInclude/clipPlaneVertex.js";
import { fogVertexWGSL } from "./ShadersInclude/fogVertex.js";
import { vertexColorMixingWGSL } from "./ShadersInclude/vertexColorMixing.js";
const name = "colorVertexShader";
const shader = `attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [bonesDeclarationWGSL, bakedVertexAnimationDeclarationWGSL, clipPlaneVertexDeclarationWGSL, fogVertexDeclarationWGSL, instancesDeclarationWGSL, instancesVertexWGSL, bonesVertexWGSL, bakedVertexAnimationWGSL, clipPlaneVertexWGSL, fogVertexWGSL, vertexColorMixingWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const colorVertexShaderWGSL = { name, shader };
//# sourceMappingURL=color.vertex.js.map
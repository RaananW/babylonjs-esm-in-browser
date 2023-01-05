// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneVertexDeclaration2.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/clipPlaneVertex.js";
import "./ShadersInclude/logDepthVertex.js";
const name = "gpuRenderParticlesVertexShader";
const shader = `precision highp float;
uniform mat4 emitterWM;
attribute vec3 position;
attribute vec3 initialDirection;
#ifdef BILLBOARDSTRETCHED
attribute vec3 direction;
attribute float angle;
attribute float cellIndex;
attribute vec2 offset;
uniform mat4 invView;
#include<clipPlaneVertexDeclaration2>
#include<logDepthDeclaration>
#ifdef COLORGRADIENTS
uniform sampler2D colorGradientSampler;
uniform vec4 colorDead;
#ifdef ANIMATESHEET
uniform vec3 sheetInfos;
#ifdef BILLBOARD
uniform vec3 eyePosition;
vec3 rotate(vec3 yaxis,vec3 rotatedCorner) {
return ((emitterWM*vec4(position,1.0)).xyz+worldOffset)+alignedCorner;
return (position+worldOffset)+alignedCorner;
}
vec3 rotateAlign(vec3 toCamera,vec3 rotatedCorner) {
return ((emitterWM*vec4(position,1.0)).xyz+worldOffset)+alignedCorner;
return (position+worldOffset)+alignedCorner;
}
void main() {
float rowOffset=floor(cellIndex/sheetInfos.z);
vUV=uv;
float ratio=age/life;
vColor=texture2D(colorGradientSampler,vec2(ratio,0));
vColor=color*vec4(1.0-ratio)+colorDead*vec4(ratio);
vec2 cornerPos=(offset-translationPivot)*size.yz*size.x+translationPivot;
vec4 rotatedCorner;
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
vec4 viewPosition=view*vec4(((emitterWM*vec4(position,1.0)).xyz+worldOffset),1.0)+rotatedCorner;
vec4 viewPosition=view*vec4((position+worldOffset),1.0)+rotatedCorner;
vPositionW=(invView*viewPosition).xyz;
#else
vec3 rotatedCorner;
gl_Position=projection*viewPosition;
vec4 worldPos=vec4(vPositionW,1.0);
#include<clipPlaneVertex>
#include<logDepthVertex>
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const gpuRenderParticlesVertexShader = { name, shader };
//# sourceMappingURL=gpuRenderParticles.vertex.js.map
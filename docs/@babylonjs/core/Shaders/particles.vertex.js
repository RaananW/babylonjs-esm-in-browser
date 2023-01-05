// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneVertexDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/clipPlaneVertex.js";
import "./ShadersInclude/logDepthVertex.js";
const name = "particlesVertexShader";
const shader = `attribute vec3 position;
attribute float cellIndex;
#ifndef BILLBOARD
attribute vec3 direction;
#ifdef BILLBOARDSTRETCHED
attribute vec3 direction;
#ifdef RAMPGRADIENT
attribute vec4 remapData;
attribute vec2 offset;
uniform vec3 particlesInfos; 
varying vec2 vUV;
varying vec4 remapRanges;
#if defined(BILLBOARD) && !defined(BILLBOARDY) && !defined(BILLBOARDSTRETCHED)
uniform mat4 invView;
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#ifdef BILLBOARD
uniform vec3 eyePosition;
vec3 rotate(vec3 yaxis,vec3 rotatedCorner) {
vec3 rotateAlign(vec3 toCamera,vec3 rotatedCorner) {
vec3 row1=direction;
vec3 crossProduct=normalize(cross(normalizedToCamera,normalizedCrossDirToCamera));
mat3 rotMatrix= mat3(row0,row1,row2);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
vec2 cornerPos;
vec3 rotatedCorner;
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
rotatedCorner.x=cornerPos.x*cos(angle)-cornerPos.y*sin(angle);
#ifdef RAMPGRADIENT
remapRanges=remapData;
gl_Position=projection*vec4(viewPos,1.0);
vec3 rotatedCorner;
vColor=color;
float rowOffset=floor(cellIndex*particlesInfos.z);
vUV=offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=vec4(vPositionW,1.0);
#include<clipPlaneVertex>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const particlesVertexShader = { name, shader };
//# sourceMappingURL=particles.vertex.js.map
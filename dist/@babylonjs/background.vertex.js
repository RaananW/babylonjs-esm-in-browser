// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/backgroundVertexDeclaration.js";
import "./ShadersInclude/backgroundUboDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/bonesDeclaration.js";
import "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import "./ShadersInclude/instancesDeclaration.js";
import "./ShadersInclude/clipPlaneVertexDeclaration.js";
import "./ShadersInclude/fogVertexDeclaration.js";
import "./ShadersInclude/lightVxFragmentDeclaration.js";
import "./ShadersInclude/lightVxUboDeclaration.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/bonesVertex.js";
import "./ShadersInclude/bakedVertexAnimation.js";
import "./ShadersInclude/clipPlaneVertex.js";
import "./ShadersInclude/fogVertex.js";
import "./ShadersInclude/shadowsVertex.js";
const name = "backgroundVertexShader";
const shader = `precision highp float;
#include<helperFunctions>
attribute vec3 position;
attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
varying vec3 vPositionW;
varying vec3 vNormalW;
#ifdef UV1
attribute vec2 uv;
#ifdef UV2
attribute vec2 uv2;
#ifdef MAINUV1
varying vec2 vMainUV1;
#ifdef MAINUV2
varying vec2 vMainUV2;
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
varying vec2 vDiffuseUV;
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=position;
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
vec4 worldPos=finalWorld*vec4(position,1.0);
mat3 normalWorld=mat3(finalWorld);
normalWorld=transposeMat3(inverseMat3(normalWorld));
vNormalW=normalize(normalWorld*normal);
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(position,0.0)));
mat3 screenToWorld=inverseMat3(mat3(finalWorld*viewProjection));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#ifdef MAINUV1
vMainUV1=uv;
#ifdef MAINUV2
vMainUV2=uv2;
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
if (vDiffuseInfos.x==0.)
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#ifdef VERTEXCOLOR
vColor=color;
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#define CUSTOM_VERTEX_MAIN_END
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const backgroundVertexShader = { name, shader };
//# sourceMappingURL=background.vertex.js.map
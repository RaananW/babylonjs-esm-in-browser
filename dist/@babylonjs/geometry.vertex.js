// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/bonesDeclaration.js";
import "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import "./ShadersInclude/morphTargetsVertexDeclaration.js";
import "./ShadersInclude/instancesDeclaration.js";
import "./ShadersInclude/geometryVertexDeclaration.js";
import "./ShadersInclude/geometryUboDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobal.js";
import "./ShadersInclude/morphTargetsVertex.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/bonesVertex.js";
import "./ShadersInclude/bakedVertexAnimation.js";
import "./ShadersInclude/bumpVertex.js";
const name = "geometryVertexShader";
const shader = `precision highp float;
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
#include<__decl__geometryVertex>
attribute vec3 position;
varying vec2 vUV;
uniform mat4 diffuseMatrix;
#ifdef BUMP
uniform mat4 bumpMatrix;
#ifdef REFLECTIVITY
uniform mat4 reflectivityMatrix;
#ifdef UV1
attribute vec2 uv;
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef BUMP
varying mat4 vWorldView;
#ifdef BUMP
varying vec3 vNormalW;
varying vec3 vNormalV;
varying vec4 vViewPos;
varying vec3 vPositionW;
#ifdef VELOCITY
uniform mat4 previousViewProjection;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
vec2 uvUpdated=uv;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#if defined(VELOCITY) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 pos=vec4(finalWorld*vec4(positionUpdated,1.0));
vWorldView=view*finalWorld;
vNormalV=normalize(vec3((view*finalWorld)*vec4(normalUpdated,0.0)));
vViewPos=view*pos;
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);
mat4 previousInfluence;
previousInfluence+=mPreviousBones[int(matricesIndices[1])]*matricesWeights[1];
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=mPreviousBones[int(matricesIndices[2])]*matricesWeights[2];
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=mPreviousBones[int(matricesIndices[3])]*matricesWeights[3];
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];
vPreviousPosition=previousViewProjection*finalPreviousWorld*previousInfluence*vec4(positionUpdated,1.0);
vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#if defined(POSITION) || defined(BUMP)
vPositionW=pos.xyz/pos.w;
gl_Position=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#ifdef UV1
#if defined(ALPHATEST) && defined(ALPHATEST_UV1)
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
vUV=uv;
#ifdef BUMP_UV1
vBumpUV=vec2(bumpMatrix*vec4(uvUpdated,1.0,0.0));
#ifdef REFLECTIVITY_UV1
vReflectivityUV=vec2(reflectivityMatrix*vec4(uvUpdated,1.0,0.0));
#ifdef ALBEDO_UV1
vAlbedoUV=vec2(albedoMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
#if defined(ALPHATEST) && defined(ALPHATEST_UV2)
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
vUV=uv2;
#ifdef BUMP_UV2
vBumpUV=vec2(bumpMatrix*vec4(uv2,1.0,0.0));
#ifdef REFLECTIVITY_UV2
vReflectivityUV=vec2(reflectivityMatrix*vec4(uv2,1.0,0.0));
#ifdef ALBEDO_UV2
vAlbedoUV=vec2(albedoMatrix*vec4(uv2,1.0,0.0));
#endif
#endif
#include<bumpVertex>
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const geometryVertexShader = { name, shader };
//# sourceMappingURL=geometry.vertex.js.map
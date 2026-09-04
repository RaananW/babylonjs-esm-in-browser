// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { sceneVertexDeclaration } from "./ShadersInclude/sceneVertexDeclaration.js";
import { decalVertexDeclaration } from "./ShadersInclude/decalVertexDeclaration.js";
import { openpbrVertexDeclaration } from "./ShadersInclude/openpbrVertexDeclaration.js";
import { sceneUboDeclaration } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclaration } from "./ShadersInclude/meshUboDeclaration.js";
import { openpbrUboDeclaration } from "./ShadersInclude/openpbrUboDeclaration.js";
import { uvAttributeDeclaration } from "./ShadersInclude/uvAttributeDeclaration.js";
import { mainUVVaryingDeclaration } from "./ShadersInclude/mainUVVaryingDeclaration.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { pbrBRDFFunctions } from "./ShadersInclude/pbrBRDFFunctions.js";
import { bonesDeclaration } from "./ShadersInclude/bonesDeclaration.js";
import { bakedVertexAnimationDeclaration } from "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import { instancesDeclaration } from "./ShadersInclude/instancesDeclaration.js";
import { prePassVertexDeclaration } from "./ShadersInclude/prePassVertexDeclaration.js";
import { samplerVertexDeclaration } from "./ShadersInclude/samplerVertexDeclaration.js";
import { harmonicsFunctions } from "./ShadersInclude/harmonicsFunctions.js";
import { openpbrNormalMapVertexDeclaration } from "./ShadersInclude/openpbrNormalMapVertexDeclaration.js";
import { clipPlaneVertexDeclaration } from "./ShadersInclude/clipPlaneVertexDeclaration.js";
import { fogVertexDeclaration } from "./ShadersInclude/fogVertexDeclaration.js";
import { lightVxFragmentDeclaration } from "./ShadersInclude/lightVxFragmentDeclaration.js";
import { lightVxUboDeclaration } from "./ShadersInclude/lightVxUboDeclaration.js";
import { morphTargetsVertexGlobalDeclaration } from "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import { morphTargetsVertexDeclaration } from "./ShadersInclude/morphTargetsVertexDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { morphTargetsVertexGlobal } from "./ShadersInclude/morphTargetsVertexGlobal.js";
import { morphTargetsVertex } from "./ShadersInclude/morphTargetsVertex.js";
import { instancesVertex } from "./ShadersInclude/instancesVertex.js";
import { bonesVertex } from "./ShadersInclude/bonesVertex.js";
import { bakedVertexAnimation } from "./ShadersInclude/bakedVertexAnimation.js";
import { prePassVertex } from "./ShadersInclude/prePassVertex.js";
import { uvVariableDeclaration } from "./ShadersInclude/uvVariableDeclaration.js";
import { samplerVertexImplementation } from "./ShadersInclude/samplerVertexImplementation.js";
import { openpbrNormalMapVertex } from "./ShadersInclude/openpbrNormalMapVertex.js";
import { clipPlaneVertex } from "./ShadersInclude/clipPlaneVertex.js";
import { fogVertex } from "./ShadersInclude/fogVertex.js";
import { shadowsVertex } from "./ShadersInclude/shadowsVertex.js";
import { vertexColorMixing } from "./ShadersInclude/vertexColorMixing.js";
import { logDepthVertex } from "./ShadersInclude/logDepthVertex.js";
const name = "openpbrVertexShader";
const shader = `#define OPENPBR_VERTEX_SHADER
#define CUSTOM_VERTEX_EXTENSION
precision highp float;
#include<__decl__openpbrVertex>
#define CUSTOM_VERTEX_BEGIN
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef TANGENT
attribute vec4 tangent;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#include<uvAttributeDeclaration>[2..7]
#include<mainUVVaryingDeclaration>[1..7]
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
varying vec3 vPositionW;
#if DEBUGMODE>0
varying vec4 vClipSpacePosition;
#endif
#ifdef NORMAL
varying vec3 vNormalW;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vec3 vEnvironmentIrradiance;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#include<openpbrNormalMapVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec3 positionUpdated=position;
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#ifdef TANGENT
vec4 tangentUpdated=tangent;
#endif
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);vPositionW=vec3(worldPos);
#ifdef PREPASS
#include<prePassVertex>
#endif
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/vec3(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vNormalW=normalize(normalWorld*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normalUpdated);
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#if !defined(NATIVE) && !defined(WEBGPU)
bool bbb=any(isnan(position));if (bbb) { }
#endif
float NdotV=max(dot(vNormalW,viewDirectionW),0.0);vec3 roughNormal=mix(vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*vBaseDiffuseRoughness);vec3 reflectionVector=vec3(reflectionMatrix*vec4(roughNormal,0)).xyz;
#else
vec3 reflectionVector=vec3(reflectionMatrix*vec4(vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vClipSpacePosition=gl_Position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(positionUpdated,0.0)));
#endif
#ifndef UV1
vec2 uvUpdated=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2Updated=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uvUpdated;
#endif
#ifdef MAINUV2
vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_MATRIXNAME_,baseColor,_INFONAME_,BaseColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_MATRIXNAME_,baseMetalness,_INFONAME_,BaseMetalnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_MATRIXNAME_,specularWeight,_INFONAME_,SpecularWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_MATRIXNAME_,specularColor,_INFONAME_,SpecularColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_MATRIXNAME_,specularRoughness,_INFONAME_,SpecularRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_MATRIXNAME_,specularRoughnessAnisotropy,_INFONAME_,SpecularRoughnessAnisotropyInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_MATRIXNAME_,transmissionWeight,_INFONAME_,TransmissionWeightInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor,_MATRIXNAME_,transmissionColor,_INFONAME_,TransmissionColorInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth,_MATRIXNAME_,transmissionDepth,_INFONAME_,TransmissionDepthInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter,_MATRIXNAME_,transmissionScatter,_INFONAME_,TransmissionScatterInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale,_MATRIXNAME_,transmissionDispersionScale,_INFONAME_,TransmissionDispersionScaleInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_MATRIXNAME_,subsurfaceWeight,_INFONAME_,SubsurfaceWeightInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor,_MATRIXNAME_,subsurfaceColor,_INFONAME_,SubsurfaceColorInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale,_MATRIXNAME_,subsurfaceRadiusScale,_INFONAME_,SubsurfaceRadiusScaleInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_MATRIXNAME_,coatWeight,_INFONAME_,CoatWeightInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_MATRIXNAME_,coatColor,_INFONAME_,CoatColorInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_MATRIXNAME_,coatRoughness,_INFONAME_,CoatRoughnessInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_MATRIXNAME_,coatRoughnessAnisotropy,_INFONAME_,CoatRoughnessAnisotropyInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_MATRIXNAME_,coatDarkening,_INFONAME_,CoatDarkeningInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_MATRIXNAME_,fuzzWeight,_INFONAME_,FuzzWeightInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_MATRIXNAME_,fuzzColor,_INFONAME_,FuzzColorInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_MATRIXNAME_,fuzzRoughness,_INFONAME_,FuzzRoughnessInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_MATRIXNAME_,geometryNormal,_INFONAME_,GeometryNormalInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_MATRIXNAME_,geometryCoatNormal,_INFONAME_,GeometryCoatNormalInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_MATRIXNAME_,geometryOpacity,_INFONAME_,GeometryOpacityInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness,_MATRIXNAME_,geometryThickness,_INFONAME_,GeometryThicknessInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_MATRIXNAME_,geometryTangent,_INFONAME_,GeometryTangentInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_MATRIXNAME_,emissionColor,_INFONAME_,EmissionColorInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_MATRIXNAME_,thinFilmWeight,_INFONAME_,ThinFilmWeightInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_MATRIXNAME_,thinFilmThickness,_INFONAME_,ThinFilmThicknessInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_MATRIXNAME_,ambientOcclusion,_INFONAME_,AmbientOcclusionInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include <samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<openpbrNormalMapVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [sceneVertexDeclaration, decalVertexDeclaration, openpbrVertexDeclaration, sceneUboDeclaration, meshUboDeclaration, openpbrUboDeclaration, uvAttributeDeclaration, mainUVVaryingDeclaration, helperFunctions, pbrBRDFFunctions, bonesDeclaration, bakedVertexAnimationDeclaration, instancesDeclaration, prePassVertexDeclaration, samplerVertexDeclaration, harmonicsFunctions, openpbrNormalMapVertexDeclaration, clipPlaneVertexDeclaration, fogVertexDeclaration, lightVxFragmentDeclaration, lightVxUboDeclaration, morphTargetsVertexGlobalDeclaration, morphTargetsVertexDeclaration, logDepthDeclaration, morphTargetsVertexGlobal, morphTargetsVertex, instancesVertex, bonesVertex, bakedVertexAnimation, prePassVertex, uvVariableDeclaration, samplerVertexImplementation, openpbrNormalMapVertex, clipPlaneVertex, fogVertex, shadowsVertex, vertexColorMixing, logDepthVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const openpbrVertexShader = { name, shader };
//# sourceMappingURL=openpbr.vertex.js.map
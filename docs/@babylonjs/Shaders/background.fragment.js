// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/backgroundFragmentDeclaration.js";
import "./ShadersInclude/backgroundUboDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/reflectionFunction.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/lightFragmentDeclaration.js";
import "./ShadersInclude/lightUboDeclaration.js";
import "./ShadersInclude/lightsFragmentFunctions.js";
import "./ShadersInclude/shadowsFragmentFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/fogFragmentDeclaration.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/lightFragment.js";
import "./ShadersInclude/fogFragment.js";
const name = "backgroundPixelShader";
const shader = `#ifdef TEXTURELODSUPPORT
#extension GL_EXT_shader_texture_lod : enable
#endif
precision highp float;
#include<helperFunctions>
#define RECIPROCAL_PI2 0.15915494
varying vec3 vPositionW;
varying vec2 vMainUV1;
#ifdef MAINUV2 
varying vec2 vMainUV2; 
#ifdef NORMAL
varying vec3 vNormalW;
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vec2 vDiffuseUV;
uniform sampler2D diffuseSampler;
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
#define sampleReflection(s,c) textureCube(s,c)
uniform samplerCube reflectionSampler;
#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;
#else
#define sampleReflection(s,c) texture2D(s,c)
uniform sampler2D reflectionSampler;
#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<reflectionFunction>
#endif
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE;
#endif
#ifndef SHADOWONLY
#define SHADOWONLY;
#endif
#include<imageProcessingDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<imageProcessingFunctions>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#ifdef REFLECTIONFRESNEL
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
vec3 fresnelSchlickEnvironmentGGX(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
vec3 normalW=normalize(vNormalW);
vec3 normalW=vec3(0.0,1.0,0.0);
float shadow=1.;
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;
globalShadow=1.0;
#ifndef BACKMAT_SHADOWONLY
vec4 reflectionColor=vec4(1.,1.,1.,1.);
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
reflectionVector.z*=-1.0;
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=reflectionVector;
vec2 reflectionCoords=reflectionVector.xy;
reflectionCoords/=reflectionVector.z;
reflectionCoords.y=1.0-reflectionCoords.y;
#ifdef REFLECTIONBLUR
float reflectionLOD=vReflectionInfos.y;
reflectionLOD=reflectionLOD*log2(vReflectionMicrosurfaceInfos.x)*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
float lodReflectionNormalized=saturate(reflectionLOD);
#else
vec4 reflectionSample=sampleReflection(reflectionSampler,reflectionCoords);
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);
#ifdef GAMMAREFLECTION
reflectionColor.rgb=toLinearSpace(reflectionColor.rgb);
#ifdef REFLECTIONBGR
reflectionColor.rgb=reflectionColor.bgr;
reflectionColor.rgb*=vReflectionInfos.x;
vec3 diffuseColor=vec3(1.,1.,1.);
vec4 diffuseMap=texture2D(diffuseSampler,vDiffuseUV);
diffuseMap.rgb=toLinearSpace(diffuseMap.rgb);
diffuseMap.rgb*=vDiffuseInfos.y;
finalAlpha*=diffuseMap.a;
diffuseColor=diffuseMap.rgb;
#ifdef REFLECTIONFRESNEL
vec3 colorBase=diffuseColor;
vec3 colorBase=reflectionColor.rgb*diffuseColor;
colorBase=max(colorBase,0.0);
vec3 finalColor=colorBase;
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
vec3 mainColor=mix(vPrimaryColorShadow.rgb,vPrimaryColor.rgb,colorBase);
vec3 mainColor=vPrimaryColor.rgb;
vec3 finalColor=colorBase*mainColor;
#ifdef REFLECTIONFRESNEL
vec3 reflectionAmount=vReflectionControl.xxx;
float reflectionDistanceFalloff=1.0-saturate(length(vPositionW.xyz-vBackgroundCenter)*vReflectionControl.w);
finalColor=mix(finalColor,reflectionColor.rgb,saturate(reflectionAmount));
#ifdef OPACITYFRESNEL
float viewAngleToFloor=dot(normalW,normalize(vEyePosition.xyz-vBackgroundCenter));
#ifdef SHADOWINUSE
finalColor=mix(finalColor*shadowLevel,finalColor,globalShadow);
vec4 color=vec4(finalColor,finalAlpha);
vec4 color=vec4(vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*alpha);
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color.rgb=clamp(color.rgb,0.,30.0);
#else
color=applyImageProcessing(color);
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;
#ifdef NOISE
color.rgb+=dither(vPositionW.xy,0.5);
gl_FragColor=color;
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const backgroundPixelShader = { name, shader };
//# sourceMappingURL=background.fragment.js.map
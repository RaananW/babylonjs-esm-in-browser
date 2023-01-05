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
precision highp float;#include<__decl__backgroundFragment>
#include<helperFunctions>
#define RECIPROCAL_PI2 0.15915494
varying vec3 vPositionW;#ifdef MAINUV1
varying vec2 vMainUV1;#endif 
#ifdef MAINUV2 
varying vec2 vMainUV2; #endif 
#ifdef NORMAL
varying vec3 vNormalW;#endif
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vec2 vDiffuseUV;#endif
uniform sampler2D diffuseSampler;#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
#define sampleReflection(s,c) textureCube(s,c)
uniform samplerCube reflectionSampler;#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;#endif
#else
#define sampleReflection(s,c) texture2D(s,c)
uniform sampler2D reflectionSampler;#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;#endif
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
vec3 fresnelSchlickEnvironmentGGX(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness){float weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);#ifdef NORMAL
vec3 normalW=normalize(vNormalW);#else
vec3 normalW=vec3(0.0,1.0,0.0);#endif
float shadow=1.;float globalShadow=0.;float shadowLightCount=0.;#include<lightFragment>[0..maxSimultaneousLights]
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;#else
globalShadow=1.0;#endif
#ifndef BACKMAT_SHADOWONLY
vec4 reflectionColor=vec4(1.,1.,1.,1.);#ifdef REFLECTION
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;#endif
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=reflectionVector;#else
vec2 reflectionCoords=reflectionVector.xy;#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;#endif
reflectionCoords.y=1.0-reflectionCoords.y;#endif
#ifdef REFLECTIONBLUR
float reflectionLOD=vReflectionInfos.y;#ifdef TEXTURELODSUPPORT
reflectionLOD=reflectionLOD*log2(vReflectionMicrosurfaceInfos.x)*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;reflectionColor=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);#else
float lodReflectionNormalized=saturate(reflectionLOD);float lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;vec4 reflectionSpecularMid=sampleReflection(reflectionSampler,reflectionCoords);if(lodReflectionNormalizedDoubled<1.0){reflectionColor=mix(sampleReflection(reflectionSamplerHigh,reflectionCoords),reflectionSpecularMid,lodReflectionNormalizedDoubled);} else {reflectionColor=mix(reflectionSpecularMid,sampleReflection(reflectionSamplerLow,reflectionCoords),lodReflectionNormalizedDoubled-1.0);}#endif
#else
vec4 reflectionSample=sampleReflection(reflectionSampler,reflectionCoords);reflectionColor=reflectionSample;#endif
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);#endif
#ifdef GAMMAREFLECTION
reflectionColor.rgb=toLinearSpace(reflectionColor.rgb);#endif
#ifdef REFLECTIONBGR
reflectionColor.rgb=reflectionColor.bgr;#endif
reflectionColor.rgb*=vReflectionInfos.x;#endif
vec3 diffuseColor=vec3(1.,1.,1.);float finalAlpha=alpha;#ifdef DIFFUSE
vec4 diffuseMap=texture2D(diffuseSampler,vDiffuseUV);#ifdef GAMMADIFFUSE
diffuseMap.rgb=toLinearSpace(diffuseMap.rgb);#endif
diffuseMap.rgb*=vDiffuseInfos.y;#ifdef DIFFUSEHASALPHA
finalAlpha*=diffuseMap.a;#endif
diffuseColor=diffuseMap.rgb;#endif
#ifdef REFLECTIONFRESNEL
vec3 colorBase=diffuseColor;#else
vec3 colorBase=reflectionColor.rgb*diffuseColor;#endif
colorBase=max(colorBase,0.0);#ifdef USERGBCOLOR
vec3 finalColor=colorBase;#else
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
vec3 mainColor=mix(vPrimaryColorShadow.rgb,vPrimaryColor.rgb,colorBase);#else
vec3 mainColor=vPrimaryColor.rgb;#endif
vec3 finalColor=colorBase*mainColor;#endif
#ifdef REFLECTIONFRESNEL
vec3 reflectionAmount=vReflectionControl.xxx;vec3 reflectionReflectance0=vReflectionControl.yyy;vec3 reflectionReflectance90=vReflectionControl.zzz;float VdotN=dot(normalize(vEyePosition.xyz),normalW);vec3 planarReflectionFresnel=fresnelSchlickEnvironmentGGX(saturate(VdotN),reflectionReflectance0,reflectionReflectance90,1.0);reflectionAmount*=planarReflectionFresnel;#ifdef REFLECTIONFALLOFF
float reflectionDistanceFalloff=1.0-saturate(length(vPositionW.xyz-vBackgroundCenter)*vReflectionControl.w);reflectionDistanceFalloff*=reflectionDistanceFalloff;reflectionAmount*=reflectionDistanceFalloff;#endif
finalColor=mix(finalColor,reflectionColor.rgb,saturate(reflectionAmount));#endif
#ifdef OPACITYFRESNEL
float viewAngleToFloor=dot(normalW,normalize(vEyePosition.xyz-vBackgroundCenter));const float startAngle=0.1;float fadeFactor=saturate(viewAngleToFloor/startAngle);finalAlpha*=fadeFactor*fadeFactor;#endif
#ifdef SHADOWINUSE
finalColor=mix(finalColor*shadowLevel,finalColor,globalShadow);#endif
vec4 color=vec4(finalColor,finalAlpha);#else
vec4 color=vec4(vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*alpha);#endif
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color.rgb=clamp(color.rgb,0.,30.0);#endif
#else
color=applyImageProcessing(color);#endif
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;#endif
#ifdef NOISE
color.rgb+=dither(vPositionW.xy,0.5);color=max(color,0.0);#endif
gl_FragColor=color;#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const backgroundPixelShader = { name, shader };
//# sourceMappingURL=background.fragment.js.map
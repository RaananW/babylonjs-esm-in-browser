// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/clipPlaneFragment.js";
const name = "glowMapGenerationPixelShader";
const shader = `#if defined(DIFFUSE_ISLINEAR) || defined(EMISSIVE_ISLINEAR)
#include<helperFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vUVDiffuse;
#ifdef OPACITY
varying vec2 vUVOpacity;
#ifdef EMISSIVE
varying vec2 vUVEmissive;
#ifdef VERTEXALPHA
varying vec4 vColor;
uniform vec4 glowColor;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
vec4 finalColor=glowColor;
vec4 albedoTexture=texture2D(diffuseSampler,vUVDiffuse);
albedoTexture=toGammaSpace(albedoTexture);
#ifdef GLOW
finalColor.a*=albedoTexture.a;
#ifdef HIGHLIGHT
finalColor.a=albedoTexture.a;
#endif
#ifdef OPACITY
vec4 opacityMap=texture2D(opacitySampler,vUVOpacity);
finalColor.a*=getLuminance(opacityMap.rgb);
finalColor.a*=opacityMap.a;
finalColor.a*=opacityIntensity;
#ifdef VERTEXALPHA
finalColor.a*=vColor.a;
#ifdef ALPHATEST
if (finalColor.a<ALPHATESTVALUE)
#ifdef EMISSIVE
vec4 emissive=texture2D(emissiveSampler,vUVEmissive);
emissive=toGammaSpace(emissive);
gl_FragColor=emissive*finalColor;
gl_FragColor=finalColor;
#ifdef HIGHLIGHT
gl_FragColor.a=glowColor.a;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const glowMapGenerationPixelShader = { name, shader };
//# sourceMappingURL=glowMapGeneration.fragment.js.map